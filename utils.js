import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from "bcrypt"


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export default __dirname



//crear hash (le decimos que del parametro password devuelva en forma sincronica el passowrd encriptado en un nivel 10 veces (mietras mas grande el numero mas encripta pero mas lento el preoceso))

export const createHash = (password) => { return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) }

//Validar hash

//le decimos que si user.password contrasenia almacenada con hash es igual a password ingresado en el website , nos devuelve un true o false

export const isValidPassword = (user, password) => {

    return bcrypt.compareSync(password, user.password)


}