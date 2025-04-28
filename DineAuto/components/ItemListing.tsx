import { StyleSheet, Text, Pressable, Image } from "react-native";
import { Item } from "@/types"
import { Link } from "expo-router";

type ItemListingProp = {
    item: Item;
}

const ItemListing = ({ item }: ItemListingProp) => {
    return (
      <Link href={`/menu/${item.id}`} asChild>
        <Pressable style={styles.container}>
          <Image 
          source={item.image ? {uri : item.image} : require('@/assets/images/placeholder.jpg')}
          style={styles.image}
          resizeMode="contain">
            
          </Image>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
        </Pressable>
      </Link>
    )
}

export default ItemListing;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 10,
      maxWidth: '45%',
      padding: 10,
      borderRadius: 20,
      backgroundColor: 'white',
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    price: {
      textAlign: 'center',
    },
    image: {
      flex: 1,
      width: '100%',
      height: '100%',
      aspectRatio: 1,
      padding: 10,
      borderRadius: 20,
    },
  });
  