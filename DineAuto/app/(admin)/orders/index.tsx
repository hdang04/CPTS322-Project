import { FlatList } from 'react-native';
import OrderListing from '@/components/OrderListing';
import { useEffect, useState } from 'react';
import { Order } from '@/types';
import { supabase } from '@/utils/supabase';

export default function OrderScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
      
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

  return (
    <FlatList
      data={orders}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => <OrderListing order={item} />}
    />
  );
}
