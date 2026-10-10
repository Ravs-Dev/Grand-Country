@echo off
setlocal EnableExtensions EnableDelayedExpansion

title GCR HUD - Check Database

echo ==============================================
echo   Grand Country Roleplay - Database Checker
echo ==============================================
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
echo Checking database %DB%...
echo.

if "%PASS%"=="" (
    "%MYSQL%" -u "%USER%" "%DB%" < "%~dp0check_database.sql"
) else (
    "%MYSQL%" -u "%USER%" -p"%PASS%" "%DB%" < "%~dp0check_database.sql"
)

if errorlevel 1 (
    echo.
    echo ERROR: Cannot check database.
    echo Open Laragon Terminal and run:
    echo mysql -u root qbcoredb ^< "%~dp0check_database.sql"
    echo.
    pause
    exit /b 1
)

echo.
echo Check completed.
pause
