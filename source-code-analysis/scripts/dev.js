// 打包packages下的模块,最终打包出js文件
//  node dev.js 要打包的名字 -f 打包的格式(esm)

import minimist from 'minimist';
import { resolve,dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// node中的命令行参数通过process argv获取
const args = minimist( process.argv.slice(2));
const target = args._[0] || "reactivity";// 要打包的模块

const formats = args.f || "iife";// 打包的格式 iife umd esm
console.log(target,formats);

// node中esm没有_driname
// 获取文件的绝对路径 
const __filename = fileURLToPath(import.meta.url);// 获取当前文件的绝对路径
const  __dirname = dirname(__filename); // 获取当前文件的目录
const require = createRequire(import.meta.url);
console.log(__filename,__dirname,require);

const entry = resolve(__dirname,'../packages/${target}/src/index.ts'); // 入口文件

