import { $ } from 'bun';
import prettyBytes from 'pretty-bytes';
import config from './config.ts';
import type DockerInspectType from './types/DockerInspectType.ts';

const branchName = (await $`git rev-parse --abbrev-ref HEAD`.quiet().text()).trim();
const branchTag = branchName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

console.log(`Building Docker image with tag: ${branchTag}`);
try {
    const buildOutput = await $`docker build -t ${config.imageName}:${branchTag} .`.quiet();
} catch (e) {
    console.error(`Failed to build: ${(e as Error).message}`);
    console.error(e);
}
// Retrieve detailed info about the newly built image using docker inspect
const inspectOutput = await $`docker inspect ${config.imageName}:${branchTag}`.quiet().text();
const inspectData: DockerInspectType = JSON.parse(inspectOutput)[0];

// Create a simplified summary object from the inspection data
const imageSummary = {
    repository: config.imageName,
    tag: branchTag,
    id: inspectData.Id,
    created: new Date(inspectData.Created).toLocaleString(),
    size: prettyBytes(inspectData.Size),
};

console.log('Just built Docker image summary:');
console.log(imageSummary);
