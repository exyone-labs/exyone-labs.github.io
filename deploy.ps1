$ErrorActionPreference = "Stop"

Write-Host "Building Jekyll site..." -ForegroundColor Green
bundle exec jekyll build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green

Write-Host "Adding changes to git..." -ForegroundColor Green
git add .

$commitMessage = "Update site - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
    exit 0
}

Write-Host "Pushing to origin..." -ForegroundColor Green
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Deployment completed successfully!" -ForegroundColor Green
