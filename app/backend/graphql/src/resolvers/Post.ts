import { userLoader } from './../loaders/userLoader';
import { Context } from './../index';

interface PostParentType {
    authorId: number;
}

export const Post = {

    user: (parent: PostParentType, __: any, { userInfo, prisma }: Context) => {
        // Devolver los usuarios usando el dataloader para hacer una unica consulta por cada usuario
        return userLoader.load(parent.authorId)
    },
}
