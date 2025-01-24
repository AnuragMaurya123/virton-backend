import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDB = async (): Promise<void> => {
  try {
    // Get the MongoDB URL from environment variables
    const mongoUrl = process.env.MONGO_URL;

    // If the MongoDB URL is not defined, throw an error
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    // Attempt to connect to the MongoDB database
    const connectDB = await mongoose.connect(mongoUrl);

    // Log successful connection with the host information
    console.log("MONGODB CONNECT: " + connectDB.connection.host);
  } catch (error) {
    // Log error and exit the process if connection fails
    console.error("Internal error", error);
    process.exit(1); // Exit with failure status
  }
};

export default connectDB;
