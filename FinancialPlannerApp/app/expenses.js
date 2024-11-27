import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateBalance, addLog } from "./helpers";

export default function ExpensesScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseLogs, setExpenseLogs] = useState([]);

  // Завантаження логів із AsyncStorage при завантаженні сторінки
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem("expenseLogs");
        if (storedLogs) {
          setExpenseLogs(JSON.parse(storedLogs)); // Завантажуємо логи в локальний стан
        }
      } catch (error) {
        console.error("Помилка завантаження логів витрат:", error);
      }
    };

    loadLogs();
  }, []);

  const handleAddExpense = async () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Помилка", "Введіть правильну суму витрати!");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Помилка", "Введіть опис витрати!");
      return;
    }

    try {
      const success = await updateBalance(parsedAmount, "subtract"); // Віднімаємо витрату з балансу
      if (success) {
        const storedExpenses = await AsyncStorage.getItem("expenses");
        const currentExpenses = storedExpenses ? parseFloat(storedExpenses) : 0;
        const updatedExpenses = currentExpenses + parsedAmount;

        await AsyncStorage.setItem("expenses", updatedExpenses.toString());

        const log = {
          description,
          type: "expense",
          amount: parsedAmount,
          date: new Date().toLocaleString(),
        };

        await addLog("expenseLogs", log); // Зберігаємо лог у AsyncStorage

        setExpenseLogs((prevLogs) => [log, ...prevLogs]); // Додаємо лог до локального стану

        Alert.alert("Успіх", `Витрату "${description}" додано!`);
        setAmount("");
        setDescription("");
      }
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося додати витрату!");
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
      <Text style={styles.title}>Додати витрату</Text>

      <TextInput
        style={styles.input}
        placeholder="Назва витрати"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Сума витрати"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <Text style={styles.addButtonText}>Додати витрату</Text>
      </TouchableOpacity>

      {/* Логи витрат */}
      <FlatList
        data={expenseLogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderLogItem}
        style={styles.logList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#FF416C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logList: {
    flex: 1,
    width: "100%",
  },
  logItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ffe6e6",
  },
  logText: {
    fontSize: 16,
  },
  logDate: {
    fontSize: 14,
    color: "#666",
  },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#FF416C",
  },
});
