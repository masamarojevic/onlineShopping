import { dbConnect } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/utils/models/userModel";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { token, shoppingCart } = await request.json();

    if (!token || !shoppingCart) {
      return new NextResponse(
        JSON.stringify({ message: "Token and shopping cart are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Verify the token and get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const userId = decoded.userId;

    // Update the shopping cart for the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { shoppingCart: shoppingCart } },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Shopping cart updated successfully",
        user: updatedUser,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "Error updating shopping cart",
        error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
