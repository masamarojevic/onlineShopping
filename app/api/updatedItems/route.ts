import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import { UserModel } from "@/utils/models/userModel";
import jwt from "jsonwebtoken";

export async function PUT(request: NextRequest) {
  await dbConnect();
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Token is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Verify the token and get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const userId = decoded.userId;

    const { shoppingCart } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { shoppingCart },
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
