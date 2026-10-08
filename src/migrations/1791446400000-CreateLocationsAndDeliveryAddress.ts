import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationsAndDeliveryAddress1791446400000 implements MigrationInterface {
  name = 'CreateLocationsAndDeliveryAddress1791446400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "country" ("id" SERIAL NOT NULL, "api_id" integer NOT NULL, "name" character varying(100) NOT NULL, "code" character varying(2) NOT NULL, CONSTRAINT "UQ_country_api_id" UNIQUE ("api_id"), CONSTRAINT "UQ_country_code" UNIQUE ("code"), CONSTRAINT "PK_country" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" SERIAL NOT NULL, "api_id" integer NOT NULL, "name" character varying(150) NOT NULL, "country_id" integer NOT NULL, CONSTRAINT "UQ_city_api_id" UNIQUE ("api_id"), CONSTRAINT "PK_city" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "delivery_address" ("id" SERIAL NOT NULL, "address" character varying(150) NOT NULL, "postal_code" character varying(20), "user_id" integer NOT NULL, "country_id" integer NOT NULL, "city_id" integer NOT NULL, CONSTRAINT "UQ_delivery_address_user" UNIQUE ("user_id"), CONSTRAINT "PK_delivery_address" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_city_country" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery_address" ADD CONSTRAINT "FK_delivery_address_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery_address" ADD CONSTRAINT "FK_delivery_address_country" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery_address" ADD CONSTRAINT "FK_delivery_address_city" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "delivery_address" DROP CONSTRAINT "FK_delivery_address_city"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery_address" DROP CONSTRAINT "FK_delivery_address_country"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery_address" DROP CONSTRAINT "FK_delivery_address_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_city_country"`,
    );
    await queryRunner.query(`DROP TABLE "delivery_address"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "country"`);
  }
}
