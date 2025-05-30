import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function TransactionItem({ transaction }) {
  return (
    <View style={styles.item}>
      <Text>{transaction.description}</Text>
      <Text style={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
});
