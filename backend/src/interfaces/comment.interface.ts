export interface IComment {
    text: string;
    userId: number;
    mainCommentId: number;
    fileText?: string;
    fileImg?: string;
}
