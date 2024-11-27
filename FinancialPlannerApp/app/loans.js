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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoansScreen() {
  const router = useRouter();

  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState('take'); // 'take' - взяти кредит, 'repay' - погасити кредит
  const [loanLogs, setLoanLogs] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loans, setLoans] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        const storedLoans = await AsyncStorage.getItem('loans');
        const storedLogs = await AsyncStorage.getItem('loanLogs');

        setBalance(storedBalance ? parseFloat(storedBalance) : 0);
        setLoans(storedLoans ? parseFloat(storedLoans) : 0);
        setLoanLogs(storedLogs ? JSON.parse(storedLogs).reverse() : []);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    };

    loadData();
  }, []);

  const handleAddLoan = async () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Помилка', 'Введіть правильну суму!');
      return;
    }

    try {
      const logs = [...loanLogs];
      let updatedBalance = balance;
      let updatedLoans = loans;

      if (operation === 'take') {
        // Взяти кредит
        updatedBalance += parsedAmount;
        updatedLoans += parsedAmount;

        // Додаємо лог про взяття кредиту
        logs.unshift({
          amount: parsedAmount,
          type: 'take',
          date: new Date().toLocaleString(),
        });
      } else if (operation === 'repay') {
        // Перевіряємо баланс і кредити перед погашенням
        if (parsedAmount > updatedLoans) {
          Alert.alert(
            'Помилка',
            'Сума погашення більша за поточну заборгованість по кредиту!'
          );
          return;
        }

        if (parsedAmount > updatedBalance) {
          Alert.alert(
            'Помилка',
            'Недостатньо коштів на балансі для погашення кредиту!'
          );
          return;
        }

        updatedBalance -= parsedAmount;
        updatedLoans -= parsedAmount;

        // Додаємо лог про погашення кредиту
        logs.unshift({
          amount: parsedAmount,
          type: 'repay',
          date: new Date().toLocaleString(),
        });
      }

      setBalance(updatedBalance);
      setLoans(updatedLoans);
      setLoanLogs(logs);

      await AsyncStorage.setItem('balance', updatedBalance.toString());
      await AsyncStorage.setItem('loans', updatedLoans.toString());
      await AsyncStorage.setItem('loanLogs', JSON.stringify(logs.reverse()));

      Alert.alert('Успіх', 'Операція успішно виконана!');
      setAmount('');
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося виконати операцію!');
      console.error(error);
    }
  };

  const renderLogItem = ({ item }) => (
    <View
      style={[
        styles.logItem,
        item.type === 'take' ? styles.takeLog : styles.repayLog,
      ]}
    >
      <Text style={styles.logText}>
        {item.type === 'take' ? 'Взято кредит:' : 'Погашено кредит:'} {item.amount} грн
      </Text>
      <Text style={styles.logDate}>{item.date}</Text>
    </View>
  );

  return (
    <>
    <Text style={styles.title}>Кредити</Text>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        
          <TextInput
            style={styles.input}
            placeholder="Введіть суму"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.operationButton,
                operation === 'take' && styles.activeButton,
              ]}
              onPress={() => setOperation('take')}
            >
              <Text style={styles.operationText}>Взяти кредит</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.operationButton,
                operation === 'repay' && styles.activeButton,
              ]}
              onPress={() => setOperation('repay')}
            >
              <Text style={styles.operationText}>Погасити кредит</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddLoan}>
            <Text style={styles.addButtonText}>
              {operation === 'take' ? 'Взяти кредит' : 'Погасити кредит'}
            </Text>
          </TouchableOpacity>
          {/* Логи */}
          <FlatList
            data={loanLogs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLogItem}
            style={styles.logList}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingRight: 20,
    paddingLeft: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c9c9c9',
    textAlign: 'center',
    backgroundColor: '#fff',
    paddingTop: 5
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  operationButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#ccc',
  },
  activeButton: {
    backgroundColor: '#ffcc00',
  },
  operationText: {
    fontSize: 16,
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
    alignItems: 'center',
    borderColor: '#ccc',
  },
  takeLog: {
    backgroundColor: '#ffe6e6',
  },
  repayLog: {
    backgroundColor: '#e6ffe6',
  },
  logText: {
    fontSize: 16,
  },
  logDate: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    paddingTop: 20,
    paddingBottom: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#4a00e0',
  },
});
