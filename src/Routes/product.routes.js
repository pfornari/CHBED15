import { Router } from "express";
import ProductDao from "../daos/dbManager/product.dao.js";
import { productModel } from "../Models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit, page, category, stock } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    };
    if(stock){
      filter.stock = stock;
    }

    const products = await productModel.paginate(
      filter,

      {
        page: page || 1,
        limit: limit || 10,
        sort: { price: 1 },
      }
    );

    res.status(200).render("products", {
      user: req.session.user,
      products,
      fileCss: "index.css",
    });

  } catch (error) {
    ProductDao.errorMessage(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductDao.getProductById(id);
    if (!product) {
      console.log("id not found");
      res.json({
        message: "id not found",
      });
    } else {
      res.status(200).json({
        message: "Product found",
        product,
      });
    }

  } catch (error) {
    ProductDao.errorMessage(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const datosProducto = req.body;

    console.log(datosProducto);

    const product = await ProductDao.addProduct(datosProducto);
    if (product === false) {
      console.log("Couldn't add product to list");
      res.status(404).json({
        message: "Couldn't add product to list. Fields incomplete.",
      });
    } else {
      res.status(200).json({
        message: "New product added to commerce list",
        data: product,
      });
    }
  } catch (error) {
    ProductDao.errorMessage(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductDao.modifyProduct(id, req.body);


    if (!product) {
      console.log("id not found");
      res.json({
        message: "id not found",
      });
    } else {
      res.status(200).json({
        message: "Product updated",
        product,
      });
    }
  } catch (error) {
    console.log("hay un error de put");
    ProductDao.errorMessage(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductDao.deleteProduct(id);

    if (!product) {
      console.log("id not found");
      res.json({
        message: "id not found",
      });
    } else {
      res.status(200).json({
        message: "Product deleted",
        product,
      });
    }
  } catch (error) {
    console.log(error);
    ProductDao.errorMessage(error);
  }
});

export default router;
