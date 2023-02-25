import { MigrationInterface, QueryRunner } from 'typeorm';

export class joinedcollum1677166749931 implements MigrationInterface {
    name = 'joinedcollum1677166749931';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "mainCommentsId" integer`);
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_694a2b1e350342c5bf470e73b06" FOREIGN KEY ("mainCommentsId") REFERENCES "main_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_694a2b1e350342c5bf470e73b06"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "mainCommentsId"`);
    }
}
