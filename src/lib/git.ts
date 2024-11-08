import { execSync } from 'node:child_process';

export function getLastGitUpdateTime(filePath: string): Date | null {
  try {
    // 执行 git log 命令获取最后一次提交的日期
    const command = `git log -1 --format="%ai" -- "${filePath}"`;
    const stdout = execSync(command).toString().trim();
    // 如果没有获取到日期，则返回 null

    if (!stdout) {
      return null;
    }
    // 将获取到的日期字符串转换为 Date 对象

    return new Date(stdout);
  } catch (error) {
    // 如果执行命令时出错（例如，文件未被跟踪或路径无效），返回 null
    console.error('Error fetching git commit time:', error);

    return null;
  }
}
