import { Types } from "mongoose";

export interface User {
  email: string;
  password: string;
  shoppingCart: ShoppingCartItem[];
}
export interface ShoppingCartItem {
  id: number;
  name: string;
  price: number;
  isOnSale: boolean;
  quantity: number;
  imagePath: string;
}
