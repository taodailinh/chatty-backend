import mongoose from "mongoose";

export default () => {
  const connect = () => {
    mongoose
      .connect("mongodb://localhost:27017/chatty-backend")
      .then(() => {
        console.log("Database connected");
      })
      .catch((error) => {
        console.log("Error connecting to database");
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
