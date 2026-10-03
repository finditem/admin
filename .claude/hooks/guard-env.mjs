#!/usr/bin/env node
//
// 환경 변수 파일(.env, .env.local 등)에 Claude가 접근하지 못하게 막는 PreToolUse 훅이다.
//
// 이 훅은 .claude/settings.json에 등록되어 있어 이 저장소에서 Claude Code를 쓰는 모든 사람에게
// 항상 켜져 있다. 개발자를 포함해 끄는 방법을 두지 않는다. env 값이 필요하면 사람이 직접 확인한다.
//
// 막는 범위는 다음과 같다.
// - Read, Edit, Write, Glob, Grep 등 파일 경로를 받는 도구에서 경로나 글롭이 .env 계열을 가리키는 경우
// - Bash 명령에 .env 계열 경로, dotenv, printenv, vercel env가 들어간 경우
// - Bash에서 --include 없이 grep을 재귀로 돌리는 경우(.gitignore를 무시하고 .env 내용까지 읽기 때문이다)
// - Bash에서 rg에 --no-ignore, --hidden, -u를 줘서 .gitignore 대상까지 읽는 경우
//
// 입력을 해석하지 못하면 통과시키지 않고 막는다(fail-closed).

import { readFileSync } from 'node:fs';

// 앞 글자가 경로 구분자나 따옴표, 공백 등일 때의 .env만 잡는다. process.env 같은 코드 표현은 걸리지 않는다.
const ENV_PATH = /(^|[\s/\\'"`=:<>|;&(){}[\],*~])\.env(?![A-Za-z0-9_])/;
const BASH_ONLY = [
  /\bdotenv\b/,
  /\bprintenv\b/,
  /\bvercel\s+env\b/,
  // cat .* 처럼 숨김 파일 전체를 펼치는 글롭
  /(^|[\s/'"])\.\*/,
  /\brg\b[^|;&]*\s(--no-ignore\S*|--hidden|-[A-Za-z]*u)\b/,
];
const RECURSIVE_GREP = /\b(e|f)?grep\b[^|;&]*\s(-[A-Za-z]*[rR][A-Za-z]*|--recursive|--dereference-recursive)\b/;

const block = (reason) => {
  process.stderr.write(
    `환경 변수 파일 보호 규칙에 따라 차단했습니다. ${reason} ` +
      '.env 계열 파일은 읽기, 수정, 복사, 검색 모두 Claude가 할 수 없습니다. 값이 필요하면 사용자에게 직접 확인해 달라고 요청하십시오.\n',
  );
  process.exit(2);
};

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  block('훅 입력을 해석하지 못했습니다.');
}

const tool = input.tool_name ?? '';
const args = input.tool_input ?? {};

if (tool === 'Bash') {
  const command = String(args.command ?? '');
  if (ENV_PATH.test(command)) block('명령에 .env 계열 경로가 들어 있습니다.');
  if (BASH_ONLY.some((re) => re.test(command))) block('환경 변수를 읽거나 숨김 파일을 펼치는 명령입니다.');
  for (const segment of command.split(/[|;&]/)) {
    if (RECURSIVE_GREP.test(segment) && !/--include\b/.test(segment)) {
      block('재귀 grep은 --include로 대상 확장자를 좁혀야 합니다(예: --include=\'*.ts\'). 또는 Grep 도구를 쓰십시오.');
    }
  }
  process.exit(0);
}

// Grep의 pattern은 파일 내용을 찾는 정규식이라 경로 검사에서 뺀다.
const pathKeys = ['file_path', 'path', 'notebook_path', 'glob'];
if (tool !== 'Grep') pathKeys.push('pattern');

const known = ['Read', 'Edit', 'MultiEdit', 'Write', 'NotebookEdit', 'Glob', 'Grep'];
const values = known.includes(tool)
  ? pathKeys.map((key) => args[key]).filter((v) => typeof v === 'string')
  : [JSON.stringify(args)];

for (const value of values) {
  if (ENV_PATH.test(value) || ENV_PATH.test(`/${value}`)) block(`${tool} 도구가 .env 계열 경로를 대상으로 합니다.`);
}

// .env를 읽는 스크립트를 써 두고 Bash로 실행하는 우회를 막는다. 설명 문서(.md)만 예외로 둔다.
const content = [args.content, args.new_string, args.new_source, ...(args.edits ?? []).map((e) => e?.new_string)]
  .filter((v) => typeof v === 'string')
  .join('\n');
if (!String(args.file_path ?? '').endsWith('.md') && ENV_PATH.test(content)) {
  block('작성하려는 내용에 .env 계열 경로가 들어 있습니다.');
}

process.exit(0);
