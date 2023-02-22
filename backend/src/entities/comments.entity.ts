import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonFields } from './commons-fields.entity';
import { Users } from './users.entity';

@Entity()
export class Comments extends CommonFields {
    @Column({
        name: 'text',
        type: 'varchar',
        width: 8000,
        nullable: false,
    })
    text: string;

    @Column({
        name: 'userId',
        type: 'int',
        nullable: false,
    })
    userId: number;

    @Column({
        name: 'mainCommentId',
        type: 'int',
        nullable: false,
    })
    mainCommentId: number;

    @Column({
        name: 'fileText',
        type: 'varchar',
        width: 255,
        nullable: true,
        unique: true,
    })
    fileText?: string;

    @Column({
        name: 'fileImg',
        type: 'varchar',
        width: 255,
        nullable: true,
        default: null,
        unique: true,
    })
    fileImg?: string;

    @ManyToOne(() => Users, (users) => users.comments)
    @JoinColumn({ name: 'userId' })
    user: Users;
}
