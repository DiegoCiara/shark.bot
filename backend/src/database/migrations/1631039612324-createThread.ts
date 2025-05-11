import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createThread1631039612324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'threads',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'contact',
            type: 'uuid',
          },
          {
            name: 'user',
            type: 'uuid',
          },
          {
            name: 'thread_id',
            isNullable: true,
            type: 'varchar',
          },
          {
            name: 'responsible',
            type: 'enum',
            enum: ['USER', 'ASSISTANT'], //Define quem está falando com o contato
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['OPEN', 'CLOSED'],
            default: `'OPEN'`,
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
      'threads',
      new TableForeignKey({
        columnNames: ['user'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'threads',
      new TableForeignKey({
        columnNames: ['contact'],
        referencedTableName: 'contacts',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('threads');
  }
}
