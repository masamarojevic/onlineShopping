import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserModel } from "@/utils/models/userModel";
import { dbConnect } from "@/utils/db";

export async function DELETE(request: NextRequest) {
  await dbConnect();
  try {
    //get token
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
    const user = await UserModel.findByIdAndUpdate(userId, {
      shoppingCart: [],
    });
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new NextResponse(
      JSON.stringify({ shoppingCart: user.shoppingCart }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "Error retrieving shopping cart and removing items",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
