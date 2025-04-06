import {Link, Stack, useLocalSearchParams } from 'expo-router';
import {View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Item } from '@/types';
import { supabase } from '@/utils/supabase';
import { useState, useEffect } from 'react';


const itemDetailsScreen = () => {
    const {id} = useLocalSearchParams();
    const [quantity, setQuantity] =  useState(1)
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const item = items.find((p) => p.id.toString() == id )

    useEffect(() => {

    const getMenuItems = async () => {
      const {data} = await supabase.from('menu_item').select('*')
      setItems(data || []) 
      setLoading(false)
    }
    
    getMenuItems() 

    }, [])

    if (loading) {
        return <ActivityIndicator/>
    }
    
    if (!item){
        return <Text>Item Not Found</Text>
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Menu', 
                headerRight: () => (
                    <Link href={`/(admin)/menu/addItem?id=${id}`} asChild>
                        <Pressable>
                            {({ pressed }) => (
                                <FontAwesome
                                name="pencil"
                                size={25}
                                color="black"
                                style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                                />
                            )}
                        </Pressable>
                    </Link>
                )}} />
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.price}</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    text: {
        fontSize: 20,
        color: 'black',
        marginHorizontal: 10,
        fontWeight: 'bold',
    }
})

export default itemDetailsScreen