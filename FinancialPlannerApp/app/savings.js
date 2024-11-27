import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { updateSavings, updateBalance, getSavings, getLogs, addLog } from './helpers';

export default function SavingsScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [savingsLogs, setSavingsLogs] = useState([]);
  const [savings, setSavings] = useState(0); // Глобальне значення накопичень
  const [operation, setOperation] = useState('deposit'); // "deposit" or "withdraw"

  // Завантаження даних при старті екрану
  useEffect(() => {
    const loadSavingsData = async () => {
      try {
        const initialSavings = await getSavings();
        setSavings(initialSavings); // Ініціалізуємо накопичення

        const storedLogs = await getLogs('savingsLogs');
        setSavingsLogs(storedLogs);
      } catch (error) {
        console.error('Помилка завантаження даних накопичень:', error);
      }
    };

    loadSavingsData();
  }, []);

  const handleOperation = async () => {
    const parsedAmount = parseFloat(amount);
  
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Помилка', 'Введіть правильну суму!');
      return;
    }
  
    if (operation === 'deposit') {
      try {
        const balanceUpdated = await updateBalance(parsedAmount, 'subtract'); // Зменшуємо баланс
        if (!balanceUpdated) return; // Якщо не вистачає грошей, зупиняємо
        const updatedSavings = await updateSavings(parsedAmount, 'add'); // Збільшуємо накопичення
        setSavings(updatedSavings); // Оновлюємо локальне значення накопичень
  
        const log = {
          type: 'deposit',
          amount: parsedAmount,
          date: new Date().toLocaleString(),
        };
  
        await addLog('savingsLogs', log);
        setSavingsLogs((prevLogs) => [log, ...prevLogs]);
        setAmount('');
        Alert.alert('Успіх', `Ви додали ${parsedAmount} грн до накопичень!`);
      } catch (error) {
        Alert.alert('Помилка', error.message);
      }
    } else if (operation === 'withdraw') {
      try {
        const updatedSavings = await updateSavings(parsedAmount, 'subtract'); // Зменшуємо накопичення
        if (updatedSavings === false || updatedSavings < 0) {
          Alert.alert('Помилка', 'Недостатньо коштів у накопиченнях!');
          return;
        }
        const balanceUpdated = await updateBalance(parsedAmount, 'add'); // Збільшуємо баланс
        if (!balanceUpdated) {
          Alert.alert('Помилка', 'Помилка оновлення балансу!');
          return;
        }
        setSavings(updatedSavings); // Оновлюємо локальне значення накопичень
  
        const log = {
          type: 'withdraw',
          amount: parsedAmount,
          date: new Date().toLocaleString(),
        };
  
        await addLog('savingsLogs', log);
        setSavingsLogs((prevLogs) => [log, ...prevLogs]);
        setAmount('');
        Alert.alert('Успіх', `Ви зняли ${parsedAmount} грн із накопичень!`);
      } catch (error) {
        Alert.alert('Помилка', error.message);
      }
    }
  };  
  

  const renderLogItem = ({ item }) => (
    <View
      style={[
        styles.logItem,
        item.type === 'deposit' ? styles.depositLog : styles.withdrawLog,
      ]}
    >
      <Text style={styles.logText}>
        {item.type === 'deposit' ? 'Поповнення' : 'Зняття'}: {item.amount} грн
      </Text>
      <Text style={styles.logDate}>{item.date}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Накопичення</Text>
        <Text style={styles.currentSavings}>
          Поточне накопичення: {savings.toFixed(2)} грн
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Сума"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.operationButton,
              operation === 'deposit' && styles.activeButton,
            ]}
            onPress={() => setOperation('deposit')}
          >
            <Text
              style={[
                styles.buttonText,
                operation === 'deposit' ? styles.activeText : styles.inactiveText,
              ]}
            >
              Поповнити
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.operationButton,
              operation === 'withdraw' && styles.activeButton,
            ]}
            onPress={() => setOperation('withdraw')}
          >
            <Text
              style={[
                styles.buttonText,
                operation === 'withdraw' ? styles.activeText : styles.inactiveText,
              ]}
            >
              Зняти
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleOperation}>
          <Text style={styles.addButtonText}>
            {operation === 'deposit' ? 'Поповнити' : 'Зняти'}
          </Text>
        </TouchableOpacity>

        {/* Логи накопичень */}
        <FlatList
          data={savingsLogs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderLogItem}
          style={styles.logList}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
  currentSavings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#56ab2f',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  operationButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#56ab2f',
    borderColor: '#56ab2f',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#000',
  },
  addButton: {
    backgroundColor: '#56ab2f',
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
  },
  depositLog: {
    backgroundColor: '#e6ffe6',
  },
  withdrawLog: {
    backgroundColor: '#ffe6e6',
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
    color: '#56ab2f',
  },
});
