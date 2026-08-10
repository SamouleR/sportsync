$ErrorActionPreference = "Continue"

Write-Host "Création du dossier C:\src..."
New-Item -ItemType Directory -Force -Path "C:\src" | Out-Null

if (-not (Test-Path "C:\src\flutter")) {
    Write-Host "Téléchargement de Flutter (clone git depuis la branche stable)... Cela peut prendre quelques minutes."
    git clone https://github.com/flutter/flutter.git -b stable C:\src\flutter
} else {
    Write-Host "Le dossier Flutter existe déjà dans C:\src\flutter."
}

Write-Host "Ajout de Flutter à la variable d'environnement PATH..."
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notmatch "C:\\src\\flutter\\bin") {
    $newPath = $userPath + ";C:\src\flutter\bin"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Flutter a été ajouté au PATH."
} else {
    Write-Host "Flutter est déjà dans le PATH."
}

Write-Host "Lancement de flutter doctor (premier démarrage, cela va télécharger le SDK Dart)..."
# Setting path for this process so it finds flutter
$env:Path += ";C:\src\flutter\bin"
flutter doctor

Write-Host "L'installation est terminée !"
