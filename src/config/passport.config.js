import passport from "passport";
import passportLocal from "passport-local";
import { createHash, validatePass } from "../dirname.js";
import { userModel } from "../Models/user.model.js";
import GitHubStrategy from "passport-github2"



//Declaramos la estrategia (qué tipo de passport voy a usar)

const localStrategy = passportLocal.Strategy;

//inicializamos passport

const inicializePassport = () => {

    //estrategia con github:

    passport.use("github",  new GitHubStrategy(
        {
        clientID: "Iv1.7c99009db2e303e2",
        clientSecret: "188861357621fa3eeff39aa6a53929552a73179e",
        callbackUrl: "http://localhost:8080/api/sessions/githubcallback"

        }, 
        //estos parámetros son propios de passport
        async (accesstoken, refreshtoken, profile, done) => {
            console.log("perfil de usuario obtenido:");
            console.log(profile);
            try{
                const userExists = await userModel.findOne({ email: profile._json.email })
                if(!userExists){
                    console.log(
                      "este usuario no se registrado con github" + profile._json.email
                    );
                    //el usuario no existe, entonces lo registro
                    let newUser = {
                        name: profile._json.name,
                        email: profile._json.email,
                        password: "", 
                        loggedBy: "github"
                    }
                    const result = await userModel.create(newUser)
                    return done(null, result)
                } else {
                    //el usuario ya existe en la db, entonces lo logueo
                    return done(null, userExists)
                }
            } catch(error) {
                return done("Error de github strategy" + error)
            }
        }
        ))



  //para register:

  passport.use(
    "register",
    new localStrategy(
      //como es un callback, hago que cuando termine vuelva a la parte de register en la ruta de sesión.
      //Y cambio el parámetro usernameField a email.
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        //le paso lo que tenía en la ruta register
        const { name, email } = req.body;
        try {
          const userExists = await userModel.findOne({ email });
          if (userExists) {
            console.log("El usuario ya existe");
            //null es porque no hay un error, false es porque el usuario ya existe
            done(null, false);
          }

          const user = {
            name,
            email,
            //uso la función create hash para encriptar la contraseña que agarro del body
            password: createHash(password),
          };

          const result = await userModel.create(user);
          return done(null, result);
        } catch (error) {
          return done("Error de register" + error);
        }
      }
    )
  );

  //para login:

  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const userExists = await userModel.findOne({ email: username });
          console.log(userExists);
          if (!userExists) {
            console.log("el usuario no existe");
            return done(null, false);
          }
          if (!validatePass(userExists, password)) {
        
            console.log("usuario o contraseña incorrectos");
            return done(null, false);
          }
          return done(null, userExists);
        } catch (error) {
          return done("Error de login" + error);
        }
      }
    )
  )

  //funciones de serialización propias de passport:

  passport.serializeUser((userExists, done) => {
    done(null, userExists._id)
  })

    passport.deserializeUser( async (id, done) => {
        try{   
            let user = await userModel.findById(id)
            done(null, user)
        }catch(error){
            console.log("error al deserializar" + error)
        }
    });

};

export default inicializePassport;