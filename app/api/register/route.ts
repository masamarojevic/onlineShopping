import { NextRequest, NextResponse } from "next/server";
import { User } from "@/utils/models/types/user";
import { UserModel } from "@/utils/models/userModel";
import { dbConnect } from "@/utils/db";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, password, shoppingCart }: User = await request.json(); // Parse JSON from the request body

    // Validate the request body
    if (!email || !password || !shoppingCart) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with that email" },
        { status: 409 } // Conflict status code
      );
    }

    // Create a new user using the UserModel
    const newUser = await UserModel.create({
      email,
      password,
      shoppingCart,
    });
    await newUser.save();
    console.log("new user:", newUser);

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
