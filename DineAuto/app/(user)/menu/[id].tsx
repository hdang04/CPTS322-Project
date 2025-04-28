import Button from '@/components/Button';
import {router, Stack, useLocalSearchParams } from 'expo-router';
import {View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useContext, useEffect, useState} from 'react';
import { CartContext } from '@/components/CartProvider';
import { Item } from '@/types';
import { supabase } from '@/utils/supabase';

const itemDetailsScreen = () => {
    const {id} = useLocalSearchParams()
    const {addItem} = useContext(CartContext)
    const [quantity, setQuantity] =  useState(1)
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    
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

    if (loading) {
        return <ActivityIndicator/>
    }

    const item = items.find((p) => p.id.toString() == id )

    if (!item){
        return <Text>Item Not Found</Text>
    }

    const addToCart = () => {
        if (!item)
        {
            return;
        }
        addItem(item, quantity);
        router.push('/cart')
    }
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <Stack.Screen options={{ title: item.name}} />

                <View style={styles.addToCart}>
                    <Button onPress={addToCart} text="Add to Cart"/>
                </View>

                <View style={styles.quantity}>
                    <Button onPress={()=> setQuantity(Math.max(1, quantity - 1))} text="-" />
                    <Text style={styles.text}>{quantity}</Text>
                    <Button onPress={()=> setQuantity(quantity + 1)} text="+"/>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    addToCart:
    {
        width: '69%',
        padding: 10,
    },
    quantity: {
        width: '31%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        marginHorizontal: 10,
    }
})

export default itemDetailsScreen