$ws = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')

$s1 = $ws.CreateShortcut("$desktop\NUR Finance Bloomberg Terminal.lnk")
$s1.TargetPath = "npx.cmd"
$s1.Arguments = "electron c:\Users\mfn\OneDrive\Desktop\Umay_Gul_Nur"
$s1.WorkingDirectory = "c:\Users\mfn\OneDrive\Desktop\Umay_Gul_Nur"
$s1.Save()

$s2 = $ws.CreateShortcut("$desktop\NUR Finance Reuters Terminal.lnk")
$s2.TargetPath = "npx.cmd"
$s2.Arguments = "electron c:\Users\mfn\OneDrive\Desktop\Umay_Gul_Nur"
$s2.WorkingDirectory = "c:\Users\mfn\OneDrive\Desktop\Umay_Gul_Nur"
$s2.Save()

Write-Host "SHORTCUTS CREATED ON DESKTOP"
