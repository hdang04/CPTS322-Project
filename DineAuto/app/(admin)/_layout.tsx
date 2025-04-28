import React, { useContext, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, Tabs, useRouter } from 'expo-router';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { AuthContext } from '@/components/AuthProvider';

export default function TabLayout() {
  const { session, isAdmin} = useContext(AuthContext);

  if (!session) {
    return <Redirect href={'/signIn'}/>
  }

  if (!isAdmin) {
    return <Redirect href={'/(user)'}/>
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'hotpink',
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
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Sign Out', 
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="user-circle-o" size={22} color={color} />,
        }}>
      
      </Tabs.Screen>
    </Tabs>
  );
}
