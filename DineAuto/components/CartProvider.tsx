import { PropsWithChildren, createContext, useState} from "react";
import { CartItem, Item} from "@/types";

type CartType = {
    items: CartItem[],
    addItem: (item: Item, quantity: number) => void;
    updateQuantity: (id: number, amount: number) => void;
    subtotal: number;
}

export const CartContext = createContext<CartType>({ 
    items: [], 
    addItem: () => {}, 
    updateQuantity: () => {},
    subtotal: 0,
});

const CartProvider = ({ children }: PropsWithChildren) => {


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

    const subtotal = items.reduce((sum, item) => (sum += (item.item.price * item.quantity)), 0)

    return(
        <CartContext.Provider value={{ items: items, addItem, updateQuantity, subtotal}}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider