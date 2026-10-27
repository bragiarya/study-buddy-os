# ============================================================
# Skrip Deploy Otomatis Study Buddy OS
# ============================================================
# CARA PENGGUNAAN:
# Sebelum menjalankan skrip ini, set environment variables berikut
# di terminal PowerShell kamu (JANGAN hardcode di sini):
#
#   $env:NEXT_PUBLIC_FIREBASE_API_KEY         = "xxx"
#   $env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN     = "xxx"
#   $env:NEXT_PUBLIC_FIREBASE_PROJECT_ID      = "xxx"
#   $env:NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  = "xxx"
#   $env:NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "xxx"
#   $env:NEXT_PUBLIC_FIREBASE_APP_ID          = "xxx"
#   $env:GEMINI_API_KEY                       = "xxx"
#
# Atau copy nilai-nilai di atas dari file .env.local kamu.
# ============================================================

# Validasi: pastikan semua variabel wajib sudah di-set
$requiredVars = @(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "GEMINI_API_KEY"
)

foreach ($varName in $requiredVars) {
    if (-not (Get-Item "env:$varName" -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: Environment variable '$varName' belum di-set!" -ForegroundColor Red
        Write-Host "Set terlebih dahulu sebelum menjalankan skrip ini." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "Semua environment variables valid. Memulai proses build ke Google Cloud..." -ForegroundColor Cyan

gcloud builds submit --tag asia-southeast2-docker.pkg.dev/study-buddy-os/study-buddy-repo/study-buddy-app `
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=$env:NEXT_PUBLIC_FIREBASE_API_KEY `
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN `
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=$env:NEXT_PUBLIC_FIREBASE_PROJECT_ID `
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$env:NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET `
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$env:NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID `
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=$env:NEXT_PUBLIC_FIREBASE_APP_ID `
  --build-arg GEMINI_API_KEY=$env:GEMINI_API_KEY

Write-Host "Build selesai! Melakukan deploy ke Cloud Run..." -ForegroundColor Green

gcloud run deploy study-buddy-os `
  --image asia-southeast2-docker.pkg.dev/study-buddy-os/study-buddy-repo/study-buddy-app `
  --platform managed `
  --region asia-southeast2 `
  --allow-unauthenticated

Write-Host "Deploy selesai!" -ForegroundColor Cyan