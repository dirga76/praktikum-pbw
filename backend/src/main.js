import express from "express";
import { PrismaClient } from "@prisma/client";
const app = express();
const database = new PrismaClient();
const port = 7000;
app.use(express.json());

app.get("/product", async (req, res) => {
  try {
    const product = await database.product.findMany();
    if (!product) throw new Error("Data tidak tersedia");
    res.send(product);
  } catch (err) {
    res.send({ status: 404, message: err.message });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await database.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!product) throw new Error("Data tidak tersedia");

    res.send(product);
  } catch (err) {
    res.send({ status: 404, message: err.message });
  }
});

app.delete("/product/delete", async (req, res) => {
  try {
    const product = await database.product.delete({
      where: {
        id: req.body.id,
      },
    });
    if (!product) throw new Error("Gagal menghapus produk");
    res.send({ message: "Berhasil menghapus produk" });
  } catch (err) {
    res.send({ message: err.message });
  }
});

app.post("/product/create", async (req, res) => {
  try {
    const product = await database.product.create({
      data: {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
      },
    });
    if (!product) throw new Error("Gagal menambahkan produk");
    res.send({ message: "Produk berhasil ditambahkan", data: product });
  } catch (err) {
    res.send({ message: err.message });
  }
});

app.put("/product/update/", async (req, res) => {
  try {
    const product = await database.product.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
      },
    });
    res.send({ message: "Produk Berhasil di update", data: product });
  } catch (err) {}
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan di port  ${port}`);
});
