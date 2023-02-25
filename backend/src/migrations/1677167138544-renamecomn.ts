import { MigrationInterface, QueryRunner } from 'typeorm';

export class renamecomn1677167138544 implements MigrationInterface {
    name = 'renamecomn1677167138544';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_ed051ec3b20d4d29a0b1425b3f6" FOREIGN KEY ("mainCommentId") REFERENCES "main_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_ed051ec3b20d4d29a0b1425b3f6"`);
    }
}
