import { router, Stack, useLocalSearchParams } from "expo-router"
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native"
import OrderItemListing from "@/components/OrderItemListing"
import OrderListing from "@/components/OrderListing"
import { supabase } from "@/utils/supabase"
import { useEffect, useState } from "react"
import { Order } from "@/types"
import Button from "@/components/Button"

const orderDetailsScreen = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const {id} = useLocalSearchParams()

      useEffect(() => {
        let channel: any;
    
        const fetchOrders = async () => {
    
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
            `);
    
          if (error || !data) {
            console.log('Error fetching orders:', error?.message);
            return;
          }
    
          const formatted = data.map((order: any) => ({
            id: order.id,
            cust_id: order.users?.name || 'Guest',
            status: order.status,
            placed: order.placed,
            items: order.order_items.map((orderItem: any) => ({
              id: orderItem.menu_items.id,
              quantity: orderItem.quantity,
              item: orderItem.menu_items,
            })),
          }));
    
          setOrders(formatted);
        };
    
        const subscribeToUpdates = async () => {
          channel = supabase
            .channel('order-updates')
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'order',
              },
              (payload) => {
                console.log('Order status updated:', payload.new);
                fetchOrders();
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'order',
              },
              (payload) => {
                console.log('New Order!', payload.new);
                fetchOrders();
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'DELETE',
                schema: 'public',
                table: 'order',
              },
              (payload) => {
                console.log('Order Gone!', payload.old);
                fetchOrders();
              }
            )
            .subscribe();
    
          fetchOrders();
        };
    
        subscribeToUpdates();
    
        return () => {
          if (channel) supabase.removeChannel(channel);
        };
      }, []);
      
    const order = orders.find((p) => p.id.toString() == id)

    if (!order) {
        return <Text>Item Not Found</Text>
    }

    const updateInProgress = () => {
        try {
          const updateStatus = async () => {
            await supabase.from('order').update({
              status: 'In Progress',
            })
            .eq('id', order?.id).single()
          }
      
          updateStatus()
        }
        catch (error) {
            console.log(error)
        }

        router.back()
        router.replace('/(admin)/orders')

    }
    const updateFinished = () => {
        try {
          const updateStatus = async () => {
            await supabase.from('order').update({
              status: 'Finished',
            })
            .eq('id', order?.id).single()
          }
      
          updateStatus()
        }
        catch (error) {
            console.log(error)
        }

        router.back()
        router.replace('/(admin)/orders')
    }

    return (
        <View style={{flex: 1, padding: 10, gap: 10}}> 
            <Stack.Screen options={{title: 'Details'}}/>
    
            <FlatList contentContainerStyle={{gap: 10, padding: 10}}
            data={order.items} renderItem={({item}) => <OrderItemListing cartItem={item}/>}
            ListHeaderComponent={() => <OrderListing order={order}/>}/>

            <View>
                <Button onPress={updateInProgress} text='In Progress'/>
                <Button onPress={updateFinished} text='Finished'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    }
})

export default orderDetailsScreen