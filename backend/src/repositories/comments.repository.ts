import { DeleteResult, UpdateResult } from 'typeorm';

import { AppDataSource } from '../configs';
import { Comments } from '../entities';
import { IComment } from '../interfaces';

class CommentsRepository {
    commentsRepository;

    constructor() {
        this.commentsRepository = AppDataSource.getRepository(Comments);
    }

    public async createOne(comment: IComment): Promise<Comments> {
        return this.commentsRepository.save(comment);
    }

    public async getAll(): Promise<Comments[]> {
        return this.commentsRepository.find();
    }

    public async getAllByMainCommentId(mainCommentId: number): Promise<Comments[]> {
        return this.commentsRepository.find({ where: { mainCommentId } });
    }

    public async getOneById(commentId: number): Promise<Comments | null> {
        return this.commentsRepository.findOneBy({ id: commentId });
    }

    public async deleteOneById(commentId: number): Promise<DeleteResult> {
        return this.commentsRepository.delete({ id: commentId });
    }

    public async updateOne(id: number, updateFields: Partial<Comments>): Promise<Comments | UpdateResult> {
        return this.commentsRepository.update({ id }, { ...updateFields });
    }
}

export const commentsRepository = new CommentsRepository();
