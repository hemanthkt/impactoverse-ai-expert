import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import { Document, Mentor } from "@/app/lib/db";
import { embedAndUpsert } from "@/app/lib/vector";
import { parsePdfToChunks } from "@/app/lib/text.js";

export const config = { api: { bodyParser: false } }; // for file uploads

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const form = await req.formData(); // built-in for App Router
    const file = form.get("file");
    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { chunks, total } = await parsePdfToChunks(buffer);
    const mentor_id = await params;

    const newDoc = await Document.create({
      user_id: form.get("user_id"),
      mentor_id: mentor_id.mentorId,
      fileName: file.name,
      chunk_count: total,
    });

    const mentorUpdate = await Mentor.findByIdAndUpdate(mentor_id.mentorId, {
      $push: { document_ids: newDoc._id },
    });
    console.log("Updated mentor: ", mentorUpdate);

    if (!mentorUpdate) {
      return Response.json(
        {
          message: "Mentor Not Found",
        },
        { status: 404 }
      );
    }

    // console.log("Chunks type:", typeof chunks);
    // console.log("Chunks length:", chunks?.length);
    // console.log("First chunk sample:", chunks?.[0]?.substring(0, 100));
    // console.log("second chunk sample:", chunks?.[1]?.substring(0, 100));
    // console.log("Total:", total);

    await embedAndUpsert(chunks, {
      user_id: form.get("user_id"),
      mentor_id: mentor_id.mentorId,
      document_id: file.name,
    });

    return NextResponse.json({ ok: true, chunks: total, Document: newDoc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
