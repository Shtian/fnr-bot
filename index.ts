import generator from "./src/fnr-generator";
import express from "express";

const server = express();

const PORT = process.env.PORT || 3000;

server.get("/", (req, res) => {
  const minAge = req.query.minAge || 0;
  const maxAge = req.query.maxAge || 120;
  const numberOfFnrs = req.query.count || 10;

  const fnrs = generator(Number(minAge), Number(maxAge), Number(numberOfFnrs));

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(fnrs));
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
