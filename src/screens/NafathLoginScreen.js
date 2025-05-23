import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {loginNafath} from '../services/nafathService';
import StyleManager from '../styles/StyleManager';
import {LoadingSpinner} from '../animations';

export default function NafathLoginScreen({navigation}) {
  const {t} = useTranslation();
  const styles = StyleManager.getNafathStyles();
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!nationalId) return;
    setLoading(true);
    try {
      const res = await loginNafath(nationalId);
      navigation.replace('NafathVerification', {
        transId: res.transId,
        random: res.random,
        nationalId,
      });
    } catch (e) {
      Alert.alert(t('nafathLogin.error'), t('nafathLogin.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, styles.centerContent]}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('nafathLogin.title')}</Text>
        <Text style={styles.subtitle}>{t('nafathLogin.subtitle')}</Text>

        <TextInput
          style={styles.textInput}
          placeholder={t('nafathLogin.placeholder')}
          value={nationalId}
          onChangeText={setNationalId}
          keyboardType="numeric"
        />

        {loading ? (
          <View style={{marginVertical: 20}}>
            <LoadingSpinner
              type="rotating"
              size={40}
              color="#00623B"
              duration={1000}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            disabled={loading || !nationalId}>
            <Text style={styles.buttonText}>{t('nafathLogin.continue')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
