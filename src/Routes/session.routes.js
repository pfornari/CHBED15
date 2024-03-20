import { Router } from "express";
import passport from "passport";

const router = Router();

//Register
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/session/fail-register",
  }),
  async (req, res) => {
    try {
      res.status(201).send({
        status: 201,
        message: `Usuario registrado correctamente. `,
      });

    } catch (error) {
      console.log("Error de register", error);
      return res.status(401).send("error de register");
    }
  }
);

//Login

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "api/session/fail-login",
  }),
  async (req, res) => {
    try {
      const userExists = req.user;
    
      if (userExists.email === "adminCoder@coder.com") {
        req.session.admin = true;

        req.session.user = {
          name: userExists.name,
          email: userExists.email,
          rol: "admin",
        };

        res.status(200).send({
          status: "success",
          message: `Usuario logueado correctamente`,
          payload: req.session.user,
        });
      } else {
        //info que va a aparecer en la página una vez logueado el usuario

        req.session.user = {
          name: userExists.name,
          email: userExists.email,
          rol: "user",
        };

        res.status(200).send({
          status: "success",
          message: `Usuario logueado correctamente`,
          payload: req.session.user,
        });
      }
    } catch (error) {
      console.log("Error de login", error);
      return res.status(401).send("error de login");
    }
  }
);

//Logout

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.json({ error: "Error de logout", msg: "Error al cerrar la session" });
    }
    res.status(200).send("Se ha cerrado la sesión");
  });
});



//login con github

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

//para volver desde la pagina de autorización de github a mi pagina

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "github/error",
  }),
  async (req, res) => {
    const userExists = req.user;

      if (userExists.email === "adminCoder@coder.com") {

      req.session.admin = true;

      req.session.user = {
        name: userExists.name,
        email: userExists.email,
        rol: 'admin',
      }
       return res.redirect("/api/products");
    }

    req.session.user = {
      name: userExists.name,
      email: userExists.email,
      rol: "user",
    };

    res.redirect("/api/products");
  }
);

//rutas de falla de registro o login:
router.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Falla al registrarse" });
});

router.get("/fail-login", (req, res) => {
  res.status(401).send({ error: "Falla al iniciar sesión" });
});

export default router;
