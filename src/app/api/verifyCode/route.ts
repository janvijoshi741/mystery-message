import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    console.log("Username", username, "code", code);

    // Decoding the username to handle special characters
    const decodedUsername = decodeURIComponent(username);
    // console.log("%", decodedUsername);
    const user = await UserModel.findOne({ username: decodedUsername });
    // console.log("^", user);
    if (!user) {
      console.error("User not found");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error verifying user",
        }),
        { status: 500 }
      );
    }

    // const allUsers = await UserModel.find({})
    // console.log("All Users", allUsers);

    if (!user.verifyCode || !user.verifyCodeExpiry) {
      console.error("Missing verification code or expiry");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error verifying user",
        }),
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      // console.log("Verified code successfully");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account verified successfully",
        }),
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      console.error("Verification code expired");
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Verification code has expired, please sign up again to get a new code",
        }),
        { status: 400 }
      );
    } else {
      console.error("Incorrect verification code");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Incorrect verification code",
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error verifying user",
      }),
      { status: 500 }
    );
  }
}
