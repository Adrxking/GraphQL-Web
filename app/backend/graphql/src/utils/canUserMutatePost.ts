import { Context } from './../index';

interface canUserMutatePostParams {
    userId: number
    postId: number
    prisma: Context["prisma"]
}

export const canUserMutatePost = async ({
    userId,
    postId,
    prisma
}: canUserMutatePostParams) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    // Comprobar si el usuario existe
    if(!user) {
        return {
            userErrors: [{
                message: "Usuario no encontrado"
            }],
            post: null
        }
    }

    // Obtener el post que queremos modificar
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    // Comprobar si el post es del usuario que quiere modificarlo
    if(post?.authorId !== user.id) {
        return {
            userErrors: [{
                message: "El usuario no tiene permisos para modificar este post"
            }],
            post: null
        }
    }

}