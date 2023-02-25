type file = Express.Multer.File[];

export interface IFileExtended extends file {
    fileText?: Express.Multer.File[];
    fileImg?: Express.Multer.File[];
}
