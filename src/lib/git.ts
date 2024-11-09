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
    const command = `git log --reverse --format="%ai" -- "${filePath}"`;
    const stdout = getFirstLine(execSync(command).toString().trim());

    if (!stdout) {
      return null;
    }

    return new Date(stdout);
  } catch (error) {
    console.error('Error fetching git commit time:', error);

    return null;
  }
}

function getFirstLine(str: string) {
  if (!str) return '';

  const lines = str.split('\n');

  return lines[0];
}
