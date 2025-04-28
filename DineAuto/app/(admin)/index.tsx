import Button from "@/components/Button";
import { supabase } from "@/utils/supabase";
import { Link, Redirect, router } from "expo-router";
import { View } from "react-native";

export default function index() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
          <Button onPress={async () => {await supabase.auth.signOut(); router.replace('/(auth)/signIn');
            }} text='Sign Out' />
        </View>
      );
}