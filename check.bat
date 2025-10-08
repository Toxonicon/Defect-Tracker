@echo off
chcp 65001 >nul
title Defect Tracker - Проверка системы

echo.
echo 🔍 Проверка системы Defect Tracker...
echo ================================================
echo.

:: Переходим в директорию скрипта
cd /d "%~dp0"

set "errors=0"

:: Проверяем Node.js
echo 🔧 Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не установлен!
    set /a errors+=1
) else (
    echo ✅ Node.js установлен: 
    node --version
)

:: Проверяем npm
echo.
echo 📦 Проверка npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не установлен!
    set /a errors+=1
) else (
    echo ✅ npm установлен: 
    npm --version
)

:: Проверяем структуру папок
echo.
echo 📁 Проверка структуры проекта...
if not exist "frontend" (
    echo ❌ Папка frontend не найдена!
    set /a errors+=1
) else (
    echo ✅ Папка frontend найдена
)

if not exist "backend" (
    echo ❌ Папка backend не найдена!
    set /a errors+=1
) else (
    echo ✅ Папка backend найдена
)

:: Проверяем зависимости backend
echo.
echo 🔧 Проверка зависимостей Backend...
if not exist "backend\node_modules" (
    echo ⚠️ Зависимости Backend не установлены
    echo 💡 Запустите: install.bat
    set /a errors+=1
) else (
    echo ✅ Зависимости Backend установлены
)

:: Проверяем зависимости frontend
echo.
echo 🎨 Проверка зависимостей Frontend...
if not exist "frontend\node_modules" (
    echo ⚠️ Зависимости Frontend не установлены
    echo 💡 Запустите: install.bat
    set /a errors+=1
) else (
    echo ✅ Зависимости Frontend установлены
)

:: Проверяем файлы конфигурации
echo.
echo ⚙️ Проверка конфигурационных файлов...
if not exist "backend\package.json" (
    echo ❌ backend\package.json не найден!
    set /a errors+=1
) else (
    echo ✅ backend\package.json найден
)

if not exist "frontend\package.json" (
    echo ❌ frontend\package.json не найден!
    set /a errors+=1
) else (
    echo ✅ frontend\package.json найден
)

:: Проверяем доступность портов
echo.
echo 🌐 Проверка портов...
netstat -an | find "3000" | find "LISTENING" >nul
if not errorlevel 1 (
    echo ⚠️ Порт 3000 уже занят! (Backend)
    echo 💡 Остановите процесс или измените порт
)

netstat -an | find "5173" | find "LISTENING" >nul
if not errorlevel 1 (
    echo ⚠️ Порт 5173 уже занят! (Frontend)
    echo 💡 Остановите процесс или измените порт
)

:: Итоговый результат
echo.
echo ================================================
if %errors% equ 0 (
    echo 🎉 Система готова к запуску!
    echo 💡 Запустите проект командой: start.bat
) else (
    echo ❌ Найдено ошибок: %errors%
    echo 💡 Исправьте ошибки перед запуском
)
echo ================================================
echo.
pause