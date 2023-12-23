const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    birthdate: { type: Date },
    gender: { type: String },
    city: { type: String },
    address: { type: String },
    email: { type: String, required: true, trim: true, unique: true },
    role: {
      type: String,
      enum: ["Fan", "Admin", "Manager"],
      default: "Fan",
      trim: true,
    },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    approved: { type: Boolean, default: false },
    creditCardNumber: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  console.log("generateJWT");
  console.log(process.env.JWT_SECRET_KEY);
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
  return token;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
