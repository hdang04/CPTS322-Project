import { FlatList } from 'react-native';
import OrderListing from '@/components/OrderListing';

export const orderData = [
    {
        id: 1,
        cust_id: 1,
        items: [
          {
            id: 1,
            item: {
              id: 1,
              image: null,
              name: 'Fried Chicken',
              price: 10.99,
            },
            quantity: 1,
          },
          {
            id: 2,
            item: {
              id: 2,
              image: null,
              name: 'Banh Day',
              price: 4.99,
            },
            quantity: 3,
          },
        ],
        placed: '12/21/2004',
        status: 'Working On',
    },
    {   
        id: 2,
        cust_id: 10,
        items: [],
        placed: '12/21/2004',
        status: 'Finished',
    },
    {
        id: 3,
        cust_id: 8,
        items: [],
        placed: '12/02/2004',
        status: 'Placed',
    },
  ];

export default function OrderScreen() {
    return (
      <FlatList
        data={orderData}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        renderItem={({ item }) => <OrderListing order={item} />}
      />
    );
  }