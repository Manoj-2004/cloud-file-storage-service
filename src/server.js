require("dotenv").config(); //loads variables from env to process.env

const app = require("./app"); //import the express app we created in app.js

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});