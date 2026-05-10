@echo off
setlocal
set "ROOT=c:\Users\lucda\OneDrive\Bureau\Projet\Website project"
set "BG=%ROOT%\blog-gaucher"
set "LOG=%BG%\.git-push-log.txt"
cd /d "%BG%"

echo === 1. git rev-parse (parent: Website project) ===> "%LOG%"
git -C "%ROOT%" rev-parse --show-toplevel 2>&1 >> "%LOG%"
echo. >> "%LOG%"
echo === 2. git status (blog-gaucher) ===>> "%LOG%"
git status 2>&1 >> "%LOG%"
echo. >> "%LOG%"
echo Parent folder is NOT a git repo; only blog-gaucher is. >> "%LOG%"
echo. >> "%LOG%"
echo === 3. git add -A ===>> "%LOG%"
git add -A 2>&1 >> "%LOG%"
echo. >> "%LOG%"
echo === 4. git status --short ===>> "%LOG%"
git status --short > "%BG%\_status_short.tmp" 2>&1
type "%BG%\_status_short.tmp" >> "%LOG%"
echo. >> "%LOG%"
for %%I in ("%BG%\_status_short.tmp") do if %%~zI equ 0 (
  echo === 5. Commit skipped: nothing to commit ===>> "%LOG%"
  set DIDCOMMIT=0
) else (
  echo === 5. git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" ===>> "%LOG%"
  git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" -m "Sync: mise ? jour du projet (commit utilisateur)" 2>&1 >> "%LOG%"
  set DIDCOMMIT=1
)
del "%BG%\_status_short.tmp" 2>nul
echo. >> "%LOG%"
echo === 6. git branch --show-current ===>> "%LOG%"
for /f "tokens=*" %%b in ('git branch --show-current') do set BR=%%b
echo %BR% >> "%LOG%"
echo. >> "%LOG%"
echo === 7. git push origin %BR% ===>> "%LOG%"
git push origin %BR% 2>&1 >> "%LOG%"
echo. >> "%LOG%"
echo === push finished (errorlevel %ERRORLEVEL%) ===>> "%LOG%"
if "%DIDCOMMIT%"=="1" (
  echo. >> "%LOG%"
  echo === HEAD after commit ===>> "%LOG%"
  git rev-parse HEAD 2>&1 >> "%LOG%"
)
endlocal
