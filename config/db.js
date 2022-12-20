const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

module.exports = {
  dbConnect: async () => {
      const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lokoEcom";
      await mongoose
        .connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          console.log("Data base connected successfully");
        })
        .catch((err) => {
          console.log("can't connect to data base", err);
        });
    
  },
};
