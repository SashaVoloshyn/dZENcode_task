import { FileEnum } from '../enums';

export const filesMimetypeConstant = {
    [FileEnum.PHOTOS]: [
        'image/jpeg', // JPEG
        'image/pjpeg', // JPEG
        'image/png', //  PNG
        'image/gif', // GIF
    ],
    [FileEnum.TEXTS]: [
        'text/plain', // TXT
    ],
};

export const fileSizeConstant = {
    SIZE_DEFAULT: 1024 * 1024,
    SIZE_AVATAR: 3 * 1024 * 1024,
    SIZE_IMG: 3 * 1024 * 1024,
    SIZE_TEXT_FILE: 100 * 1024,
};

export const filesUploadFields = [
    { name: 'fileText', maxCount: 1 },
    { name: 'fileImg', maxCount: 1 },
];
