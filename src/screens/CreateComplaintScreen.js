import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {useUser} from '../context/UserContext';
import {useFocusEffect} from '@react-navigation/native';
import {
  ArrowLeft24Regular,
  ChevronDown24Regular,
  Attach24Regular,
  Delete24Regular,
  Document24Regular,
} from '@fluentui/react-native-icons';
import complaintCreationService, {
  MOCK_SERVICE_PROVIDERS,
  MOCK_CONSUMPTION_CATEGORIES,
  MOCK_COMPLAINT_TYPES,
} from '../services/complaintCreationService';
import AppConfig from '../config/appConfig';
import Toast from '../components/Toast';
import {LoadingSpinner} from '../animations';

const CreateComplaintScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const {user} = useUser();
  const isRTL = i18n.language === 'ar';

  // Form state
  const [serviceProvider, setServiceProvider] = useState(null);
  const [consumptionCategory, setConsumptionCategory] = useState(null);
  const [complaintType, setComplaintType] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Data state
  const [serviceProviders, setServiceProviders] = useState([]);
  const [consumptionCategories, setConsumptionCategories] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);

  // Field visibility state
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showOrderNumber, setShowOrderNumber] = useState(false);

  // Modal states
  const [showServiceProviderModal, setShowServiceProviderModal] =
    useState(false);
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [showComplaintTypeModal, setShowComplaintTypeModal] = useState(false);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Get contact ID from user context
  const getContactId = () => {
    if (user?.contactInfo?.id) {
      return user.contactInfo.id;
    }
    return null;
  };

  // Check if should use mock data based on config
  const shouldUseMockData = () => {
    if (AppConfig.api.useMockData) {
      return true;
    }

    if (AppConfig.development.mockServices.complaintCreation) {
      return true;
    }

    const contactId = getContactId();
    if (!contactId) {
      return true;
    }

    return false;
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Hide toast notification
  const hideToast = () => {
    setToastVisible(false);
  };

  // Fetch service providers
  const fetchServiceProviders = async () => {
    try {
      if (shouldUseMockData()) {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using mock data for service providers');
        }
        setServiceProviders(MOCK_SERVICE_PROVIDERS);
      } else {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Fetching real service providers from API');
        }

        const response = await complaintCreationService.getServiceProviders();
        if (response.success) {
          setServiceProviders(response.providers || []);
        } else {
          throw new Error('Failed to fetch service providers');
        }
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error fetching service providers:', error);
      }
      // Fallback to mock data
      setServiceProviders(MOCK_SERVICE_PROVIDERS);
    }
  };

  // Fetch consumption categories
  const fetchConsumptionCategories = async () => {
    try {
      if (shouldUseMockData()) {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using mock data for consumption categories');
        }
        setConsumptionCategories(
          MOCK_CONSUMPTION_CATEGORIES[i18n.language] ||
            MOCK_CONSUMPTION_CATEGORIES.ar,
        );
      } else {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Fetching real consumption categories from API');
        }

        const response =
          await complaintCreationService.getConsumptionCategories(
            i18n.language,
          );
        if (response.success) {
          setConsumptionCategories(response.categories || []);
        } else {
          throw new Error('Failed to fetch consumption categories');
        }
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error fetching consumption categories:', error);
      }
      // Fallback to mock data
      setConsumptionCategories(
        MOCK_CONSUMPTION_CATEGORIES[i18n.language] ||
          MOCK_CONSUMPTION_CATEGORIES.ar,
      );
    }
  };

  // Fetch complaint types
  const fetchComplaintTypes = async () => {
    try {
      if (shouldUseMockData()) {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using mock data for complaint types');
        }
        setComplaintTypes(MOCK_COMPLAINT_TYPES);
      } else {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Fetching real complaint types from API');
        }

        const response = await complaintCreationService.getComplaintTypes();
        if (response.success) {
          setComplaintTypes(response.types || []);
        } else {
          throw new Error('Failed to fetch complaint types');
        }
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error fetching complaint types:', error);
      }
      // Fallback to mock data
      setComplaintTypes(MOCK_COMPLAINT_TYPES);
    }
  };

  // Check field visibility based on complaint type
  const checkFieldVisibility = async caseTypeId => {
    try {
      if (shouldUseMockData()) {
        // Mock behavior - show account number for certain types
        setShowAccountNumber(true);
        setShowOrderNumber(false);
        return;
      }

      const response = await complaintCreationService.checkFieldVisibility(
        caseTypeId,
      );
      if (response.success) {
        setShowAccountNumber(response.showAccountNumber);
        setShowOrderNumber(response.showOrderNumber);
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error checking field visibility:', error);
      }
      // Default to showing account number
      setShowAccountNumber(true);
      setShowOrderNumber(false);
    }
  };

  // Load initial data
  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      await Promise.all([
        fetchServiceProviders(),
        fetchConsumptionCategories(),
        fetchComplaintTypes(),
      ]);
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error loading initial data:', error);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  // Load data when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      loadInitialData();
    }, []),
  );

  // Handle complaint type selection
  const handleComplaintTypeSelect = async selectedType => {
    setComplaintType(selectedType);

    if (!shouldUseMockData() && selectedType?.caseTypeId) {
      await checkFieldVisibility(selectedType.caseTypeId);
    } else if (shouldUseMockData()) {
      // Mock behavior
      setShowAccountNumber(true);
      setShowOrderNumber(false);
    }
  };

  const handleAttachFile = () => {
    Alert.alert(
      t('complaints.create.uploadFileTitle'),
      t('complaints.create.uploadFileMessage'),
      [
        {text: t('complaints.create.cancel'), style: 'cancel'},
        {
          text: t('complaints.create.chooseFile'),
          onPress: () => {
            // Mock file addition
            const mockFile = {
              id: Date.now(),
              name: `document_${attachments.length + 1}.pdf`,
              size: '2.5 MB',
              type: 'application/pdf',
            };
            setAttachments([...attachments, mockFile]);
          },
        },
      ],
    );
  };

  const removeAttachment = id => {
    setAttachments(attachments.filter(file => file.id !== id));
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !serviceProvider ||
      !consumptionCategory ||
      !complaintType ||
      !complaintText.trim()
    ) {
      Alert.alert(
        t('complaints.create.error'),
        t('complaints.create.errorMessage'),
      );
      return;
    }

    if (showAccountNumber && !accountNumber.trim()) {
      Alert.alert(
        t('complaints.create.error'),
        'Account number is required for this complaint type',
      );
      return;
    }

    if (showOrderNumber && !orderNumber.trim()) {
      Alert.alert(
        t('complaints.create.error'),
        'Order number is required for this complaint type',
      );
      return;
    }

    setLoading(true);

    try {
      if (shouldUseMockData()) {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        showToast(
          t('complaints.create.successWithCaseId', {caseId: '#25010898'}),
        );

        // Navigate to complaints screen after delay
        setTimeout(() => {
          navigation.navigate('Complaints');
        }, 1000);
      } else {
        // Real API call
        const contactId = getContactId();

        const complaintData = {
          accountNumber: accountNumber || '',
          orderNumber: orderNumber || '',
          attachmentsObject: null, // TODO: Handle file uploads
          complainterType: consumptionCategory?.value || consumptionCategory,
          beneficiary: contactId,
          descriptionParam: complaintText,
          isTheConsumerHasPriority: false,
          isThereComplaint: 1,
          region: '962d623d-0a35-ee11-baea-0205857feb80', // TODO: Get from user data
          city: 'CC631FD4-926D-EE11-BAF4-00155D007258', // TODO: Get from user data
          caseType: complaintType?.caseTypeId || complaintType,
          against: serviceProvider?.accountid || serviceProvider,
        };

        const response = await complaintCreationService.createComplaint(
          complaintData,
        );

        if (response.success) {
          showToast(
            t('complaints.create.successWithCaseId', {
              caseId: `#${response.caseId}`,
            }),
          );

          // Navigate to complaints screen after delay
          setTimeout(() => {
            navigation.navigate('Complaints');
          }, 1000);
        } else {
          throw new Error(response.message || 'Failed to create complaint');
        }
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Submit complaint error:', error);
      }

      Alert.alert(
        t('complaints.create.error'),
        error.message || t('complaints.create.submitError'),
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (value, placeholder, onPress) => (
    <TouchableOpacity
      style={[
        styles.dropdown,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.dropdownText,
          {
            color: value ? theme.colors.text : theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}>
        {value || placeholder}
      </Text>
      <ChevronDown24Regular
        style={[styles.dropdownIcon, {color: theme.colors.icon}]}
      />
    </TouchableOpacity>
  );

  const renderSelectionModal = (
    visible,
    setVisible,
    title,
    data,
    onSelect,
    displayKey,
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}>
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.modalTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {title}
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.id ||
              item.accountid ||
              item.caseTypeId ||
              item.value ||
              index.toString()
            }
            renderItem={({item}) => {
              let displayText = '';
              if (displayKey === 'serviceProvider') {
                displayText = isRTL ? item.accountName : item.englishName;
              } else if (displayKey === 'category') {
                displayText = item.name;
              } else if (displayKey === 'complaintType') {
                displayText = item.caseType;
              }

              return (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    {borderBottomColor: theme.colors.border},
                  ]}
                  onPress={() => {
                    if (displayKey === 'complaintType') {
                      handleComplaintTypeSelect(item);
                    } else {
                      onSelect(item);
                    }
                    setVisible(false);
                  }}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color: theme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                      },
                    ]}>
                    {displayText}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={[
              styles.modalCloseButton,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => setVisible(false)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.modalCloseText,
                {color: theme.colors.textInverse},
              ]}>
              {t('complaints.create.close')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAttachment = ({item}) => (
    <View
      style={[
        styles.attachmentItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <Document24Regular
        style={[styles.attachmentIcon, {color: theme.colors.primary}]}
      />
      <View style={styles.attachmentInfo}>
        <Text
          style={[
            styles.attachmentName,
            {
              color: theme.colors.text,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {item.name}
        </Text>
        <Text
          style={[
            styles.attachmentSize,
            {
              color: theme.colors.textSecondary,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {item.size}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeAttachment(item.id)}
        activeOpacity={0.7}>
        <Delete24Regular style={[styles.removeIcon, {color: '#F44336'}]} />
      </TouchableOpacity>
    </View>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backIcon: {
      width: 24,
      height: 24,
      color: theme.colors.primary,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      flex: 1,
    },
    submitButton: {
      backgroundColor: loading
        ? theme.colors.textSecondary
        : theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 40,
    },
    submitButtonText: {
      color: theme.colors.textInverse,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  if (initialLoading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.surface}
        />
        <View style={styles.loadingContainer}>
          <LoadingSpinner
            type="rotating"
            size={40}
            color={theme.colors.primary}
            duration={1000}
          />
          <Text style={[styles.loadingText, {color: theme.colors.text}]}>
            Loading form data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />

      {/* Toast Notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
      />

      {/* Header */}
      <View
        style={[
          dynamicStyles.header,
          {flexDirection: isRTL ? 'row-reverse' : 'row'},
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}>
          <ArrowLeft24Regular
            style={[
              dynamicStyles.backIcon,
              {transform: [{scaleX: isRTL ? -1 : 1}]},
            ]}
          />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>
          {t('complaints.create.title')}
        </Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Service Provider */}
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.fieldLabel,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.create.serviceProvider')} *
          </Text>
          {renderDropdown(
            serviceProvider
              ? isRTL
                ? serviceProvider.accountName
                : serviceProvider.englishName
              : null,
            t('complaints.create.serviceProviderPlaceholder'),
            () => setShowServiceProviderModal(true),
          )}
        </View>

        {/* Consumption Category */}
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.fieldLabel,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.create.consumptionCategory')} *
          </Text>
          {renderDropdown(
            consumptionCategory?.name,
            t('complaints.create.consumptionCategoryPlaceholder'),
            () => setShowConsumptionModal(true),
          )}
        </View>

        {/* Complaint Type */}
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.fieldLabel,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.create.complaintType')} *
          </Text>
          {renderDropdown(
            complaintType?.caseType,
            t('complaints.create.complaintTypePlaceholder'),
            () => setShowComplaintTypeModal(true),
          )}
        </View>

        {/* Account Number Field - Conditional */}
        {showAccountNumber && (
          <View style={styles.fieldContainer}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color: theme.colors.text,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {t('complaints.create.accountNumber')} *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
              placeholder={t('complaints.create.accountNumberPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          </View>
        )}

        {/* Order Number Field - Conditional */}
        {showOrderNumber && (
          <View style={styles.fieldContainer}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color: theme.colors.text,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {t('complaints.create.orderNumber')} *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
              placeholder={t('complaints.create.orderNumberPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              value={orderNumber}
              onChangeText={setOrderNumber}
            />
          </View>
        )}

        {/* Complaint Text */}
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.fieldLabel,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.create.complaintDetails')} *
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            placeholder={t('complaints.create.complaintDetailsPlaceholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={complaintText}
            onChangeText={setComplaintText}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Attachments */}
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.fieldLabel,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.create.attachments')}
          </Text>
          <TouchableOpacity
            style={[
              styles.attachButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={handleAttachFile}
            activeOpacity={0.7}>
            <Attach24Regular
              style={[styles.attachIcon, {color: theme.colors.primary}]}
            />
            <Text
              style={[
                styles.attachText,
                {
                  color: theme.colors.primary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {t('complaints.create.attachFile')}
            </Text>
          </TouchableOpacity>

          {attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              <FlatList
                data={attachments}
                renderItem={renderAttachment}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
              />
            </View>
          )}

          <Text
            style={[
              styles.attachmentNote,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.create.attachmentNote')}
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={dynamicStyles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.7}>
          <Text style={dynamicStyles.submitButtonText}>
            {loading
              ? t('complaints.create.submitting')
              : t('complaints.create.submit')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      {renderSelectionModal(
        showServiceProviderModal,
        setShowServiceProviderModal,
        t('complaints.create.serviceProvider'),
        serviceProviders,
        setServiceProvider,
        'serviceProvider',
      )}

      {renderSelectionModal(
        showConsumptionModal,
        setShowConsumptionModal,
        t('complaints.create.consumptionCategory'),
        consumptionCategories,
        setConsumptionCategory,
        'category',
      )}

      {renderSelectionModal(
        showComplaintTypeModal,
        setShowComplaintTypeModal,
        t('complaints.create.complaintType'),
        complaintTypes,
        () => {}, // Handled by handleComplaintTypeSelect
        'complaintType',
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  placeholderView: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 120,
  },
  attachButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  attachText: {
    fontSize: 16,
    fontWeight: '600',
  },
  attachmentsList: {
    marginTop: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  attachmentIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    width: 20,
    height: 20,
  },
  attachmentNote: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default CreateComplaintScreen;
