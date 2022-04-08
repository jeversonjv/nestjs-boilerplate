import config from './database.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  ...config,
} as DataSourceOptions);
