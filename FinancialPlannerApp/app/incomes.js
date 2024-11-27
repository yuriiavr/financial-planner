import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateBalance, addLog } from './helpers';

export default function IncomesScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [tax, setTax] = useState('');
  const [incomeLogs, setIncomeLogs] = useState([]);

  // Завантаження логів із AsyncStorage при завантаженні сторінки
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('incomeLogs');
        if (storedLogs) {
          setIncomeLogs(JSON.parse(storedLogs)); // Завантажуємо логи в локальний стан
        }
      } catch (error) {
        console.error('Помилка завантаження логів доходів:', error);
      }
    };

    loadLogs();
  }, []);

  const handleAddIncome = async () => {
    const parsedAmount = parseFloat(amount);
    const parsedTax = parseFloat(tax) || 0; // Якщо податок не заповнений, ставимо 0%

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Помилка', 'Введіть правильну суму доходу!');
      return;
    }

    if (!source.trim()) {
      Alert.alert('Помилка', 'Введіть джерело доходу!');
      return;
    }

    // Розрахунок чистого доходу
    const netIncome = parsedAmount - (parsedAmount * parsedTax) / 100;

    try {
      await updateBalance(netIncome, 'add'); // Додаємо чистий дохід до балансу
      const storedIncomes = await AsyncStorage.getItem('incomes');
      const currentIncomes = storedIncomes ? parseFloat(storedIncomes) : 0;
      const updatedIncomes = currentIncomes + netIncome;
  
      await AsyncStorage.setItem('incomes', updatedIncomes.toString());
      const log = {
        type: 'income',
        source,
        grossIncome: parsedAmount,
        tax: parsedTax,
        netIncome,
        date: new Date().toLocaleString(),
      };

      await addLog('incomeLogs', log); // Зберігаємо лог у AsyncStorage

      setIncomeLogs((prevLogs) => [log, ...prevLogs]); // Додаємо лог до локального стану

      Alert.alert('Успіх', `Дохід "${source}" додано!`);
      setAmount('');
      setSource('');
      setTax('');
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося додати дохід!');
      console.error(error);
    }
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logText}>
        Джерело: {item.source} | Сума: {item.grossIncome} грн
      </Text>
      <Text style={styles.logText}>
        Податок: {item.tax || 0}% | Чистий дохід: {item.netIncome ? item.netIncome.toFixed(2) : '0.00'} грн
      </Text>
      <Text style={styles.logDate}>{item.date}</Text>
    </View>
  );  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Додати дохід</Text>

      <TextInput
        style={styles.input}
        placeholder="Джерело доходу"
        value={source}
        onChangeText={setSource}
      />

      <TextInput
        style={styles.input}
        placeholder="Сума доходу"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Податок (%)"
        keyboardType="numeric"
        value={tax}
        onChangeText={setTax}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
        <Text style={styles.addButtonText}>Додати дохід</Text>
      </TouchableOpacity>

      {/* Логи доходів */}
      <FlatList
        data={incomeLogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderLogItem}
        style={styles.logList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4a00e0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logList: {
    flex: 1,
    width: '100%',
  },
  logItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e6f7ff',
  },
  logText: {
    fontSize: 16,
  },
  logDate: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#4a00e0',
  },
});
