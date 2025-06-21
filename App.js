import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Appearance } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/AppNavigator';
import { BookmarkProvider } from './src/contexts/BookmarkContext';
import { darkTheme, lightTheme } from './src/utils/theme';

export default function App() {
  const [scheme, setScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
        <BookmarkProvider>
          <NavigationContainer theme={scheme === 'dark' ? darkTheme : lightTheme}>
            <AppNavigator />
          </NavigationContainer>
        </BookmarkProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
