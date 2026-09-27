param(
  [string]$OutputDirectory = 'backups'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
  throw 'Supabase CLI is required. Install it on the operator workstation, not in the application bundle.'
}

$root = (Get-Location).Path
$backupRoot = [IO.Path]::GetFullPath((Join-Path $root $OutputDirectory))
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$target = Join-Path $backupRoot $stamp
New-Item -ItemType Directory -Force -Path $target | Out-Null

& supabase db dump --linked --file (Join-Path $target 'schema.sql')
if ($LASTEXITCODE -ne 0) { throw 'Schema dump failed.' }

& supabase db dump --linked --data-only --file (Join-Path $target 'data.sql')
if ($LASTEXITCODE -ne 0) { throw 'Data dump failed.' }

& supabase db dump --linked --role-only --file (Join-Path $target 'roles.sql')
if ($LASTEXITCODE -ne 0) { throw 'Role dump failed.' }

Get-ChildItem -LiteralPath $target -File | Get-FileHash -Algorithm SHA256 |
  Select-Object Path, Hash | Format-Table -AutoSize
Write-Output "Backup written to $target. Keep it outside Git and test restoration in a separate non-production project."
