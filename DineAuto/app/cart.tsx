import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useContext } from 'react';
import { CartContext } from '@/components/CartProvider';
import CartListing from '@/components/CartListing';
import Button from '@/components/Button';

export default function CartScreen() {
  const { items, subtotal, checkOut } = useContext(CartContext);
  return (
    <View style={{padding: 10, flex: 1}}>

      <FlatList data={items} renderItem={({ item }) => <CartListing cartItem={item}/>}
      contentContainerStyle={{gap:10}}
      />

      <View style={styles.container}>
        <Text style={styles.text}>Subtotal</Text>
        <Text style={styles.text}>${subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>Tax</Text>
        <Text style={styles.text}>{(subtotal * 0.08).toFixed(2)}</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.total}>Total</Text>
        <Text style={styles.total}>${(subtotal * 1.08).toFixed(2)}</Text>
      </View>

      <Button onPress={checkOut} text="Checkout" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
  },

  text: {
    fontSize: 18,
    fontWeight: '500',
  },

  total: { 
    fontSize: 20,
    fontWeight: 'bold',
  }
});

