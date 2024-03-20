import { productModel } from "../../Models/product.model.js";
import mongoose from "mongoose";

class ProductDao {
  async addProduct(nuevoProducto) {

    try {
      if (nuevoProducto) {
        return await productModel.create(nuevoProducto);
      }

      console.log("Hay campos incompletos");
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProducts() {
    try {
      return await productModel.find();
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(_id) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const productFound = await productModel.findById({ _id });

        if (productFound) {
          return await productModel.findById({ _id });
        }
        return "Product not found";
      }
      console.log("Formato de id no válido");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(_id) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const productFound = await productModel.findById({ _id });

        if (productFound) {
          return await productModel.findByIdAndDelete({ _id });
        }
        return "Product not found";
      }
      console.log("Formato de id no válido");
    } catch (error) {
      console.log(error);
    }
  }

  async modifyProduct(_id, newProduct) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const productFound = await productModel.findById({ _id });

        if (productFound) {
          return await productModel.findByIdAndUpdate({ _id }, newProduct);
        }
        return "Product not found";
      }
      console.log("Formato de id no válido");
    } catch (error) {
      console.log(error);
    }
  }

  errorMessage(error) {
    console.log(error);
    res.status(404).json({
      error,
      message: "Error",
    });
  }
}

export default new ProductDao();
