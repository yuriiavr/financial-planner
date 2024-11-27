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

export default function BillsScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [billsLogs, setBillsLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('billsLogs');
        if (storedLogs) {
          setBillsLogs(JSON.parse(storedLogs));
        }
      } catch (error) {
        console.error('Помилка завантаження логів рахунків:', error);
      }
    };

    loadLogs();
  }, []);

  const handleAddBill = async () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Помилка', 'Введіть правильну суму!');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Помилка', 'Введіть опис рахунку!');
      return;
    }

    try {
      const success = await updateBalance(parsedAmount, 'subtract');
      const storedBills = await AsyncStorage.getItem('bills');
      const currentBills = storedBills ? parseFloat(storedBills) : 0;
      const updatedBills = currentBills + parsedAmount;
  
      await AsyncStorage.setItem('bills', updatedBills.toString());
      if (success) {
        const log = {
          type: 'bill',
          description,
          amount: parsedAmount,
          date: new Date().toLocaleString(),
        };

        await addLog('billsLogs', log);

        setBillsLogs((prevLogs) => [log, ...prevLogs]);

        Alert.alert('Успіх', `Рахунок "${description}" додано!`);
        setAmount('');
        setDescription('');
      }
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося додати рахунок!');
      console.error(error);
    }
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logText}>
        Назва: {item.description} | Сума: {item.amount} грн
      </Text>
      <Text style={styles.logDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Додати рахунок</Text>

      <TextInput
        style={styles.input}
        placeholder="Назва рахунку"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Сума"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddBill}>
        <Text style={styles.addButtonText}>Додати рахунок</Text>
      </TouchableOpacity>

      {/* Логи рахунків */}
      <FlatList
        data={billsLogs}
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
    backgroundColor: '#0072ff',
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
    backgroundColor: '#e6f2ff',
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
    color: '#0072ff',
  },
});
