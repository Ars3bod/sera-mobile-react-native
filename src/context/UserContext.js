import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const USER_STORAGE_KEY = '@sera_user_data';
const TOKEN_STORAGE_KEY = '@sera_tokens';

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState({accessToken: null, wToken: null});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data and tokens from storage on app start
  useEffect(() => {
    loadUserDataFromStorage();
  }, []);

  const loadUserDataFromStorage = async () => {
    try {
      const [userData, tokenData] = await Promise.all([
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(TOKEN_STORAGE_KEY),
      ]);

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }

      if (tokenData) {
        const parsedTokens = JSON.parse(tokenData);
        setTokens(parsedTokens);
      }
    } catch (error) {
      console.log('Error loading user data from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async userData => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  const saveTokens = async tokenData => {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
      setTokens(tokenData);
    } catch (error) {
      console.log('Error saving tokens:', error);
    }
  };

  const updateUserProfile = async profileData => {
    try {
      const updatedUser = {...user, ...profileData};
      await saveUserData(updatedUser);
    } catch (error) {
      console.log('Error updating user profile:', error);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(USER_STORAGE_KEY),
        AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
      ]);
      setUser(null);
      setTokens({accessToken: null, wToken: null});
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  // Store Nafath authentication response data
  const storeNafathAuthData = async authResponse => {
    try {
      const userData = {
        id: authResponse.person.id,
        nationalId: authResponse.person.id.toString(),
        // Arabic names
        arFirst: authResponse.person.arFirst,
        arFather: authResponse.person.arFather,
        arGrand: authResponse.person.arGrand,
        arFamily: authResponse.person.arFamily,
        arFullName: authResponse.person.arFullName,
        arTwoNames: authResponse.person.arTwoNames,
        arNationality: authResponse.person.arNationality,
        // English names
        enFirst: authResponse.person.enFirst,
        enFather: authResponse.person.enFather,
        enGrand: authResponse.person.enGrand,
        enFamily: authResponse.person.enFamily,
        enFullName: authResponse.person.enFullName,
        enTwoNames: authResponse.person.enTwoNames,
        enNationality: authResponse.person.enNationality,
        // Personal info
        gender: authResponse.person.gender,
        dobG: authResponse.person.dobG,
        dobH: authResponse.person.dobH,
        nationality: authResponse.person.nationality,
        language: authResponse.person.language,
        // ID information
        idVersion: authResponse.person.idVersion,
        idIssueDateG: authResponse.person.idIssueDateG,
        idIssueDateH: authResponse.person.idIssueDateH,
        idExpiryDateG: authResponse.person.idExpiryDateG,
        idExpiryDateH: authResponse.person.idExpiryDateH,
        // Timestamps
        authenticatedAt: new Date().toISOString(),
      };

      const tokenData = {
        accessToken: authResponse.accessToken,
        wToken: authResponse.wToken,
        tokenIssuedAt: new Date().toISOString(),
      };

      await Promise.all([saveUserData(userData), saveTokens(tokenData)]);

      return {userData, tokenData};
    } catch (error) {
      console.log('Error storing Nafath auth data:', error);
      throw error;
    }
  };

  // Get formatted data for validatecontact API
  const getValidateContactData = () => {
    if (!user) return null;

    // Format dobH from "14161009" to "1416-10"
    const formatDobH = dobH => {
      if (!dobH) return '';
      const dobHStr = dobH.toString();
      if (dobHStr.length >= 6) {
        return `${dobHStr.substring(0, 4)}-${dobHStr.substring(4, 6)}`;
      }
      return dobHStr;
    };

    return {
      dob: user.dobG,
      dobh: formatDobH(user.dobH),
      fname: user.enFirst,
      lname: user.enFamily,
      mname: user.enFather,
      afname: user.arFirst,
      alname: user.arFamily,
      amname: user.arFather,
      nationality: user.arNationality,
      nin: user.nationalId,
    };
  };

  const value = {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    saveUserData,
    saveTokens,
    updateUserProfile,
    logout,
    storeNafathAuthData,
    getValidateContactData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
