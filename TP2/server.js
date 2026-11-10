const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.disable("x-powered-by");

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/big", (req, res) => {
  const filePath = path.join(__dirname, "maybe-big-file.txt");
  const stream = fs.createReadStream(filePath, "utf8");

  stream.on("open", () => res.type("text/plain"));
  stream.on("error", () => res.status(404).send("Fichier introuvable"));
  stream.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
