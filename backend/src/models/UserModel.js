import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  {
    collection: "users",
    versionKey: false,
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

const User = model("User", UserSchema);

export default User;
