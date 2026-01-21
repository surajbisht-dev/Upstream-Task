import mongoose from "mongoose";

export const connectDb = async (mongoUri) => {
  if (!mongoUri) throw new Error("MONGO_URI missing in .env");

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};
