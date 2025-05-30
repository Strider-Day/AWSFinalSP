// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_GATEWAY_URL = 'https://5293cv8mg4.execute-api.us-east-1.amazonaws.com/TestDeveloper/transactions';

const STORAGE_KEY = 'transactions';

export const saveTransaction = async (transaction) => {
  try {
    console.log('Saving transaction to API:', transaction);
    
    // Save to API Gateway
    const response = await fetch(API_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: transaction.amount,
        note: transaction.description, // Your form uses 'description', API expects 'note'
        type: transaction.type // Include the type (income/expense)
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Transaction saved to API successfully:', result);
    
    // Also save to local storage as backup/cache
    const current = await getTransactions();
    const transactionWithId = {
      ...transaction,
      id: result.id,
      timestamp: new Date().toISOString()
    };
    current.push(transactionWithId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    
    return {
      success: true,
      id: result.id,
      message: result.message
    };
    
  } catch (error) {
    console.error('Error saving transaction to API:', error);
    
    // Fallback: save to local storage only if API fails
    try {
      const current = await getTransactions();
      const transactionWithId = {
        ...transaction,
        id: Date.now().toString(), // Generate temporary ID
        timestamp: new Date().toISOString(),
        synced: false // Mark as not synced with API
      };
      current.push(transactionWithId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      
      throw new Error(`API unavailable, saved locally: ${error.message}`);
    } catch (localError) {
      throw new Error(`Failed to save transaction: ${error.message}`);
    }
  }
};

export const getTransactions = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
    
    
  } catch (error) {
    console.error('Error getting transactions:', error);
    
    // Fallback to local storage
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (localError) {
      console.error('Error reading local storage:', localError);
      return [];
    }
  }
};
