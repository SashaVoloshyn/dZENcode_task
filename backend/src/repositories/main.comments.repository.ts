import { DeleteResult, UpdateResult } from 'typeorm';

import { AppDataSource } from '../configs';
import { MainComments } from '../entities';
import { IMainComment } from '../interfaces';

class MainCommentsRepository {
    mainCommentsRepository;

    constructor() {
        this.mainCommentsRepository = AppDataSource.getRepository(MainComments);
    }

    public async createOne(mainComment: IMainComment): Promise<MainComments> {
        return this.mainCommentsRepository.save(mainComment);
    }

    public async updateOne(id: number, updateFields: Partial<MainComments>): Promise<MainComments | UpdateResult> {
        return this.mainCommentsRepository.update({ id }, { ...updateFields });
    }

    public async getAll(): Promise<MainComments[]> {
        return this.mainCommentsRepository
            .createQueryBuilder('mainComments')
            .leftJoinAndSelect('mainComments.comments', 'comments')
            .leftJoinAndSelect('mainComments.user', 'user')
            .getMany();
    }

    public async getAllWithPagination(skip: number, take: number): Promise<[MainComments[], number]> {
        return this.mainCommentsRepository
            .createQueryBuilder('mainComments')
            .leftJoinAndSelect('mainComments.comments', 'comments')
            .leftJoin('mainComments.user', 'user')
            .select(['mainComments', 'comments', 'user.id', 'user.userName', 'user.email', 'user.avatar'])
            .skip(skip)
            .take(take)
            .getManyAndCount();
    }

    public async getOneById(id: number): Promise<MainComments | null> {
        return this.mainCommentsRepository
            .createQueryBuilder('mainComments')
            .where('mainComments.id = :id', { id })
            .leftJoinAndSelect('mainComments.comments', 'comments')
            .leftJoin('mainComments.user', 'user')
            .select(['mainComments', 'comments', 'user.id', 'user.userName', 'user.email', 'user.avatar'])
            .getOne();
    }

    public async deleteOne(id: number): Promise<DeleteResult> {
        return this.mainCommentsRepository.delete({ id });
    }
}

export const mainCommentsRepository = new MainCommentsRepository();
