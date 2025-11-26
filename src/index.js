require('dotenv').config()
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
  res.send("OK")
})

// Genre endpoints
app.get("/api/v1/genres", async (req, res) => {
  const genres = await prisma.genre.findMany();
  res.json(genres);
})

app.post("/api/v1/genres", async (req, res) => {
  const { name, url } = req.body;
  const genre = await prisma.genre.create({
    data: { name, url }
  });
  res.status(201).json(genre);
})

app.get("/api/v1/genres/:id", async (req, res) => {
  const genre = await prisma.genre.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  if (!genre) return res.status(404).json({ error: "Genre not found" });
  res.json(genre);
})

app.put("/api/v1/genres/:id", async (req, res) => {
  const { name, url } = req.body;
  const genre = await prisma.genre.update({
    where: { id: parseInt(req.params.id) },
    data: { name, url }
  });
  res.json(genre);
})

app.delete("/api/v1/genres/:id", async (req, res) => {
  await prisma.genre.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.status(204).send();
})

app.post("/api/v1/books", async (req, res) => {
  const body = req.body;
  console.log(body);
  const result = await prisma.book.create({
    data: {
      title: body.title,
      summary: body.summary,
      isbn: body.isbn,
      url: body.url,
      author: {
        connect: {
          id: body.authorId
        }
      },
      genres: {
        create: body.genres.map(genreId => ({
          genre: {
            connect: {
              id: genreId
            }
          }
        }))
      }
    }
  })
  return res.status(201).json(result);
})

app.listen(3001, () => {
  console.log("Server started on port 3001")
});