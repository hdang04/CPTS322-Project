import {Text, StyleSheet, TextInput, Alert, Image, ActivityIndicator} from 'react-native'
import Button from '@/components/Button'
import { useEffect, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as ImagePicker from 'expo-image-picker'
import Colors from '@/constants/Colors'
import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router'
import { supabase } from '@/utils/supabase'
import { Item } from '@/types'


const addItemScreen = () => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [desc, setDesc] = useState('')
    const [image, setImage] = useState<string | null>(null)
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    

    useEffect(() => {
        const getMenuItems = async () => {
            const {data} = await supabase.from('menu_item').select('*')
            setItems(data || []) 
            setLoading(false)
        }
        
        getMenuItems() 

    }, []) 

    const { id } = useLocalSearchParams()
    const item = items.find((p) => p.id.toString() == id )
    const existsOnMenu = !!id 

    useEffect(()=> {
        if (existsOnMenu) {
            setName(item?.name || '')
            setPrice(item?.price.toString() || '')
            setImage(item?.image || '')
        }
    }, [existsOnMenu, item])

    const validateInput = () => {
        if (!name) {
            Alert.alert('Please enter a name')
            return false
        }

        if (!price) {
            Alert.alert('Please enter a price')
            return false
        }

        if (isNaN(parseFloat(price))) {
            Alert.alert('Price must be a number')
            return false
        }

        if (parseFloat(price) <= 0){
            Alert.alert('Price must be greater than 0')
            return false
        }

        return true
    }

    const addItem = () => {
        if (!validateInput()) return

        try {
            const insertMenuItem = async () => {
                await supabase.from('menu_item').insert({
                    image: image,
                    name: name,
                    price: parseFloat(price),
                
                }).single()
            }
    
            insertMenuItem()
            setName('')
            setPrice('')
            setDesc('')
            setImage(null)

            router.replace('/(admin)')

        }
        catch (error) {

        }

       
    }

    const updateItem = () => {

        if (!validateInput()) return

        try {
            const updateMenuItem = async () => {
                await supabase.from('menu_item').update({
                    image: image,
                    name: name,
                    price: parseFloat(price),
                
                }).eq('id', item?.id).single()
            }
    
            updateMenuItem()
            setName('')
            setPrice('')
            setDesc('')
            setImage(null)

            router.replace('/(admin)')

        }
        catch (error) {

        }
    }

    const removeItem = () => {
        if (!validateInput()) return

        try {
            const deleteMenuItem = async () => {
                await supabase.from('menu_item').delete().eq('id', item?.id).single()
            }
    
            deleteMenuItem()
            
            router.replace('/(admin)')
        }
        catch (error) {

        }

    }

    const confirmRemove = () => {
        Alert.alert("Confirm", `Remove ${item?.name}?`, 
            [{text: 'Cancel'}, {text: 'Remove', style: 'destructive', onPress: removeItem}])
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

    if (loading) {
        return <ActivityIndicator/>
    }
    
    return (
        <KeyboardAwareScrollView style={styles.container}>
            <Stack.Screen options={{title: existsOnMenu ? `Remove or Update ${item?.name}` : 'Add Item to Menu'}}/>
            <Image source={image ? {uri : image} : require('@/assets/images/placeholder.jpg')} 
            style={styles.image}/>
            <Text onPress={pickImage} style={styles.selectButton}>Choose an image</Text>

            <Text style={styles.text}>Item Name</Text>
            <TextInput value={name} onChangeText={setName}
            placeholder='Name' style={styles.input}/>

            <Text style={styles.text}>Price</Text>
            <TextInput value={price} onChangeText={setPrice}
            placeholder='Price' style={styles.input}/>

            <Text style={styles.text}>Description</Text>
            <TextInput value={desc} onChangeText={setDesc}
            placeholder='Description' style={styles.input} multiline={true}/> 

            <Button onPress={existsOnMenu ? updateItem : addItem} text={existsOnMenu ? 'Update' : 'Add to menu'}/>
            {existsOnMenu && <Button onPress={confirmRemove} text='Remove'/>}
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
        marginVertical: 10,
        borderRadius: 50,
        backgroundColor: Colors.light.tint,
        color: 'white',
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
})

export default addItemScreen