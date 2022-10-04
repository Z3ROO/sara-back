import dotenv from 'dotenv';
import {join} from 'path';
import {findRootDirSync} from './src/util/findRootDir';

const directory = findRootDirSync()
dotenv.config({
  path: join(directory,`${process.env.NODE_ENV}.env`)
})
