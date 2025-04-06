import { View, FlatList, ActivityIndicator } from 'react-native';

import ItemListing from '@/components/ItemListing';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Item } from '@/types';

export default function Menu() {
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

  if (loading) {
    return <ActivityIndicator/>
  }

  return (
    <FlatList
      data={ items }
      renderItem={({ item }) => <ItemListing item={item} />}
      numColumns={2}
    />
  );
}
