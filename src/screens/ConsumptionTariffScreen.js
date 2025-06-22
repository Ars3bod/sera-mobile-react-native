import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
// Define fallback icon components first
const FallbackArrowLeft = ({ style }) => <Text style={[{ fontSize: 20 }, style]}>←</Text>;
const FallbackFlash = ({ style }) => <Text style={[{ fontSize: 20 }, style]}>⚡</Text>;
const FallbackBuilding = ({ style }) => <Text style={[{ fontSize: 20 }, style]}>🏢</Text>;
const FallbackFactory = ({ style }) => <Text style={[{ fontSize: 20 }, style]}>🏭</Text>;
const FallbackHome = ({ style }) => <Text style={[{ fontSize: 20 }, style]}>🏠</Text>;
const FallbackChevronDown = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>▼</Text>;
const FallbackChevronUp = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>▲</Text>;
const FallbackInfo = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>ℹ️</Text>;

// Safe imports with fallbacks for FluentUI icons
let ArrowLeft24Regular = FallbackArrowLeft;
let Flash24Regular = FallbackFlash;
let Building24Regular = FallbackBuilding;
let BuildingFactoryRegular = FallbackFactory;
let Home24Regular = FallbackHome;
let ChevronDown24Regular = FallbackChevronDown;
let ChevronUp24Regular = FallbackChevronUp;
let Info24Regular = FallbackInfo;

try {
    const icons = require('@fluentui/react-native-icons');
    if (icons.ArrowLeft24Regular) ArrowLeft24Regular = icons.ArrowLeft24Regular;
    if (icons.Flash24Regular) Flash24Regular = icons.Flash24Regular;
    if (icons.Building24Regular) Building24Regular = icons.Building24Regular;
    if (icons.BuildingFactoryRegular) BuildingFactoryRegular = icons.BuildingFactoryRegular;
    if (icons.Home24Regular) Home24Regular = icons.Home24Regular;
    if (icons.ChevronDown24Regular) ChevronDown24Regular = icons.ChevronDown24Regular;
    if (icons.ChevronUp24Regular) ChevronUp24Regular = icons.ChevronUp24Regular;
    if (icons.Info24Regular) Info24Regular = icons.Info24Regular;
} catch (error) {
    console.log('FluentUI icons not available, using fallback icons');
}

const ConsumptionTariffScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const isRTL = i18n.language === 'ar';
    const [expandedCategories, setExpandedCategories] = useState({});

    // Safety check for theme colors
    const safeTheme = {
        colors: {
            background: theme?.colors?.background || '#ffffff',
            surface: theme?.colors?.surface || '#f5f5f5',
            card: theme?.colors?.card || '#ffffff',
            text: theme?.colors?.text || '#000000',
            textSecondary: theme?.colors?.textSecondary || '#666666',
            primary: theme?.colors?.primary || '#1976d2',
            success: theme?.colors?.success || '#4caf50',
            warning: theme?.colors?.warning || '#ff9800',
            border: theme?.colors?.border || '#e0e0e0',
            icon: theme?.colors?.icon || '#666666',
            ...theme?.colors
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const tariffCategories = [
        {
            id: 'residential',
            titleKey: 'consumptionTariff.categories.residential.title',
            icon: Home24Regular || FallbackHome,
            color: '#4CAF50',
            data: [
                { range: '1-6,000', tariff: '18' },
                { range: '6,000+', tariff: '30' }
            ],
            note: null
        },
        {
            id: 'commercial',
            titleKey: 'consumptionTariff.categories.commercial.title',
            icon: Building24Regular || FallbackBuilding,
            color: '#4CAF50',
            data: [
                { range: '1-6,000', tariff: '22' },
                { range: '6,000+', tariff: '32' }
            ],
            note: 'consumptionTariff.notes.effectiveFrom2025'
        },
        {
            id: 'governmental',
            titleKey: 'consumptionTariff.categories.governmental.title',
            icon: Building24Regular || FallbackBuilding,
            color: '#4CAF50',
            data: [
                { range: 'All', tariff: '32' }
            ],
            note: null
        },
        {
            id: 'industrial',
            titleKey: 'consumptionTariff.categories.industrial.title',
            icon: BuildingFactoryRegular || FallbackFactory,
            color: '#4CAF50',
            data: [
                { range: 'Distribution Network', tariff: '20' },
                { range: 'Transmission Network', tariff: '20' }
            ],
            note: 'consumptionTariff.notes.effectiveFrom2025'
        },
        {
            id: 'agricultural',
            titleKey: 'consumptionTariff.categories.agricultural.title',
            icon: Home24Regular || FallbackHome,
            color: '#4CAF50',
            data: [
                { range: '1-6,000', tariff: '18' },
                { range: '6,000+', tariff: '22' }
            ],
            note: 'consumptionTariff.notes.effectiveFrom2025'
        },
        {
            id: 'organizations',
            titleKey: 'consumptionTariff.categories.organizations.title',
            icon: Building24Regular || FallbackBuilding,
            color: '#4CAF50',
            data: [
                { range: '1-6,000', tariff: '16' },
                { range: '6,000+', tariff: '20' }
            ],
            note: null
        },
        {
            id: 'healthEducation',
            titleKey: 'consumptionTariff.categories.healthEducation.title',
            icon: Building24Regular || FallbackBuilding,
            color: '#4CAF50',
            data: [
                { range: 'All', tariff: '18' }
            ],
            note: null
        },
        {
            id: 'cloudComputing',
            titleKey: 'consumptionTariff.categories.cloudComputing.title',
            icon: Building24Regular || FallbackBuilding,
            color: '#4CAF50',
            data: [
                { range: 'All', tariff: '18' }
            ],
            note: null,
            description: 'consumptionTariff.categories.cloudComputing.description'
        },
        {
            id: 'highIntensityFirst',
            titleKey: 'consumptionTariff.categories.highIntensityFirst.title',
            icon: Flash24Regular || FallbackFlash,
            color: '#4CAF50',
            data: [
                { range: 'Transmission Network', tariff: '12' },
                { range: 'Distribution Network', tariff: '18' }
            ],
            note: 'consumptionTariff.notes.highIntensityConditions',
            description: 'consumptionTariff.categories.highIntensityFirst.description'
        },
        {
            id: 'highIntensitySecond',
            titleKey: 'consumptionTariff.categories.highIntensitySecond.title',
            icon: Flash24Regular || FallbackFlash,
            color: '#4CAF50',
            data: [
                { range: 'Transmission Network', tariff: '18' },
                { range: 'Distribution Network', tariff: '24' }
            ],
            note: 'consumptionTariff.notes.highIntensityConditions',
            description: 'consumptionTariff.categories.highIntensitySecond.description'
        }
    ];

    const renderTariffCategory = (category) => {
        // Ensure IconComponent is always defined
        const IconComponent = category.icon || FallbackBuilding;
        const isExpanded = expandedCategories[category.id];

        return (
            <View key={category.id} style={[styles.categoryCard, { backgroundColor: safeTheme.colors.card }]}>
                <TouchableOpacity
                    style={[styles.categoryHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    onPress={() => toggleCategory(category.id)}
                    activeOpacity={0.7}>
                    <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '15' }]}>
                        {React.createElement(IconComponent, { style: [styles.categoryIcon, { color: category.color }] })}
                    </View>
                    <View style={styles.categoryTitleContainer}>
                        <Text style={[styles.categoryTitle, {
                            color: safeTheme.colors.text,
                            textAlign: isRTL ? 'right' : 'left'
                        }]}>
                            {t(category.titleKey)}
                        </Text>
                    </View>
                    {isExpanded ? (
                        React.createElement(ChevronUp24Regular || FallbackChevronUp, { style: [styles.chevronIcon, { color: safeTheme.colors.icon }] })
                    ) : (
                        React.createElement(ChevronDown24Regular || FallbackChevronDown, { style: [styles.chevronIcon, { color: safeTheme.colors.icon }] })
                    )}
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.categoryContent}>
                        {category.description && (
                            <View style={[styles.descriptionContainer, { backgroundColor: safeTheme.colors.primary + '10' }]}>
                                {React.createElement(Info24Regular || FallbackInfo, { style: [styles.infoIcon, { color: safeTheme.colors.primary }] })}
                                <Text style={[styles.categoryDescription, {
                                    color: safeTheme.colors.primary,
                                    textAlign: isRTL ? 'right' : 'left'
                                }]}>
                                    {t(category.description)}
                                </Text>
                            </View>
                        )}

                        <View style={styles.tariffTable}>
                            <View style={[styles.tableHeader, { backgroundColor: safeTheme.colors.surface }]}>
                                <Text style={[styles.tableHeaderText, {
                                    color: safeTheme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left'
                                }]}>
                                    {category.id === 'industrial' || category.id.includes('highIntensity')
                                        ? t('consumptionTariff.table.networkType')
                                        : t('consumptionTariff.table.consumptionRange')
                                    }
                                </Text>
                                <Text style={[styles.tableHeaderText, {
                                    color: safeTheme.colors.text,
                                    textAlign: isRTL ? 'left' : 'right'
                                }]}>
                                    {t('consumptionTariff.table.tariff')}
                                </Text>
                            </View>

                            {category.data.map((item, index) => (
                                <View key={index} style={[styles.tableRow, {
                                    backgroundColor: index % 2 === 0 ? 'transparent' : safeTheme.colors.surface + '50',
                                    flexDirection: isRTL ? 'row-reverse' : 'row'
                                }]}>
                                    <Text style={[styles.tableCell, {
                                        color: safeTheme.colors.text,
                                        textAlign: isRTL ? 'right' : 'left',
                                        flex: 1
                                    }]}>
                                        {category.id === 'industrial' || category.id.includes('highIntensity')
                                            ? t(`consumptionTariff.networkTypes.${item.range.toLowerCase().replace(' ', '')}`) || item.range
                                            : item.range === 'All'
                                                ? t('consumptionTariff.ranges.all')
                                                : item.range + ' ' + t('consumptionTariff.units.kwhMonth')
                                        }
                                    </Text>
                                    <Text style={[styles.tableCellTariff, {
                                        color: category.color,
                                        textAlign: isRTL ? 'left' : 'right'
                                    }]}>
                                        {item.tariff} {t('consumptionTariff.units.hhKwh')}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {category.note && (
                            <View style={[styles.noteContainer, { backgroundColor: safeTheme.colors.warning + '10' }]}>
                                <Text style={[styles.noteText, {
                                    color: safeTheme.colors.warning,
                                    textAlign: isRTL ? 'right' : 'left'
                                }]}>
                                    * {t(category.note)}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: safeTheme.colors.background,
        },
        header: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: safeTheme.colors.border,
            backgroundColor: safeTheme.colors.surface,
        },
        backButton: {
            padding: 8,
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0,
        },
        backIcon: {
            width: 24,
            height: 24,
            color: safeTheme.colors.primary,
            transform: [{ scaleX: isRTL ? -1 : 1 }],
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: safeTheme.colors.text,
            flex: 1,
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
    });

    return (
        <SafeAreaView style={dynamicStyles.container} edges={['top']}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={safeTheme.colors.surface}
            />

            {/* Header */}
            <View style={dynamicStyles.header}>
                <TouchableOpacity
                    style={dynamicStyles.backButton}
                    onPress={handleGoBack}
                    activeOpacity={0.7}>
                    {React.createElement(ArrowLeft24Regular || FallbackArrowLeft, { style: dynamicStyles.backIcon })}
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle}>
                    {t('consumptionTariff.title')}
                </Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Description Section */}
                <View style={[styles.descriptionSection, { backgroundColor: safeTheme.colors.primary + '10' }]}>
                    <Text style={[styles.descriptionTitle, {
                        color: safeTheme.colors.primary,
                        textAlign: isRTL ? 'right' : 'left'
                    }]}>
                        {t('consumptionTariff.description.title')}
                    </Text>
                    <Text style={[styles.descriptionText, {
                        color: safeTheme.colors.primary,
                        textAlign: isRTL ? 'right' : 'left'
                    }]}>
                        {t('consumptionTariff.description.content')}
                    </Text>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: safeTheme.colors.card }]}>
                        <Text style={[styles.statNumber, { color: safeTheme.colors.primary }]}>
                            {tariffCategories.length}
                        </Text>
                        <Text style={[styles.statLabel, {
                            color: safeTheme.colors.textSecondary,
                            textAlign: 'center'
                        }]}>
                            {t('consumptionTariff.stats.categories')}
                        </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: safeTheme.colors.card }]}>
                        <Text style={[styles.statNumber, { color: safeTheme.colors.primary }]}>
                            12-32
                        </Text>
                        <Text style={[styles.statLabel, {
                            color: safeTheme.colors.textSecondary,
                            textAlign: 'center'
                        }]}>
                            {t('consumptionTariff.stats.tariffRange')}
                        </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: safeTheme.colors.card }]}>
                        <Text style={[styles.statNumber, { color: safeTheme.colors.primary }]}>
                            2025
                        </Text>
                        <Text style={[styles.statLabel, {
                            color: safeTheme.colors.textSecondary,
                            textAlign: 'center'
                        }]}>
                            {t('consumptionTariff.stats.effectiveYear')}
                        </Text>
                    </View>
                </View>

                {/* Tariff Categories */}
                <View style={styles.categoriesContainer}>
                    {tariffCategories.map(renderTariffCategory)}
                </View>

                {/* Additional Information */}
                <View style={[styles.additionalInfo, { backgroundColor: safeTheme.colors.surface }]}>
                    <Text style={[styles.additionalInfoTitle, {
                        color: safeTheme.colors.text,
                        textAlign: isRTL ? 'right' : 'left'
                    }]}>
                        {t('consumptionTariff.additionalInfo.title')}
                    </Text>
                    <Text style={[styles.additionalInfoText, {
                        color: safeTheme.colors.textSecondary,
                        textAlign: isRTL ? 'right' : 'left'
                    }]}>
                        {t('consumptionTariff.additionalInfo.content')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    descriptionSection: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    descriptionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    categoriesContainer: {
        gap: 16,
        marginBottom: 24,
    },
    categoryCard: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    categoryHeader: {
        padding: 20,
        alignItems: 'center',
    },
    categoryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    categoryIcon: {
        width: 24,
        height: 24,
    },
    categoryTitleContainer: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chevronIcon: {
        width: 20,
        height: 20,
    },
    categoryContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    descriptionContainer: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    infoIcon: {
        width: 16,
        height: 16,
        marginTop: 2,
        marginRight: 8,
    },
    categoryDescription: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    tariffTable: {
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    tableHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
    },
    tableRow: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    tableCell: {
        fontSize: 14,
    },
    tableCellTariff: {
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 80,
    },
    noteContainer: {
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    noteText: {
        fontSize: 12,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    additionalInfo: {
        padding: 20,
        borderRadius: 16,
        marginTop: 8,
    },
    additionalInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    additionalInfoText: {
        fontSize: 14,
        lineHeight: 22,
    },
});

export default ConsumptionTariffScreen; 