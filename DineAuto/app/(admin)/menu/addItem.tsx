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
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState< ImagePicker.ImagePickerAsset| null>(null);  
  
    useEffect(() => {
        const getMenuItems = async () => {
          const { data, error } = await supabase.from('menu_item').select('*');
          if (error) {
            console.error('Error fetching menu items:', error.message);
            setLoading(false);
            return;
          }
          setItems(data as Item[]);
          setLoading(false);
        };
      
        getMenuItems();
      
        const setupRealtime = async () => {
          const channel = supabase
            .channel('menu-item-changes')
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'menu_item',
              },
              (payload) => {
                console.log('New menu item added:', payload.new);
                setItems((prev) => [...prev, payload.new as Item]);
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'menu_item',
              },
              (payload) => {
                console.log('Menu item updated:', payload.new);
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === (payload.new as Item).id ? { ...item, ...(payload.new as Item) } : item
                  )
                );
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'DELETE',
                schema: 'public',
                table: 'menu_item',
              },
              (payload) => {
                console.log('Menu item deleted:', payload.old);
                setItems((prev) => prev.filter((item) => item.id !== (payload.old as Item).id));
              }
            );
      
          await channel.subscribe();
          
          return () => {
            supabase.removeChannel(channel);
          };
        };
      
        const cleanupPromise = setupRealtime();
      
        return () => {
          cleanupPromise.then((cleanup) => cleanup?.());
        };
      }, []);

    const { id } = useLocalSearchParams()
    const item = items.find((p) => p.id.toString() == id )
    const existsOnMenu = !!id 

    useEffect(()=> {
        if (existsOnMenu) {
            setName(item?.name || '')
            setPrice(item?.price.toString() || '')
            //setImage(item?.image || null)
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

              if (image){
                const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())
                const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
                const path = `${Date.now()}.${fileExt}`
                const { data, error } = await supabase.storage.from('menu-images').upload(path, arraybuffer, {
                  contentType: image.mimeType ?? 'image/jpeg',
                });
                if (error){
                  console.log(error)
                  throw error
                }
                const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(data.path)
                console.log(urlData.publicUrl)
                await supabase.from('menu_item').insert({
                  image: urlData.publicUrl,
                  name: name,
                  price: parseFloat(price),
              
              }).single()
              }
              
              else {
                await supabase.from('menu_item').insert({
                  image: null,
                  name: name,
                  price: parseFloat(price),
              
              }).single()
              }
          }
  
          insertMenuItem()
          setName('')
          setPrice('')
          setDesc('')
          setImage(null)

          router.back()
          router.replace('/(admin)/menu')

      }
      catch (error) {

      }

    }

    const updateItem = () => {

        if (!validateInput()) return

        try {
            const updateMenuItem = async () => {

                if (image){
                  const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())
                  const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
                  const path = `${Date.now()}.${fileExt}`
                  const { data, error } = await supabase.storage.from('menu-images').upload(path, arraybuffer, {
                    contentType: image.mimeType ?? 'image/jpeg',
                  });
                  if (error){
                    console.log(error)
                    throw error
                  }
                  const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(data.path)
                  console.log(urlData.publicUrl)
                  await supabase.from('menu_item').update({
                    image: urlData.publicUrl,
                    name: name,
                    price: parseFloat(price),
                
                }).eq('id', item?.id).single()
                }
                
                else {
                  await supabase.from('menu_item').update({
                    image: null,
                    name: name,
                    price: parseFloat(price),
                
                }).eq('id', item?.id).single()
                }
            }
    
            updateMenuItem()
            setName('')
            setPrice('')
            setDesc('')
            setImage(null)

            router.back()
            router.replace('/(admin)/menu')

        }
        catch (error) {

        }
    }

    const removeItem = () => {
        if (!validateInput()) return

        try {
            const deleteMenuItem = async () => {
                await supabase.from('menu_item').delete().eq('id', item?.id)
            }
    
            deleteMenuItem()

            router.back()
            router.replace('/(admin)/menu')
            
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
          setImage(result.assets[0]);
        }
      };

    if (loading) {
        return <ActivityIndicator/>
    }
    
    return (
        <KeyboardAwareScrollView style={styles.container}>
            <Stack.Screen options={{title: existsOnMenu ? `Remove or Update ${item?.name}` : 'Add Item to Menu'}}/>
            <Image source={image?.uri ? {uri : image.uri} : require('@/assets/images/placeholder.jpg')} 
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
            {/* on press should be confirm remove; changing for demo */}
            {existsOnMenu && <Button onPress={removeItem} text='Remove'/>}
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