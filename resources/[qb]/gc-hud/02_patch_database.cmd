@echo off
setlocal EnableExtensions EnableDelayedExpansion

title GCR HUD - Patch Metadata

echo ==============================================
echo   Grand Country Roleplay - HUD DB Patch
echo ==============================================
echo.
echo This patch does NOT add or delete QBCore columns.
echo It only adds missing HUD keys inside players.metadata.
echo Existing metadata values are preserved.
echo.

set "MYSQL=mysql"
if exist "C:\laragon\bin\mysql" (
    for /f "delims=" %%D in ('dir /b /ad /o-n "C:\laragon\bin\mysql\mysql-*" 2^>nul') do (
        if exist "C:\laragon\bin\mysql\%%D\bin\mysql.exe" (
            set "MYSQL=C:\laragon\bin\mysql\%%D\bin\mysql.exe"
            goto :mysql_found
        )
    )
)

:mysql_found
set "DB=qbcoredb"
set "USER=root"
set /p DBINPUT=Database name [qbcoredb]: 
if not "%DBINPUT%"=="" set "DB=%DBINPUT%"
set /p PASS=MySQL password [ENTER if empty]: 

echo.
echo Applying metadata patch to %DB%...
echo.

if "%PASS%"=="" (
    "%MYSQL%" -u "%USER%" "%DB%" < "%~dp0database_patch.sql"
) else (
    "%MYSQL%" -u "%USER%" -p"%PASS%" "%DB%" < "%~dp0database_patch.sql"
)

if errorlevel 1 (
    echo.
    echo ERROR: Patch failed.
    echo Open Laragon Terminal and run:
    echo mysql -u root qbcoredb ^< "%~dp0database_patch.sql"
    echo.
    pause
    exit /b 1
)

echo.
echo Database metadata patch completed successfully.
pause
