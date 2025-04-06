import { Stack, useLocalSearchParams } from "expo-router"
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native"
import { orderData } from '@/app/(admin)/orders/index'
import OrderItemListing from "@/components/OrderItemListing"
import OrderListing from "@/components/OrderListing"

const orderDetailsScreen = () => {
    const {id} = useLocalSearchParams()
    const order = orderData.find((p) => p.id.toString() == id)

    if (!order) {
        return <Text>Item Not Found</Text>
    }

    return (
        <View style={{flex: 1, padding: 10, gap: 10}}> 
            <Stack.Screen options={{title: 'Details'}}/>
    
            <FlatList contentContainerStyle={{gap: 10, padding: 10}}
            data={order.items} renderItem={({item}) => <OrderItemListing cartItem={item}/>}
            ListHeaderComponent={() => <OrderListing order={order}/>}/>
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