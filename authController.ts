import { PrismaClient} from '@prisma/client'

import { hash, verify } from 'argon2';
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const prisma = new PrismaClient()

// const transporter = nodemailer.createTransport({
//     host: process.env.NODEMAILER_HOST,
//     port: process.env.NODEMAILER_PORT,
//     secure: false, 
//     auth: {
//       user: process.env.NODEMAILER_USER,
//       pass: process.env.NODEMAILER_PASS,
//     },
//   });

const generateAccessToken = (id:number, name:string) => {
    const payload = {
        id,
        name
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
}

class authController {


    async registration(req:any, res:any) {
        const {email, name, password} = req.body;

        if(email.length > 0 || name.length > 0 || password.length > 0) {
            try {
                const oldUser = await prisma.users.findUnique({
                    where: {
                        email
                    }
                   })
            
                   if(oldUser) res.status(400).json({
                    message: 'Пользователь существует+'
               })
            
                   await prisma.users.create({
                    data: {
                        email,
                        name,
                        password: await hash(password)
                    }
                   })
    
    
                   return res.send({
                    message: 'Пользователь существует'
               })
            } catch(e) {
          
                res.status(400).json({
                    message: 'Регистрация неуспеша'
               });
            }
        } else {
            res.status(400).json({message: 'Заполните все поля'});
        }
       
    }

    async login(req:any, res:any) {
      
        const {name, password} = req.body;

        if(name.length > 0 || password.length > 0) {
    
            try {
                const user = await prisma.users.findUnique({
                    where: {
                        name: name
                    }
                })
        
                if(!user) res.status(400).json({  message: `Пользователь не найден`})
        
                const isValid = await verify(user!.password, password);
                if(!isValid) res.status(400).json({ message: `Invalid password`})
                    const token = generateAccessToken(user!.id, user!.name);
                 res.json({
                        name,
                        token
                       })
                } catch(e) {
                  res.status(400).json({message: 'Login error'});
                } 
        } else {
            res.status(400).json({message: 'Заполните все поля'});
        }
    
    }

    async loginTelegram(req:any, res:any) {
      
        const {name} = req.body;

        if(name.length > 0 ) {
    
            try {
                const user = await prisma.users.findUnique({
                    where: {
                        name: name
                    }
                })
        
                if(!user) res.status(400).json({  message: `Пользователь не найден`})
        
                    const token = generateAccessToken(user!.id, user!.name);
                 res.json({
                        name,
                        token
                       })
                } catch(e) {
                  res.status(400).json({message: 'Login error'});
                } 
        } else {
            res.status(400).json({message: 'Заполните все поля'});
        }
    
    }

    async getUsers(req:any, res:any) {
        try {
            const users = await prisma.users.findMany()
      
            res.json(users)
          
        } catch(e) {
            res.status(400).json({message: 'Users error'});
        }
    }

}

module.exports = new authController();