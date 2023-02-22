import { AppDataSource } from '../configs';

import { Users } from '../entities';
import { IUser } from '../interfaces';

class UsersRepository {
    userRepository;

    constructor() {
        this.userRepository = AppDataSource.getRepository(Users);
    }

    public async createOne(user: IUser): Promise<Users> {
        return this.userRepository.save(user);
    }

    public async getOneById(id: number): Promise<Users | null> {
        return this.userRepository.findOneBy({ id });
    }

    public async getOneByEmail(email: string): Promise<Users | null> {
        return this.userRepository.findOneBy({ email });
    }
}

export const usersRepository = new UsersRepository();
