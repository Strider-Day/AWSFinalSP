import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveTransaction } from '../utils/storage';

export default function AddTransactionScreen({ navigation }) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    try {
      const newTransaction = { type, amount: parseFloat(amount), description };
      await saveTransaction(newTransaction);
      navigation.goBack();
    } catch (error) {
      // Add error handling here
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <Picker selectedValue={type} onValueChange={(itemValue) => setType(itemValue)}>
        <Picker.Item label="Income" value="income" />
        <Picker.Item label="Expense" value="expense" />
      </Picker>
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 10, borderBottomWidth: 1, padding: 5 },
});
