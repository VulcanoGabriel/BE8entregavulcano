//importamos mongoose para armar el modelo

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"


//creamos un esquema , el cual le damos forma de acuerdo al proyecto 

const productsSchema = new mongoose.Schema({

    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: Number,
    stock: Number,
    category: Number,
    status: Boolean,
    id: Number

})

//aplicamos esta linea para que use paginate sobre nuestro schema creado

productsSchema.plugin(mongoosePaginate)

//por ultimo exportamos el modelo que es primer dato la coleccion en la que trabajamos y segundo el esquema que trabajamos

const productsModel = mongoose.model("products", productsSchema)

//exportamos para su uso con este podemos usar los metodos ya creados como find(), deleteOne() 

export default productsModel