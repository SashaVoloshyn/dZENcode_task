import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonFields } from './commons-fields.entity';
import { Users } from './users.entity';

@Entity()
export class MainComments extends CommonFields {
    @Column({
        name: 'pageUrl',
        type: 'varchar',
        width: 255,
        nullable: true,
        default: null,
    })
    pageUrl?: string;

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

    @ManyToOne(() => Users, (users) => users.mainComments)
    @JoinColumn({ name: 'userId' })
    user: Users;
}
