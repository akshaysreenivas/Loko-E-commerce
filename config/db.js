const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

module.exports = {
  dbConnect: async () => {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lokoEcom";
    try {
      await mongoose
        .connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => console.log("MONGODB CONNECTED SUCCESSFULLY !"))
        .catch((err) => console.log("err", err))
    } catch (error) {
      console.log("error", error)
    }
  }
};
