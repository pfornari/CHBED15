import { Router } from "express";
import CartDao from "../daos/dbManager/cart.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await CartDao.findCart();
    // console.log(carts);
    res.json({
      message: "These are the carts:",
      data: carts,
    });
  } catch (error) {
    CartDao.errorMessage(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const { pid } = req.params
    const cart = await CartDao.findCartById(id);

    if (!cart) {
      console.log("cart not found");

      res.status(404).json({
        message: "Cart not found",
      });
    } else {
      res.json({
        cart,
        message: "Cart found",
      });
    }
  } catch (error) {
    CartDao.errorMessage(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = await CartDao.createCart(req.body);

    if (cart === false) {
      console.log("Couldn't add product to list");
      res.status(404).json({
        message: "Couldn't add product to list. Fields incomplete.",
      });
    } else {
      res.json({
        cart,
        message: "New cart created",
      });
    }
  } catch (error) {
    CartDao.errorMessage(error);
  }
});

router.post("/:id/product/:pid", async (req, res) => {
  try {
    const { id } = req.params;
    const { pid } = req.params;

    const cart = await CartDao.findCartById(id);

    if (!cart) {
      console.log("cart not found");
      res.status(404).json({
        message: "Cart not found",
      });
    } else {
      await CartDao.addProductToCart(id, pid);

      res.json({
        message: `Product ${pid} added to cart ${id}`,
        cart,
      });
    }
  } catch (error) {
    CartDao.errorMessage(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await CartDao.findCartById(id);

    if (!cart) {
      console.log("cart not found");
      res.status(404).json({
        message: "Cart not found",
      });
    } else {
      await CartDao.updateCart(id, req.body);

      res.json({
        message: "Cart updated",
        cart,
      });
    }
  } catch (error) {
    CartDao.errorMessage(error);
  }
});


router.put("/:cid/product/:pid", async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;
  const { quantity } = req.body

  try {

    const cart = await CartDao.updateOneProduct(cid, pid, quantity);

    if (cart === false) {
      res.status(404).json({
        message: `Cart ${cid} not found`,
      });
    } else {
      res.json({
        message: `Product ${pid} quantity updated in cart ${cid}`,
      });
    }
  } catch (e) {
    res.json({
      error: e,
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await CartDao.deleteCart(id);
    if (!cart) {
      console.log("cart not found");
      res.status(404).json({
        message: "Cart not found",
      });
    } else {
      res.json({
        message: "Cart deleted",
        cart,
      });
    }
  } catch (error) {
    CartDao.errorMessage(error);
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;

  try {
    const cart = await CartDao.deleteOneProduct(cid, pid);

    if (cart === false) {

      res.status(404).json({
        message: `Cart ${cid} not found`,
      });
    } else {
      res.json({
        message: `Product ${pid} deleted from cart ${cid}`,
      });
    }
  } catch (e) {
    res.json({
      error: e,
    });
  }
});

export default router;
