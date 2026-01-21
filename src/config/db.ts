import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.NODE_ENV === "production" ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ DB error:", error.message);
    } else {
      console.error("❌ DB error:", error);
    }
    process.exit(1);
  }
};

export default connectDB;