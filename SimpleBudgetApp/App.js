import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SimpleBudget" component={HomeScreen} />
        <Stack.Screen name="Add Transaction" component={AddTransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
