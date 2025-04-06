import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { supabase } from '@/utils/supabase';
import Button from '@/components/Button';
import { router } from 'expo-router';
import  AuthProvider  from '@/components/AuthProvider';


export default function TabTwoScreen() {
  async function signOut() {
    await supabase.auth.signOut()
    setSession(null) 
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button onPress={signOut} text='Sign Out' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
function setSession(arg0: null) {
  throw new Error('Function not implemented.');
}

