import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Оновлення балансу
export const updateBalance = async (amount, type) => {
    try {
      const storedBalance = await AsyncStorage.getItem('balance');
      let currentBalance = storedBalance ? parseFloat(storedBalance) : 0;
  
      if (type === 'add') {
        currentBalance += amount;
      } else if (type === 'subtract') {
        if (amount > currentBalance) {
          Alert.alert('Помилка', 'Недостатньо коштів на балансі!');
          return false;
        }
        currentBalance -= amount;
      }
  
      await AsyncStorage.setItem('balance', currentBalance.toString());
      return true;
    } catch (error) {
      console.error('Помилка оновлення балансу:', error);
      return false;
    }
  };
  

// Отримання балансу
export const getBalance = async () => {
  try {
    const balance = await AsyncStorage.getItem('balance');
    return balance ? parseFloat(balance) : 0;
  } catch (error) {
    console.error('Помилка отримання балансу:', error);
    return 0;
  }
};

export const getSavings = async () => {
    try {
      const storedSavings = await AsyncStorage.getItem('savings');
      return storedSavings ? parseFloat(storedSavings) : 0; // Повертаємо 0, якщо значення немає
    } catch (error) {
      console.error('Помилка отримання накопичень:', error);
      return 0;
    }
  };
  
  export const updateSavings = async (amount, type) => {
    try {
      const storedSavings = await AsyncStorage.getItem('savings');
      let currentSavings = storedSavings ? parseFloat(storedSavings) : 0;
  
      if (type === 'add') {
        currentSavings += amount;
      } else if (type === 'subtract') {
        if (amount > currentSavings) {
          Alert.alert('Помилка', 'Недостатньо коштів у накопиченнях!');
          return false; // Повертаємо помилку, якщо не вистачає коштів
        }
        currentSavings -= amount;
      }
  
      // Перевірка на негативне значення
      if (currentSavings < 0) {
        Alert.alert('Помилка', 'Значення накопичень не може бути негативним!');
        return false;
      }
  
      await AsyncStorage.setItem('savings', currentSavings.toString());
      return currentSavings; // Повертаємо оновлене значення накопичень
    } catch (error) {
      console.error('Помилка оновлення накопичень:', error);
      return false;
    }
  };
  
  

// Додавання логу
export const addLog = async (key, log) => {
  try {
    const storedLogs = await AsyncStorage.getItem(key);
    const logs = storedLogs ? JSON.parse(storedLogs) : [];
    logs.unshift(log); // Додаємо новий лог на початок
    await AsyncStorage.setItem(key, JSON.stringify(logs));
  } catch (error) {
    console.error(`Помилка додавання логу до ${key}:`, error);
  }
};

// Отримання логів
export const getLogs = async (key) => {
  try {
    const storedLogs = await AsyncStorage.getItem(key);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (error) {
    console.error(`Помилка отримання логів із ${key}:`, error);
    return [];
  }
};
