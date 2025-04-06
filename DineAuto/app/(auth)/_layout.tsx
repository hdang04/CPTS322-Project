import { AuthContext } from '@/components/AuthProvider';
import {Redirect, Stack} from 'expo-router';
import { useContext } from 'react';

export default function AuthLayout() {
  const {session} = useContext(AuthContext)

  if (session) {
    return <Redirect href={'/'}/>
  }
  
  return <Stack>
    <Stack.Screen name="signIn" options={{ headerShown: false }} />
    <Stack.Screen name="signUp" options={{ headerShown: false }} />
  </Stack>;
};