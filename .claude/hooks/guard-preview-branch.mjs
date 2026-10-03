#!/usr/bin/env node
//
// 비개발자가 Claude로 작업할 때 반드시 .claude/worktrees 아래의 preview/ 브랜치 워크트리에서만
// 파일을 고치고 커밋하게 강제하는 PreToolUse 훅이다.
//
// 이 훅은 .claude/settings.json에 등록되어 있어 기본으로 켜져 있다. 개발자는 개인 파일인
// .claude/settings.local.json에 아래처럼 적어 이 훅만 끌 수 있다. env 보호 훅(guard-env.mjs)은 꺼지지 않는다.
//
//   {
//     "env": { "FI_ADMIN_DEVELOPER": "1" }
//   }
//
// 막는 범위는 다음과 같다.
// - 이 저장소 안의 파일을 Edit/Write할 때, 그 파일이 .claude/worktrees/<이름>/ 아래에 있고
//   그 워크트리의 브랜치가 preview/로 시작하지 않으면 막는다. 메인 워킹 디렉토리는 항상 막는다.
// - 저장소의 .claude/hooks, .claude/scripts, .claude/settings.json은 워크트리 안이라도 막는다.
// - Bash의 git commit, merge, rebase, reset, cherry-pick은 preview/ 워크트리 안에서만 허용한다.
// - git push는 preview/ 브랜치로만 허용하고, force push와 develop, main으로의 push, gh pr merge는 막는다.
//
// 저장소 밖의 파일(스크래치패드, 메모리 등)은 검사하지 않는다.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.env.FI_ADMIN_DEVELOPER === '1') process.exit(0);


const GUIDE =
  '작업은 preview/ 브랜치 워크트리에서만 할 수 있습니다. 먼저 `bash .claude/scripts/new-preview-worktree.sh <영문-작업-이름>`을 실행해 ' +
  '.claude/worktrees/<작업-이름>/ 워크트리를 만들고, 그 안의 파일만 수정하십시오.';

const block = (reason) => {
  process.stderr.write(`preview 브랜치 규칙에 따라 차단했습니다. ${reason} ${GUIDE}\n`);
  process.exit(2);
};

const git = (cwd, ...args) => {
  try {
    return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

// 워크트리 안에서 Claude를 띄워도 메인 워킹 디렉토리를 기준으로 삼도록 git 공통 디렉토리에서 루트를 구한다.
const hookDir = dirname(fileURLToPath(import.meta.url));
const commonDir = git(hookDir, 'rev-parse', '--path-format=absolute', '--git-common-dir');
const ROOT = realpathSync(commonDir ? dirname(commonDir) : resolve(hookDir, '../..'));
const WORKTREES = resolve(ROOT, '.claude/worktrees');

const isInside = (child, parent) => {
  const rel = relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
};

// 아직 없는 경로면 존재하는 가장 가까운 상위 디렉토리까지만 심볼릭 링크를 풀고 나머지를 이어 붙인다.
const realPath = (path) => {
  let dir = path;
  while (!existsSync(dir)) dir = dirname(dir);
  return resolve(realpathSync(dir), relative(dir, path));
};
const existingDir = (path) => {
  let dir = path;
  while (!existsSync(dir)) dir = dirname(dir);
  return realpathSync(dir);
};

// 주어진 디렉토리가 이 저장소의 preview/ 워크트리 안이면 그 워크트리 경로를, 아니면 이유를 돌려준다.
const checkLocation = (dir) => {
  if (!isInside(dir, WORKTREES)) return { error: '메인 워킹 디렉토리에서는 작업할 수 없습니다.' };
  const top = git(dir, 'rev-parse', '--show-toplevel');
  if (!top || realpathSync(top) === ROOT) return { error: '워크트리 밖입니다.' };
  const branch = git(dir, 'rev-parse', '--abbrev-ref', 'HEAD');
  if (!branch.startsWith('preview/')) return { error: `현재 브랜치(${branch || '알 수 없음'})가 preview/로 시작하지 않습니다.` };
  return { top: realpathSync(top), branch };
};

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  block('훅 입력을 해석하지 못했습니다.');
}

const tool = input.tool_name ?? '';
const args = input.tool_input ?? {};
const cwd = input.cwd || process.cwd();

if (['Edit', 'MultiEdit', 'Write', 'NotebookEdit'].includes(tool)) {
  const target = realPath(resolve(cwd, String(args.file_path ?? args.notebook_path ?? '')));
  const dir = existingDir(dirname(target));
  // 저장소 밖 파일은 대상이 아니다.
  if (!isInside(dir, ROOT)) process.exit(0);

  const location = checkLocation(dir);
  if (location.error) block(location.error);

  const rel = relative(location.top, target);
  if (/^\.claude[\\/](hooks|scripts)([\\/]|$)/.test(rel) || /^\.claude[\\/]settings\.json$/.test(rel)) {
    block('Claude 보호 규칙 파일(.claude/hooks, .claude/scripts, .claude/settings.json)은 개발자만 수정합니다.');
  }
  process.exit(0);
}

if (tool === 'Bash') {
  const command = String(args.command ?? '');

  // 명령이 cd로 시작하면 그 경로를 git 명령의 실행 위치로 본다.
  const cdMatch = command.match(/^\s*cd\s+(?:"([^"]+)"|'([^']+)'|(\S+))\s*(?:&&|;)/);
  const runDir = existingDir(resolve(cwd, cdMatch ? (cdMatch[1] ?? cdMatch[2] ?? cdMatch[3]) : '.'));
  if (!isInside(runDir, ROOT)) process.exit(0);

  if (/\bgh\s+pr\s+merge\b/.test(command)) block('PR 머지는 개발자가 합니다.');

  if (/\bgit\s+(-C\s+\S+\s+)?push\b/.test(command)) {
    if (/\s(--force\S*|-f|--mirror|--delete|-d)\b|\s\+\S/.test(command)) block('강제 push와 브랜치 삭제는 할 수 없습니다.');
    if (/\b(develop|main|master)\b/.test(command)) block('develop, main으로는 push할 수 없습니다.');
    const location = checkLocation(runDir);
    if (location.error) block(location.error);
  }

  if (/\bgit\s+(-C\s+\S+\s+)?(commit|merge|rebase|reset|cherry-pick|revert)\b/.test(command)) {
    const location = checkLocation(runDir);
    if (location.error) block(location.error);
  }
}

process.exit(0);
