import { PropsWithChildren, createContext, useState} from "react";
import { CartItem, Item} from "@/types";

type CartType = {
    items: CartItem[],
    addItem: (item: Item) => void;
    updateQuantity: (id: number, amount: number) => void;
}

export const CartContext = createContext<CartType>({ 
    items: [], 
    addItem: () => {}, 
    updateQuantity: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([]);
    
    const addItem = (item: Item) => {
        const existingItems = items.find(cartItem => cartItem.item == item)

        if (existingItems){
            updateQuantity(existingItems.id, 1)
            return;
        }
        const newCartItem={
            item: item,
            id: item.id,
            quantity: 1,    
        }
        setItems([newCartItem, ...items])
        console.log(item)
    }

    const updateQuantity = (id:number, amount: number) => {
        const updated = items.map(item => item.id != id ? item : {...item, quantity: item.quantity + amount});
        setItems(updated)
        console.warn("UPDATED QUANTITY")
    }

    return(
        <CartContext.Provider value={{ items: items, addItem, updateQuantity}}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider