import { Schema, model } from "mongoose";


const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  rol:  {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium'],
    },

  loggedBy: { type: String, required: false }
});

const userModel = model("users", userSchema);
export { userModel };

