const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    const connect = await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`Connected to MongoDB: ${connect.connection.host}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
