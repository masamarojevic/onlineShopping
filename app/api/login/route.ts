import { NextRequest, NextResponse } from "next/server";
import { User } from "@/utils/models/types/user";
import { UserModel } from "@/utils/models/userModel";
import { dbConnect } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  //added
  // const rateLimitResponse = await rateLimitMiddleware(request);
  // if (rateLimitResponse) return rateLimitResponse;

  await dbConnect();

  try {
    const { email, password }: User = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "need to write in email and password" },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isPassValid = user.password === password;
    if (isPassValid) {
      const jwtSecret = process.env.JWT_SECRET as string;

      if (!jwtSecret) {
        throw new Error(
          "JWT_SECRET is not defined. Check your .env.local file."
        );
      }
      console.log("JWT_SECRET:", jwtSecret);
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        jwtSecret, // Secret key from my .env.local file
        { expiresIn: "1h" } // Token expiration time
      );

      return NextResponse.json(
        { message: "Login successful", token: token },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error during login", error },
      { status: 500 }
    );
  }
}
