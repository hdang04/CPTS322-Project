export type Item = {
    id: number;
    image: string | null;
    name: string;
    price: number;
}

export type CartItem = {
    item: Item;
    id: number;
    quantity: number;
}