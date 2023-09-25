import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertValueToRoleTable1695057112690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "role"(id, role)
            VALUES (1, 'ADMIN');

            INSERT INTO "role"(id, role)
            VALUES (2, 'USER');

            INSERT INTO "role"(id, role)
            VALUES (3, 'FILMMAKER');
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "role" WHERE role IN ('ADMIN', 'USER', 'FILMMAKER');
        `)
  }
}
