import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionManager';
import SafeContainer from '../components/SafeContainer';
import SessionWrapper from '../components/SessionWrapper';
import surveyService from '../services/surveyService';
import { LoadingIndicator } from '../components';

// FluentUI Icons with static import (comment in English)
import {
    ArrowLeft24Regular as FluentArrowLeft24Regular,
    Star24Regular as FluentStar24Regular,
    Checkmark24Regular as FluentCheckmark24Regular
} from '@fluentui/react-native-icons';

// Icon components with fallback (comment in English)
const ArrowBackIcon = FluentArrowLeft24Regular || (({ style }) => <Text style={style}>←</Text>);
const StarIcon = FluentStar24Regular || (({ style }) => <Text style={style}>⭐</Text>);
const CheckmarkIcon = FluentCheckmark24Regular || (({ style }) => <Text style={style}>✓</Text>);

/**
 * SurveyScreen Component
 * Handles standalone surveys accessed via direct URL
 * URL Structure: /survey?SurveyCode={code}&InvitationNumber={number}
 * Based on the survey system architecture from documentation
 */
const SurveyScreen = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { updateActivity } = useSession();
    const isRTL = i18n.language === 'ar';

    // Extract parameters from route (comment in English)
    const { surveyCode, invitationNumber } = route.params || {};

    // Survey state (comment in English)
    const [loading, setLoading] = useState(true);
    const [surveyData, setSurveyData] = useState(null);
    const [actionTypes, setActionTypes] = useState([]);
    const [responses, setResponses] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [surveyStatus, setSurveyStatus] = useState(null);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    // Load survey data on mount (comment in English)
    useEffect(() => {
        if (surveyCode && invitationNumber) {
            loadSurveyData();
        } else {
            setError(t('survey.errors.missingParameters'));
            setLoading(false);
        }
    }, [surveyCode, invitationNumber]);

    // Auto-save progress on page change (comment in English)
    useEffect(() => {
        if (initialDataLoaded && surveyStatus?.isActive && Object.keys(responses).length > 0) {
            saveProgress();
        }
    }, [currentPage, responses]);

    /**
     * Load survey data and validate status
     */
    const loadSurveyData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Check survey status first (comment in English)
            const statusResponse = await surveyService.getSurveyStatus(invitationNumber);

            if (!statusResponse.success || !statusResponse.isActive) {
                throw new Error(t('survey.errors.surveyNotActive'));
            }

            setSurveyStatus(statusResponse);

            // Load survey and action types in parallel (comment in English)
            const [surveyResponse, actionTypesResponse] = await Promise.all([
                surveyService.getSurvey(surveyCode),
                surveyService.getAvailableActionTypes()
            ]);

            if (surveyResponse.success) {
                setSurveyData(surveyResponse.surveyData);
            } else {
                throw new Error(surveyResponse.message || t('survey.errors.loadFailed'));
            }

            if (actionTypesResponse.success) {
                setActionTypes(actionTypesResponse.actionTypes);
            }

            setInitialDataLoaded(true);

        } catch (error) {
            console.error('Survey load error:', error);
            setError(error.message || t('survey.errors.networkError'));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Save survey progress
     */
    const saveProgress = async () => {
        try {
            const actionType = actionTypes.find(type => type.key === 'new_confirm')?.value || 'New Confirm';

            const progressData = {
                invitationNumber: invitationNumber,
                surveyData: responses,
                actionType: actionType,
                surveyCode: surveyCode,
                progressSavedAt: new Date().toISOString(),
                currentPage: currentPage
            };

            // Use updateFullSurvey for standalone surveys (comment in English)
            await surveyService.updateFullSurvey(progressData);

        } catch (error) {
            console.error('Progress save error:', error);
            // Don't show error to user for progress saves (comment in English)
        }
    };

    /**
     * Handle response change for a question
     */
    const handleResponseChange = (questionName, value) => {
        setResponses(prev => ({
            ...prev,
            [questionName]: value
        }));

        // Update session activity (comment in English)
        updateActivity('survey_response');
    };

    /**
     * Check if current page is valid
     */
    const isCurrentPageValid = () => {
        if (!surveyData?.questions) return false;

        const currentQuestions = surveyData.questions.slice(currentPage, currentPage + 1);

        return currentQuestions.every(question => {
            if (!question.isRequired) return true;
            const response = responses[question.name];
            return response !== undefined && response !== null && response !== '';
        });
    };

    /**
     * Go to next page or submit survey
     */
    const handleNext = () => {
        if (!surveyData?.questions) return;

        if (currentPage < surveyData.questions.length - 1) {
            setCurrentPage(prev => prev + 1);
        } else {
            handleSubmitSurvey();
        }
    };

    /**
     * Go to previous page
     */
    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    /**
     * Submit final survey
     */
    const handleSubmitSurvey = async () => {
        setSubmitting(true);

        try {
            const actionType = actionTypes.find(type => type.key === 'confirmed')?.value || 'Confirmed';

            const finalSurveyData = {
                invitationNumber: invitationNumber,
                surveyData: responses,
                actionType: actionType,
                surveyCode: surveyCode,
                completedAt: new Date().toISOString()
            };

            const response = await surveyService.updateFullSurvey(finalSurveyData);

            if (response.success) {
                // Show success message and navigate back (comment in English)
                Alert.alert(
                    t('survey.completion.title'),
                    t('survey.completion.message'),
                    [
                        {
                            text: t('common.ok'),
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            } else {
                throw new Error(response.message || t('survey.errors.submitFailed'));
            }

        } catch (error) {
            console.error('Survey submit error:', error);
            Alert.alert(
                t('survey.errors.title'),
                error.message || t('survey.errors.submitFailed')
            );
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Handle survey cancellation
     */
    const handleCancelSurvey = () => {
        Alert.alert(
            t('survey.cancel.title'),
            t('survey.cancel.message'),
            [
                { text: t('common.no'), style: 'cancel' },
                {
                    text: t('common.yes'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const actionType = actionTypes.find(type => type.key === 'cancelled')?.value || 'Cancelled';

                            const cancelData = {
                                invitationNumber: invitationNumber,
                                surveyData: responses,
                                actionType: actionType,
                                surveyCode: surveyCode,
                                cancelledAt: new Date().toISOString()
                            };

                            await surveyService.updateFullSurvey(cancelData);
                        } catch (error) {
                            console.error('Survey cancellation error:', error);
                        } finally {
                            navigation.goBack();
                        }
                    }
                }
            ]
        );
    };

    /**
     * Render question based on type (same as SurveyModal)
     */
    const renderQuestion = (question) => {
        const questionTitle = typeof question.title === 'object'
            ? question.title[i18n.language] || question.title.en
            : question.title;

        switch (question.type) {
            case 'radiogroup':
                return (
                    <View style={styles.questionContainer}>
                        <Text style={[
                            styles.questionTitle,
                            {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left'
                            }
                        ]}>
                            {questionTitle}
                            {question.isRequired && <Text style={styles.required}> *</Text>}
                        </Text>

                        {question.choices?.map((choice, index) => {
                            const choiceText = typeof choice.text === 'object'
                                ? choice.text[i18n.language] || choice.text.en
                                : choice.text;

                            const isSelected = responses[question.name] === choice.value;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.choiceOption,
                                        {
                                            backgroundColor: isSelected ? theme.colors.primary + '20' : theme.colors.card,
                                            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                                        }
                                    ]}
                                    onPress={() => handleResponseChange(question.name, choice.value)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.radioButton,
                                        { borderColor: isSelected ? theme.colors.primary : theme.colors.border }
                                    ]}>
                                        {isSelected && (
                                            <View style={[
                                                styles.radioButtonSelected,
                                                { backgroundColor: theme.colors.primary }
                                            ]} />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.choiceText,
                                        {
                                            color: theme.colors.text,
                                            textAlign: isRTL ? 'right' : 'left'
                                        }
                                    ]}>
                                        {choiceText}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                );

            case 'rating':
                return (
                    <View style={styles.questionContainer}>
                        <Text style={[
                            styles.questionTitle,
                            {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left'
                            }
                        ]}>
                            {questionTitle}
                            {question.isRequired && <Text style={styles.required}> *</Text>}
                        </Text>

                        <View style={styles.ratingContainer}>
                            {Array.from({ length: question.rateMax || 5 }, (_, index) => {
                                const rating = index + 1;
                                const isSelected = responses[question.name] >= rating;

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleResponseChange(question.name, rating)}
                                        style={styles.ratingButton}
                                        activeOpacity={0.7}
                                    >
                                        <StarIcon
                                            style={[
                                                styles.starIcon,
                                                { color: isSelected ? theme.colors.warning : theme.colors.border }
                                            ]}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {question.minRateDescription && question.maxRateDescription && (
                            <View style={styles.ratingLabels}>
                                <Text style={[styles.ratingLabel, { color: theme.colors.textSecondary }]}>
                                    {typeof question.minRateDescription === 'object'
                                        ? question.minRateDescription[i18n.language] || question.minRateDescription.en
                                        : question.minRateDescription}
                                </Text>
                                <Text style={[styles.ratingLabel, { color: theme.colors.textSecondary }]}>
                                    {typeof question.maxRateDescription === 'object'
                                        ? question.maxRateDescription[i18n.language] || question.maxRateDescription.en
                                        : question.maxRateDescription}
                                </Text>
                            </View>
                        )}
                    </View>
                );

            case 'comment':
                return (
                    <View style={styles.questionContainer}>
                        <Text style={[
                            styles.questionTitle,
                            {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left'
                            }
                        ]}>
                            {questionTitle}
                            {question.isRequired && <Text style={styles.required}> *</Text>}
                        </Text>

                        <TextInput
                            style={[
                                styles.textInputContainer,
                                styles.textInput,
                                {
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left'
                                }
                            ]}
                            placeholder={t('survey.comment.placeholder')}
                            placeholderTextColor={theme.colors.textSecondary}
                            value={responses[question.name] || ''}
                            onChangeText={(text) => handleResponseChange(question.name, text)}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={500}
                        />
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <SessionWrapper>
            <SafeContainer style={{ backgroundColor: theme.colors.background }}>
                {/* Header (comment in English) */}
                <View style={[
                    styles.header,
                    { borderBottomColor: theme.colors.border }
                ]}>
                    <TouchableOpacity
                        onPress={handleCancelSurvey}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <ArrowBackIcon style={[styles.backIcon, { color: theme.colors.text }]} />
                    </TouchableOpacity>

                    <Text style={[
                        styles.headerTitle,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left'
                        }
                    ]}>
                        {surveyData?.title ?
                            (typeof surveyData.title === 'object'
                                ? surveyData.title[i18n.language] || surveyData.title.en
                                : surveyData.title)
                            : t('survey.defaultTitle')}
                    </Text>
                </View>

                {/* Content (comment in English) */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <LoadingIndicator size="large" color={theme.colors.primary} />
                            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                                {t('survey.loading')}
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={[styles.errorText, { color: theme.colors.error }]}>
                                {error}
                            </Text>
                            <TouchableOpacity
                                onPress={loadSurveyData}
                                style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.retryButtonText}>
                                    {t('common.retry')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : surveyData?.questions ? (
                        <>
                            {/* Progress indicator (comment in English) */}
                            <View style={styles.progressContainer}>
                                <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                                    {t('survey.progress', {
                                        current: currentPage + 1,
                                        total: surveyData.questions.length
                                    })}
                                </Text>
                                <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                backgroundColor: theme.colors.primary,
                                                width: `${((currentPage + 1) / surveyData.questions.length) * 100}%`
                                            }
                                        ]}
                                    />
                                </View>
                            </View>

                            {/* Current question (comment in English) */}
                            {surveyData.questions[currentPage] && renderQuestion(surveyData.questions[currentPage])}
                        </>
                    ) : null}
                </ScrollView>

                {/* Footer buttons (comment in English) */}
                {!loading && !error && surveyData && (
                    <View style={[
                        styles.footer,
                        { borderTopColor: theme.colors.border }
                    ]}>
                        <View style={styles.footerButtons}>
                            {/* Previous button (comment in English) */}
                            {currentPage > 0 && (
                                <TouchableOpacity
                                    onPress={handlePrevious}
                                    style={[
                                        styles.navigationButton,
                                        { backgroundColor: theme.colors.surface }
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.navigationButtonText, { color: theme.colors.text }]}>
                                        {t('survey.buttons.previous')}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Next/Submit button (comment in English) */}
                            <TouchableOpacity
                                onPress={handleNext}
                                disabled={!isCurrentPageValid() || submitting}
                                style={[
                                    styles.primaryButton,
                                    {
                                        backgroundColor: (!isCurrentPageValid() || submitting)
                                            ? theme.colors.disabled
                                            : theme.colors.primary,
                                        marginLeft: currentPage > 0 ? 12 : 0
                                    }
                                ]}
                                activeOpacity={0.7}
                            >
                                {submitting ? (
                                    <LoadingIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.primaryButtonText}>
                                        {currentPage < (surveyData?.questions?.length || 1) - 1
                                            ? t('survey.buttons.next')
                                            : t('survey.buttons.submit')}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </SafeContainer>
        </SessionWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    backIcon: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressText: {
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    questionContainer: {
        marginBottom: 24,
    },
    questionTitle: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        marginBottom: 16,
    },
    required: {
        color: '#E53E3E',
    },
    choiceOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    choiceText: {
        fontSize: 14,
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    ratingButton: {
        padding: 4,
        marginHorizontal: 4,
    },
    starIcon: {
        fontSize: 32,
    },
    ratingLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ratingLabel: {
        fontSize: 12,
    },
    textInputContainer: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
    },
    textInput: {
        fontSize: 14,
        textAlignVertical: 'top',
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        alignItems: 'center',
        padding: 32,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        borderTopWidth: 1,
        padding: 16,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    navigationButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    navigationButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    primaryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default SurveyScreen; 