import passport from "passport";

import local from "passport-local"

import UserModel from "../dao/models/user.model.js";

import { createHash, isValidPassword } from "../../utils.js";

import GitHubStrategy from "passport-github2"

const LocalStrategy = local.Strategy

const initializePassport = () => {


    ////Bcrypt///////////////////////////////////////////////////////////////////////////////////////////////////////

    passport.use('register', new LocalStrategy({
        passReqToCallback: true, // Tener acceso al req como un middleware
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { name, email } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log('User already exits')
                return done(null, false)
            }

            const newUser = {
                name,
                email,
                password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch (error) {
            done('Error to register ' + error)
        }
    }))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User doent exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                return done('Error login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })


    //github//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    passport.use(`github`, new GitHubStrategy({


        //id otorgada por github unica de app para trabajar con nuestro sitio web

        clientID: `Iv1.16d6f7b17a9f457b`,

        //codigo de app unico generado por github

        clientSecret: `4fe2d52235bbd1223973ee8a2b432aebccdd6ed3`,

        //ruta de funcion callback

        callBackURL: `http//127.0.0.1:8080/githubcallback`

    }, async (accesToken, refreshToken, profile, done) => {

        console.log(profile)

        try {


            //buscamos un user igual a del profile de github por coincidencia en el email

            const user = await UserModel.findOne({ email: profile._json.email })


            //si tenemos el user devolvemos el mismo porque ya existe

            if (user) {
                console.log(`ya se encuentra registrado`)
                return done(null, user)
            }

            //sino lo tenemos hacemos un nuevo usuario con el metodo create y el molde de usermodel, le vamos a pasar de lo traido de github el first name y el email lo sacamos por medio del metodo de github profile

            const newUser = await UserModel.create({
                first_name: profile._json.name,
                last_name: ``,
                email: profile._json.email,
                password: ``,
                age: ``
            })

            //retornamos si llegamos hasta aca el usuario generado

            return done(null, newUser)

        } catch (e) { return done(`error para loguear git`) }


    }


    ))

    passport.serializeUser((user, done) => {

        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {

        const user = await UserModel.findById(id)
        done(null, user)



    })


}

export default initializePassport