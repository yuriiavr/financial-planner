import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../app';
import ExpensesScreen from '../app/expenses';
import SavingsScreen from '../app/savings';
import LoansScreen from '../app/loans';
import FoodScreen from '../app/food'
import BillsScreen from '../app/bills';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Фінансовий планер' }} />
        <Stack.Screen name="Incomes" component={IncomesScreen} options={{ title: 'Доходи' }} />
        <Stack.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Витрати' }} />
        <Stack.Screen name="Savings" component={SavingsScreen} options={{ title: 'Накопичення' }} />
        <Stack.Screen name="Loans" component={LoansScreen} options={{ title: 'Кредити' }} />
        <Stack.Screen name="Food" component={FoodScreen} options={{ title: 'Їжа' }} />
        <Stack.Screen name="Bills" component={BillsScreen} options={{ title: 'Рахунки' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
