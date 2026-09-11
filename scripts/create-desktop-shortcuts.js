import path from "path";
import fs from "fs";

function createWindowsShortcut(shortcutPath, targetPath, args, iconPath) {
  const vbsScript = `
Set ws = CreateObject("WScript.Shell")
Set shortcut = ws.CreateShortcut("${shortcutPath.replace(/\\/g, "\\\\")}")
shortcut.TargetPath = "${targetPath.replace(/\\/g, "\\\\")}"
shortcut.Arguments = "${args}"
shortcut.IconLocation = "${iconPath.replace(/\\/g, "\\\\")}"
shortcut.WorkingDirectory = "${path.dirname(targetPath).replace(/\\/g, "\\\\")}"
shortcut.Save()
`;
  const scriptPath = path.join(process.env.TEMP || "C:\\Temp", "make_shortcut.vbs");
  fs.writeFileSync(scriptPath, vbsScript, "utf8");
  require("child_process").execSync(`cscript //Nologo "${scriptPath}"`);
  try { fs.unlinkSync(scriptPath); } catch (e) {}
}

const desktopPath = path.join(process.env.USERPROFILE, "Desktop");
const projectDir = "c:\\Users\\mfn\\OneDrive\\Desktop\\Umay_Gul_Nur";
const nodeExe = process.execPath; // or npx/npm command

console.log("Masaüstü kısayolları hazırlanıyor...");
