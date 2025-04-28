import {Text, StyleSheet, TextInput, Alert, Image} from 'react-native'
import Button from '@/components/Button'
import { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '@/constants/Colors'
import { router, Stack, useLocalSearchParams, Link } from 'expo-router'
import { supabase } from '@/utils/supabase'


const signInScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    
    async function guestSignIn() {
        const { error } = await supabase.auth.signInAnonymously()
    }
    
    async function accSignIn() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({email: email, password: password})

        if (error) Alert.alert(error.message)
            setLoading(false)
    }

    return (
        <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{flex: 1, justifyContent: 'center'}}>

            <Text style={styles.text}>Email</Text>
            <TextInput value={email} onChangeText={setEmail}
            placeholder='Email' style={styles.input}
            inputMode='email'/>

            <Text style={styles.text}>Password</Text>
            <TextInput value={password} onChangeText={setPassword}
            placeholder='' style={styles.input}
            secureTextEntry={true}/>

            <Button onPress={accSignIn} disabled={loading} text='Sign In'/>

            <Text onPress={() => router.navigate('/(auth)/signUp')} 
            style={styles.selectButton}>New? Create an Account Here</Text>

            <Text onPress={guestSignIn} style={styles.selectButton}>Continue as Guest</Text>

        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
    },

    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'lightgrey',
    },

    text: {
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
    },

    image: {
        width: '40%',
        aspectRatio: 1,
        alignSelf: 'center',
    },

    selectButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginVertical: 2,
        borderRadius: 50,
        color: Colors.light.tint,
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
})

export default signInScreen