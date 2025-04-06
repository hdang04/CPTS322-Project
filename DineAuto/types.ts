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

export type Order = {
    id: number;
    cust_id: number;
    items: CartItem[];
    placed: string;
    status: string;
}

export type User = {
    id: string;
    name: string;
    role: string;
}