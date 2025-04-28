import {Link, Stack, useLocalSearchParams } from 'expo-router';
import {View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Item } from '@/types';
import { supabase } from '@/utils/supabase';
import { useState, useEffect } from 'react';


const itemDetailsScreen = () => {
    const {id} = useLocalSearchParams();
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const item = items.find((p) => p.id.toString() == id )

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
    
    if (!item){
        return <Text>Item Not Found</Text>
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Menu', 
                headerRight: () => (
                    <Link href={`/(admin)/menu/addItem?id=${id}`} replace asChild>
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