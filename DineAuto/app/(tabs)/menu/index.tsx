import { View, FlatList } from 'react-native';

import ItemListing from '@/components/ItemListing';

export const items = [
  {
    id: 1,
    image: null,
    name: "Fried Chicken",
    price: 10.99,
  },
  {
    id: 2,
    image: null,
    name: "Sandwich",
    price: 11.99,
  },
  {
    id: 3,
    image: null,
    name: "Noodles",
    price: 11.99,
  },
  {
    id: 4,
    image: null,
    name: "Pho",
    price: 17.99,
  },
  {
    id: 5,
    image: null,
    name: "Banh Bao",
    price: 7.99,
  },
  {
    id: 6,
    image: null,
    name: "Banh Day",
    price: 4.99,
  },
  {
    id: 7,
    image: null,
    name: "Xoi Man",
    price: 9.99,
  },
];

export default function Menu() {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ItemListing item={item} />}
      numColumns={2}
    />
  );
}
