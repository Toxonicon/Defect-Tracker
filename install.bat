@echo off
chcp 65001 >nul
title Defect Tracker - Установка зависимостей

echo.
echo 📦 Установка зависимостей Defect Tracker...
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

echo ✅ Node.js найден: 
node --version

:: Проверяем наличие npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не установлен!
    pause
    exit /b 1
)

echo ✅ npm найден: 
npm --version

:: Устанавливаем зависимости для backend
echo.
echo 🔧 Установка зависимостей Backend...
cd /d "%~dp0\backend"
call npm install
if errorlevel 1 (
    echo ❌ Ошибка установки зависимостей Backend!
    pause
    exit /b 1
)
echo ✅ Backend зависимости установлены!

:: Устанавливаем зависимости для frontend
echo.
echo 🎨 Установка зависимостей Frontend...
cd /d "%~dp0\frontend"
call npm install
if errorlevel 1 (
    echo ❌ Ошибка установки зависимостей Frontend!
    pause
    exit /b 1
)
echo ✅ Frontend зависимости установлены!

:: Возвращаемся в корневую директорию
cd /d "%~dp0"

echo.
echo 🎉 Все зависимости успешно установлены!
echo ================================================
echo 💡 Теперь запустите проект командой: start.bat
echo.
pause