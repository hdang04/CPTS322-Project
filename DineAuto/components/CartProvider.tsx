import { PropsWithChildren, createContext, useContext, useState} from "react";
import { CartItem, Item} from "@/types";
import { supabase } from "@/utils/supabase";
import { AuthContext } from "./AuthProvider";
import { Alert } from "react-native";
import { router } from "expo-router";

type CartType = {
    items: CartItem[],
    addItem: (item: Item, quantity: number) => void;
    updateQuantity: (id: number, amount: number) => void;
    subtotal: number;
    checkOut: () => void;
}

type Order = {
    id: number;
    customer_id: string;
    status: string;
    placed: string;
  };

export const CartContext = createContext<CartType>({ 
    items: [], 
    addItem: () => {}, 
    updateQuantity: () => {},
    subtotal: 0,
    checkOut: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {

    const {session} = useContext(AuthContext)

    const [items, setItems] = useState<CartItem[]>([]);
    
    const addItem = (item: Item, quantity: number) => {
        const existingItems = items.find(cartItem => cartItem.item == item)

        if (existingItems){
            updateQuantity(existingItems.id, quantity)
            return;
        }
        const newCartItem={
            item: item,
            id: item.id,
            quantity: quantity,    
        }
        setItems([newCartItem, ...items])
    }

    const updateQuantity = (id:number, amount: number) => {
        const updated = items.map(item => item.id != id ? item : {...item, quantity: item.quantity + amount})
        .filter((item) => item.quantity > 0)
        setItems(updated)
    }

    const clearCart = () => {
        setItems([])
    }

    const insertOrderItems = async (items: any[], orderId: any) => {
        const itemsToInsert = items.map(cartItem => ({
          id: orderId,
          item_id: cartItem.item.id,
          quantity: cartItem.quantity,
        }));
      
        const { error } = await supabase.from('order_items').insert(itemsToInsert);
      
        if (error) {
          console.error('Error with order items: ', error.message);
        } else {
          console.log('Order success');
        } 
      };


    const checkOut = async () => {
        console.log("inside checkOut");

        if (items.length === 0){
          Alert.alert('Cart is empty')
          return
        }

        const { data } = await supabase.from('order').select('*').eq('customer_id',session?.user.id)

        const activeOrder = data?.some(order => order.status !== 'Finished')
        
        if (!activeOrder){
        try {
                const { data: orderData, error } = await supabase.from('order').insert({
                customer_id: session?.user.id,
                status: 'Placed',
                placed: new Date().toISOString(), 
              }).select().single()
              
              if (error) {
                throw error; 
              }
              
              if (orderData){
                await insertOrderItems(items, orderData.id);
              }

              clearCart(); 
              router.back()
              router.replace('/(user)/profile')
              
            } catch (error) {
              console.error('Checkout failed', error);
        }
    }
        else {
            Alert.alert('Already placed an order')
        }
      };

    const subtotal = items.reduce((sum, item) => (sum += (item.item.price * item.quantity)), 0)

    return(
        <CartContext.Provider value={{ items: items, addItem, updateQuantity, subtotal, checkOut}}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider