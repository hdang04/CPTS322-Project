import { StyleSheet, Text, Pressable, Image, View } from "react-native";
import { CartItem } from "@/types"


type CartListingProps = {
    cartItem: CartItem;
};

export const CartListing = ({cartItem}: CartListingProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{cartItem.quantity} | {cartItem.item.name}</Text>
            <Text>@ {cartItem.item.price} each</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'left',
    },
  });