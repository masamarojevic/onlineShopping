import { User } from "./types/user";
import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
const ShoppingCartItemSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isOnSale: {
    type: Boolean,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    shoppingCart: {
      type: [ShoppingCartItemSchema], // an array that has products inside
      default: [], //by default starts with an empty array
    },
  },
  { strict: true }
);
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

export const UserModel =
  mongoose.models.UserModel ||
  mongoose.model<User>("UserModel", userSchema, "users");
