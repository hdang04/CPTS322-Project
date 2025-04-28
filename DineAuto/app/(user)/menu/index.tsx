import { View, FlatList, ActivityIndicator } from 'react-native';
import ItemListing from '@/components/ItemListing';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Item } from '@/types';

export default function Menu() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      
      // Clean up on unmount
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
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ItemListing item={item} />}
      numColumns={2}
    />
  );
}