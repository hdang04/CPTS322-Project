import React, { useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { AuthContext } from '@/components/AuthProvider';

export default function TabLayout() {
  const {isAdmin} = useContext(AuthContext)
   
  if (!isAdmin) {
    return <Redirect href={'/'}/>
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          backgroundColor: 'pink'
        }
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
        name="orders"
        options={{
          title: 'Orders',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="list-ul" size={22} color={color} />,
        }}
      />
      <Tabs.Screen name="index" options={{href: null}}>
      
      </Tabs.Screen>
    </Tabs>
  );
}
