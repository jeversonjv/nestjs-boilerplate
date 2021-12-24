import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Env } from '../shared/helpers/env.helper';

export const config: TypeOrmModuleOptions = {
  type: Env.getString('DB_TYPE') as any,
  host: Env.getString('DB_HOST'),
  port: Env.getNumber('DB_PORT'),
  username: Env.getString('DB_USER'),
  password: Env.getString('DB_PASS'),
  database: Env.getString('DB_NAME'),
  entities: [`${__dirname}/../modules/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  migrationsRun: true,
  synchronize: false,
};

export default config;
