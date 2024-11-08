import { execSync } from 'node:child_process';

export function getLastGitUpdateTime(filePath: string): Date | null {
  try {
    const command = `git log -1 --format="%ai" -- "${filePath}"`;
    const stdout = execSync(command).toString().trim();

    if (!stdout) {
      return null;
    }

    return new Date(stdout);
  } catch (error) {
    console.error('Error fetching git commit time:', error);

    return null;
  }
}

export function getFirstGitCommitTime(filePath: string): Date | null {
  try {
    const command = `git log --reverse -1 --format="%ai" -- "${filePath}"`;
    const stdout = execSync(command).toString().trim();

    if (!stdout) {
      return null;
    }

    return new Date(stdout);
  } catch (error) {
    console.error('Error fetching git first commit time:', error);

    return null;
  }
}
