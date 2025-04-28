import { ActivityIndicator, AppState, View} from 'react-native';
import { useContext } from 'react';
import Button from '../components/Button';
import { Link, Redirect, router } from 'expo-router';
import { AuthContext } from '@/components/AuthProvider';
import { supabase } from '@/utils/supabase';

const index = () => {
  const {session, loading, user, isAdmin} = useContext(AuthContext)

  if (loading) {
    return <ActivityIndicator/>
  }

  if (!user) {
    return <Redirect href="/signIn"/>;
  }

  if (isAdmin == true) {
    return <Redirect href="/(admin)/menu" />;
  } 
  
  if (user) {
    return <Redirect href="/(user)" />;
  }
  
};

export default index;