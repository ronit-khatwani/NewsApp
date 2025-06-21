import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { View, StyleSheet, Text } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator 
    screenOptions={{ 
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        height: 90,
        paddingTop: 10,
        paddingBottom: 30,
      },
      tabBarBackground: () => (
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      ),
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
      },
      tabBarIconStyle: {
        marginTop: 4,
      },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{
      tabBarIcon: ({ color, focused }) => (
        <Text style={{ fontSize: 24, color: color, fontWeight: focused ? 'bold' : 'normal' }}>
          🏠
        </Text>
      )
    }} />
    <Tab.Screen name="Bookmarks" component={BookmarksScreen} options={{
      tabBarIcon: ({ color, focused }) => (
        <Text style={{ fontSize: 24, color: color, fontWeight: focused ? 'bold' : 'normal' }}>
          {focused ? '★' : '☆'}
        </Text>
      )
    }} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
