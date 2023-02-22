import jwt, { JwtPayload } from 'jsonwebtoken';

import { IPayload, ITokenPair } from '../interfaces';
import { mainConfig } from '../configs';
import { ClientEnum } from '../enums';
import { clientRepository } from '../repositories/client.repository';
import { authConstants } from '../constants';

class JwtService {
    public async generateTokenPair(payload: IPayload): Promise<ITokenPair | undefined> {
        const accessToken = jwt.sign(payload, mainConfig.SECRET_ACCESS_KEY as string, {
            expiresIn: mainConfig.EXPIRES_IN_ACCESS,
        });
        const refreshToken = jwt.sign(payload, mainConfig.SECRET_REFRESH_KEY as string, {
            expiresIn: mainConfig.EXPIRES_IN_REFRESH,
        });

        const clientKey = clientRepository.generateClientKey(payload.id!, payload.userName!, ClientEnum.AUTHTOKEN) as string;
        const saveToken = await clientRepository.setExpire(
            clientKey,
            Number(mainConfig.EXPIRES_CLIENT_TOKENS_PAIR),
            JSON.stringify({ accessToken, refreshToken })
        );

        if (!saveToken) {
            return;
        }

        return {
            accessToken,
            refreshToken,
            clientKey,
        };
    }

    public verify(token: string, type = authConstants.ACCESS): string | JwtPayload {
        let secretWord = mainConfig.SECRET_ACCESS_KEY;

        if (type === authConstants.REFRESH) {
            secretWord = mainConfig.SECRET_REFRESH_KEY;
        }

        return jwt.verify(token, secretWord);
    }
}

export const jwtService = new JwtService();
