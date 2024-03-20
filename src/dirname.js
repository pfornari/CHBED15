import path from "path";

import { fileURLToPath } from "url";
import bcrypt, { compare } from "bcrypt"


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//generamos la encriptación de contraseña, de manera sincrónica: 
export const createHash = (hashPass) =>
  bcrypt.hashSync(hashPass, bcrypt.genSaltSync(10));

//validamos la encriptación:

export const validatePass = (user, hashPass) => {
  console.log(
    `Datos a validar: userpassword = ${user.password} y contraseña = ${hashPass}`
  );
  return bcrypt.compareSync(hashPass, user.password);
};

//no se si es user.pass o user.password

export default __dirname;
