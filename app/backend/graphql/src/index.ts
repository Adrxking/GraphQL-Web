//////////////////////////
// IMPORTACION DE PAQUETES
//////////////////////////
import { ApolloServer } from "apollo-server"
import { PrismaClient, Prisma } from "@prisma/client"
//////////////////////////
// IMPORTACION DE CONSTANTES
//////////////////////////
import { typeDefs } from "./schema"
import { Query, Mutation, Profile, Post, User } from "./resolvers/index"
import { getUserFromToken } from './utils/getUserFromToken';

export const prisma = new PrismaClient();

//////////////////////////
// DEFINICION DE LAS INTERFACES
//////////////////////////
export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
    userInfo: {
        userId: number
    } | null
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post,
        User
    },
    context: async ({ req }: any): Promise<Context> => {
        const userInfo = await getUserFromToken(req.headers.authorization)
        return {
            prisma,
            userInfo
        }
    }
})


//////////////////////////
// LANZAMIENTO DEL SERVER
//////////////////////////
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});  