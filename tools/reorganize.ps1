# PowerShell script to reorganize project structure
# Moves source code to 'source/' folder and build output to root directory

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "=== Project Structure Reorganization ===" -ForegroundColor Cyan
Write-Host "Project root: $projectRoot" -ForegroundColor Gray

# Define source files and folders to move
$sourceItems = @(
    "src",
    "public",
    "index.html",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "env.d.ts",
    "vite-env.d.ts",
    ".env.development",
    ".env.production",
    ".gitignore",
    "node_modules",
    "types"
)

# Create source directory
$sourceDir = Join-Path $projectRoot "source"
if (-not (Test-Path $sourceDir)) {
    New-Item -ItemType Directory -Path $sourceDir | Out-Null
    Write-Host "[Created] source/" -ForegroundColor Green
}

# Move items to source directory
Write-Host "`n[Moving] Source files to source/..." -ForegroundColor Yellow
foreach ($item in $sourceItems) {
    $sourcePath = Join-Path $projectRoot $item
    $destPath = Join-Path $sourceDir $item
    
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  Moved: $item" -ForegroundColor Gray
    }
}

# Clean up old dist folder if exists
$distDir = Join-Path $projectRoot "dist"
if (Test-Path $distDir) {
    Write-Host "`n[Cleaning] Removing old dist/ folder..." -ForegroundColor Yellow
    Remove-Item -Path $distDir -Recurse -Force
    Write-Host "  Removed: dist/" -ForegroundColor Gray
}

# Update vite.config.ts paths
Write-Host "`n[Updating] vite.config.ts..." -ForegroundColor Yellow
$viteConfigPath = Join-Path $sourceDir "vite.config.ts"
if (Test-Path $viteConfigPath) {
    $content = Get-Content $viteConfigPath -Raw
    
    # Update outDir to parent directory (root)
    $content = $content -replace "outDir:\s*['`"]dist['`"]", "outDir: '../'"
    $content = $content -replace "emptyOutDir:\s*true", "emptyOutDir: false"
    
    # Update alias path
    $content = $content -replace "'@':\s*fileURLToPath\(new URL\(['`"]\./src['`"], import\.meta\.url\)\)", "'@': fileURLToPath(new URL('./src', import.meta.url))"
    
    Set-Content -Path $viteConfigPath -Value $content -NoNewline
    Write-Host "  Updated: vite.config.ts" -ForegroundColor Gray
}

# Update tsconfig paths
Write-Host "`n[Updating] tsconfig files..." -ForegroundColor Yellow
$tsconfigAppPath = Join-Path $sourceDir "tsconfig.app.json"
if (Test-Path $tsconfigAppPath) {
    $content = Get-Content $tsconfigAppPath -Raw
    $content = $content -replace '"outDir":\s*"dist"', '"outDir": "../dist"'
    Set-Content -Path $tsconfigAppPath -Value $content -NoNewline
    Write-Host "  Updated: tsconfig.app.json" -ForegroundColor Gray
}

Write-Host "`n=== Reorganization Complete ===" -ForegroundColor Green
Write-Host @"

New structure:
  source/
    - src/           (Vue source code)
    - public/        (Static assets)
    - node_modules/  (Dependencies)
    - package.json   (Project config)
    - vite.config.ts (Build config)
    - ...            (Other source files)
  
  root/
    - index.html     (Built HTML)
    - assets/        (Built JS/CSS)
    - ...            (Other build outputs)

Next steps:
  1. cd source
  2. npm run build
  3. Build output will be in root directory

"@ -ForegroundColor Cyan
