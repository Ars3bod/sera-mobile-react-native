import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {pollNafathStatus, loginNafath} from '../services/nafathService';
import StyleManager from '../styles/StyleManager';
import {LoadingSpinner} from '../animations';

export default function NafathVerificationScreen({route, navigation}) {
  const {t} = useTranslation();
  const styles = StyleManager.getNafathStyles();
  const {
    transId: initialTransId,
    random: initialRandom,
    nationalId,
  } = route.params;
  const [transId, setTransId] = useState(initialTransId);
  const [random, setRandom] = useState(initialRandom);
  const [remaining, setRemaining] = useState(60); // 1 minute
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef();
  const pollingRef = useRef(true);

  // Timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Polling logic
  const startPolling = useCallback(() => {
    pollingRef.current = true;
    setLoading(true);
    setError(null);
    async function poll() {
      try {
        await pollNafathStatus(
          transId,
          random,
          nationalId,
          () => pollingRef.current,
          () => {
            setLoading(false);
            navigation.replace('Home');
          },
        );
      } catch (e) {
        setError(t('nafathVerification.verificationFailed'));
        setLoading(false);
        setCanResend(true);
      }
    }
    poll();
  }, [transId, random, nationalId, navigation]);

  useEffect(() => {
    startPolling();
    return () => {
      pollingRef.current = false;
    };
  }, [startPolling]);

  // Timer expiration
  useEffect(() => {
    if (remaining <= 0) {
      setError(t('nafathVerification.timeoutError'));
      setLoading(false);
      setCanResend(true);
      clearInterval(timerRef.current);
    }
  }, [remaining]);

  // Resend Request logic
  const handleResend = async () => {
    if (!canResend || !nationalId) return;
    setLoading(true);
    setError(null);
    setCanResend(false);
    setRemaining(60);
    pollingRef.current = false;
    try {
      const res = await loginNafath(nationalId);
      setTransId(res.transId);
      setRandom(res.random);
      pollingRef.current = true;
      startPolling();
      // Restart timer
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRemaining(prev => prev - 1);
      }, 1000);
    } catch (e) {
      setError(t('nafathVerification.resendFailed'));
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const openNafathApp = () => {
    // TODO: Implement deep link to Nafath app if available
    Alert.alert(
      t('nafathVerification.openAppTitle'),
      t('nafathVerification.openAppMessage'),
    );
  };

  return (
    <View style={[styles.container, styles.centerContent]}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('nafathVerification.title')}</Text>
        <Text style={styles.subtitle}>{t('nafathVerification.subtitle')}</Text>
        <View style={styles.randomBox}>
          <Text style={styles.randomText}>{random}</Text>
        </View>
        <Text style={styles.timer}>
          {t('nafathVerification.remainingTime')}:{' '}
          {`00:${remaining.toString().padStart(2, '0')}`}
        </Text>

        <TouchableOpacity
          onPress={handleResend}
          disabled={!canResend}
          style={[
            styles.resendBtn,
            canResend ? styles.resendActive : styles.resendDisabled,
          ]}>
          <Text
            style={
              canResend ? styles.resendActiveText : styles.resendDisabledText
            }>
            {t('nafathVerification.resendRequest')}
          </Text>
        </TouchableOpacity>

        {loading && (
          <View style={{marginTop: 16}}>
            <LoadingSpinner
              type="rotating"
              size={40}
              color="#00623B"
              duration={1000}
            />
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <TouchableOpacity onPress={openNafathApp} style={styles.openBtn}>
        <Text style={styles.buttonText}>{t('nafathVerification.openApp')}</Text>
      </TouchableOpacity>
    </View>
  );
}
