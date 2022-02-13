// Esto sirve para cachear los usuarios para que si por ejemplo queremos obtener
// todos los posts y de cada post su usuario para que cada post no haga una consulta a la 
// BD guardamos el id de los post para hacer una unica consulta por cada usuario

//////////////////////////
// IMPORTACION DE PAQUETES
//////////////////////////
import DataLoader from "dataloader"
import { User } from "@prisma/client"
//////////////////////////
// IMPORTACION DE CONSTANTES
//////////////////////////
import { prisma } from "../index"

//////////////////////////
// DEFINICION DEL TIPO
//////////////////////////
type BatchUser = (ids: number[]) => Promise<User[]>

//////////////////////////
// DEFINICION DEL BATCH
//////////////////////////
const batchUsers: BatchUser = async (ids) => {
    
    // Obtener todos los usuarios con los ids mandados
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids
            }
        }
    })

    // Para batchear los usuarios debemos ordenar los ids de los usuarios que queremos de la BD
    const userMap: { [key: string]: User } = {};

    users.forEach((user) => {
        userMap[user.id] = user
    })

    return ids.map((id) => userMap[id])

    // Lo anterior equivale a pasar de tener por ejemplo un array de ids [1, 3, 2]
    // a tener un objeto

    //{
    //      1: {id: 1},
    //      2: {id: 2},
    //      3: {id: 3},
    //}

}

//////////////////////////
// DEFINICION DEL DATALOADER
//////////////////////////
//@ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers)