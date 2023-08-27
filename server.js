const app = require('./app');
const mongoose = require('mongoose');
const { MONGO_PASSWORD, MONGO_IP, MONGO_PORT, MONGO_USER } = require("./config/config");

const mongoUri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
  mongoose
  .connect(mongoUri)
  .then(() => console.log("successfully connected to DB"))
  .catch((e) => {
    console.log(e)
    setTimeout(connectWithRetry, 5000)
  })
}
connectWithRetry();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app running on port ${port}`)
});
