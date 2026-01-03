# Setup script for Globe Trotter
Write-Host "=== Globe Trotter Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
$envPath = "backend\.env"
if (Test-Path $envPath) {
    Write-Host ".env file already exists in backend directory" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Skipping .env creation" -ForegroundColor Yellow
        exit
    }
}

# Get MySQL password
Write-Host "Enter your MySQL configuration:" -ForegroundColor Green
$dbPassword = Read-Host "MySQL Password (press Enter if no password)" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

# Create .env file
$envContent = @"
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$dbPasswordPlain
DB_NAME=globe_trotter
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_$(Get-Random -Minimum 1000 -Maximum 9999)
NODE_ENV=development
"@

Set-Content -Path $envPath -Value $envContent
Write-Host ""
Write-Host ".env file created successfully!" -ForegroundColor Green
Write-Host "Location: $envPath" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MySQL is running" -ForegroundColor White
Write-Host "2. Create the database: CREATE DATABASE globe_trotter;" -ForegroundColor White
Write-Host "3. Run the schema: mysql -u root -p globe_trotter < schema.sql" -ForegroundColor White
Write-Host "4. Restart the backend server" -ForegroundColor White

