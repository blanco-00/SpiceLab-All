#!/bin/bash
# 推送两个仓库到 GitHub 和 Gitee
# 用法: ./scripts/push-all.sh "commit message"

MSG="${1:-update}"

echo "=== Pushing SpiceLab-All (public) ==="
cd "$(dirname "$0")/.."
git add .
if git commit -m "$MSG"; then
    git push origin main
    git push gitee main
else
    echo "No changes to commit in SpiceLab-All"
fi

echo ""
echo "=== Pushing SpiceLab-Private ==="
cd SpiceLab-Private
git add .
if git commit -m "$MSG"; then
    git push origin main
    git push gitee main
else
    echo "No changes to commit in SpiceLab-Private"
fi

echo ""
echo "=== Done! ==="
