/* eslint-disable no-console */
import inquirer from 'inquirer';
import fs from 'fs';
import { execa } from 'execa';
import * as dotenv from 'dotenv';
import { spawn } from 'node:child_process';
dotenv.config();

const nodeArgs = process.argv.map((val) => {
  return val;
});

interface Args {
  clientID: string;
  clientSecret: string;
}

async function getArgs(): Promise<Args> {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'clientID',
      message: 'Enter your client ID',
    },
    {
      type: 'input',
      name: 'clientSecret',
      message: 'Enter your client Secret',
    },
  ]);
}

async function createEnv(args: Args): Promise<void> {
  fs.writeFile('.env', `CLIENT_ID=${args.clientID}\nCLIENT_SECRET=${args.clientSecret}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function main(): Promise<void> {
  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    const args = await getArgs();
    await createEnv(args);
    console.log('Created .env file with given ID and secret');
  } else {
    console.log('Using ID and Secret found in .env');
  }
  if (nodeArgs.includes('--usertest')) {
    spawn('yarn', ['user-auth']).stdout.pipe(process.stdout);
  }
}

main();
