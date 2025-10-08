@echo off
chcp 65001 >nul
title Defect Tracker - Остановка

echo.
echo 🛑 Остановка Defect Tracker...
echo ================================================
echo.

:: Останавливаем все процессы Node.js
echo 🔄 Остановка всех Node.js процессов...
taskkill /f /im node.exe >nul 2>&1

:: Ждем немного
timeout /t 2 >nul

:: Проверяем, что процессы остановлены
tasklist | find "node.exe" >nul
if errorlevel 1 (
    echo ✅ Все процессы успешно остановлены!
) else (
    echo ⚠️ Некоторые процессы могут быть еще активны
    echo 💡 Попробуйте закрыть окна терминалов вручную
)

echo.
echo 🎉 Остановка завершена!
echo ================================================
echo.
pause