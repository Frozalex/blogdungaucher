Set-Location "c:\Users\lucda\OneDrive\Bureau\Projet\Website project\blog-gaucher"
$log = Join-Path $PSScriptRoot "_git_cmd.txt"
"" | Out-File -Encoding utf8 $log
git status 2>&1 | Out-File -Append -Encoding utf8 $log
git add -A 2>&1 | Out-File -Append -Encoding utf8 $log
git diff --cached --stat 2>&1 | Out-File -Append -Encoding utf8 $log
git commit -m "Fix: rendu mdast pour split Markdown (build) + deps hast-util-to-html" 2>&1 | Out-File -Append -Encoding utf8 $log
if ($LASTEXITCODE -eq 0) {
  git push origin main 2>&1 | Out-File -Append -Encoding utf8 $log
}
