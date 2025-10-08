#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = (message, color = colors.white) => {
  console.log(`${color}${message}${colors.reset}`);
};

const projectRoot = __dirname;
const isWindows = process.platform === 'win32';

log('🚀 Запуск Defect Tracker...', colors.green);
log('='.repeat(50), colors.cyan);

// Проверяем наличие папок
const frontendPath = path.join(projectRoot, 'frontend');
const backendPath = path.join(projectRoot, 'backend');

if (!fs.existsSync(frontendPath)) {
  log('❌ Папка frontend не найдена!', colors.red);
  process.exit(1);
}

if (!fs.existsSync(backendPath)) {
  log('❌ Папка backend не найдена!', colors.red);
  process.exit(1);
}

// Функция для запуска процесса
const startProcess = (command, args, cwd, name) => {
  log(`🔄 Запуск ${name}...`, colors.blue);
  
  const child = spawn(command, args, {
    cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWindows
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`[${name}] ${data}`);
  });

  child.on('error', (error) => {
    log(`❌ Ошибка запуска ${name}: ${error.message}`, colors.red);
  });

  return child;
};

// Останавливаем существующие процессы
const killNodeProcesses = () => {
  return new Promise((resolve) => {
    log('🔄 Остановка существующих процессов...', colors.yellow);
    
    const killCommand = isWindows 
      ? 'taskkill /f /im node.exe'
      : 'pkill -f node';
    
    exec(killCommand, (error) => {
      // Игнорируем ошибки, если процессы не найдены
      setTimeout(resolve, 2000);
    });
  });
};

// Проверка доступности сервиса
const checkService = (url, name) => {
  return new Promise((resolve) => {
    const http = require('http');
    const urlObj = new URL(url);
    
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      timeout: 5000
    }, (res) => {
      if (res.statusCode === 200) {
        log(`✅ ${name} работает: ${url}`, colors.green);
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
};

// Открытие браузера
const openBrowser = (url) => {
  const command = isWindows ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = isWindows ? ['', url] : [url];
  
  spawn(command, args, { shell: true, detached: true });
};

// Главная функция
const main = async () => {
  try {
    // Останавливаем существующие процессы
    await killNodeProcesses();

    // Запускаем бэкенд
    log('🔧 Запуск Backend (http://localhost:3000)...', colors.green);
    const backendProcess = startProcess('npm', ['run', 'dev'], backendPath, 'Backend');

    // Ждем немного
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Запускаем фронтенд
    log('🎨 Запуск Frontend (http://localhost:5173)...', colors.green);
    const frontendProcess = startProcess('npm', ['run', 'dev'], frontendPath, 'Frontend');

    // Ждем запуска сервисов
    log('⏳ Ожидание запуска сервисов...', colors.yellow);
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Проверяем сервисы
    log('🔍 Проверка сервисов...', colors.cyan);
    
    const backendWorking = await checkService('http://localhost:3000/api/health', 'Backend');
    const frontendWorking = await checkService('http://localhost:5173', 'Frontend');

    if (!backendWorking) {
      log('⚠️  Backend может быть еще запускается...', colors.yellow);
    }
    
    if (!frontendWorking) {
      log('⚠️  Frontend может быть еще запускается...', colors.yellow);
    }

    console.log('');
    log('🎉 Defect Tracker запущен!', colors.green);
    log('='.repeat(50), colors.cyan);
    log('📱 Frontend: http://localhost:5173', colors.blue);
    log('🔧 Backend:  http://localhost:3000', colors.blue);
    log('📋 API Docs: http://localhost:3000/api/health', colors.blue);
    console.log('');
    log('💡 Для входа используйте любые данные:', colors.cyan);
    log('   📧 Email: test@example.com', colors.white);
    log('   🔑 Password: password', colors.white);
    console.log('');
    
    log('🌐 Открываю браузер...', colors.yellow);
    setTimeout(() => openBrowser('http://localhost:5173'), 2000);

    log('✨ Готово! Приложение запущено.', colors.green);
    log('❌ Нажмите Ctrl+C для остановки', colors.red);

    // Обработка завершения
    const cleanup = () => {
      log('🔄 Остановка сервисов...', colors.yellow);
      
      if (backendProcess && !backendProcess.killed) {
        backendProcess.kill('SIGTERM');
      }
      
      if (frontendProcess && !frontendProcess.killed) {
        frontendProcess.kill('SIGTERM');
      }
      
      setTimeout(() => {
        log('✅ Все сервисы остановлены.', colors.green);
        process.exit(0);
      }, 2000);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
  } catch (error) {
    log(`❌ Ошибка: ${error.message}`, colors.red);
    process.exit(1);
  }
};

main();