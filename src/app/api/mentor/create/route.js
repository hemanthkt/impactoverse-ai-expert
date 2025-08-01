import { Mentor, User } from "@/app/lib/db";
import dbConnect from "@/app/lib/mongodb";
import { getCookie } from "@/utils/getCookies";

export async function POST(req) {
  await dbConnect();
  try {
    const { user_id, name, description, document_id } = await req.json();
    // const user_id = await getCookie("userId")
    console.log("Received user_id:", user_id, typeof user_id);

    const exisitingUser = await User.findOne({ uuid: user_id });
    console.log("Found User:", exisitingUser);

    let mentorCreation = await Mentor.create({
      user_id,
      name,
      description,
      document_id,
    });

    const updatedUser = await User.findOneAndUpdate(
      { uuid: user_id },
      { $push: { mentor_ids: mentorCreation._id.toString() } },
      { new: true }
    );
    console.log(updatedUser);

    if (!updatedUser) {
      return Response.json(
        {
          message: "User Not Found",
        },
        { status: 404 }
      );
    }

    return Response.json({ message: "Mentor Created", mentor: mentorCreation });
  } catch (error) {
    return Response.json(
      { message: "Error while creating", error },
      { status: 500 }
    );
  }
}
