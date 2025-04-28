import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://zkojouyyalewawzmirvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprb2pvdXl5YWxld2F3em1pcnZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NjI2MTQsImV4cCI6MjA1OTEzODYxNH0.TZNxXV0T4ibWcmuXoqT6q6toUpTGaKGJ5xhuEloIP8Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== 'web' ? {storage: AsyncStorage} : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 