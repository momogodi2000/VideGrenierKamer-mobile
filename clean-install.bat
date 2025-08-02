@echo off
echo Cleaning up previous installation...

REM Remove node_modules and package-lock.json
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Clear npm cache
npm cache clean --force

REM Clear Expo cache
if exist .expo rmdir /s /q .expo

REM Clear Metro cache
if exist .metro-cache rmdir /s /q .metro-cache

echo Installing dependencies...
npm install --legacy-peer-deps

echo Installation complete!
pause 