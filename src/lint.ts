import { $ } from 'bun';

try {
    // Execute Hadolint via Docker using the provided command
    const result =
        await $`docker run --rm -i --entrypoint=hadolint hadolint/hadolint --failure-threshold=error - < Dockerfile`
            .quiet()
            .nothrow();

    // Trim the output for a cleaner log message
    const output = result.text().trim();

    if (result.exitCode !== 0) {
        console.error(`Linting failed with exit code ${result.exitCode}:\n${output}`);
        // Optionally, exit the process with the Hadolint exit code
        process.exit(result.exitCode);
    } else {
        console.log(`Linting passed:\n${output}`);
    }
} catch (error) {
    console.error('An error occurred while running Hadolint:', error);
    process.exit(1);
}
