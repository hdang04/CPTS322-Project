import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { supabase } from '@/utils/supabase';
import Button from '@/components/Button';
import { router, useLocalSearchParams } from 'expo-router';
import OrderListing from '@/components/OrderListing';
import OrderItemListing from '@/components/OrderItemListing';
import { useState, useEffect } from 'react';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string | null;
};

type CartItem = {
  id: number;
  quantity: number;
  item: MenuItem;
};

type Order = {
  id: number;
  cust_id: number;
  status: string;
  placed: string;
  items: CartItem[];
};

export default function ProfileScreen() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    let channel: any;

    const fetchOrder = async () => {
      const session = (await supabase.auth.getSession()).data.session;
      const userId = session?.user.id;
    
      const { data, error } = await supabase
        .from('order')
        .select(`
          id,
          customer_id,
          status,
          placed,
          users:customer_id (
            name
          ),
          order_items (
            id,
            quantity,
            menu_items:item_id (
              id,
              name,
              price,
              image
            )
          ) 
        `)
        .eq('customer_id', userId)
        .order('placed', { ascending: false })
        .limit(1)
        .single();
    
      if (error || !data) {
        console.log('Error fetching order:', error?.message);
        return;
      }

      const formatted: Order & { customer_name?: string } = {
        id: data.id,
        cust_id: data.users.name || "Guest",
        status: data.status,
        placed: data.placed,
        items: data.order_items.map((orderItem: any) => ({
          id: orderItem.menu_items.id,
          quantity: orderItem.quantity,
          item: orderItem.menu_items,
        })),
      };

      console.log(formatted)
      
      setOrder(formatted);
    };

    const subscribeToUpdates = async () => {
      const session = (await supabase.auth.getSession()).data.session;
      const userId = session?.user.id;
      
      channel = supabase
        .channel('order-status-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'order',
            filter: `customer_id=eq.${userId}`
          },
          (payload) => {
            console.log('Order status updated:', payload.new);
            fetchOrder();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'order',
            filter: `customer_id=eq.${userId}`
          },
          (payload) => {
            console.log('New Order!:', payload.new);
            fetchOrder();
          }
        )
        .subscribe(); 

      fetchOrder();
    };

    subscribeToUpdates();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);
  
  if (!order)
  {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.title}>No Order Yet!</Text>
        </View>
    
        <View style={{ alignSelf: 'stretch', padding: 20 }}>
          <Button
            onPress={async () => {
              await supabase.auth.signOut();
              router.replace('/(auth)/signIn');
            }}
            text="Sign Out"
          />
        </View>
      </View>
    );
  }
  else{
    return (
      <View style={styles.container}>
        <FlatList contentContainerStyle={{gap: 10, padding: 10}}
              data={order.items} renderItem={({item}) => <OrderItemListing cartItem={item}/>}
              ListHeaderComponent={() => <OrderListing order={order}/>}/>
        <View style={{alignSelf: 'stretch', padding: 20}}>
          <Button onPress={async () => {await supabase.auth.signOut(); router.replace('/(auth)/signIn');
          }} text='Sign Out' />
        </View>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  title: {
    justifyContent: 'flex-end',
    fontWeight: '500',
    fontSize: 20,
  }
});

