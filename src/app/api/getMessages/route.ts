import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // console.log("Session:", session);

  if (!session || !session.user) {
    return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const userId = new mongoose.Types.ObjectId(session.user._id);
  // console.log("Userid", userId);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    // console.log("User", user);

    if (!user || user.length === 0) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, messages: user[0].messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
