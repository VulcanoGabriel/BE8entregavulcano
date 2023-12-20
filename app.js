import express from "express"
import products from "./src/router/router.products.js"
import carts from "./src/router/router.cart.js"
import productManager from "./src/dao/productManager.js"
import chatModel from "./src/dao/models/chat.models.js"
import sessionRouter from "./src/router/router.session.js"

import passport from "passport"

import initializePassport from "./src/config/passport.config.js"

//abre una session 

import session from "express-session"

//crea dentro de mongo la session donde le digamos

import MongoStore from "connect-mongo"

import mongoose from "mongoose"

//importo viewrouter para renderisar en pantalla 

import viewsRouter from "./src/routes/view.router.js"

//importo server de socket.io lo que usaremos para iniciar el mismo

import { Server } from "socket.io"

//Importamos handlebars para dar dinamismo al proyecto junto a express

import handlebars from "express-handlebars"

//importamos un parametro , que nos ayuda a encontrar las rutas 

import __dirname from "./utils.js"



const mongoURL = "mongodb+srv://vulcano27:2790@cluster0.vzspbhh.mongodb.net/"

const mongoDB = "ecommerce"

const app = express()


//passport

initializePassport()


//iniciamos handlebars

app.engine(`handlebars`, handlebars.engine())

//setiamos la ubicacion de las vistas de handlebars

app.set(`views`, __dirname + `/views`)

//al ya tener iniciado el motor de handlebars le decimos cual en especifico vamos a usar

app.set(`view engine`, `handlebars`)

// json nos deja usar el formato con compatibilidad

//urlencoded aumenta la compatibilidad en transferencia de datos

//setiamos contenido estatico la carpeta publica 

app.use(express.static(__dirname + `/public`))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// configuramos la session de mongodb

//importamos arriba session que es para abrir una session y guardar datos , importamos arriba tambien mongoStore que crea en la direccion y base de datos mongo una sesion pasamos parametros de los mismo

app.use(session({

    store: MongoStore.create({

        mongoUrl: mongoURL,

        dbName: mongoDB

    }),

    secret: `secret`,
    resave: true,
    saveUninitialized: true
}))


// rutas

app.use("/", viewsRouter)

app.use("/api/products", products)

app.use("/api/carts", carts)

app.use(passport.initialize())

app.use(passport.session())

app.use(`/api/session`, sessionRouter)


//abro servidor dentro de una contante para pasarlo a el serversocket

const httpServer = app.listen(8080, () => { console.log("<<<<<<<<<<<<<<<<<<<<<<<<<servidor corriendo....................") })

//creo un nuevo servidor socket

const serverSocket = new Server(httpServer)


//entablesco cuando tenga una coneccion el servidor respondera

serverSocket.on(`connection`, async socket => {

    console.log(`conectado por web socket`)

    //CHAT //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on("message", async data => {

        console.log(data)
        await chatModel.create(data)
        let messages = await chatModel.find().lean().exec()
        console.log(messages)
        serverSocket.emit("logs", messages)

        // await chatModel.deleteMany(data)

    })

    //----------------------------------------------------------------------------------------------------------------------------------------------------

    ///// PRODUCTOS CON FS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // const pM1 = new productManager("./src/db/lista.json");

    // let productos = await pM1.getProducts()

    // socket.emit("products", productos  )

    // socket.on("productoAdd", async (producto) => {

    //     console.log(producto)

    //     let {title, description ,  price, thumbnail, code, stock, category} = producto

    //     await pM1.addProduct(title , description, price, thumbnail, code, stock, category)

    // })

    // socket.on("eliminado", async (eliminado) => {

    //     await pM1.deleteProduct(Number(eliminado))


    // })

    //----------------------------------------------------------------------------------------------------------------------------------------------------

    ///// PRODUCTOS CON Mongoose/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const pM1 = new productManager();

    let productos = await pM1.getProducts()

    socket.emit("products", productos)

    socket.on("productoAdd", async (producto) => {

        console.log(producto)

        let { title, description, price, thumbnail, code, stock, category } = producto

        await pM1.addProduct(title, description, price, thumbnail, code, stock, category)

    })

    socket.on("eliminado", async (eliminado) => {

        await pM1.deleteProduct(Number(eliminado))

    })
})

//----------------------------------------------------------------------------------------------------------------------------------------------------


//Mongoose/////////////////////////////////////////////////////////////////////

mongoose.connect(mongoURL, { dbName: mongoDB })
    .then(() => {

        console.log(`Conectado por mongoose a ${mongoDB}`)

    })
    .catch(e => console.log(e))

//----------------------------------------------------------------------------------------------------------------------------------------------------