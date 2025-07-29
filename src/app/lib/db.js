import mongoose, { Schema } from "mongoose";
import crypto from "node:crypto";

const UUID = Schema.Types.UUID;

const UserSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    mentor_id: { type: String, ref: "Mentor" },
  },
  { timestamps: true }
);

const MentorSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, ref: "User", index: true },
    document_id: { type: String, ref: "Document" },
    name: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const DocumentSchema = new mongoose.Schema(
  {
    mentor_id: { type: String, ref: "Mentor" },
    user_id: { type: String, ref: "User" },
    fileName: { type: String },
    chunk_count: { type: Number },
  },
  { timestamps: true }
);

export const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
export const Mentor =
  mongoose.models.Mentor ?? mongoose.model("Mentor", MentorSchema);

export const Document =
  mongoose.models.Document ?? mongoose.model("Document", DocumentSchema);
console.log("documnets");
