//////////////////////////
// IMPORTACION DE CONSTANTES
//////////////////////////
import { Context } from './../index';

//////////////////////////
// DEFINICION DE LAS INTERFACES
//////////////////////////
interface UserParentType {
    id: number;
}

//////////////////////////
// DEFINICION DE LOS RESOLVERS
//////////////////////////
export const User = {

    posts: (parent: UserParentType, __: any, { userInfo, prisma }: Context) => {
        // Comprobar si es el propietario el que pide la info
        const isOwnProfile = parent.id === userInfo?.userId
        
        // Devolver todos o solamente los publicados dependiendo de si es el propietario o no
        if (isOwnProfile) {
            return prisma.post.findMany({
                where: {
                    authorId: parent.id
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            })
        } else {
            return prisma.post.findMany({
                where: {
                    authorId: parent.id,
                    published: true
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            })
        }
        
    },
}
