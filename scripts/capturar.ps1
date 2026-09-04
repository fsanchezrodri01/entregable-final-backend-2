# Genera las paginas HTML de evidencia, las fotografia con Chrome/Edge headless y recorta el sobrante.
# Uso: powershell -ExecutionPolicy Bypass -File scripts/capturar.ps1
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "docs\capturas"
$work = Join-Path $env:TEMP "softwareai-capturas"

# Chrome maneja mejor las rutas con espacios que Edge, pero sirven los dos.
$navegadores = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
$navegador = $navegadores | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $navegador) {
  Write-Error "No se encontro Chrome ni Edge para tomar las capturas."
}

python (Join-Path $root "scripts\capturas.py")

New-Item -ItemType Directory -Force -Path $work | Out-Null

Get-ChildItem $dir -Filter *.html | ForEach-Object {
  $nombre = $_.BaseName
  # Se copia a una ruta sin espacios: el modo headless falla con algunas rutas largas.
  Copy-Item $_.FullName (Join-Path $work "$nombre.html") -Force
  & $navegador --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 `
    --screenshot="$work\$nombre.png" --window-size=1200,3000 "file:///$($work.Replace('\','/'))/$nombre.html" | Out-Null
  Copy-Item "$work\$nombre.png" (Join-Path $dir "$nombre.png") -Force
}

python (Join-Path $root "scripts\capturas.py") --recortar

Remove-Item $work -Recurse -Force
Write-Output "Capturas actualizadas en docs/capturas"
