import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SideMenu from '@/components/widgets/SideMenu'; 

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4d7c0f', 
          tabBarInactiveTintColor: '#65a30d',
          headerStyle: {
            backgroundColor: '#f0f9ff',
          },
          headerShadowVisible: true,
          headerTintColor: '#cae9ff',
          tabBarStyle: {
            backgroundColor: '#7dd3fc',
          },
          headerLeft: () => (
            <Image
              source={require('@/assets/images/logo_text.png')} 
              style={{ width: 200, height: 50, marginLeft: 10 }}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={toggleDrawer}>
              <Ionicons
                name="menu" 
                size={24}
                color={'#4d7c0f'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6 name={focused ? 'plant-wilt' : 'plant-wilt'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="organization"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? 'hoop-house' : 'hoop-house'} color={color} size={30} />
            ),
          }}
        />
      </Tabs>

      {/* Drawer personalizado */}
      <SideMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}
