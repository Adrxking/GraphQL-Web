//////////////////////////
// IMPORTACION DE CONSTANTES
//////////////////////////
import { Context } from './../index';

//////////////////////////
// DEFINICION DE LOS RESOLVERS
//////////////////////////
export const Query = {

    me: (_: any, __: any, { userInfo, prisma }: Context) => {
        // Comprobar si existe el usuario
        if(!userInfo) return null;

        // Devolver la info del usuario
        return prisma.user.findUnique({
            where: {
                id: userInfo.userId,
            }
        })
    },

    profile: async (_: any, { userId }: { userId: string }, { prisma, userInfo }: Context) => {

        const isMyProfile = Number(userId) === userInfo?.userId

        // Devolver el perfil
        const profile = await prisma.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        })

        if (!profile) return null

        return {
            ...profile,
            isMyProfile
        }

    },

    posts: async (
        _: any, 
        __: any, 
        { prisma }: Context
    ) => {
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [
                {
                    createdAt: "desc"
                },
                {
                    title: "desc"
                }
            ]
        });
        return posts
    }
}
