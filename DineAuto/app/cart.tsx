import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useContext } from 'react';
import { CartContext } from '@/components/CartProvider';
import { CartListing } from '@/components/CartListing';

export default function CartScreen() {
  const { items } = useContext(CartContext);
  return (
    <View style={styles.container}>
      <FlatList data={items} renderItem={({ item }) => <CartListing cartItem={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
