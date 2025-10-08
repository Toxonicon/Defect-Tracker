# Создание ярлыка для Windows Desktop
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Defect Tracker.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\start.bat"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.IconLocation = "shell32.dll,137"
$Shortcut.Description = "Запуск Defect Tracker одной кнопкой"
$Shortcut.Save()

Write-Host "✅ Ярлык создан на рабочем столе!" -ForegroundColor Green