import productsModel from "../dao/models/products.models.js";
import { Router } from "express"
import cartManager from "../dao/cartsManager.js";
import passport from "passport";


// import productManager from "../dao/productManager.js" trabajando desde FS

const router = Router()

//RENDER DESDE FS

// router.get("/", async (req, res) => {

// const pM1 = new productManager("./src/db/lista.json");

// let respuesta = await pM1.getProducts()

//     res.render(`home`, { respuesta })
// })

// router.get("/realtimeproducts", async (req, res) => {

//     res.render(`realTimeProducts`)
// })



//este archivo lo usamos para dar los renderizados a las vista en cada apartado de las url , para no saturar el app.js

//RENDER DESDE MONGOOSE

// router.get("/", (req, res) => {

//     res.json("todo ok")

// })

router.use((req, res, next) => {

    res.locals.auth = req.session?.user
    next()

})



router.get("/products/", async (req, res) => {

    //desde FS//////////////////////////////////////////////////////////

    // const pM1 = new productManager();

    // let respuesta = await pM1.getProducts()

    ///////////////////////////////////////////////////////////////////////////

    const user = req.session.user

    console.log(user)

    const limit = parseInt(req.query?.limit ?? 10)

    const page = parseInt(req.query?.page ?? 1)

    const query = (req.query?.query ?? "")

    const category = Number(req.query?.category ?? 0)

    const sort = (req.query?.sort ?? "")

    const search = {}

    try {

        if (query) search.title = { "$regex": query, "$options": "i" }
        const options = {
            page,
            limit,
            lean: true
        }

        if (category) search.category = category

        if (sort != 0) {
            options["sort"] = { price: sort == "asc" ? 1 : -1 }
        }

        const result = await productsModel.paginate(search, options)


        result.payload = result.docs

        result.query = query

        result.status = "success"

        delete result.docs

        result.sortzero = sort === "0"


        result.sortasc = sort === "asc"


        result.sortdes = sort === "des"

        // console.log(result)

        res.render(`home`, { result, user })

    }

    catch (e) { (console.log(e)), result.status = "error" }
})


//RealTime Products //////////////////////////////////////////////////////

router.get("/realtimeproducts", async (req, res) => {

    res.render(`realTimeProducts`)
})

//CHAT///////////////////////////////////////////////////////////////////

router.get("/chat", (req, res) => {

    res.render("chat", {})

})

// vista 1 carrito (haciendo)

router.get("/carts/:cid", async (req, res) => {

    let idC = parseInt(req.params.cid)

    // let search = {}

    let cam1 = new cartManager()

    let resultados = await cam1.getCartId(idC)

    console.log(resultados)

    res.render("oneC", { res: resultados.doc })



})


//MIDLEWARES


//funcion que se fija si la sesion esta activa, es decir si hay cargado contenido en la session.user  de ser asi nos manda a 
// /profile la usamos como midleware y si no cumple la condicion continua con el codigo

function justPublicWithoutSession(req, res, next) {

    if (req.session?.user) return res.redirect('/profile')

    return next()
}

// se fija si hay un usuario cargado , de no ser asi nos manda a una pantalla de logueo

function auth(req, res, next) {

    if (req.session?.user) return next()

    res.redirect('/login')


}


//RENDERS de LOGIN

router.get('/', (req, res) => {

    return res.render('index')


})

//  router.get('/login', justPublicWithoutSession,  (req, res) => {

//    return  res.render('login', {})
//  })

//  router.get('/register', justPublicWithoutSession, (req, res) => {


//   return   res.render('register', {})




//  })

















//register passport bcrypt

router.post("/register", passport.authenticate(`register`, { failureRedirect: `/` }), async (req, res) => {
    res.send(`registrado`)

})


//login passport bcrypt/////////////////////////////////////////////////////////////////////////////////////

router.post("/login", passport.authenticate(`login`, { failureRedirect: `/` }), async (req, res) => {

    if (!req.user) return res.status(400).send(`invalidad credentials `)

    req.session.user = req.user

    return res.send(`logueado`)


})



router.get("/login", (req, res) => {

    res.render("login", {})

})


router.get("/register", (req, res) => {

    res.render("register", {})

})



router.get('/profile', auth, (req, res) => {

    const user = req.session.user

    res.render('profile', { user })


})


router.get(`/logout`, (req, res) => {


    req.session.destroy(err => {

        if (err) { return res.send`problemas al finalizar sesion` } else {

            res.redirect(`/`)

        }

    })

})



//login Github///////////////////////////////////////////////////////////////////////////////////////////////////////

//llamamos a nuestro passport configurado por el nombre `github`, le decimos que tenga scope en los datos user email, que tenga acceso y se pueda usar

router.get(`/github`, passport.authenticate(`github`, { scope: [`user:email`] }), async (req, res) => { })

//volvemos a llamar a nuestro passport , si falla le damos una ruta que tenemos que configurar, sino que setie el user de session por el traido y redirecionamos a /

router.get(`/githubcallback`, passport.authenticate(`github`, { failureRedirect: `/error` }),

    (req, res) => {

        console.log(`callback: `, req.user)

        req.session.user = req.user
        console.log(`user session setted`)

        res.redirect(`/`)


    })

router.get(`/error`, (req, res) => res.render(`error al loguear`))





export default router