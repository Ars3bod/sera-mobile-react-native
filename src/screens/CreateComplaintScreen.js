import React, { useState, useEffect } from 'react';
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
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
// Safe import for FluentUI icons with fallbacks
let ArrowLeft24Regular, ChevronDown24Regular, Attach24Regular, Delete24Regular, Document24Regular;
try {
  const icons = require('@fluentui/react-native-icons');
  ArrowLeft24Regular = icons.ArrowLeft24Regular;
  ChevronDown24Regular = icons.ChevronDown24Regular;
  Attach24Regular = icons.Attach24Regular;
  Delete24Regular = icons.Delete24Regular;
  Document24Regular = icons.Document24Regular;
} catch (error) {
  // Fallback components using emoji or simple text
  ArrowLeft24Regular = () => <Text style={{ fontSize: 20 }}>←</Text>;
  ChevronDown24Regular = () => <Text style={{ fontSize: 16 }}>▼</Text>;
  Attach24Regular = () => <Text style={{ fontSize: 20 }}>📎</Text>;
  Delete24Regular = () => <Text style={{ fontSize: 18 }}>🗑️</Text>;
  Document24Regular = () => <Text style={{ fontSize: 18 }}>📄</Text>;
}
import complaintCreationService, {
  MOCK_SERVICE_PROVIDERS,
  MOCK_CONSUMPTION_CATEGORIES,
  MOCK_COMPLAINT_TYPES,
} from '../services/complaintCreationService';
import AppConfig from '../config/appConfig';
import Toast from '../components/Toast';
import LoadingSpinner from '../animations/components/LoadingSpinner';
import { pick, types } from '@react-native-documents/picker';

const CreateComplaintScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { user } = useUser();
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

  const handleAttachFile = async () => {
    try {
      // Check if we're on web first
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png,.jpg,.jpeg,.pdf,.doc,.docx,.zip,.xls,.xlsx,.svg';
        input.multiple = false;

        input.onchange = async (event) => {
          const file = event.target.files[0];
          if (file) {
            await handleFileSelection({
              name: file.name,
              size: file.size,
              type: file.type,
              uri: URL.createObjectURL(file),
              file: file,
            });
          }
        };

        input.click();
        return;
      }

      // For mobile platforms, use @react-native-documents/picker
      try {
        const result = await pick({
          type: [
            types.images,
            types.pdf,
            types.doc,
            types.docx,
            types.xls,
            types.xlsx,
            types.zip,
            types.plainText,
          ],
          allowMultiSelection: false,
        });

        if (AppConfig.development.enableDebugLogs) {
          console.log('Document picker result:', result);
        }

        // Handle the result - new API returns array directly
        if (result && result.length > 0) {
          const file = result[0];
          await handleFileSelection({
            name: file.name,
            size: file.size,
            type: file.type,
            uri: file.uri,
          });
        }
      } catch (error) {
        // Check if user cancelled
        if (error.message === 'User canceled document picker') {
          if (AppConfig.development.enableDebugLogs) {
            console.log('User cancelled document picker');
          }
          return;
        }

        if (AppConfig.development.enableDebugLogs) {
          console.error('Document picker error:', error);
        }

        // Show fallback options
        Alert.alert(
          t('complaints.create.uploadFileTitle'),
          'Document picker failed. Choose an option:',
          [
            { text: t('complaints.create.cancel'), style: 'cancel' },
            {
              text: t('complaints.create.mockDocument'),
              onPress: () => handleMockFileSelection(),
            },
          ],
        );
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('File selection error:', error);
      }

      Alert.alert(
        t('complaints.create.error'),
        error.message || 'An error occurred while selecting a file. Please try again.',
      );
    }
  };

  const handleMockFileSelection = () => {
    // Mock file selection for documents when document picker fails
    const fileTypes = [
      { name: 'Invoice_Receipt.pdf', type: 'application/pdf' },
      { name: 'Supporting_Document.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { name: 'Evidence_Photo.jpg', type: 'image/jpeg' },
      { name: 'Spreadsheet_Data.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { name: 'Contract_Agreement.pdf', type: 'application/pdf' },
      { name: 'Bill_Statement.pdf', type: 'application/pdf' },
      { name: 'Financial_Report.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { name: 'Technical_Specs.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    ];

    const randomFile = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const fileNumber = attachments.length + 1;

    handleFileSelection({
      name: `${fileNumber}_${randomFile.name}`,
      size: Math.floor(Math.random() * (5 * 1024 * 1024)) + (500 * 1024), // Random size between 500KB and 5MB
      type: randomFile.type,
      uri: 'mock://file.pdf',
      mockFile: true,
    });
  };

  const handleFileSelection = async (file) => {
    try {
      // Validate file
      const validation = complaintCreationService.validateFile(file);
      if (!validation.isValid) {
        Alert.alert(t('complaints.create.error'), validation.error);
        return;
      }

      // Check total attachments count
      if (attachments.length >= 5) {
        Alert.alert(
          t('complaints.create.error'),
          'Maximum 5 files can be attached.',
        );
        return;
      }

      // Format file size for display
      const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      // Add file to attachments list with upload status
      const newAttachment = {
        id: Date.now(),
        name: file.name,
        size: formatFileSize(file.size || 0),
        type: file.type,
        uri: file.uri,
        file: file,
        uploading: false,
        uploaded: false,
        error: null,
      };

      setAttachments(prev => [...prev, newAttachment]);
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('File handling error:', error);
      }

      Alert.alert(
        t('complaints.create.error'),
        'Failed to process file. Please try again.',
      );
    }
  };

  const removeAttachment = (id) => {
    Alert.alert(
      t('complaints.create.removeAttachment'),
      t('complaints.create.removeAttachmentConfirm'),
      [
        { text: t('complaints.create.cancel'), style: 'cancel' },
        {
          text: t('common.ok'),
          style: 'destructive',
          onPress: () => {
            setAttachments(prev => prev.filter(file => file.id !== id));
          },
        },
      ],
    );
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
          t('complaints.create.successWithCaseId', { caseId: '#25010898' }),
        );

        // Navigate to complaints screen after delay
        setTimeout(() => {
          navigation.navigate('Complaints');
        }, 1000);
      } else {
        // Real API call
        const contactId = getContactId();

        // Process attachments - convert to base64
        const processedAttachments = [];
        const failedAttachments = [];

        for (const attachment of attachments) {
          try {
            let base64Data;

            if (attachment.mockFile) {
              // Handle mock files for testing
              base64Data = 'JVBERi0xLjQKJdPr6eEKMSAwIG9iao8PAovVGl0bGUgKFVudGl0bGVkKQo+PgplbmRvYmoKMiAwIG9iao8PAovQ3JlYXRvciAoTW9ja1BERkNyZWF0b3IpCj4+CmVuZG9iagp4cmVmCjAgMwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA0NSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDMKPj4Kc3RhcnR4cmVmCjkxCiUlRU9G'; // Mock PDF base64
            } else if (attachment.uri && !attachment.uri.startsWith('mock://')) {
              // Handle URI-based files (mobile) - prioritize this for React Native
              try {
                if (AppConfig.development.enableDebugLogs) {
                  console.log('Processing file URI:', attachment.uri);
                }

                const response = await fetch(attachment.uri);
                if (!response.ok) {
                  throw new Error(`Failed to fetch file "${attachment.name}": HTTP ${response.status}`);
                }

                const blob = await response.blob();
                base64Data = await new Promise((resolve, reject) => {
                  const reader = new FileReader();

                  reader.onload = function (event) {
                    try {
                      // More robust event handling
                      const result = event.target?.result || this.result;
                      if (result && typeof result === 'string') {
                        resolve(result);
                      } else {
                        reject(new Error('FileReader returned invalid result for blob'));
                      }
                    } catch (eventError) {
                      reject(new Error(`Blob event handling error: ${eventError.message}`));
                    }
                  };

                  reader.onerror = function (error) {
                    reject(new Error(`Blob FileReader failed: ${error.message || 'Unknown error'}`));
                  };

                  reader.onabort = function () {
                    reject(new Error('Blob FileReader was aborted'));
                  };

                  try {
                    reader.readAsDataURL(blob);
                  } catch (readError) {
                    reject(new Error(`Failed to start reading blob: ${readError.message}`));
                  }
                });
              } catch (fetchError) {
                throw new Error(`Failed to process file "${attachment.name}": ${fetchError.message}`);
              }
            } else if (attachment.file && typeof attachment.file === 'object') {
              // Handle File objects (web) - fallback for web platforms
              try {
                if (AppConfig.development.enableDebugLogs) {
                  console.log('Processing file object for web platform');
                }

                base64Data = await new Promise((resolve, reject) => {
                  const reader = new FileReader();

                  reader.onload = function (event) {
                    try {
                      // More robust event handling
                      const result = event.target?.result || this.result;
                      if (result && typeof result === 'string') {
                        resolve(result);
                      } else {
                        reject(new Error('FileReader returned invalid result'));
                      }
                    } catch (eventError) {
                      reject(new Error(`Event handling error: ${eventError.message}`));
                    }
                  };

                  reader.onerror = function (error) {
                    reject(new Error(`FileReader failed: ${error.message || 'Unknown error'}`));
                  };

                  reader.onabort = function () {
                    reject(new Error('FileReader was aborted'));
                  };

                  try {
                    reader.readAsDataURL(attachment.file);
                  } catch (readError) {
                    reject(new Error(`Failed to start reading file: ${readError.message}`));
                  }
                });
              } catch (fileReaderError) {
                throw new Error(`Failed to read file "${attachment.name}": ${fileReaderError.message}`);
              }
            } else {
              // Mock file URI or no valid source - use mock data for testing/development
              if (AppConfig.development.enableDebugLogs) {
                console.log('Using mock data for attachment:', attachment.name);
              }
              base64Data = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iao8PAovVGl0bGUgKFVudGl0bGVkKQo+PgplbmRvYmoKMiAwIG9iago8PAovQ3JlYXRvciAoTW9ja1BERkNyZWF0b3IpCj4+CmVuZG9iagp4cmVmCjAgMwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA0NSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDMKPj4Kc3RhcnR4cmVmCjkxCiUlRU9G';
            }

            if (!base64Data) {
              throw new Error(`No data could be extracted from file "${attachment.name}"`);
            }

            processedAttachments.push({
              name: attachment.name,
              type: attachment.type,
              base64Data: base64Data.replace(/^data:[^;]+;base64,/, ''), // Remove data URL prefix
            });

            if (AppConfig.development.enableDebugLogs) {
              console.log('Successfully processed attachment:', attachment.name);
            }
          } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
              console.error('Failed to process attachment:', attachment.name, error.message);
              console.error('Attachment object:', JSON.stringify(attachment, null, 2));
              console.error('Full error:', error);
            }

            // For development/testing - provide more details
            let errorMessage = error.message;
            if (AppConfig.development.enableDebugLogs) {
              errorMessage += ` (Type: ${attachment.type || 'unknown'}, Size: ${attachment.size || 'unknown'}, URI: ${attachment.uri ? 'present' : 'missing'})`;
            }

            failedAttachments.push({
              name: attachment.name,
              error: errorMessage,
            });
          }
        }

        // Check if any attachments failed to process
        if (failedAttachments.length > 0) {
          const failedFileNames = failedAttachments.map(failed => failed.name).join(', ');
          const errorDetails = failedAttachments.map(failed => `• ${failed.name}: ${failed.error}`).join('\n');

          const errorMessage = failedAttachments.length === 1
            ? t('complaints.create.attachmentFailedSingle', { fileName: failedFileNames })
            : t('complaints.create.attachmentFailedMultiple', { count: failedAttachments.length, fileNames: failedFileNames });

          Alert.alert(
            t('complaints.create.attachmentError'),
            `${errorMessage}\n\n${t('complaints.create.attachmentErrorDetails')}:\n${errorDetails}`,
            [
              {
                text: t('complaints.create.continueWithoutAttachments'),
                style: 'default',
                onPress: () => {
                  // Remove failed attachments and continue
                  const successfulAttachments = attachments.filter(att =>
                    !failedAttachments.some(failed => failed.name === att.name)
                  );
                  setAttachments(successfulAttachments);
                  // Don't restart submission automatically - let user decide
                }
              },
              {
                text: t('complaints.create.fixAttachments'),
                style: 'cancel'
              }
            ]
          );

          throw new Error(`Attachment processing failed for: ${failedFileNames}`);
        }

        const complaintData = {
          accountNumber: accountNumber || '',
          orderNumber: orderNumber || '',
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
          processedAttachments,
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
      <ChevronDown24Regular />
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
          style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
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
            renderItem={({ item }) => {
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
                    { borderBottomColor: theme.colors.border },
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
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setVisible(false)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.modalCloseText,
                { color: theme.colors.textInverse },
              ]}>
              {t('complaints.create.close')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAttachment = ({ item }) => (
    <View
      style={[
        styles.attachmentItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: item.error ? '#F44336' : theme.colors.border,
        },
      ]}>
      <Document24Regular />
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
          {item.uploading && ' - Uploading...'}
          {item.uploaded && ' - ✓ Uploaded'}
          {item.error && ` - Error: ${item.error}`}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeAttachment(item.id)}
        activeOpacity={0.7}
        disabled={item.uploading}>
        <Delete24Regular />
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
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
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
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}>
          <ArrowLeft24Regular />
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
            <Attach24Regular />
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
        () => { }, // Handled by handleComplaintTypeSelect
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
