import cartModel from "./models/cart.models.js"

class cartManager {

    constructor() {
        this.lista = []
    }

    getCarts = async () => {
        try {


            //buscamos si existe el documento con los datos

            let carritoSi = await cartModel.find()

            if (carritoSi) {

                //de la constante pasamos el contenido a this.lista en formato javascript

                this.lista = carritoSi
            }

            //de no existir el archivo escribimos el mismo con el contenido de this.lista

            else { return "No hay carritos en la base de datos" }

            //devolvemos el contenido de los carritos para usarlo en los proximos metodos

            return this.lista
        }

        catch (e) { return console.log(e) }
    }

    addCart = async (body) => {

        //usamos el metodo para traer todos los carritos

        let carritoId = await this.getCarts()

        console.log(carritoId)

        //contamos la totalidad de carritos para darle un id que no se repita

        let carritoL = await parseInt(carritoId.length)

        //creamos un objeto molde para darle una id y un array nuevo por dentro para agregar productos proximamente al carrito

        const carritoMolde = {

            id: carritoL + 1,
            products: body.map(p => ({ id: p.id }))
        }

        // traemos los carritos , y le agregamos el objeto nuevo lo escribimos en el archivo principal
        try {
            if (carritoId) {

                await cartModel.insertMany([carritoMolde])

            }
        }
        catch (error) {
            console.error(error);
            return `No se pudo agregar el carrito o el producto.`;
        }
    }

    getCartId = async (id) => {

        try {

            cartModel.find({ id: id })
                .populate('products')

            let obtenerCarrito = await this.getCarts()

            this.lista = obtenerCarrito

            //de todos los carritos encontramos el que coincida por ID

            let encontrarCarrito = await this.lista.find((f) => f.id === id)


            if (encontrarCarrito) { return encontrarCarrito }

            //sino encontramos el carrito >>>>
            else { return `carrito no encontrado por ID` }

        }
        catch (e) {
            console.log(e)
        }
    }

    delCartProd = async (pid, cid) => {

        try {

            //usamos updateOne para actualizar datos en un documento en este caso borrar uno en especifico
            //le decimos que busque el id del primer array que son los carritos que coincida con el pasado desde router.cart por url

            await cartModel.updateOne({ id: cid },

                //como segundo parametro le decimos lo que queremos hacer en este caso pull , borrar un dato de el array products el id que coincida por el pasado desde 
                //router.cart por url 

                { $pull: { products: { id: pid } } }

            )

        }
        catch (e) { console.log(e) }

    }

    delCartProductsT = async (idC) => {

        try {

            let encontrarC = await this.getCartId(idC)

            if (encontrarC) {
                await cartModel.updateOne({ id: idC }, { $set: { products: [] } })

            }
        }
        catch
        (e) { console.log(e) }
    }


    addProductCart = async (idC, idP, body) => {

        try {

            let bodyQ = body



            let carritoId = await this.getCartId(idC)

            if (!carritoId) return (`no se encontro el carrito por el ID ingresado`)

            // let productoEncontrado = carritoId.products.find(item => item.product === idP)

            let productoEncontrado = await cartModel.find({ id: idC, 'products.product': idP })



            if (productoEncontrado) {

                await cartModel.updateOne({ id: idC, 'products.product': idP },
                    { $inc: { 'products.$.quantity': bodyQ } }

                )

            } else {

                await cartModel.updateOne({ id: carritoNum },
                    { $push: { products: { product: productoId, quantity: 1 } } }

                )

            }

        }
        catch (e) { console.log(e) }

    }

    addProductsArrayCart = async (idC, body) => {


        try {


            let carritoId = await this.getCartId(idC)

            let productsB = await body


            if (carritoId && productsB) {


                await cartModel.updateOne({ id: idC }, { $push: { products: { $each: productsB } } });


                return "productos agregados correctamente"


            } else { return "faltan parametros" }


        }
        catch (e) {
            console.log(e);
            return "error al agregar productos"
        }
    }
}

export default cartManager