import { View, Text, StyleSheet, Image } from 'react-native';
import {useContext} from 'react';
import { CartItem } from '@/types';
import { CartContext } from '../components/CartProvider'
import Button from './Button';

type CartListingProps = {
  cartItem: CartItem;  
};

const CartListing = ({ cartItem }: CartListingProps) => {
    const {updateQuantity} = useContext(CartContext);
  return (
    <View style={styles.container}>
      <Image
        source={cartItem.item.image ? {uri : cartItem.item.image} : require('@/assets/images/placeholder.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
      <View>
        <Text style={styles.title}>{cartItem.item.name}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.price}>${(cartItem.item.price * cartItem.quantity).toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.quantitySelector}>
        <Button onPress={()=> updateQuantity(cartItem.item.id, -1)} text="-" />
        <Text style={styles.quantity}>{cartItem.quantity}</Text>
        <Button onPress={()=> updateQuantity(cartItem.item.id, 1)} text="+" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderCurve: 'circular',
    borderColor: 'grey',
  },
  image: {
    width: '25%',
    aspectRatio: 1,
    alignSelf: 'center',
    marginRight: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  quantitySelector: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginLeft: 'auto',
  },
  quantity: {
    fontWeight: '500',
    fontSize: 18,
  },
  price: {
    color: 'grey',
    fontWeight: 'bold',
  },
});

export default CartListing;