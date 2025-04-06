import {Text, StyleSheet, TextInput, Alert, Image} from 'react-native'
import Button from '@/components/Button'
import { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '@/constants/Colors'
import { Link, Redirect, router} from 'expo-router'
import { supabase } from '@/utils/supabase'

const signUpScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const [loading, setLoading] = useState(false)
 
    const validateInput= () => {
        if (!email){
            Alert.alert('Please enter an email')
            return false
        }

        if (!name){
            Alert.alert('Please enter a name')
            return false
        }

        if (!password){
            Alert.alert('Please enter a password')
            return false
        }
 
        return true
    }

    async function createAccount() { 
        if (!validateInput()) return

        setLoading(true)
        
        const { error } = await supabase.auth.signUp({
            email: email, 
            password: password,
            options: {
                data: {
                    name: name,
                }
            }
        })

        if (error) Alert.alert(error.message)
        else router.back()
        setLoading(false)

    } 
    
    return (
        <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{flex: 1, justifyContent: 'center'}}>

            <Text style={styles.text}>Email</Text>
            <TextInput value={email} onChangeText={setEmail}
            placeholder='Email' style={styles.input}
            inputMode='email'/>

            <Text style={styles.text}>Name</Text>
            <TextInput value={name} onChangeText={setName}
            placeholder='Name' style={styles.input}/>

            <Text style={styles.text}>Password</Text>
            <TextInput value={password} onChangeText={setPassword}
            placeholder='' style={styles.input}
            secureTextEntry={true}/>

            <Button onPress={createAccount} disabled={loading} text='Create Account'/>
            <Text onPress={() => router.back()}  
            style={styles.selectButton}>Already have an account? Sign In Here</Text>


        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        verticalAlign: 'middle',
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

    selectButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginVertical: 10,
        borderRadius: 50,
        color: Colors.light.tint,
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
})

export default signUpScreen