@echo off
chcp 65001 >nul
title Defect Tracker - Быстрый запуск

echo.
echo 🚀 Defect Tracker - Быстрый запуск одной командой
echo ================================================
echo.

:: Переходим в директорию скрипта
cd /d "%~dp0"

:: Проверяем наличие Node.js
echo 🔍 Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не установлен! 
    echo 💡 Скачайте и установите Node.js с https://nodejs.org/
    echo 📋 Рекомендуемая версия: v20 LTS или новее
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js найден: %NODE_VERSION%

:: Останавливаем существующие процессы
echo.
echo 🔄 Остановка существующих процессов...
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 >nul

:: Проверяем и устанавливаем зависимости Backend
echo.
echo 🔧 Подготовка Backend...
cd /d "%~dp0\backend"
if not exist "node_modules" (
    echo 📦 Установка зависимостей Backend...
    call npm install --silent
    if errorlevel 1 (
        echo ❌ Ошибка установки зависимостей Backend!
        echo 💡 Попробуйте запустить: install.bat
        pause
        exit /b 1
    )
    echo ✅ Зависимости Backend установлены
) else (
    echo ✅ Зависимости Backend уже установлены
)

:: Проверяем и устанавливаем зависимости Frontend
echo.
echo 🎨 Подготовка Frontend...
cd /d "%~dp0\frontend"
if not exist "node_modules" (
    echo 📦 Установка зависимостей Frontend...
    call npm install --silent
    if errorlevel 1 (
        echo ❌ Ошибка установки зависимостей Frontend!
        echo 💡 Попробуйте запустить: install.bat
        pause
        exit /b 1
    )
    echo ✅ Зависимости Frontend установлены
) else (
    echo ✅ Зависимости Frontend уже установлены
)

:: Возвращаемся в корневую директорию
cd /d "%~dp0"

echo.
echo 🚀 Запуск сервисов...
echo ================================================

:: Запускаем Backend
echo 🔧 Запуск Backend (порт 3000)...
start "Defect Tracker Backend" /min cmd /c "cd /d %~dp0\backend && echo 🔧 Backend запускается... && npm run dev"

:: Ждем запуска Backend
echo ⏳ Ожидание запуска Backend (3 сек)...
timeout /t 3 >nul

:: Запускаем Frontend
echo 🎨 Запуск Frontend (порт 5173)...
start "Defect Tracker Frontend" /min cmd /c "cd /d %~dp0\frontend && echo 🎨 Frontend запускается... && npm run dev"

:: Ждем запуска Frontend
echo ⏳ Ожидание запуска Frontend (5 сек)...
timeout /t 5 >nul

echo.
echo 🎉 Запуск завершен!
echo ================================================
echo 🌐 Приложение должно быть доступно по адресам:
echo.
echo    📱 Frontend:  http://localhost:5173
echo    🔧 Backend:   http://localhost:3000
echo    📋 Health:    http://localhost:3000/api/health
echo.
echo 💡 Тестовые данные для входа:
echo    📧 Email:     test@example.com
echo    🔑 Password:  password
echo.
echo 🌐 Открываю браузер...
timeout /t 2 >nul
start http://localhost:5173

echo.
echo ✨ Готово! Если возникли проблемы:
echo    🔍 Запустите check.bat для диагностики
echo    🛑 Запустите stop.bat для остановки
echo.
echo ❌ Нажмите любую клавишу для выхода...
pause >nul