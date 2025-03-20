import path from 'node:path';
import config from "./config.ts";
import { $ } from "bun";
import fs from 'fs-extra';

const ROOT = path.resolve('.')
const sharedDirPath = path.resolve(ROOT, config.localSharedDirName)
const configDirPath = path.resolve(ROOT, 'config')

console.info(`Fetching shared files from ${config.sharedRepoUrl}...`);

console.info(`First, clearing ${sharedDirPath} and ${configDirPath}`);
await fs.remove(sharedDirPath);
await fs.remove(configDirPath);

console.info(`Next, cloning the repo`);
await $`git clone --depth=1 ${config.sharedRepoUrl} ${sharedDirPath}`;

console.log("Copying necessary files...")
await fs.mkdir(configDirPath)
// # Copy Python dependencies
await $`cp ${sharedDirPath}/python/requirements.txt ${configDirPath}/requirements.txt`
// # Copy Docker CI-related files into the `config/` directory
await $`cp -R ${sharedDirPath}/docker/ci/* ${configDirPath}`

console.info("Cleaning up...");
await fs.remove(sharedDirPath);

console.info("Shared files updated!");
