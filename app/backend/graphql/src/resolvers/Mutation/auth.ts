import { JWT_SIGNATURE } from './../../keys';
//////////////////////////
// IMPORTACION DE PAQUETES
//////////////////////////
import validator from "validator"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import { Context } from "../../index"

//////////////////////////
// DEFINICION DE INTERFACES
//////////////////////////
interface SignupArgs {
    credentials: {
        password:   string
        email:      string
    }
    name:       string
    bio:        string
}

interface SigninArgs {
    credentials: {
        password:   string
        email:      string
    }
}

interface UserPayload {
    userErrors: {
        message: string
    }[];
    token: null | string
}

//////////////////////////
// DEFINICION DE RESOLVERS
//////////////////////////
export const authResolvers = {

    signup: async (
        _: any,
        { bio, name, credentials }: SignupArgs,
        { prisma }: Context
    ): Promise<UserPayload> => {

        const { email, password } = credentials

        // Validar si es un email
        const isEmail = validator.isEmail(email);

        if(!isEmail) {
            return {
                userErrors: [{
                    message: "Email invalido"
                }],
                token: null
            }
        }

        // Encontrar el usuario con el email introducido
        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        // Comprobar si existe el usuario introducido
        if(userExists) {
            return {
                userErrors: [
                    { message: "Ya existe una cuenta con este email" }    
                ],
                token: null
            }
        }

        // Validar si es una contraseña
        const isPassword = validator.isLength(password, {
            min: 5
        });

        if(!isPassword) {
            return {
                userErrors: [{
                    message: "Contraseña invalida"
                }],
                token: null
            }
        }

        // Validar que el nombre y la bio no estan vacias
        if(!name || !bio) {
            return {
                userErrors: [{
                    message: "Nombre o biografia invalida"
                }],
                token: null
            }
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Creacion de usuario en nuestra base de datos
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        })

        // Creacion del perfil en nuestra base de datos
        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            }
        })

        // Creacion del token
        const token = await JWT.sign({
            userId: user.id,
        }, JWT_SIGNATURE, {
            expiresIn: 3600000,
        })

        return {
            userErrors: [],
            token
        }

    },

    signin: async (
        _: any,
        { credentials }: SigninArgs,
        { prisma }: Context
    ) => {

        const { email, password } = credentials

        // Encontrar el usuario con el email introducido
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        // Comprobar si existe el usuario introducido
        if(!user) {
            return {
                userErrors: [
                    { message: "Credenciales invalidas" }    
                ],
                token: null
            }
        }

        // Comparar la contraseña introducida es correcta
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return {
                userErrors: [
                    { message: "Credenciales invalidas" }    
                ],
                token: null
            }
        }


        // Generar el token
        const token = JWT.sign({
            userId: user.id
        }, JWT_SIGNATURE, {
            expiresIn: 3600000
        })

        return {
            userErrors: [],
            token
        }

    }

}