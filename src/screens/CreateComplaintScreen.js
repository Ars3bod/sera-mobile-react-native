import React, {useState} from 'react';
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
import {
  ArrowLeft24Regular,
  ChevronDown24Regular,
  Attach24Regular,
  Delete24Regular,
  Document24Regular,
} from '@fluentui/react-native-icons';

const CreateComplaintScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  // Form state
  const [serviceProvider, setServiceProvider] = useState('');
  const [consumptionCategory, setConsumptionCategory] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showServiceProviderModal, setShowServiceProviderModal] =
    useState(false);
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [showComplaintTypeModal, setShowComplaintTypeModal] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Mock data - في التطبيق الحقيقي سيتم جلبها من API
  const serviceProviders = [
    {
      id: '1',
      nameAr: t('complaints.serviceProviders.sec'),
      nameEn: t('complaints.serviceProviders.sec'),
    },
    {
      id: '2',
      nameAr: t('complaints.serviceProviders.marafiq'),
      nameEn: t('complaints.serviceProviders.marafiq'),
    },
  ];

  const consumptionCategories = [
    {
      id: '1',
      nameAr: t('complaints.consumptionCategories.residential'),
      nameEn: t('complaints.consumptionCategories.residential'),
    },
    {
      id: '2',
      nameAr: t('complaints.consumptionCategories.commercial'),
      nameEn: t('complaints.consumptionCategories.commercial'),
    },
    {
      id: '3',
      nameAr: t('complaints.consumptionCategories.industrial'),
      nameEn: t('complaints.consumptionCategories.industrial'),
    },
    {
      id: '4',
      nameAr: t('complaints.consumptionCategories.government'),
      nameEn: t('complaints.consumptionCategories.government'),
    },
  ];

  const complaintTypes = [
    {
      id: '1',
      nameAr: t('complaints.complaintTypes.powerOutage'),
      nameEn: t('complaints.complaintTypes.powerOutage'),
    },
    {
      id: '2',
      nameAr: t('complaints.complaintTypes.highBill'),
      nameEn: t('complaints.complaintTypes.highBill'),
    },
    {
      id: '3',
      nameAr: t('complaints.complaintTypes.serviceQuality'),
      nameEn: t('complaints.complaintTypes.serviceQuality'),
    },
    {
      id: '4',
      nameAr: t('complaints.complaintTypes.connectionDelay'),
      nameEn: t('complaints.complaintTypes.connectionDelay'),
    },
    {
      id: '5',
      nameAr: t('complaints.complaintTypes.customerService'),
      nameEn: t('complaints.complaintTypes.customerService'),
    },
  ];

  const handleAttachFile = () => {
    // في التطبيق الحقيقي سيتم استخدام react-native-document-picker
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

    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        t('complaints.create.success'),
        t('complaints.create.successMessage'),
        [
          {
            text: t('complaints.create.ok'),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        t('complaints.create.error'),
        t('complaints.create.submitError'),
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

  const renderSelectionModal = (visible, setVisible, title, data, onSelect) => (
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
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  {borderBottomColor: theme.colors.border},
                ]}
                onPress={() => {
                  onSelect(isRTL ? item.nameAr : item.nameEn);
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
                  {isRTL ? item.nameAr : item.nameEn}
                </Text>
              </TouchableOpacity>
            )}
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

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
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
            serviceProvider,
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
            consumptionCategory,
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
            complaintType,
            t('complaints.create.complaintTypePlaceholder'),
            () => setShowComplaintTypeModal(true),
          )}
        </View>

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
      )}

      {renderSelectionModal(
        showConsumptionModal,
        setShowConsumptionModal,
        t('complaints.create.consumptionCategory'),
        consumptionCategories,
        setConsumptionCategory,
      )}

      {renderSelectionModal(
        showComplaintTypeModal,
        setShowComplaintTypeModal,
        t('complaints.create.complaintType'),
        complaintTypes,
        setComplaintType,
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
});

export default CreateComplaintScreen;
