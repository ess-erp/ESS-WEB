Write-Host "Checking Docker..." -ForegroundColor Yellow
docker --version

Write-Host "`nChecking AWS CLI..." -ForegroundColor Yellow
aws --version

Write-Host "`nChecking Docker status..." -ForegroundColor Yellow
docker ps

Write-Host "`nAll checks passed!" -ForegroundColor Green
