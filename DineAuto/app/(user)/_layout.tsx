import React, { useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, Redirect, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { AuthContext } from '@/components/AuthProvider';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {session, isAdmin} = useContext(AuthContext)

  if (!session) {
    return <Redirect href={'/signIn'}/>
  }

  if (isAdmin) {
    return <Redirect href={'/(admin)'}/>
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="restaurant-menu" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user-o" size={22} color={color} />,
        }}
      />
      <Tabs.Screen name="index" options={{href: null}}>
      
      </Tabs.Screen>
    </Tabs>
  );
}
