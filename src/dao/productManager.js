//Importamos el modelo de producto que vamos a utilizar en nuestro proyecto con mongoose y socket io desde el app

import productsModel from "./models/products.models.js";

class productManager {
  constructor() {
    this.listado = [];
  }

  addProduct = async (title, description, price, thumbnail, code, stock, category) => {


    let p = await this.getProducts()

    this.listado = p

    // console.log(p)

    let totalId = (await p).length

    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status: true,
      id: totalId + 1,
    };


    try {
      if (p) {

        // console.log(this.listado)

        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
          return "Faltan parametros";
        }


        let codigoR = await productsModel.findOne({ code })

        if (codigoR) {
          return "codigo repetido"
        } else {
          //usamos el modelo de producto para insertar productos a nuestra base de datos

          await productsModel.create(product)

          // return product
        }
      }
    }
    catch (e) { console.log(e) }
  };

  // PRODUCTOS OBTENIDOS CON MONGOOOSE

  getProducts = async () => {

    try {

      //usamos modelo de producto para leer nuestra base de datos , junto a lean y exec para traerlo en el formato parseado(objeto) con el que trabajamos

      const productosSi = await productsModel.find().lean().exec()

      if (productosSi) {
        return productosSi

      } else {
        return `No se encontraron productos.`
      }

    }
    catch (e) { console.log(e) }

  }



  //Metodo para traer un producto de this.path por su ID ///////////////////////////////////////////////////////////////////////////////

  getProductById = async (id) => {
    try {


      // usamos el metodo ya creado para ahorrar codigo para llamar a los productos
      let productosT = await this.getProducts()

      this.listado = productosT

      const idEncontrada = this.listado.find((idE) => idE.id === id);

      if (idEncontrada) {
        return idEncontrada;
      } else {
        return `No se encontro la ID.`;
      }
    }
    catch (e) { console.log(e) }
  };

  //Metodo para actualizar un producto de this.path ////////////////////////////////////////////////////////////////////////////////////////////////

  updateProduct = async (idU, campo) => {
    try {

      let datosSi = await this.getProducts()

      if (datosSi) {
        // this.listado = datosSi;

        //  let buscado =   await productsModel.findOne({"id": idU})

        // Construye un objeto con las modificaciones utilizando $set
        const setObj = { $set: {} };
        campo.forEach(campos => {
          const campoL = Object.keys(campos)[0]; // Obtiene el nombre del campo a modificar
          const valor = campos[campoL];
          setObj.$set[campoL] = valor;
        });


        await productsModel.updateOne({ "id": idU }, setObj)


      } else {
        return `No hay productos en la base de datos.`
      }

    }
    catch (e) { console.log(e) }
  };

  //Metodo para eliminar un producto por ID /////////////////////////////////////////////////////////////////////////////////////////

  deleteProduct = async (id) => {
    try {

      //usamos metodo que encuentra y borra un dato , le pasamos la id desde el html por el socket hasta el manager

      await productsModel.findOneAndDelete({ id });

      return "se elimino el producto con exito"

    }
    catch (e) { console.log(e) }
  }

}

export default productManager;
