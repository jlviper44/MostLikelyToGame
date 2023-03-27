const express = require('express');
const requestIp = require("request-ip");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/getIP", (req, res) => {
  var clientIP = requestIp.getClientIp(req);
  res.send(clientIP);
});

app.listen(3000, () => console.log("Server started on port 3000"));