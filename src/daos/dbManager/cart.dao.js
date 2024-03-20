import { cartModel } from "../../Models/cart.model.js";
import mongoose from "mongoose";
import { productModel } from "../../Models/product.model.js";

class CartDao {
  async findCart() {
    return await cartModel.find();
  }

  async findCartById(_id) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });

        if (cartFound) {
          return await cartModel.findById(_id).populate("products._id")
          
        }
        return "Cart not found";
      }
      console.log("Id format not valid");
    } catch (error) {
      console.log(error);
    }
  }

  async createCart(cart) {
    try {
      return await cartModel.create(cart);
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(_id, _pid) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });
        if (cartFound) {
          const productoRepetido = cartFound.products.find(
            (producto) => producto._id == _pid
          );

          if (productoRepetido) {
            console.log("Product already exists");
            productoRepetido.quantity++;

            const result = await cartModel.findByIdAndUpdate(
              { _id: cartFound._id },
              cartFound
            );
            console.log(productoRepetido.quantity);
            return;
          }
          console.log("New product");
          const prodAgregado = cartFound.products.push(_pid);

          const result = await cartModel.findByIdAndUpdate(
            { _id: cartFound._id },
            cartFound
          );
          return;
        }
        console.log("Cart not found");
        return "Cart not found";
      }
      console.log("Id format not valid");
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCart(_id, cart) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });

        if (cartFound) {
          return await cartModel.findByIdAndUpdate({ _id }, cart);
        }
        return "Cart not found";
      }
      console.log("Id format not valid");
    } catch (error) {
      console.log(error);
    }
  }

  async updateOneProduct(_id, _pid, quantity){
     try {
       if (mongoose.Types.ObjectId.isValid(_id)) {
         const cartFound = await cartModel.findById({ _id });

         if (!cartFound) {
           console.log("Cart not found");
           return false;

         } else {
           const productoBuscado = cartFound.products.find(
             (producto) => producto._id == _pid
           );

           if (productoBuscado) {
             productoBuscado.quantity = quantity;
             const result = await cartModel.findByIdAndUpdate(
               { _id: cartFound._id },
               cartFound
             );

             return;
           }
           console.log("Product doesn't exist");
           return;
         }
       }
       console.log("Id format not valid");
     } catch (error) {
       console.log(error);
     }
  }

  async deleteCart(_id) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });

        if (cartFound) {
          cartFound.products = []
          return await cartModel.findByIdAndUpdate(
            { _id: cartFound._id },
            cartFound
          );
          
        }
        return "Cart not found";
      }
      console.log("Id format not valid");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteOneProduct(_id, _pid) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });

        if (!cartFound) {
          console.log("Cart not found");
          return false;
        } else {
          const productoBuscado = cartFound.products.find(
            (producto) => producto._id == _pid
          );

          if (productoBuscado) {
            productoBuscado.deleteOne();
            const result = await cartModel.findByIdAndUpdate(
              { _id: cartFound._id },
              cartFound
            );

            return;
          }
          console.log("Product doesn't exist");
          return;
        }
      }
      console.log("Id format not valid");
    } catch (error) {
      console.log(error);
    }
  }

  errorMessage(error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
}

export default new CartDao();
