import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import {useContext} from 'react';
import { Order } from '../types';
import Button from './Button';
import { Link } from 'expo-router';

type OrderListingProps = {
    order: Order;
}

const OrderListing = ( { order }: OrderListingProps) => {
    return (
      <Link href={`/(admin)/orders/${order.id}`} asChild>
        <Pressable style={styles.container}>
        <View>
          <Text style={styles.title}>Order {order.id}</Text>
          <View>
            <Text style={{color: 'grey', fontWeight: 'bold'}}>Customer {order.cust_id}</Text>
          </View>
        </View>
        <View style= {{marginLeft: 'auto', paddingHorizontal: 15}}>
          <Text style={{fontWeight: '500', fontSize: 18}}>{order.status}</Text>
        </View>
      </Pressable>
    </Link>
    );
};

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'lightgrey',
      borderCurve: 'circular',
    },
    title: {
      textAlign: 'left',
      fontWeight: '500',
      fontSize: 16,
      marginBottom: 5,
    },
  });
  
  export default OrderListing;