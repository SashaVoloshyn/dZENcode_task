import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTables1677002991199 implements MigrationInterface {
    name = 'createTables1677002991199';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "common_fields" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_173d3d2a663d8f98a9fc3841357" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "main_comments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "pageUrl" character varying, "text" character varying NOT NULL, "userId" integer NOT NULL, "fileText" character varying, "fileImg" character varying, CONSTRAINT "UQ_aa0f8148417bd23a3e0a2b14263" UNIQUE ("fileText"), CONSTRAINT "UQ_060d05833c03fa7c055cecb8316" UNIQUE ("fileImg"), CONSTRAINT "PK_8352799a52664d152fc65c291cd" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "comments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "text" character varying NOT NULL, "userId" integer NOT NULL, "mainCommentId" integer NOT NULL, "fileText" character varying, "fileImg" character varying, CONSTRAINT "UQ_64366c4235f03572a558db1b615" UNIQUE ("fileText"), CONSTRAINT "UQ_e1bb01143477aa0d58a33cfd66e" UNIQUE ("fileImg"), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "main_comments" ADD CONSTRAINT "FK_fcbd77426714dc47d364780f6e4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "main_comments" DROP CONSTRAINT "FK_fcbd77426714dc47d364780f6e4"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "main_comments"`);
        await queryRunner.query(`DROP TABLE "common_fields"`);
    }
}
