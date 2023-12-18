import { Router } from "express";

import userModel from "../dao/models/user.model.js";

const router = Router()




router.post(`/login`, async (req, res) => {

    const {email, password} = req.body

    const user = await userModel.findOne({email , password})

    if(!user)  return res.status(404).send(`user not found`)

    req.session.user = user

    return res.redirect(`/products`)
})

router.post (`/register`, async  (req, res) =>{

    const user = req.body

    console.log(user)

    if(user.email === `adminCoder@coder.com` &&  user.password === `admincod3r123`){ 
        
         user.role = "admin"
        await userModel.create(user)
        res.redirect(`/`)
    } else{

    await userModel.create(user)

    return res.redirect(`/`)}


})

export default router