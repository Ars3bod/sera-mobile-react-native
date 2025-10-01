import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
    ArrowLeft24Regular,
    DocumentText24Regular,
    Money24Regular,
    Clock24Regular,
    Alert24Regular,
    ChevronRight24Regular,
    ArrowDownload24Regular,
    Power24Regular,
} from '@fluentui/react-native-icons';

const CompensationStandardsScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const isRTL = i18n.language === 'ar';

    // Consumer Compensation Standards Data from SERA - Complete 9 Standards
    const compensationStandards = [
        {
            id: 1,
            icon: DocumentText24Regular,
            title: isRTL
                ? 'مدة تسجيل العداد باسم المستهلك'
                : 'Meter Registration Period in Consumer Name',
            description: isRTL
                ? 'طلب تسجيل العداد باسم مالك المنشأة أو المستأجر، أو إلغاء التسجيل'
                : 'Request to register the meter in the name of property owner or tenant, or cancel registration',
            conditions: isRTL
                ? 'إرفاق كافة المستندات المطلوبة'
                : 'Attach all required documents',
            period: isRTL ? '3 أيام عمل' : '3 working days',
            compensation: isRTL ? '100 ريال' : 'SAR 100',
            additionalCompensation: isRTL
                ? '20 ريال عن كل يوم عمل إضافي أو جزء منه'
                : 'SAR 20 per additional working day or part thereof',
            notes: isRTL
                ? 'يتم حساب بداية المدة من يوم العمل التالي لتقديم الطلب'
                : 'Period starts from the working day following the request submission',
            color: '#00623B',
            category: 'service',
        },
        {
            id: 2,
            icon: Power24Regular,
            title: isRTL
                ? 'مدة إيصال الخدمة الكهربائية أو التعديل عليها بعد السداد'
                : 'Period for Electricity Service Connection or Modification After Payment',
            description: isRTL
                ? 'تقديم طلب إيصال الخدمة الكهربائية، طلب التعديل على الخدمة الكهربائية القائمة بـ إضافة، تقوية، تجزئة، أو تجميع، تقديم طلب إيصال مؤقت لأغراض الإنشاءات'
                : 'Submit request for electricity service connection, request modification to existing electrical service (addition, strengthening, division, or consolidation), submit temporary connection request for construction purposes',
            conditions: isRTL
                ? 'سداد مبلغ الإيصال أو التكاليف الفعلية'
                : 'Payment of connection amount or actual costs',
            period: isRTL
                ? '20 يوم عمل (جهد منخفض)، 60 يوم عمل (جهد متوسط أو أعمال على الجهد المتوسط)'
                : '20 working days (low voltage), 60 working days (medium voltage or work on medium voltage)',
            compensation: isRTL ? '400 ريال' : 'SAR 400',
            additionalCompensation: isRTL
                ? '20 ريال عن كل يوم عمل إضافي أو جزء منه'
                : 'SAR 20 per additional working day or part thereof',
            notes: isRTL
                ? 'يتم حساب بداية المدة من يوم العمل التالي ليوم السداد'
                : 'Period starts from the working day following payment day',
            color: '#00623B',
            category: 'service',
        },
        {
            id: 3,
            icon: Clock24Regular,
            title: isRTL
                ? 'مدة إعادة الخدمة الكهربائية بعد السداد'
                : 'Period for Restoring Electricity Service After Payment',
            description: isRTL
                ? 'إعادة الخدمة الكهربائية بعد فصلها عن المستهلك بسبب عدم سداده للفاتورة المستحقة'
                : 'Restore electricity service after disconnection due to non-payment of due invoice',
            conditions: isRTL
                ? 'سداد المبلغ المطلوب'
                : 'Payment of required amount',
            period: isRTL ? 'ساعتان' : '2 hours',
            compensation: isRTL ? '100 ريال' : 'SAR 100',
            additionalCompensation: isRTL
                ? '100 ريال عن كل ساعة إضافية أو جزء منها'
                : 'SAR 100 per additional hour or part thereof',
            notes: isRTL
                ? 'يتم حساب المدة من وقت إشعار مقدم الخدمة بالسداد'
                : 'Period is calculated from time of notifying service provider of payment',
            color: '#00623B',
            category: 'restoration',
        },
        {
            id: 4,
            icon: Alert24Regular,
            title: isRTL
                ? 'الإشعار عن الانقطاع المخطط للخدمة الكهربائية'
                : 'Notice of Planned Electricity Service Outage',
            description: isRTL
                ? 'إشعار المستهلك بالانقطاع المخطط للخدمة الكهربائية'
                : 'Notify consumer of planned electricity service outage',
            conditions: isRTL
                ? 'عدم وصول الإشعار المسبق'
                : 'No prior notice received',
            period: isRTL ? 'يومين قبل الانقطاع على الأقل' : 'At least 2 days before outage',
            compensation: isRTL ? '100 ريال' : 'SAR 100',
            additionalCompensation: isRTL
                ? 'لا ينطبق'
                : 'Not applicable',
            notes: isRTL
                ? 'إذا لم يلتزم مقدم الخدمة بالإشعار بالانقطاع قبل 48 ساعة، يستحق المستهلك التعويض'
                : 'If service provider does not notify of outage 48 hours in advance, consumer is entitled to compensation',
            color: '#00623B',
            category: 'notification',
        },
        {
            id: 5,
            icon: Clock24Regular,
            title: isRTL
                ? 'مدة إعادة الخدمة الكهربائية بعد الانقطاع المخطط'
                : 'Period for Restoring Electricity Service After Planned Outage',
            description: isRTL
                ? 'إعادة الخدمة الكهربائية للمستهلك بعد الانقطاع المخطط'
                : 'Restore electricity service to consumer after planned outage',
            period: isRTL ? 'في أسرع وقت وبما لا يتجاوز 6 ساعات' : 'As soon as possible not exceeding 6 hours',
            compensation: isRTL ? '200 ريال' : 'SAR 200',
            additionalCompensation: isRTL
                ? '50 ريال عن كل ساعة إضافية أو جزء منها'
                : 'SAR 50 per additional hour or part thereof',
            notes: isRTL
                ? 'تحسب المدة من بداية وقت الانقطاع الفعلي المخطط. يستحق المستهلك تعويض على المعيار الرابع والخامس إذا تأثر بهما معاً'
                : 'Period calculated from start of actual planned outage time. Consumer entitled to compensation for both standards 4 and 5 if affected by both',
            color: '#00623B',
            category: 'restoration',
        },
        {
            id: 6,
            icon: Alert24Regular,
            title: isRTL
                ? 'مدة إعادة الخدمة الكهربائية بعد الانقطاع الطارئ (غير المخطط)'
                : 'Period for Restoring Electricity Service After Emergency (Unplanned) Outage',
            description: isRTL
                ? 'انقطاع الخدمة الكهربائية عن المستهلك انقطاعاً طارئاً نتيجة عطل مثلاً'
                : 'Emergency electricity service outage to consumer due to fault for example',
            period: isRTL ? 'في أسرع وقت وبما لا يتجاوز 3 ساعات' : 'As soon as possible not exceeding 3 hours',
            compensation: isRTL ? '50 ريال' : 'SAR 50',
            additionalCompensation: isRTL
                ? '50 ريال عن كل ساعة إضافية أو جزء منها'
                : 'SAR 50 per additional hour or part thereof',
            notes: isRTL
                ? 'يتم حساب المدة من بداية وقت الانقطاع الطارئ غير المخطط'
                : 'Period calculated from start of emergency unplanned outage',
            color: '#00623B',
            category: 'emergency',
        },
        {
            id: 7,
            icon: Power24Regular,
            title: isRTL
                ? 'مدة إعادة الخدمة الكهربائية بعد الانطفاء الشامل'
                : 'Period for Restoring Electricity Service After Total Blackout',
            description: isRTL
                ? 'حدوث انطفاء شامل للنظام الكهربائي عن أي مدينة أو محافظة، دون عودة الخدمة الكهربائية خلال 6 ساعات لكامل تلك المدينة / المحافظة'
                : 'Total blackout of electrical system in any city or province without restoration within 6 hours for entire city/province',
            conditions: isRTL
                ? 'انطفاء شامل للمدينة أو المحافظة لأكثر من 6 ساعات'
                : 'Total blackout of city or province for more than 6 hours',
            period: isRTL ? 'بما يتجاوز 6 ساعات للانطفاء الشامل' : 'Exceeding 6 hours for total blackout',
            compensation: isRTL ? 'بما يصل إلى 1000 ريال' : 'Up to SAR 1,000',
            additionalCompensation: isRTL
                ? 'لا يتجاوز مجموع مبالغ التعويض 200 مليون ريال لكل مدينة/محافظة'
                : 'Total compensation shall not exceed SAR 200 million per city/province',
            notes: isRTL
                ? 'تحسب المدة من بداية وقت الانطفاء الشامل. في حال كان الانطفاء الشامل على أكثر من مدينة/محافظة، فيتم التعامل مع كل مدينة أو محافظة بشكل مستقل من حيث حساب سقف التعويض. كل مستهلك مستحق لهذا التعويض، يتم تعويضه أيضاً عن المعيار السادس'
                : 'Period calculated from start of total blackout. If blackout affects multiple cities/provinces, each is treated independently for compensation cap. Every consumer entitled to this compensation is also compensated under standard 6',
            color: '#00623B',
            category: 'emergency',
        },
        {
            id: 8,
            icon: Alert24Regular,
            title: isRTL
                ? 'فصل الخدمة الكهربائية في الأوقات والحالات المحظورة'
                : 'Disconnection of Electricity Service at Prohibited Times and Cases',
            description: isRTL
                ? 'في حال قيام مقدم الخدمة بفصل الخدمة الكهربائية عن أي عداد بعدم الالتزام بالضوابط والإجراءات المعتمدة، أو في الأوقات والحالات المحظورة، أو قبل التاريخ المحدد، أو عن أي عداد غير مستحق للفصل'
                : 'If service provider disconnects electricity from any meter without complying with approved controls and procedures, or at prohibited times and cases, or before specified date, or from any meter not due for disconnection',
            period: isRTL ? 'إعادة الخدمة فوراً' : 'Restore service immediately',
            compensation: isRTL ? '500 ريال' : 'SAR 500',
            notes: isRTL
                ? 'من الأوقات المحظورة لفصل الخدمة لعدم السداد: شهر رمضان ووقت اختبارات التعليم العام للاستهلاك السكني، بعد الساعة 12 ظهراً، خارج أوقات عمل مقدم الخدمة، في حال كان في المنشأة أحد المسجلين بخدمة ذوي الاحتياجات الماسة للكهرباء'
                : 'Prohibited times for disconnection due to non-payment include: Ramadan and general education exam period for residential consumption, after 12 PM, outside service provider working hours, if premises has registered person with critical electricity needs',
            color: '#00623B',
            category: 'violation',
        },
        {
            id: 9,
            icon: DocumentText24Regular,
            title: isRTL
                ? 'مدة معالجة شكوى الفواتير'
                : 'Period for Processing Invoice Complaints',
            description: isRTL
                ? 'معالجة مقدم الخدمة للشكاوى المتعلقة بالفواتير، وتقديم رد تفصيلي للمستهلك عن نتيجة معالجة شكواه'
                : 'Service provider processing of invoice-related complaints and providing detailed response to consumer about complaint processing result',
            conditions: isRTL
                ? 'تقديم شكوى لمزود الخدمة متعلقة بالفاتورة'
                : 'Submit invoice-related complaint to service provider',
            period: isRTL ? '5 أيام عمل' : '5 working days',
            compensation: isRTL ? '100 ريال' : 'SAR 100',
            additionalCompensation: isRTL
                ? '50 ريال عن كل يوم عمل إضافي أو جزء منه'
                : 'SAR 50 per additional working day or part thereof',
            notes: isRTL
                ? 'يتم حساب المدة من يوم العمل التالي ليوم تقديم الشكوى'
                : 'Period calculated from working day following complaint submission day',
            color: '#00623B',
            category: 'complaint',
        },
    ];

    const translations = {
        title: isRTL ? 'معايير التعويضات' : 'Compensation Standards',
        subtitle: isRTL
            ? 'حقوقك كمستهلك للكهرباء'
            : 'Your Rights as Electricity Consumer',
        description: isRTL
            ? 'وصف المعيار'
            : 'Standard Description',
        conditions: isRTL ? 'شرط الاستحقاق' : 'Eligibility Condition',
        period: isRTL ? 'الفترة الزمنية' : 'Time Period',
        compensation: isRTL ? 'مبلغ التعويض عند التقصير' : 'Compensation Amount for Non-Compliance',
        additionalCompensation: isRTL
            ? 'الاستمرار في التقصير "التعويض الإضافي"'
            : 'Continued Non-Compliance "Additional Compensation"',
        notes: isRTL ? 'توضيحات إضافية' : 'Additional Notes',
        mainDescription: isRTL
            ? 'تعرف على حقوقك في التعويض عند عدم التزام مقدم الخدمة بالمعايير المحددة من قبل الهيئة السعودية لتنظيم الكهرباء.'
            : 'Learn about your compensation rights when service providers fail to meet the standards set by the Saudi Electricity Regulatory Authority.',
        categories: {
            service: isRTL ? 'خدمات الكهرباء' : 'Electricity Services',
            restoration: isRTL ? 'استعادة الخدمة' : 'Service Restoration',
            notification: isRTL ? 'الإشعارات' : 'Notifications',
            emergency: isRTL ? 'الطوارئ' : 'Emergency',
            violation: isRTL ? 'المخالفات' : 'Violations',
            complaint: isRTL ? 'الشكاوى' : 'Complaints',
        },
        quickStats: {
            totalStandards: isRTL ? 'المعايير المتاحة' : 'Available Standards',
            avgCompensation: isRTL ? 'متوسط التعويض' : 'Average Compensation',
            maxCompensation: isRTL ? 'أعلى تعويض' : 'Highest Compensation',
        },
        downloadGuide: isRTL ? 'تحميل الدليل المبسط' : 'Download Simplified Guide',
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Handle PDF download
    const handleDownloadGuide = async () => {
        const guideUrl = 'https://sera.gov.sa/-/media/standard-file.pdf';
        try {
            // Directly open PDF URL without checking (as per Android fix)
            await Linking.openURL(guideUrl);
        } catch (error) {
            console.error('Error opening PDF guide:', error);
        }
    };

    // Group standards by category
    const groupedStandards = {
        service: compensationStandards.filter(s => s.category === 'service'),
        restoration: compensationStandards.filter(s => s.category === 'restoration'),
        notification: compensationStandards.filter(s => s.category === 'notification'),
        emergency: compensationStandards.filter(s => s.category === 'emergency'),
        violation: compensationStandards.filter(s => s.category === 'violation'),
        complaint: compensationStandards.filter(s => s.category === 'complaint'),
    };

    // Calculate quick stats
    const quickStats = {
        totalStandards: compensationStandards.length,
        avgCompensation: Math.round(
            compensationStandards.reduce((sum, s) => {
                const amount = parseInt(s.compensation.replace(/[^\d]/g, ''));
                return sum + amount;
            }, 0) / compensationStandards.length
        ),
        maxCompensation: isRTL ? '1,000 ريال' : 'SAR 1,000',
    };

    // Quick Stats Component
    const QuickStatsCard = () => (
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {quickStats.totalStandards}
                    </Text>
                    <Text style={[styles.statLabel, {
                        color: theme.colors.textSecondary,
                        textAlign: 'center'
                    }]} numberOfLines={2}>
                        {translations.quickStats.totalStandards}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {isRTL ? `${quickStats.avgCompensation} ريال` : `SAR ${quickStats.avgCompensation}`}
                    </Text>
                    <Text style={[styles.statLabel, {
                        color: theme.colors.textSecondary,
                        textAlign: 'center'
                    }]} numberOfLines={2}>
                        {translations.quickStats.avgCompensation}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {quickStats.maxCompensation}
                    </Text>
                    <Text style={[styles.statLabel, {
                        color: theme.colors.textSecondary,
                        textAlign: 'center'
                    }]} numberOfLines={2}>
                        {translations.quickStats.maxCompensation}
                    </Text>
                </View>
            </View>
        </View>
    );

    // Section Header Component
    const SectionHeader = ({ title, count }) => (
        <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.sectionTitle, {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr'
            }]}>
                {title}
            </Text>
            <View style={[styles.countBadge, {
                backgroundColor: '#00623B20',
                marginLeft: isRTL ? 0 : 8,
                marginRight: isRTL ? 8 : 0
            }]}>
                <Text style={[styles.countText, { color: '#00623B' }]}>
                    {count}
                </Text>
            </View>
        </View>
    );

    const CompensationCard = ({ standard }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const IconComponent = standard.icon;

        return (
            <TouchableOpacity
                style={[styles.compensationCard, { backgroundColor: theme.colors.card }]}
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}>
                <View
                    style={[
                        styles.compensationHeader,
                        { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    ]}>
                    <View
                        style={[
                            styles.compensationIcon,
                            {
                                backgroundColor: standard.color + '20',
                                marginRight: isRTL ? 0 : 12,
                                marginLeft: isRTL ? 12 : 0,
                            },
                        ]}>
                        <IconComponent
                            style={[
                                styles.compensationIconComponent,
                                { color: standard.color },
                            ]}
                        />
                    </View>
                    <View style={[styles.compensationHeaderText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                        <Text
                            style={[
                                styles.compensationTitle,
                                {
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left',
                                    writingDirection: isRTL ? 'rtl' : 'ltr',
                                },
                            ]}
                            numberOfLines={isExpanded ? 0 : 2}>
                            {standard.title}
                        </Text>
                        <View
                            style={[
                                styles.compensationAmountRow,
                                {
                                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                                    flexDirection: isRTL ? 'row-reverse' : 'row',
                                },
                            ]}>
                            <Text
                                style={[styles.compensationAmount, { color: standard.color }]}>
                                {standard.compensation}
                            </Text>
                            <Text
                                style={[
                                    styles.compensationLabel,
                                    {
                                        color: theme.colors.textSecondary,
                                        marginLeft: isRTL ? 0 : 6,
                                        marginRight: isRTL ? 6 : 0,
                                    },
                                ]}>
                                {translations.compensation}
                            </Text>
                        </View>
                    </View>
                    <ChevronRight24Regular
                        style={[
                            styles.compensationChevron,
                            {
                                color: theme.colors.textSecondary,
                                transform: [
                                    ...(isRTL ? [{ rotate: '180deg' }] : []),
                                    ...(isExpanded ? [{ rotate: isRTL ? '90deg' : '-90deg' }] : []),
                                ],
                            },
                        ]}
                    />
                </View>

                {isExpanded && (
                    <View style={[styles.compensationDetails, { borderTopColor: theme.colors.border }]}>
                        {standard.description && (
                            <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                                <Text style={[styles.compensationDetailLabel, {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {translations.description}:
                                </Text>
                                <Text style={[styles.compensationDetailValue, {
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {standard.description}
                                </Text>
                            </View>
                        )}
                        {standard.conditions && (
                            <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                                <Text style={[styles.compensationDetailLabel, {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {translations.conditions}:
                                </Text>
                                <Text style={[styles.compensationDetailValue, {
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {standard.conditions}
                                </Text>
                            </View>
                        )}
                        <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                            <Text style={[styles.compensationDetailLabel, {
                                color: theme.colors.textSecondary,
                                textAlign: isRTL ? 'right' : 'left',
                            }]}>
                                {translations.period}:
                            </Text>
                            <Text style={[styles.compensationDetailValue, {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left',
                            }]}>
                                {standard.period}
                            </Text>
                        </View>
                        <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                            <Text style={[styles.compensationDetailLabel, {
                                color: theme.colors.textSecondary,
                                textAlign: isRTL ? 'right' : 'left',
                            }]}>
                                {translations.additionalCompensation}:
                            </Text>
                            <Text style={[styles.compensationDetailValue, {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left',
                            }]}>
                                {standard.additionalCompensation}
                            </Text>
                        </View>
                        {standard.notes && (
                            <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                                <Text style={[styles.compensationDetailLabel, {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {translations.notes}:
                                </Text>
                                <Text style={[styles.compensationDetailValue, {
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {standard.notes}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
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
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
        descriptionSection: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        descriptionTitle: {
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 8,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
        },
        descriptionText: {
            fontSize: 14,
            lineHeight: 20,
            opacity: 0.8,
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
        },
    });

    return (
        <SafeAreaView style={dynamicStyles.container} edges={['top']}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.surface}
            />

            {/* Header */}
            <View style={dynamicStyles.header}>
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
                <Text style={dynamicStyles.headerTitle}>{translations.title}</Text>
                <View style={styles.placeholderView} />
            </View>

            {/* Description Section */}
            <View style={dynamicStyles.descriptionSection}>
                <Text style={dynamicStyles.descriptionTitle}>
                    {translations.subtitle}
                </Text>
                <Text style={dynamicStyles.descriptionText}>
                    {translations.mainDescription}
                </Text>
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Quick Stats */}
                <QuickStatsCard />

                {/* Download Guide Button */}
                <TouchableOpacity
                    style={[styles.downloadButton, {
                        backgroundColor: theme.colors.primary,
                        flexDirection: isRTL ? 'row-reverse' : 'row'
                    }]}
                    onPress={handleDownloadGuide}
                    activeOpacity={0.8}>
                    <ArrowDownload24Regular
                        style={[styles.downloadIcon, {
                            color: '#ffffff',
                            marginRight: isRTL ? 0 : 8,
                            marginLeft: isRTL ? 8 : 0
                        }]}
                    />
                    <Text style={[styles.downloadButtonText, { color: '#ffffff' }]}>
                        {translations.downloadGuide}
                    </Text>
                </TouchableOpacity>

                {/* Service Standards Section */}
                {groupedStandards.service.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.service}
                            count={groupedStandards.service.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.service.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Restoration Standards Section */}
                {groupedStandards.restoration.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.restoration}
                            count={groupedStandards.restoration.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.restoration.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Notification Standards Section */}
                {groupedStandards.notification.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.notification}
                            count={groupedStandards.notification.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.notification.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Emergency Standards Section */}
                {groupedStandards.emergency.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.emergency}
                            count={groupedStandards.emergency.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.emergency.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Violation Standards Section */}
                {groupedStandards.violation.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.violation}
                            count={groupedStandards.violation.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.violation.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Complaint Standards Section */}
                {groupedStandards.complaint.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.complaint}
                            count={groupedStandards.complaint.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.complaint.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Additional Info Section */}
                <View style={[styles.infoSection, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.infoTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL ? 'معلومات إضافية' : 'Additional Information'}
                    </Text>
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL
                            ? 'هذه المعايير محددة وفقاً للوائح الهيئة السعودية لتنظيم الكهرباء. للمزيد من التفاصيل، يرجى زيارة الموقع الرسمي للهيئة أو التواصل مع خدمة العملاء.'
                            : 'These standards are set according to the Saudi Electricity Regulatory Authority regulations. For more details, please visit the official SERA website or contact customer service.'
                        }
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backButton: {
        padding: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderView: {
        width: 40,
        height: 40,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    // Quick Stats Styles
    statsContainer: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 14,
        minHeight: 28,
    },
    // Section Styles
    sectionHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    countBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 24,
        alignItems: 'center',
    },
    countText: {
        fontSize: 12,
        fontWeight: '600',
    },
    sectionContent: {
        marginBottom: 24,
    },
    // Info Section Styles
    infoSection: {
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.9,
    },
    compensationCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    compensationHeader: {
        alignItems: 'flex-start',
        marginBottom: 0,
    },
    compensationIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    compensationIconComponent: {
        width: 22,
        height: 22,
    },
    compensationHeaderText: {
        flex: 1,
        alignItems: 'flex-start',
        minWidth: 0,
    },
    compensationTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 20,
        width: '100%',
    },
    compensationAmountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        maxWidth: '100%',
    },
    compensationAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    compensationLabel: {
        fontSize: 13,
        fontWeight: '500',
        flexShrink: 1,
    },
    compensationChevron: {
        width: 18,
        height: 18,
        marginLeft: 8,
        marginRight: 8,
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    compensationDetails: {
        paddingTop: 16,
        marginTop: 12,
        borderTopWidth: 1,
    },
    compensationDetailRow: {
        flexDirection: 'column',
        marginBottom: 12,
        width: '100%',
    },
    compensationDetailLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    compensationDetailValue: {
        fontSize: 14,
        lineHeight: 20,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    downloadIcon: {
        width: 20,
        height: 20,
    },
    downloadButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CompensationStandardsScreen; 