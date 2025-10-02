import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    StyleSheet,

    TextInput,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import surveyService from '../services/surveyService';
import AppConfig from '../config/appConfig';
import ActionToast from './ActionToast';
import LoadingIndicator from './LoadingIndicator';

// FluentUI Icons with static import (comment in English)
import {
    Dismiss24Regular as FluentDismiss24Regular,
    Star24Regular as FluentStar24Regular,
    Checkmark24Regular as FluentCheckmark24Regular
} from '@fluentui/react-native-icons';

// Icon components with fallback (comment in English)
const CloseIcon = FluentDismiss24Regular || (({ style }) => <Text style={style}>✕</Text>);
const StarIcon = FluentStar24Regular || (({ style }) => <Text style={style}>⭐</Text>);
const CheckmarkIcon = FluentCheckmark24Regular || (({ style }) => <Text style={style}>✓</Text>);

/**
 * SurveyModal Component
 * Handles embedded surveys that appear as modals within the app
 * Based on the survey system architecture from documentation
 */
const SurveyModal = ({
    visible,
    onClose,
    surveyCode,
    surveyResponseId,
    onSurveyComplete,
    title = null,
    description = null,
}) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isRTL = i18n.language === 'ar';

    // Survey state (comment in English)
    const [loading, setLoading] = useState(false);
    const [surveyData, setSurveyData] = useState(null);
    const [actionTypes, setActionTypes] = useState([]);
    const [responses, setResponses] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Toast state (comment in English)
    const [actionToastVisible, setActionToastVisible] = useState(false);
    const [actionToastData, setActionToastData] = useState({});

    // Load survey data when modal opens (comment in English)
    useEffect(() => {
        if (visible && surveyCode) {
            loadSurveyData();
        }
    }, [visible, surveyCode]);

    /**
     * Load survey questions and action types
     */
    const loadSurveyData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load survey and action types in parallel (comment in English)
            const [surveyResponse, actionTypesResponse] = await Promise.all([
                surveyService.getSurvey(surveyCode),
                surveyService.getAvailableActionTypes()
            ]);

            if (surveyResponse.success) {
                if (AppConfig.development.enableDebugLogs) {
                    console.log('Survey modal received survey response:', surveyResponse);
                    console.log('Survey data:', surveyResponse.surveyData);
                    console.log('Questions:', surveyResponse.surveyData?.questions);
                }

                setSurveyData(surveyResponse.surveyData);

                if (AppConfig.development.enableDebugLogs && surveyResponse.isMockData) {
                    console.log('Survey modal using mock data:', surveyResponse.message);
                }
            } else {
                throw new Error(surveyResponse.message || t('survey.errors.loadFailed'));
            }

            if (actionTypesResponse.success) {
                setActionTypes(actionTypesResponse.actionTypes);

                if (AppConfig.development.enableDebugLogs && actionTypesResponse.isMockData) {
                    console.log('Survey modal using mock action types:', actionTypesResponse.message);
                }
            }

        } catch (error) {
            console.error('Survey load error:', error);
            setError(error.message || t('survey.errors.networkError'));
        } finally {
            setLoading(false);
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
     * Submit survey response
     */
    const handleSubmitSurvey = async () => {
        setSubmitting(true);

        try {
            // Validate required fields before submission (comment in English)
            if (!surveyResponseId) {
                throw new Error('Survey response ID is missing');
            }

            if (!surveyCode) {
                throw new Error('Survey code is missing');
            }

            // Check if required questions are answered (comment in English)
            if (!isCurrentPageValid()) {
                const currentQuestions = surveyData.questions.slice(currentPage, currentPage + 1);
                const missingQuestions = currentQuestions.filter(question => {
                    if (!question.isRequired) return false;
                    const response = responses[question.name];
                    return response === undefined || response === null || response === '';
                });

                if (missingQuestions.length > 0) {
                    const questionTitles = missingQuestions.map(q => {
                        const title = typeof q.title === 'object'
                            ? q.title[i18n.language] || q.title.en
                            : q.title;
                        return title;
                    }).join(', ');
                    throw new Error(`Please answer the following required questions: ${questionTitles}`);
                }
            }

            const actionType = actionTypes.find(type => type.key === 'confirmed')?.value || 'Confirmed';

            const surveyResponseData = {
                surveyResponseId: surveyResponseId,
                surveyData: responses,
                actionType: actionType,
                surveyCode: surveyCode,
                completedAt: new Date().toISOString()
            };

            if (AppConfig.development.enableDebugLogs) {
                console.log('=== Survey Modal Submit Debug ===');
                console.log('Survey Response ID:', surveyResponseId);
                console.log('Survey Code:', surveyCode);
                console.log('Action Type:', actionType);
                console.log('Responses:', responses);
                console.log('Survey Response Data:', surveyResponseData);
            }

            const response = await surveyService.updateSurveyResponseSafely(surveyResponseData);

            if (response.success) {
                // Show success message with appropriate text (comment in English)
                const successMessage = response.isMockData
                    ? `${t('survey.completion.message')} ${response.fallbackUsed ? '(تم الحفظ محلياً)' : '(بيانات تجريبية)'}`
                    : t('survey.completion.message');

                // Show success toast (comment in English)
                showActionToast(
                    t('survey.completion.title'),
                    successMessage,
                    () => {
                        hideActionToast();
                        onSurveyComplete?.(responses);
                        handleClose();
                    },
                    null,
                    'success'
                );
            } else {
                throw new Error(response.message || t('survey.errors.submitFailed'));
            }

        } catch (error) {
            console.error('Survey submit error:', error);
            // Show error toast (comment in English)
            showActionToast(
                t('survey.errors.title'),
                error.message || t('survey.errors.submitFailed'),
                () => {
                    hideActionToast();
                },
                null,
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Helper functions for custom toasts
     */
    const showActionToast = (title, message, onConfirm, onCancel, type = 'info') => {
        setActionToastData({
            title,
            message,
            onConfirm,
            onCancel,
            type,
        });
        setActionToastVisible(true);
    };

    const hideActionToast = () => {
        setActionToastVisible(false);
    };

    /**
     * Handle survey rejection
     */
    const handleRejectSurvey = async () => {
        try {
            const actionType = actionTypes.find(type => type.key === 'rejected')?.value || 'Rejected';

            const surveyResponseData = {
                surveyResponseId: surveyResponseId,
                surveyData: {},
                actionType: actionType,
                surveyCode: surveyCode,
                rejectedAt: new Date().toISOString()
            };

            await surveyService.updateSurveyResponseSafely(surveyResponseData);
            onSurveyComplete?.({}, 'rejected');
            handleClose();

        } catch (error) {
            console.error('Survey rejection error:', error);
            // Still close modal even if rejection fails (comment in English)
            handleClose();
        }
    };

    /**
     * Close modal and reset state
     */
    const handleClose = () => {
        setCurrentPage(0);
        setResponses({});
        setError(null);
        setSurveyData(null);
        onClose();
    };

    /**
     * Render question based on type
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
                            {question.choices && question.choices.length > 0 ? (
                                // Use specific rating values from API
                                question.choices.map((choice, index) => {
                                    const isSelected = responses[question.name] == choice.value;

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handleResponseChange(question.name, choice.value)}
                                            style={[
                                                styles.ratingButton,
                                                isSelected && styles.ratingButtonSelected
                                            ]}
                                            activeOpacity={0.7}
                                        >
                                            {question.rateType === 'smileys' ? (
                                                <Text style={[
                                                    styles.smileyIcon,
                                                    { color: isSelected ? theme.colors.primary : theme.colors.border }
                                                ]}>
                                                    {index === 0 ? '😟' : index === 1 ? '😐' : index === 2 ? '😊' : index === 3 ? '😃' : '😍'}
                                                </Text>
                                            ) : (
                                                <StarIcon
                                                    style={[
                                                        styles.starIcon,
                                                        { color: isSelected ? theme.colors.warning : theme.colors.border }
                                                    ]}
                                                />
                                            )}
                                            <Text style={[
                                                styles.ratingText,
                                                {
                                                    color: isSelected ? theme.colors.primary : theme.colors.textSecondary,
                                                    textAlign: 'center'
                                                }
                                            ]}>
                                                {choice.text}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                // Fallback to star rating
                                Array.from({ length: question.rateMax || 5 }, (_, index) => {
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
                                })
                            )}
                        </View>

                        {/* Show comment area if enabled */}
                        {question.comment && question.comment.enabled && (
                            <View style={styles.commentSection}>
                                <Text style={[
                                    styles.commentLabel,
                                    {
                                        color: theme.colors.textSecondary,
                                        textAlign: isRTL ? 'right' : 'left'
                                    }
                                ]}>
                                    {question.comment.text}
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
                                    value={responses[`${question.name}_comment`] || ''}
                                    onChangeText={(text) => handleResponseChange(`${question.name}_comment`, text)}
                                    multiline={true}
                                    numberOfLines={3}
                                    maxLength={500}
                                />
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

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[
                    styles.modalContainer,
                    { backgroundColor: theme.colors.background }
                ]}>
                    {/* Header (comment in English) */}
                    <View style={[
                        styles.header,
                        { borderBottomColor: theme.colors.border }
                    ]}>
                        <Text style={[
                            styles.headerTitle,
                            {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left'
                            }
                        ]}>
                            {title || (surveyData?.title ?
                                (typeof surveyData.title === 'object'
                                    ? surveyData.title[i18n.language] || surveyData.title.en
                                    : surveyData.title)
                                : t('survey.defaultTitle'))}
                        </Text>

                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
                            activeOpacity={0.7}
                        >
                            <CloseIcon style={[styles.closeIcon, { color: theme.colors.text }]} />
                        </TouchableOpacity>
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
                                {AppConfig.development.enableDebugLogs && console.log('RENDERING SURVEY:', {
                                    surveyData,
                                    questionsLength: surveyData.questions.length,
                                    currentPage,
                                    currentQuestion: surveyData.questions[currentPage]
                                })}

                                {description && (
                                    <Text style={[
                                        styles.description,
                                        {
                                            color: theme.colors.textSecondary,
                                            textAlign: isRTL ? 'right' : 'left'
                                        }
                                    ]}>
                                        {description}
                                    </Text>
                                )}

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
                        ) : (
                            AppConfig.development.enableDebugLogs && console.log('NO QUESTIONS FOUND:', {
                                surveyData,
                                hasQuestions: !!surveyData?.questions,
                                questionsType: typeof surveyData?.questions,
                                questionsValue: surveyData?.questions
                            }) || <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>
                                Debug: No questions found in survey data
                            </Text>
                        )}
                    </ScrollView>

                    {/* Footer buttons (comment in English) */}
                    {!loading && !error && surveyData && (
                        <View style={[styles.footer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
                            <View style={styles.footerButtons}>
                                {/* Skip/Decline button (comment in English) */}
                                <TouchableOpacity
                                    onPress={handleRejectSurvey}
                                    style={[
                                        styles.secondaryButton,
                                        {
                                            borderColor: theme.colors.border,
                                            backgroundColor: theme.colors.surface
                                        }
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.secondaryButtonText, { color: theme.colors.textSecondary }]}>
                                        {t('survey.buttons.skip')}
                                    </Text>
                                </TouchableOpacity>

                                {/* Navigation buttons (comment in English) */}
                                <View style={styles.navigationButtons}>
                                    {currentPage > 0 && (
                                        <TouchableOpacity
                                            onPress={handlePrevious}
                                            style={[
                                                styles.navigationButton,
                                                {
                                                    backgroundColor: theme.colors.surface,
                                                    borderColor: theme.colors.border
                                                }
                                            ]}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.navigationButtonText, { color: theme.colors.text }]}>
                                                {t('survey.buttons.previous')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        onPress={handleNext}
                                        disabled={!isCurrentPageValid() || submitting}
                                        style={[
                                            styles.primaryButton,
                                            {
                                                backgroundColor: (!isCurrentPageValid() || submitting)
                                                    ? theme.colors.disabled
                                                    : theme.colors.primary
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
                        </View>
                    )}
                </View>
            </View>

            {/* Custom Action Toast (comment in English) */}
            <ActionToast
                visible={actionToastVisible}
                title={actionToastData.title}
                message={actionToastData.message}
                onConfirm={actionToastData.onConfirm}
                onCancel={actionToastData.onCancel}
                confirmText={t('common.ok')}
                cancelText={t('common.cancel')}
                type={actionToastData.type}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: Dimensions.get('window').width > 768 ? '70%' : '95%',
        maxWidth: 600,
        height: Dimensions.get('window').height > 700 ? '85%' : '90%',
        maxHeight: Dimensions.get('window').height - 100,
        minHeight: 400,
        borderRadius: 12,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        minHeight: 60,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
    },
    closeButton: {
        padding: 8,
        marginLeft: 8,
        borderRadius: 20,
        minWidth: 40,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
        padding: 20,
        minHeight: 200,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressText: {
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: '500',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    questionContainer: {
        marginBottom: 32,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 26,
        marginBottom: 20,
    },
    required: {
        color: '#E53E3E',
    },
    choiceOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        minHeight: 56,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    choiceText: {
        fontSize: 16,
        flex: 1,
        lineHeight: 22,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 8,
        flexWrap: 'wrap',
    },
    ratingButton: {
        padding: 6,
        marginHorizontal: 2,
        borderRadius: 8,
        flex: 1,
        maxWidth: '18%',
        minHeight: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    ratingButtonSelected: {
        backgroundColor: 'rgba(0, 122, 255, 0.15)',
        borderColor: '#007AFF',
        borderWidth: 2,
    },
    starIcon: {
        fontSize: 32,
    },
    smileyIcon: {
        fontSize: 20,
        marginBottom: 2,
    },
    ratingText: {
        fontSize: 8,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 10,
        flexWrap: 'wrap',
    },
    ratingLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    ratingLabel: {
        fontSize: 13,
        textAlign: 'center',
        flex: 1,
    },
    commentSection: {
        marginTop: 16,
    },
    commentLabel: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
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
        padding: 20,
        minHeight: 80,
    },
    footerButtons: {
        flexDirection: 'column',
        gap: 12,
    },
    secondaryButton: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 48,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 12,
    },
    navigationButton: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 8,
        minHeight: 48,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    navigationButtonText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    primaryButton: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
        minHeight: 48,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default SurveyModal; 