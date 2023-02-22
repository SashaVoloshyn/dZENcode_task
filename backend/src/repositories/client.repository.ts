import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

import { ClientEnum } from '../enums';

class ClientRepository {
    client;

    constructor() {
        this.client = createClient();
        (async () => {
            await this.client.connect();
        })();
    }

    public async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    public async set(key: string, data: string): Promise<string | null> {
        return this.client.set(key, data);
    }

    public async setExpire(key: string, expireTime: number, value: string): Promise<string | null> {
        return this.client.setEx(key, expireTime, value);
    }

    public async getKey(key: string): Promise<string[]> {
        return this.client.keys(key);
    }

    public async getAnyKeysByUserName(userName: string, type: ClientEnum): Promise<string[]> {
        return this.client.keys(`*${type}:${userName}*`);
    }

    public generateClientKey(id: number, userName: string, type: ClientEnum): string {
        let clientKey = '';

        if (type === ClientEnum.AUTHTOKEN) {
            clientKey = `${ClientEnum.AUTHTOKEN}:${userName}:${id}:${uuidv4()}`;
        }
        return clientKey;
    }

    public async delete(key: string): Promise<any> {
        return this.client.del(key);
    }
}

export const clientRepository = new ClientRepository();
