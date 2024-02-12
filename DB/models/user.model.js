import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: { type: Boolean, default: false },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    forgetCode: String,
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dd7nbp5ee/image/upload/v1705340000/ecommerceMondayDemo/users/defaults/profilePic/profilePic_y1oh8e.jpg",
      },
      id: {
        type: String,
        default:
          "ecommerceMondayDemo/users/defaults/profilePic/profilePic_y1oh8e",
      },
    },
    coverImages: [{ url: { type: String }, id: { type: String } }],
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  // document >>> user document >>> ahmed this.password
  // user.save()
  if (this.isModified("password")) {
    this.password = bcryptjs.hashSync(
      this.password,
      parseInt(process.env.SALT_ROUND)
    );
  }
});

export const User = model("User", userSchema);
