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
  
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
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
    {id: '1', nameKey: 'permits.powerGeneration.mockData.accounts.company1'},
    {id: '2', nameKey: 'permits.powerGeneration.mockData.accounts.company2'},
    {id: '3', nameKey: 'permits.powerGeneration.mockData.accounts.company3'},
  ],
  stationNatures: [
    {id: 'solar', nameKey: 'permits.powerGeneration.mockData.natures.solar'},
    {id: 'wind', nameKey: 'permits.powerGeneration.mockData.natures.wind'},
    {id: 'gas', nameKey: 'permits.powerGeneration.mockData.natures.gas'},
    {id: 'diesel', nameKey: 'permits.powerGeneration.mockData.natures.diesel'},
    {id: 'hybrid', nameKey: 'permits.powerGeneration.mockData.natures.hybrid'},
  ],
  stationTypes: [
    {
      id: 'commercial',
      nameKey: 'permits.powerGeneration.mockData.types.commercial',
    },
    {
      id: 'industrial',
      nameKey: 'permits.powerGeneration.mockData.types.industrial',
    },
    {
      id: 'residential',
      nameKey: 'permits.powerGeneration.mockData.types.residential',
    },
    {id: 'utility', nameKey: 'permits.powerGeneration.mockData.types.utility'},
  ],
  fuelTypes: [
    {
      id: 'natural_gas',
      nameKey: 'permits.powerGeneration.mockData.fuels.naturalGas',
    },
    {id: 'diesel', nameKey: 'permits.powerGeneration.mockData.fuels.diesel'},
    {id: 'solar', nameKey: 'permits.powerGeneration.mockData.fuels.solar'},
    {id: 'wind', nameKey: 'permits.powerGeneration.mockData.fuels.wind'},
    {id: 'biomass', nameKey: 'permits.powerGeneration.mockData.fuels.biomass'},
  ],
  stationUses: [
    {
      id: 'power_only',
      nameKey: 'permits.powerGeneration.mockData.uses.powerOnly',
    },
    {
      id: 'cogeneration',
      nameKey: 'permits.powerGeneration.mockData.uses.cogeneration',
    },
    {
      id: 'dual_production',
      nameKey: 'permits.powerGeneration.mockData.uses.dualProduction',
    },
  ],
  gridConnections: [
    {id: 'yes', nameKey: 'permits.powerGeneration.mockData.gridConnection.yes'},
    {id: 'no', nameKey: 'permits.powerGeneration.mockData.gridConnection.no'},
    {
      id: 'planned',
      nameKey: 'permits.powerGeneration.mockData.gridConnection.planned',
    },
  ],
};

const CreatePowerGenerationPermitScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  // Form state
  const [formData, setFormData] = useState({
    // Section 1: Basic data
    userAccount: '',
    stationNature: '',
    stationType: '',

    // Section 2: Location and Layout
    stationLocation: '',
    expectedPowerAC: '',
    expectedPowerDC: '',
    fuelType: '',
    stationUses: '',
    dualProductionCapacity: '',
    cogenerationCapacity: '',
    coordinatesFile: null,
    aerialPhotosFile: null,
    siteOwnershipFile: null,
    fuelAllocationFile: null,
    energyEfficiencyFile: null,

    // Section 3: Energy Sales
    energySoldTo: '',
    energyPercentageSold: '',
    totalLoad: '',

    // Section 4: Grid Connection
    gridConnection: '',
    anchorPoint: '',
    connectionVoltage: '',
    operationDate: '',
    initialApprovalFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [currentField, setCurrentField] = useState('');

  const handleGoBack = () => {
    Alert.alert(
      t('permits.powerGeneration.confirmExit.title'),
      t('permits.powerGeneration.confirmExit.message'),
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
      t('permits.powerGeneration.fileAttachment.title'),
      t('permits.powerGeneration.fileAttachment.message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('permits.powerGeneration.fileAttachment.select'),
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
        t('permits.powerGeneration.saveSuccess.title'),
        t('permits.powerGeneration.saveSuccess.message'),
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
        t('permits.powerGeneration.saveError.message'),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    const requiredFields = ['userAccount', 'stationNature', 'stationType'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        t('common.error'),
        t('permits.powerGeneration.validation.requiredFields'),
      );
      return;
    }

    setLoading(true);
    try {
      // Mock submission API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(
        t('permits.powerGeneration.submitSuccess.title'),
        t('permits.powerGeneration.submitSuccess.message', {
          permitNumber: 'PWR-2024-001234',
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
        t('permits.powerGeneration.submitError.message'),
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
            style={[styles.dropdownIcon, {color: theme.colors.textSecondary}]}
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
          onChangeText={text => setFormData(prev => ({...prev, [field]: text}))}
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
                style={[styles.fileIcon, {color: theme.colors.primary}]}
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
                style={[styles.removeFileIcon, {color: '#F44336'}]}
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
              style={[styles.attachmentIcon, {color: theme.colors.primary}]}
            />
            <Text
              style={[
                styles.attachmentText,
                {
                  color: theme.colors.textSecondary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {t('permits.powerGeneration.attachFile')}
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
          {t('permits.powerGeneration.fileRequirements')}
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
          {t('permits.powerGeneration.title')}
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
                {t('permits.powerGeneration.saveForLater')}
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
          t('permits.powerGeneration.sections.basicData'),
          <>
            {renderDropdownField(
              t('permits.powerGeneration.fields.userAccount'),
              formData.userAccount,
              'userAccount',
              MOCK_DATA.userAccounts,
              t('permits.powerGeneration.placeholders.selectAccount'),
            )}

            {renderDropdownField(
              t('permits.powerGeneration.fields.stationNature'),
              formData.stationNature,
              'stationNature',
              MOCK_DATA.stationNatures,
              t('permits.powerGeneration.placeholders.selectNature'),
            )}

            {renderDropdownField(
              t('permits.powerGeneration.fields.stationType'),
              formData.stationType,
              'stationType',
              MOCK_DATA.stationTypes,
              t('permits.powerGeneration.placeholders.selectType'),
            )}
          </>,
        )}

        {/* Section 2: Location and Layout */}
        {renderSection(
          t('permits.powerGeneration.sections.locationLayout'),
          <>
            {renderTextInput(
              t('permits.powerGeneration.fields.stationLocation'),
              formData.stationLocation,
              'stationLocation',
              t('permits.powerGeneration.placeholders.enterLocation'),
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.expectedPowerAC'),
              formData.expectedPowerAC,
              'expectedPowerAC',
              t('permits.powerGeneration.placeholders.enterPowerAC'),
              'numeric',
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.expectedPowerDC'),
              formData.expectedPowerDC,
              'expectedPowerDC',
              t('permits.powerGeneration.placeholders.enterPowerDC'),
              'numeric',
            )}

            {renderDropdownField(
              t('permits.powerGeneration.fields.fuelType'),
              formData.fuelType,
              'fuelType',
              MOCK_DATA.fuelTypes,
              t('permits.powerGeneration.placeholders.selectFuel'),
            )}

            {renderDropdownField(
              t('permits.powerGeneration.fields.stationUses'),
              formData.stationUses,
              'stationUses',
              MOCK_DATA.stationUses,
              t('permits.powerGeneration.placeholders.selectUses'),
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.dualProductionCapacity'),
              formData.dualProductionCapacity,
              'dualProductionCapacity',
              t('permits.powerGeneration.placeholders.enterDualProduction'),
              'numeric',
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.cogenerationCapacity'),
              formData.cogenerationCapacity,
              'cogenerationCapacity',
              t('permits.powerGeneration.placeholders.enterCogeneration'),
              'numeric',
            )}

            {renderFileAttachment(
              t('permits.powerGeneration.fields.coordinatesFile'),
              formData.coordinatesFile,
              'coordinatesFile',
              true,
            )}

            {renderFileAttachment(
              t('permits.powerGeneration.fields.aerialPhotosFile'),
              formData.aerialPhotosFile,
              'aerialPhotosFile',
              true,
            )}

            {renderFileAttachment(
              t('permits.powerGeneration.fields.siteOwnershipFile'),
              formData.siteOwnershipFile,
              'siteOwnershipFile',
              true,
            )}

            {renderFileAttachment(
              t('permits.powerGeneration.fields.fuelAllocationFile'),
              formData.fuelAllocationFile,
              'fuelAllocationFile',
            )}

            {renderFileAttachment(
              t('permits.powerGeneration.fields.energyEfficiencyFile'),
              formData.energyEfficiencyFile,
              'energyEfficiencyFile',
            )}
          </>,
        )}

        {/* Section 3: Energy Sales */}
        {renderSection(
          t('permits.powerGeneration.sections.energySales'),
          <>
            {renderTextInput(
              t('permits.powerGeneration.fields.energySoldTo'),
              formData.energySoldTo,
              'energySoldTo',
              t('permits.powerGeneration.placeholders.enterEnergySoldTo'),
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.energyPercentageSold'),
              formData.energyPercentageSold,
              'energyPercentageSold',
              t('permits.powerGeneration.placeholders.enterPercentage'),
              'numeric',
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.totalLoad'),
              formData.totalLoad,
              'totalLoad',
              t('permits.powerGeneration.placeholders.enterTotalLoad'),
              'numeric',
            )}
          </>,
        )}

        {/* Section 4: Grid Connection */}
        {renderSection(
          t('permits.powerGeneration.sections.gridConnection'),
          <>
            {renderDropdownField(
              t('permits.powerGeneration.fields.gridConnection'),
              formData.gridConnection,
              'gridConnection',
              MOCK_DATA.gridConnections,
              t('permits.powerGeneration.placeholders.selectGridConnection'),
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.anchorPoint'),
              formData.anchorPoint,
              'anchorPoint',
              t('permits.powerGeneration.placeholders.enterAnchorPoint'),
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.connectionVoltage'),
              formData.connectionVoltage,
              'connectionVoltage',
              t('permits.powerGeneration.placeholders.enterVoltage'),
              'numeric',
            )}

            {renderTextInput(
              t('permits.powerGeneration.fields.operationDate'),
              formData.operationDate,
              'operationDate',
              t('permits.powerGeneration.placeholders.enterOperationDate'),
            )}

            {renderFileAttachment(
              t('permits.powerGeneration.fields.initialApprovalFile'),
              formData.initialApprovalFile,
              'initialApprovalFile',
            )}
          </>,
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={loading}>
          {loading ? (
            <LoadingIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {t('permits.powerGeneration.submit')}
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
              {backgroundColor: theme.colors.surface},
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
                    {borderBottomColor: theme.colors.border},
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
                {backgroundColor: theme.colors.border},
              ]}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}>
              <Text style={[styles.modalCloseText, {color: theme.colors.text}]}>
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

export default CreatePowerGenerationPermitScreen;
