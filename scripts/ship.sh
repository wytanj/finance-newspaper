#!/usr/bin/env bash
# Run on a machine where JT is logged into gh + vercel (or after `gh auth login` / `vercel login`).
set -euo pipefail
cd "$(dirname "$0")/.."
REPO="${REPO:-wytanj/finance-newspaper}"
VISIBILITY="${VISIBILITY:-public}"

if ! gh auth status >/dev/null 2>&1; then
  echo "Need: gh auth login"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "$REPO" --"$VISIBILITY" --source=. --remote=origin --description "JT personal daily/weekly macro finance newspaper"
  git push -u origin main
else
  git push -u origin HEAD
fi

# Open draft PR if we are not on default after first push of a feature branch
BRANCH=$(git branch --show-current)
DEFAULT=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
if [[ "$BRANCH" != "$DEFAULT" ]]; then
  gh pr create --draft --title "JT Finance Paper v1" --body "Daily + weekly newspaper, Yahoo markets, Vercel cron, voice distill from X." || true
fi

if vercel whoami >/dev/null 2>&1; then
  vercel --prod --yes
else
  echo "Skip Vercel: run vercel login then vercel --prod --yes"
  echo "Or import $REPO in the Vercel dashboard (personal account)."
fi
