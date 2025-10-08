#!/usr/bin/env pwsh

# Defect Tracker - Запуск всего проекта одной командой
# Этот скрипт запускает и фронтенд, и бэкенд одновременно

Write-Host "🚀 Запуск Defect Tracker..." -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

# Переходим в корневую директорию проекта
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Write-Host "📂 Корневая директория: $ProjectRoot" -ForegroundColor Yellow

# Проверяем наличие папок
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Папка frontend не найдена!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "backend")) {
    Write-Host "❌ Папка backend не найдена!" -ForegroundColor Red
    exit 1
}

# Функция для запуска процесса в фоне
function Start-BackgroundProcess {
    param(
        [string]$WorkingDirectory,
        [string]$Command,
        [string]$Arguments,
        [string]$Name
    )
    
    Write-Host "🔄 Запуск $Name..." -ForegroundColor Blue
    
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = $Command
    $processInfo.Arguments = $Arguments
    $processInfo.WorkingDirectory = $WorkingDirectory
    $processInfo.UseShellExecute = $false
    $processInfo.CreateNoWindow = $false
    
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $processInfo
    $process.Start()
    
    return $process
}

# Останавливаем существующие процессы Node.js
Write-Host "🔄 Остановка существующих процессов..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
} catch {
    # Игнорируем ошибки если процессы не найдены
}

# Запускаем бэкенд
Write-Host "🔧 Запуск Backend (http://localhost:3000)..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "cmd" -ArgumentList "/c", "cd /d `"$ProjectRoot\backend`" && npm run dev" -PassThru -WindowStyle Minimized

# Ждем немного для запуска бэкенда
Start-Sleep -Seconds 3

# Запускаем фронтенд
Write-Host "🎨 Запуск Frontend (http://localhost:5173)..." -ForegroundColor Green
$frontendProcess = Start-Process -FilePath "cmd" -ArgumentList "/c", "cd /d `"$ProjectRoot\frontend`" && npm run dev" -PassThru -WindowStyle Minimized

# Ждем запуска сервисов
Write-Host "⏳ Ожидание запуска сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Проверяем доступность сервисов
Write-Host "🔍 Проверка сервисов..." -ForegroundColor Cyan

# Проверка бэкенда
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get -TimeoutSec 10
    if ($backendResponse.success) {
        Write-Host "✅ Backend работает: http://localhost:3000" -ForegroundColor Green
        Write-Host "   📊 Статус БД: $($backendResponse.database)" -ForegroundColor Gray
        Write-Host "   🔧 Режим: $($backendResponse.mode)" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  Backend может быть еще запускается..." -ForegroundColor Yellow
}

# Проверка фронтенда
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend работает: http://localhost:5173" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend может быть еще запускается..." -ForegroundColor Yellow
}

Write-Host "" 
Write-Host "🎉 Defect Tracker запущен!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Blue
Write-Host "🔧 Backend:  http://localhost:3000" -ForegroundColor Blue
Write-Host "📋 API Docs: http://localhost:3000/api/health" -ForegroundColor Blue
Write-Host "" 
Write-Host "💡 Для входа используйте любые данные:" -ForegroundColor Cyan
Write-Host "   📧 Email: test@example.com" -ForegroundColor Gray
Write-Host "   🔑 Password: password" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Открываю браузер..." -ForegroundColor Yellow

# Открываем браузер
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

Write-Host "✨ Готово! Приложение запущено." -ForegroundColor Green
Write-Host "❌ Для остановки нажмите Ctrl+C" -ForegroundColor Red

# Ожидаем прерывания для закрытия
try {
    Write-Host "⏳ Нажмите Ctrl+C для остановки..." -ForegroundColor Yellow
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "🔄 Остановка сервисов..." -ForegroundColor Yellow
    
    # Останавливаем процессы
    if ($backendProcess -and !$backendProcess.HasExited) {
        $backendProcess.Kill()
    }
    if ($frontendProcess -and !$frontendProcess.HasExited) {
        $frontendProcess.Kill()
    }
    
    # Останавливаем все Node.js процессы
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    Write-Host "✅ Все сервисы остановлены." -ForegroundColor Green
}