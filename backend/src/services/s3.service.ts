import S3, { ManagedUpload } from 'aws-sdk/clients/s3';
import { v4 } from 'uuid';
import path from 'path';

import { mainConfig } from '../configs';
import { FileEnum, ItemTypeFileEnum } from '../enums';

class S3Service {
    Bucket;

    uuidv4;

    constructor() {
        this.Bucket = new S3({
            region: mainConfig.S3_REGION,
            accessKeyId: mainConfig.S3_ACCESS_KEY,
            secretAccessKey: mainConfig.S3_SECRET_KEY,
        });
        this.uuidv4 = v4;
    }

    // eslint-disable-next-line no-undef
    public async uploadFile(
        file: Express.Multer.File,
        itemId: number,
        fileType: FileEnum,
        itemType: ItemTypeFileEnum
    ): Promise<ManagedUpload.SendData> {
        const { originalname, buffer, mimetype } = file;
        const itemIdToString = itemId.toString();

        const pathToFile = this._pathBuilder(originalname, itemIdToString, fileType, itemType);

        return this.Bucket.upload({
            Bucket: mainConfig.S3_NAME as string,
            Key: pathToFile,
            Body: buffer,
            ContentType: mimetype,
            ACL: 'public-read',
        }).promise();
    }

    public async deleteFile(filePath: string): Promise<void> {
        /*
            where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
            - full path name to your file without '/' at the beginning
        */
        const filePathSlice = filePath.slice(1);
        await this.Bucket.deleteObject({ Bucket: mainConfig.S3_NAME!, Key: filePathSlice }, (err) => {
            if (err) console.error(err);
        }).promise();
    }

    private _pathBuilder(fileName: string, itemId: string, fileType: FileEnum, itemType: ItemTypeFileEnum): string {
        const fileExpansion = path.extname(fileName);
        const newFileName = this.uuidv4() + fileExpansion;

        return `${fileType}/${itemType}/${itemId}/${newFileName}`;
    }
}
export const s3Service = new S3Service();
