#!/usr/bin/env bash
#
# 최신 origin/preview에서 work/<작업-이름> 브랜치를 만들고 .claude/worktrees/<작업-이름>/에
# 워크트리로 체크아웃한다. 비개발자가 Claude로 작업을 시작할 때 Claude가 이 스크립트를 실행한다.
#
#   bash .claude/scripts/new-preview-worktree.sh notice-banner-text
#
# 새 워크트리에는 gitignore 대상인 환경 변수 파일과 next-env.d.ts가 없으므로 메인 워킹 디렉토리에서
# 복사한다. 복사만 하고 내용은 출력하지 않는다. Claude는 이 파일들을 직접 다룰 수 없으므로
# (.claude/hooks/guard-env.mjs) 복사는 이 스크립트에서만 한다.
set -euo pipefail

name="${1:-}"
if ! [[ "$name" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "작업 이름은 영문 소문자, 숫자, 하이픈으로만 적어 주십시오. 예: notice-banner-text" >&2
  exit 1
fi

root=$(cd "$(dirname "$0")/../.." && pwd)
dir="$root/.claude/worktrees/$name"
# 저장소에 preview 브랜치가 있으면 git이 preview/<이름> 브랜치를 만들 수 없으므로 work/를 쓴다.
branch="work/$name"

if [ -e "$dir" ]; then
  echo "이미 있는 워크트리입니다: $dir" >&2
  exit 1
fi
if git -C "$root" show-ref --verify --quiet "refs/heads/$branch"; then
  echo "이미 있는 브랜치입니다: $branch" >&2
  exit 1
fi

git -C "$root" fetch --quiet origin preview
git -C "$root" worktree add --quiet --no-track -b "$branch" "$dir" origin/preview

copied=0
for file in "$root"/.env* "$root/next-env.d.ts"; do
  [ -f "$file" ] || continue
  cp "$file" "$dir/"
  copied=$((copied + 1))
done

echo "워크트리를 만들었습니다."
echo "  경로: $dir"
echo "  브랜치: $branch"
echo "  설정 파일 ${copied}개를 메인 워킹 디렉토리에서 복사했습니다."
echo "화면을 확인하려면 터미널에서 이 경로로 이동해 pnpm dev를 직접 실행해 주십시오."
