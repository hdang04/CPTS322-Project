import Button from '@/components/Button';
import {Stack, useLocalSearchParams } from 'expo-router';
import {View, Text } from 'react-native';
import { useContext } from 'react';
import { CartContext } from '@/components/CartProvider';
import { items } from '@/app/(tabs)/menu/index'


const itemDetailsScreen = () => {
    const {id} = useLocalSearchParams();
    const {addItem} = useContext(CartContext);

    const item = items.find((p) => p.id.toString() == id )

    if (!item){
        return <Text>Item Not Found</Text>
    }

    const addToCart = () => {
        if (!item)
        {
            return;
        }
        addItem(item);
    }
    return (
        <View>
            <Stack.Screen options={{ title: item.name}} />
            <Button onPress={addToCart} text="Add to Cart" />
        </View>

    )
}

export default itemDetailsScreen