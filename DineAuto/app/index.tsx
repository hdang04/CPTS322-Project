import { ActivityIndicator, View} from 'react-native';
import { useContext } from 'react';
import Button from '../components/Button';
import { Link, Redirect } from 'expo-router';
import { AuthContext } from '@/components/AuthProvider';
import { supabase } from '@/utils/supabase';

const index = () => {
  const {session, loading, isAdmin} = useContext(AuthContext)

  if (loading) {
    return <ActivityIndicator/>
  }

  if (!session) {
    return <Redirect href={'/signIn'}/>
  }

  if (!isAdmin) {
    return <Redirect href={'/(user)'}/>
  } 
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href={'/(user)'} asChild>
        <Button text="User" />
      </Link>
      <Link href={'/(admin)'} asChild>
        <Button text="Admin" />
      </Link>

      <Button onPress={() => supabase.auth.signOut()} text='Sign Out' />
    </View>
  );
};

export default index;