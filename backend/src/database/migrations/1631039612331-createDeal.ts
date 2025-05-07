import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createDeal1631039612331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'deals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'pipeline',
            type: 'uuid',
          },
          {
            name: 'contact',
            type: 'uuid',
          },
          {
            name: 'workspace',
            type: 'uuid',
          },
          {
            name: 'product',
            type: 'uuid',
          },
          {
            name: 'partner',
            type: 'uuid',
          },
          {
            name: 'user',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['INPROGRESS', 'WON', 'LOST', 'PENDING', 'ARCHIVED'],
            default: `'INPROGRESS'`,
          },
          {
            name: 'value',
            type: 'float',
          },
          {
            name: 'observation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'deadline',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'activity',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'deals',
      new TableForeignKey({
        columnNames: ['pipeline'],
        referencedTableName: 'pipelines',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'deals',
      new TableForeignKey({
        columnNames: ['contact'],
        referencedTableName: 'contacts',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'deals',
      new TableForeignKey({
        columnNames: ['product'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'deals',
      new TableForeignKey({
        columnNames: ['partner'],
        referencedTableName: 'partners',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'deals',
      new TableForeignKey({
        columnNames: ['workspace'],
        referencedTableName: 'workspaces',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'deals',
      new TableForeignKey({
        columnNames: ['user'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('deals');
  }
}
