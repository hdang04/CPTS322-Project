import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = ;
const supabaseAnonKey = ;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== 'web' ? {storage: AsyncStorage} : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 
