import dbConnect from "@/app/lib/mongodb";
import User from "@/models/users";

export async function POST(req) {
  await dbConnect();

  const { user } = await req.json();

  let existingUser = await User.findOne({ uuid: user.uuid });

  if (!existingUser) {
    existingUser = await User.create(user);
    return Response.json({ message: "User created", user: existingUser });
  }

  return Response.json({ message: "User exists", user: existingUser });
}
