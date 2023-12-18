import mongoose from "mongoose";

const userModel = mongoose.model(`users`, new mongoose.Schema({

    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {

        type: String,
        default: "usuario"

    }

}))

export default userModel

