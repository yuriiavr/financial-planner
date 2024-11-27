import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StatisticsChart from '../components/StatisticsChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState({
    balance: 0,
    loans: 0,
    expenses: 0,
    incomes: 0,
    food: 0,
    bills: 0,
    savings: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const balance = await AsyncStorage.getItem('balance');
        const loans = await AsyncStorage.getItem('loans');
        const expenses = await AsyncStorage.getItem('expenses');
        const incomes = await AsyncStorage.getItem('incomes');
        const food = await AsyncStorage.getItem('food');
        const bills = await AsyncStorage.getItem('bills');
        const savings = await AsyncStorage.getItem('savings');

        setData({
          balance: balance ? parseFloat(balance) : 0,
          loans: loans ? parseFloat(loans) : 0,
          expenses: expenses ? parseFloat(expenses) : 0,
          incomes: incomes ? parseFloat(incomes) : 0,
          food: food ? parseFloat(food) : 0,
          bills: bills ? parseFloat(bills) : 0,
          savings: savings ? parseFloat(savings) : 0,
        });
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    };

    loadData();
  }, []);

  // Розрахунок часток для діаграми
  const totalSpent =
    data.expenses + data.food + data.bills + data.loans + data.savings;
  const remainingIncome = Math.max(data.incomes - totalSpent, 0);

  const chartData = [
    { value: data.expenses, color: 'red', label: 'Витрати' },
    { value: data.food, color: 'orange', label: 'Їжа' },
    { value: data.bills, color: 'blue', label: 'Рахунки' },
    { value: data.savings, color: 'green', label: 'Накопичення' },
    { value: data.loans, color: 'yellow', label: 'Кредити' },
    { value: remainingIncome, color: 'purple', label: 'Залишок доходів' },
  ];

  const buttons = [
    { label: 'Доходи', route: '/incomes', colors: ['#4a00e0', '#8e2de2'] },
    { label: 'Витрати', route: '/expenses', colors: ['#FF416C', '#FF4B2B'] },
    { label: 'Кредити', route: '/loans', colors: ['#FFCC00', '#FFD700'] },
    { label: 'Їжа', route: '/food', colors: ['#FF7E5F', '#FF9472'] },
    { label: 'Рахунки', route: '/bills', colors: ['#00c6ff', '#0072ff'] },
    { label: 'Накопичення', route: '/savings', colors: ['#56ab2f', '#a8e063'] },
  ];

  const getPercentage = (amount) =>
    data.incomes > 0 ? ((amount / data.incomes) * 100).toFixed(2) : '0.00';

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Кнопки */}
        <View style={styles.buttonsContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(button.route)}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={button.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Діаграма */}
        <StatisticsChart data={chartData} balance={data.balance} />

        {/* Статистика */}
        <View style={styles.statistics}>
        <Text style={styles.summaryText}>
            Баланс: {data.balance.toFixed(2)} грн
          </Text>
          <Text style={styles.summaryText}>
            Кредити: {data.loans.toFixed(2)} грн
          </Text>
          <Text style={styles.summaryText}>
            Накопичення: {data.savings.toFixed(2)} грн
          </Text>
          <Text style={styles.statisticsText}>
            Доходи: {data.incomes.toFixed(2)} грн
          </Text>
          <Text style={styles.statisticsText}>
            Витрати: {totalSpent.toFixed(2)} грн ({getPercentage(totalSpent)}%)
          </Text>
          <Text style={styles.subStatisticsText}>
            Їжа: {data.food.toFixed(2)} грн ({getPercentage(data.food)}%)
          </Text>
          <Text style={styles.subStatisticsText}>
            Рахунки: {data.bills.toFixed(2)} грн ({getPercentage(data.bills)}%)
          </Text>
          <Text style={styles.subStatisticsText}>
            Інші витрати: {data.expenses.toFixed(2)} грн (
            {getPercentage(data.expenses)}%)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  buttonWrapper: {
    width: '48%',
    marginVertical: 5,
  },
  button: {
    paddingVertical: 55,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summary: {
    marginTop: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  statistics: {
    marginTop: 20,
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },
  statisticsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  subStatisticsText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
    paddingLeft: 10,
  },
});
