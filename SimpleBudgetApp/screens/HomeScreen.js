import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import TransactionItem from '../components/TransactionItem';
import { getTransactions } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const data = await getTransactions();
      setTransactions(data || []);
    });
    return unsubscribe;
  }, [navigation]);

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Balance: ${balance.toFixed(2)}</Text>
      <Text>Income: ${income.toFixed(2)} | Expenses: ${expense.toFixed(2)}</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
      />
      <Button title="Add Transaction" onPress={() => navigation.navigate('Add Transaction')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
