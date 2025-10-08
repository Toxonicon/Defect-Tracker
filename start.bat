@echo off
chcp 65001 >nul
title Defect Tracker - Запуск

echo.
echo 🚀 Запуск Defect Tracker...
echo ================================================
echo.

:: Переходим в директорию скрипта
cd /d "%~dp0"

:: Проверяем наличие Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не установлен! Установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

:: Проверяем наличие npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не установлен!
    pause
    exit /b 1
)

:: Проверяем наличие папок
if not exist "frontend" (
    echo ❌ Папка frontend не найдена!
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Папка backend не найдена!
    pause
    exit /b 1
)

:: Останавливаем существующие процессы Node.js
echo 🔄 Остановка существующих процессов...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

:: Проверяем и устанавливаем зависимости для backend
echo 📦 Проверка зависимостей Backend...
cd /d "%~dp0\backend"
if not exist "node_modules" (
    echo 🔧 Установка зависимостей Backend...
    call npm install
    if errorlevel 1 (
        echo ❌ Ошибка установки зависимостей Backend!
        pause
        exit /b 1
    )
)

:: Проверяем и устанавливаем зависимости для frontend
echo 📦 Проверка зависимостей Frontend...
cd /d "%~dp0\frontend"
if not exist "node_modules" (
    echo 🎨 Установка зависимостей Frontend...
    call npm install
    if errorlevel 1 (
        echo ❌ Ошибка установки зависимостей Frontend!
        pause
        exit /b 1
    )
)

:: Возвращаемся в корневую директорию
cd /d "%~dp0"

:: Запускаем бэкенд в отдельном окне
echo 🔧 Запуск Backend (http://localhost:3000)...
start "Defect Tracker - Backend" cmd /c "cd /d %~dp0\backend && npm run dev & pause"

:: Ждем немного
timeout /t 5 >nul

:: Запускаем фронтенд в отдельном окне  
echo 🎨 Запуск Frontend (http://localhost:5173)...
start "Defect Tracker - Frontend" cmd /c "cd /d %~dp0\frontend && npm run dev & pause"

:: Ждем запуска
echo ⏳ Ожидание запуска сервисов...
timeout /t 8 >nul

echo.
echo 🎉 Defect Tracker запущен!
echo ================================================
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3000  
echo 📋 API Docs: http://localhost:3000/api/health
echo.
echo 💡 Для входа используйте любые данные:
echo    📧 Email: test@example.com
echo    🔑 Password: password
echo.
echo 🌐 Открываю браузер...

:: Открываем браузер
timeout /t 2 >nul
start http://localhost:5173

echo.
echo ✨ Готово! Приложение запущено.
echo ❌ Закройте это окно или нажмите любую клавишу для выхода
pause >nul