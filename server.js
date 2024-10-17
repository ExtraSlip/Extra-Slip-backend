const express = require("express");
const app = express();
const { config } = require("dotenv");
config();
const PORT = process.env.PORT;
var cors = require("cors");
const path = require("path");
const { db } = require("./utils");
const { sendEmail } = require("./utils/sendMail");

app.use(cors());
app.set("view engine", "ejs");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/", require("./routes"));

app.get("/test", function (req, res) {
  return res.send({ status: true, msg: "server working perfectly" });
});

db.sync({ sync: true }).then((req) => {
  app.listen(PORT, () =>
    console.log(`Example app is listening on port ${PORT}.`)
  );
});
