import { Router } from "express"
import productManager from "../dao/productManager.js"

const router = Router()

router.post("/", async (req, res) => {

  const pM1 = new productManager();

  const producto = req.body

  let { title, description, price, thumbnail, code, stock, category } = producto

  const newProduct = await pM1.addProduct(title, description, price, thumbnail, code, stock, category)

  res.status(201).send({ status: "succes", message: newProduct })

})

router.get(`/`, async (req, res) => {

  //Creo una instancia de productManager para trabajarla

  const pM1 = new productManager();

  //Llamo un metodo y lo guardo en una constante

  let data = await pM1.getProducts();

  //Comprobamos si el usuario ingreso en la url un query , de ser asi lo pasamos a una variable para obtener su valor

  if (req.query.limit) {

    let limit = req.query.limit;

    //Usamos slice y le ponemos de parametro la variable limit

    let lista2 = data.slice(0, limit);

    //Dibujamos el resultado en pantalla

    return res.json({ lista2 });
  }

  //Dibujamos el resultado en pantalla si el usuario no ingreso ningun query

  res.json(data);
});

router.get(`/:id`, async (req, res) => {

  const idR = parseInt(req.params.id)

  if (!idR) { return `No se encontro id` }


  const pM1 = new productManager()

  let buscarId = await pM1.getProductById(idR)

  res.json(buscarId)

})

router.put(`/:id`, async (req, res) => {

  const body = req.body

  console.log(body)

  const idR = parseInt(req.params.id)


  console.log(idR)

  const pM1 = new productManager()

  let update = await pM1.updateProduct(idR, body)

  res.json(update)

})

router.delete(`/:id`, async (req, res) => {

  let idD = parseInt(req.params.id)

  const pM1 = new productManager()

  let borrar = await pM1.deleteProduct(idD)

  res.json(borrar)

})

export default router