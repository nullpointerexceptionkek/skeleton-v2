import fs from 'fs/promises';
import path from 'path';
import {compile} from '@mdx-js/mdx'

import { minimatch } from 'minimatch';
async function getMdxFiles(dir: string, pattern: string = "**/*.mdx"): Promise<string[]> {
    const mdxFiles: string[] = [];

    try {
        const files = await fs.readdir(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                // Recursively scan subdirectories
                const subDirFiles = await getMdxFiles(fullPath, pattern);
                mdxFiles.push(...subDirFiles);
            } else if (file.isFile() && minimatch(fullPath, pattern)) {
                // Collect .mdx files matching the pattern
                mdxFiles.push(fullPath);
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${dir}:`, err);
    }

    return mdxFiles;
}

function getComponentName(filePath: string): string | null {
    // Ensure the file is in the components directory
    if (minimatch(filePath, "**/content/docs/components/*/*.mdx")) {
        const parts = filePath.split(path.sep); // Split by OS-specific path separator
        const index = parts.indexOf("components");
        
        if (index !== -1 && index + 1 < parts.length) {
            return parts[index + 1]; // Extract the component name
        }
    }
    return null;
}

(async () => {
    const currentDir = process.cwd();
    const mdxFiles = await getMdxFiles(currentDir);

    const componentFiles = mdxFiles.filter((file) => minimatch(file, '**/content/docs/components/**/*.mdx'));

    const uniqueComponentNames = [...new Set(componentFiles.map(getComponentName).filter(Boolean))];

    console.log('Component Names:', uniqueComponentNames);

    if (componentFiles.length > 0) {
        const firstFile = componentFiles[2];
        try {
            const content = await fs.readFile(firstFile, 'utf-8');
            console.log(`\nContent of ${firstFile}:\n`, compile(content));
        } catch (err) {
            console.error(`Error reading file ${firstFile}:`, err);
        }
    } else {
        console.log("\nNo component MDX files found.");
    }
})();

