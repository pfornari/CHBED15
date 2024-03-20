import { Router } from "express";
import { productModel } from "../Models/product.model.js";

const router = Router();


router.get("/register", async (req, res) => {
  res.render("register", {
    fileCss: "register.css",
  });
});



export default router;