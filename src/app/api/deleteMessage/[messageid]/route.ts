import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

type Params = Promise<{ messageid: string }>;

export async function DELETE(request: NextRequest, segmentData: { params: Params }) {
  const params = await segmentData.params; 
  const messageId = params.messageid; 
  console.log(messageId);
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updateResult.modifiedCount == 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Message deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in deleting message route", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting message",
      },
      {
        status: 401,
      }
    );
  }
}

export const dynamic = "force-dynamic";
