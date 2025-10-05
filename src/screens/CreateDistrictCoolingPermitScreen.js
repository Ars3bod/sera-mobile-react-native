import React, { useState } from 'react';
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

} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { LoadingIndicator } from '../components';
import {
  ArrowLeft24Regular,
  Save24Regular,
  DocumentAdd24Regular,
  Calendar24Regular,
  ChevronDown24Regular,
  Attach24Regular,
  Delete24Regular,
} from '@fluentui/react-native-icons';

// Mock data for dropdowns
const MOCK_DATA = {
  userAccounts: [
    { id: '1', nameKey: 'permits.districtCooling.mockData.accounts.company1' },
    { id: '2', nameKey: 'permits.districtCooling.mockData.accounts.company2' },
    { id: '3', nameKey: 'permits.districtCooling.mockData.accounts.company3' },
  ],
  coolingPurposes: [
    {
      id: 'commercial',
      nameKey: 'permits.districtCooling.mockData.purposes.commercial',
    },
    {
      id: 'residential',
      nameKey: 'permits.districtCooling.mockData.purposes.residential',
    },
    {
      id: 'industrial',
      nameKey: 'permits.districtCooling.mockData.purposes.industrial',
    },
    { id: 'mixed', nameKey: 'permits.districtCooling.mockData.purposes.mixed' },
  ],
  powerSources: [
    { id: 'grid', nameKey: 'permits.districtCooling.mockData.powerSources.grid' },
    {
      id: 'solar',
      nameKey: 'permits.districtCooling.mockData.powerSources.solar',
    },
    { id: 'gas', nameKey: 'permits.districtCooling.mockData.powerSources.gas' },
    {
      id: 'hybrid',
      nameKey: 'permits.districtCooling.mockData.powerSources.hybrid',
    },
  ],
  waterSources: [
    {
      id: 'seawater',
      nameKey: 'permits.districtCooling.mockData.waterSources.seawater',
    },
    {
      id: 'groundwater',
      nameKey: 'permits.districtCooling.mockData.waterSources.groundwater',
    },
    {
      id: 'wastewater',
      nameKey: 'permits.districtCooling.mockData.waterSources.wastewater',
    },
    {
      id: 'desalinated',
      nameKey: 'permits.districtCooling.mockData.waterSources.desalinated',
    },
    {
      id: 'other',
      nameKey: 'permits.districtCooling.mockData.waterSources.other',
    },
  ],
  gridConnections: [
    { id: 'yes', nameKey: 'permits.districtCooling.mockData.gridConnection.yes' },
    { id: 'no', nameKey: 'permits.districtCooling.mockData.gridConnection.no' },
  ],
  networkTypes: [
    {
      id: 'transmission',
      nameKey: 'permits.districtCooling.mockData.networkTypes.transmission',
    },
    {
      id: 'distribution',
      nameKey: 'permits.districtCooling.mockData.networkTypes.distribution',
    },
  ],
};

const CreateDistrictCoolingPermitScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const isRTL = i18n.language === 'ar';

  // Form state
  const [formData, setFormData] = useState({
    // Section 1: Basic data
    userAccount: '',
    stationLocation: '',
    coolingPurposes: '',
    expectedCoolingQuantity: '',
    powerSource: '',
    operationDate: '',
    coolingWaterSource: '',

    // Conditional file attachments
    landPlanFile: null,
    energyEfficiencyFile: null,
    fuelAllocationFile: null,
    ministryApprovalFile: null,

    // Section 2: Grid connection
    gridConnection: '',
    load: '',
    internalVoltage: '',
    anchorPoint: '',
    networkType: '',
    serviceProviderConsentFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [currentField, setCurrentField] = useState('');

  const handleGoBack = () => {
    Alert.alert(
      t('permits.districtCooling.confirmExit.title'),
      t('permits.districtCooling.confirmExit.message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.exit'),
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const openDropdownModal = (field, data, title) => {
    setCurrentField(field);
    setModalData(data);
    setModalTitle(title);
    setModalVisible(true);
  };

  const selectDropdownValue = value => {
    setFormData(prev => ({
      ...prev,
      [currentField]: value,
    }));
    setModalVisible(false);
  };

  const handleFileAttachment = field => {
    // Mock file attachment
    Alert.alert(
      t('permits.districtCooling.fileAttachment.title'),
      t('permits.districtCooling.fileAttachment.message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('permits.districtCooling.fileAttachment.select'),
          onPress: () => {
            setFormData(prev => ({
              ...prev,
              [field]: {
                name: `mock_file_${field}.pdf`,
                size: '2.5 MB',
                type: 'application/pdf',
              },
            }));
          },
        },
      ],
    );
  };

  const removeFile = field => {
    setFormData(prev => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleSaveForLater = async () => {
    setLoading(true);
    try {
      // Mock save for later API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        t('permits.districtCooling.saveSuccess.title'),
        t('permits.districtCooling.saveSuccess.message'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('permits.districtCooling.saveError.message'),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    const requiredFields = [
      'userAccount',
      'stationLocation',
      'coolingPurposes',
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        t('common.error'),
        t('permits.districtCooling.validation.requiredFields'),
      );
      return;
    }

    setLoading(true);
    try {
      // Mock submission API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(
        t('permits.districtCooling.submitSuccess.title'),
        t('permits.districtCooling.submitSuccess.message', {
          permitNumber: 'DC-2024-001234',
        }),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('permits.districtCooling.submitError.message'),
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDropdownField = (label, value, field, data, placeholder) => {
    const selectedItem = data.find(item => item.id === value);

    return (
      <View style={styles.fieldContainer}>
        <Text
          style={[
            styles.fieldLabel,
            {
              color: theme.colors.text,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {label} *
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => openDropdownModal(field, data, label)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.dropdownText,
              {
                color: selectedItem
                  ? theme.colors.text
                  : theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {selectedItem ? t(selectedItem.nameKey) : placeholder}
          </Text>
          <ChevronDown24Regular
            style={[styles.dropdownIcon, { color: theme.colors.textSecondary }]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTextInput = (
    label,
    value,
    field,
    placeholder,
    keyboardType = 'default',
    multiline = false,
  ) => {
    return (
      <View style={styles.fieldContainer}>
        <Text
          style={[
            styles.fieldLabel,
            {
              color: theme.colors.text,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {label}
        </Text>
        <TextInput
          style={[
            multiline ? styles.textAreaInput : styles.textInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
          value={value}
          onChangeText={text => setFormData(prev => ({ ...prev, [field]: text }))}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
      </View>
    );
  };

  const renderFileAttachment = (label, file, field, required = false) => {
    return (
      <View style={styles.fieldContainer}>
        <Text
          style={[
            styles.fieldLabel,
            {
              color: theme.colors.text,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {label} {required && '*'}
        </Text>

        {file ? (
          <View
            style={[
              styles.fileContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <View style={styles.fileInfo}>
              <DocumentAdd24Regular
                style={[styles.fileIcon, { color: theme.colors.primary }]}
              />
              <View style={styles.fileDetails}>
                <Text
                  style={[
                    styles.fileName,
                    {
                      color: theme.colors.text,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}>
                  {file.name}
                </Text>
                <Text
                  style={[
                    styles.fileSize,
                    {
                      color: theme.colors.textSecondary,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}>
                  {file.size}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => removeFile(field)}
              style={styles.removeFileButton}
              activeOpacity={0.7}>
              <Delete24Regular
                style={[styles.removeFileIcon, { color: '#F44336' }]}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.attachmentButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => handleFileAttachment(field)}
            activeOpacity={0.7}>
            <Attach24Regular
              style={[styles.attachmentIcon, { color: theme.colors.primary }]}
            />
            <Text
              style={[
                styles.attachmentText,
                {
                  color: theme.colors.textSecondary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {t('permits.districtCooling.attachFile')}
            </Text>
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.fileHint,
            {
              color: theme.colors.textSecondary,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {t('permits.districtCooling.fileRequirements')}
        </Text>
      </View>
    );
  };

  const renderSection = (title, children) => {
    return (
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.primary,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {title}
        </Text>
        {children}
      </View>
    );
  };

  // Helper function to determine which files to show based on cooling water source
  const getRequiredFilesForWaterSource = () => {
    const source = formData.coolingWaterSource;
    if (!source) return [];

    const commonFiles = [
      'landPlanFile',
      'energyEfficiencyFile',
      'fuelAllocationFile',
    ];

    if (source === 'groundwater' || source === 'desalinated') {
      return ['ministryApprovalFile', ...commonFiles];
    }

    // seawater, wastewater, other
    return commonFiles;
  };

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
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      flex: 1,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
    },
    saveIcon: {
      width: 20,
      height: 20,
      color: '#FFFFFF',
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
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}>
          <ArrowLeft24Regular
            style={[
              dynamicStyles.backIcon,
              { transform: [{ scaleX: isRTL ? -1 : 1 }] },
            ]}
          />
        </TouchableOpacity>

        <Text style={dynamicStyles.headerTitle}>
          {t('permits.districtCooling.title')}
        </Text>

        <TouchableOpacity
          style={dynamicStyles.saveButton}
          onPress={handleSaveForLater}
          activeOpacity={0.7}
          disabled={loading}>
          {loading ? (
            <LoadingIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Save24Regular style={dynamicStyles.saveIcon} />
              <Text style={dynamicStyles.saveButtonText}>
                {t('permits.districtCooling.saveForLater')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Basic Data */}
        {renderSection(
          t('permits.districtCooling.sections.basicData'),
          <>
            {renderDropdownField(
              t('permits.districtCooling.fields.userAccount'),
              formData.userAccount,
              'userAccount',
              MOCK_DATA.userAccounts,
              t('permits.districtCooling.placeholders.selectAccount'),
            )}

            {renderTextInput(
              t('permits.districtCooling.fields.stationLocation'),
              formData.stationLocation,
              'stationLocation',
              t('permits.districtCooling.placeholders.enterLocation'),
            )}

            {renderDropdownField(
              t('permits.districtCooling.fields.coolingPurposes'),
              formData.coolingPurposes,
              'coolingPurposes',
              MOCK_DATA.coolingPurposes,
              t('permits.districtCooling.placeholders.selectPurposes'),
            )}

            {renderTextInput(
              t('permits.districtCooling.fields.expectedCoolingQuantity'),
              formData.expectedCoolingQuantity,
              'expectedCoolingQuantity',
              t('permits.districtCooling.placeholders.enterCoolingQuantity'),
              'numeric',
            )}

            {renderDropdownField(
              t('permits.districtCooling.fields.powerSource'),
              formData.powerSource,
              'powerSource',
              MOCK_DATA.powerSources,
              t('permits.districtCooling.placeholders.selectPowerSource'),
            )}

            {renderTextInput(
              t('permits.districtCooling.fields.operationDate'),
              formData.operationDate,
              'operationDate',
              t('permits.districtCooling.placeholders.enterOperationDate'),
            )}

            {renderDropdownField(
              t('permits.districtCooling.fields.coolingWaterSource'),
              formData.coolingWaterSource,
              'coolingWaterSource',
              MOCK_DATA.waterSources,
              t('permits.districtCooling.placeholders.selectWaterSource'),
            )}

            {/* Conditional File Attachments */}
            {formData.coolingWaterSource && (
              <>
                {getRequiredFilesForWaterSource().map(fileField => {
                  const fieldMappings = {
                    ministryApprovalFile: {
                      label: t(
                        'permits.districtCooling.fields.ministryApprovalFile',
                      ),
                      required: true,
                    },
                    landPlanFile: {
                      label: t('permits.districtCooling.fields.landPlanFile'),
                      required: true,
                    },
                    energyEfficiencyFile: {
                      label: t(
                        'permits.districtCooling.fields.energyEfficiencyFile',
                      ),
                      required: true,
                    },
                    fuelAllocationFile: {
                      label: t(
                        'permits.districtCooling.fields.fuelAllocationFile',
                      ),
                      required: true,
                    },
                  };

                  const fieldConfig = fieldMappings[fileField];
                  if (!fieldConfig) return null;

                  return renderFileAttachment(
                    fieldConfig.label,
                    formData[fileField],
                    fileField,
                    fieldConfig.required,
                  );
                })}
              </>
            )}
          </>,
        )}

        {/* Section 2: Grid Connection */}
        {renderSection(
          t('permits.districtCooling.sections.gridConnection'),
          <>
            {renderDropdownField(
              t('permits.districtCooling.fields.gridConnection'),
              formData.gridConnection,
              'gridConnection',
              MOCK_DATA.gridConnections,
              t('permits.districtCooling.placeholders.selectGridConnection'),
            )}

            {renderTextInput(
              t('permits.districtCooling.fields.load'),
              formData.load,
              'load',
              t('permits.districtCooling.placeholders.enterLoad'),
              'numeric',
            )}

            {/* Conditional Grid Connection Fields */}
            {formData.gridConnection === 'yes' && (
              <>
                {renderTextInput(
                  t('permits.districtCooling.fields.internalVoltage'),
                  formData.internalVoltage,
                  'internalVoltage',
                  t('permits.districtCooling.placeholders.enterVoltage'),
                  'numeric',
                )}

                {renderTextInput(
                  t('permits.districtCooling.fields.anchorPoint'),
                  formData.anchorPoint,
                  'anchorPoint',
                  t('permits.districtCooling.placeholders.enterAnchorPoint'),
                )}

                {renderDropdownField(
                  t('permits.districtCooling.fields.networkType'),
                  formData.networkType,
                  'networkType',
                  MOCK_DATA.networkTypes,
                  t('permits.districtCooling.placeholders.selectNetworkType'),
                )}

                {renderFileAttachment(
                  t(
                    'permits.districtCooling.fields.serviceProviderConsentFile',
                  ),
                  formData.serviceProviderConsentFile,
                  'serviceProviderConsentFile',
                  true,
                )}
              </>
            )}
          </>,
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={loading}>
          {loading ? (
            <LoadingIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {t('permits.districtCooling.submit')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}>
            <Text
              style={[
                styles.modalTitle,
                {
                  color: theme.colors.text,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {modalTitle}
            </Text>

            <ScrollView style={styles.modalOptions}>
              {modalData.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.colors.border },
                  ]}
                  onPress={() => selectDropdownValue(item.id)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color: theme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                      },
                    ]}>
                    {t(item.nameKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                { backgroundColor: theme.colors.border },
              ]}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}>
              <Text style={[styles.modalCloseText, { color: theme.colors.text }]}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textAreaInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  attachmentIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  attachmentText: {
    fontSize: 16,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
  },
  removeFileButton: {
    padding: 4,
  },
  removeFileIcon: {
    width: 20,
    height: 20,
  },
  fileHint: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalOptions: {
    maxHeight: 300,
  },
  modalOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCloseButton: {
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateDistrictCoolingPermitScreen;
