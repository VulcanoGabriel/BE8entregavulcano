import fs from "fs";


// Creamos la clase ProductManager

class productManager {
  constructor(path) {
    //Array donde se van a guardar temporalmente los datos antes de enviarlos al archivo principal para sus modificaciones
    this.listado = [];

    //Ubicacion donde se crea el archivo que contendra la base de datos

    this.path = path;
  }

  // Metodo para agregar un producto cumpliendo ciertos requerimientos

  addProduct = async (title, description, price, thumbnail, code, stock, category) => {

    let p = this.getProducts()

    let totalId = (await p).length


    //Molde objeto del producto a crear

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

    //Si nos falta alguna de las propiedades no pasara el testeo
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        this.listado = JSON.parse(data);

        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
          return "Faltan parametros";
        }

        //Si se repite el codigo del producto no pasara el testeo

        if (this.listado.some((product) => product.code === code)) {
          return `El codigo delproducto ${code} ya esta ingresado`;
        } else {
          this.listado.push(product);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.listado, null)

            //emito los datos hacia el socket

          );
          return product
        }
      }
    }
    catch (e) { console.log(e) }
  };


  //Metodo para traer los productos cargados en this.path

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, `utf-8`);
        this.listado = JSON.parse(data);
      } else {
        await fs.promises.writeFile(this.path, JSON.stringify(this.listado))
        return this.listado
      }
      return this.listado;
    }
    catch (e) { console.log(e) }
  };

  //Metodo para traer un producto de this.path por su ID

  getProductById = async (id) => {
    try {
      const contenidoDb2 = await fs.promises.readFile(this.path, `utf-8`);
      this.listado = JSON.parse(contenidoDb2);
      const idEncontrada = this.listado.find((idE) => idE.id === id);

      if (idEncontrada) {
        return idEncontrada;
      } else {
        return `no se encontro la ID`;
      }
    }
    catch (e) { console.log(e) }
  };

  //Metodo para actualizar un producto de this.path

  updateProduct = async (idU, campo) => {
    try {
      if (fs.existsSync(this.path)) {
        const contenidoDb3 = await fs.promises.readFile(this.path, `utf-8`);
        this.listado = JSON.parse(contenidoDb3);
      } else {
        await fs.promises.writeFile(this.path, JSON.stringify(this.listado));
      }
      //buscamos el ID del producto a actualizar

      let idEncontrada2 = this.listado.find((idE) => idE.id === idU);

      //creamos un array nuevo para poner el producto modificado

      let newArr = this.listado.filter((prod) => prod !== idEncontrada2);

      // de existir la ID buscamos el campo a actualizar en el objeto y lo reemplazamos en la ubicacion de this.listado

      for (let llaveCampo in campo) {
        if (idEncontrada2.hasOwnProperty(llaveCampo)) {
          idEncontrada2[llaveCampo] = campo[llaveCampo];
          newArr.push(idEncontrada2);
          this.listado = newArr;
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.listado, null)
          );
          return `Producto ${idU} actualizado`;
        }

        return "producto no encontrado";
      }

      //escribimos el arhivo con los datos de nuestro listado a su vercion final

      await fs.promises.writeFile(this.path, JSON.stringify(this.listado, null));
    }
    catch (e) { console.log(e) }
  };

  deleteProduct = async (id) => {
    try {
      //Leemos el arhivo this.path

      const idEncontrada = await fs.promises.readFile(this.path, `utf-8`);

      //Lo traemos y grabamos en this.listado en formato objeto

      this.listado = JSON.parse(idEncontrada);

      //Filtramos de nuestro listado todo lo que no coincida !==

      const productoFiltado = this.listado.filter(
        (producto) => producto.id !== id
      )

      //escribimos el arhivo this.path con nuestra busqueda de productos filtrados que no coincidieron con la ID quedando solo los que no queremos borrar

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productoFiltado, null)

        //por medio del socket mandamos los productos filtrados
      )

      return productoFiltado
    }
    catch (e) { console.log(e) }
  }

}

// Instancia de testeo

// const manager1 = new productManager("./lista.json");

// Funcion que ejecuta todos los metodos con el metodo

// const ejecutar = async () => {
//   await manager1.addProduct(
//     "sadasd",
//     "sadsa",
//     "sadsa",
//     "sadsa",
//     "sadsa",
//     "sadsa"
//   );

//   await manager1.addProduct(
//     "sadasd",
//     "sadsa",
//     "sadsa",
//     "sadsa",
//     "22222",
//     "sadsa"
//   );

//   await manager1.addProduct(
//     "sadasd",
//     "sadsa",
//     "sadsa",
//     "sadsa",
//     "3333",
//     "sadsa"
//   );

//   await manager1.addProduct(
//     "sadasd",
//     "sadsa",
//     "sadsa",
//     "sadsa",
//     "sadsa",
//     "sadsa"
//   );

//   await manager1.addProduct(
//     "sadasd",
//     "sadsa",
//     "sadsa",
//     "sadsa",
//     "sadsa",
//     "sadsa"
//   );

// await manager1.getProducts();

//   manager1.getProductById(2);
// await manager1.updateProduct(1, { price: 7000000000 });

//   await manager1.getProducts();

//   await manager1.deleteProduct(2);
//  console.log( await manager1.getProducts());
// };

// ejecutamos la funcion anteriormente creada

// ejecutar();

export default productManager;
