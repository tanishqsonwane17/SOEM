import mongoose from "mongoose";
console.log(process.env.MONGO_URI);
function dbConnection(){
    mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
}
export default dbConnection;