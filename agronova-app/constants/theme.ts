import { DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    disabled: '#f0f0f0',
    placeholder: '#a0a0a0',
    backdrop: '#f0f0f0',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#bb86fc',
    accent: '#03dac4',
    background: '#121212',
    surface: '#121212',
    text: '#ffffff',
    disabled: '#3a3a3a',
    placeholder: '#a0a0a0',
    backdrop: '#121212',
  },
};