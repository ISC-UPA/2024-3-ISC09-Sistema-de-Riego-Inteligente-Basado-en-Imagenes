import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerLeft: () => (
          <Image
            source={require('@/assets/images/logo_text.png')} 
            style={{ width: 200, height: 50, marginLeft: 10 }}
          />
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => alert('Botón presionado!')}>
            <Ionicons
              name="menu" 
              size={24}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          paddingTop: 10,    
          height: 60,       
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name={focused? 'plant-wilt': 'plant-wilt'} color={color}  size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="crops"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused? 'hoop-house': 'hoop-house'} color={color} size={30} />
          ),
        }}
      />
    </Tabs>
  );
}
