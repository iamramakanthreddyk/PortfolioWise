@echo off
REM Portfolio Analyzer - Quick Launch Menu
REM Segregated app with EUR 2,000 default exemption

setlocal enabledelayedexpansion

:menu
cls
echo.
echo ============================================================
echo   PORTFOLIO ANALYZER - Germany Tax Edition
echo   Default: EUR 2,000 exemption (Couple Status)
echo ============================================================
echo.
echo Choose how to view your analysis:
echo.
echo   1) Terminal Summary (10 sec) - Quick overview
echo   2) HTML Reports (30 sec) - Beautiful formatted reports  
echo   3) Web Dashboard (20 sec) - Interactive scenario switching
echo   4) Open Report Folder - View files
echo   5) Exit
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" goto terminal
if "%choice%"=="2" goto html
if "%choice%"=="3" goto dashboard
if "%choice%"=="4" goto folder
if "%choice%"=="5" goto exit
goto menu

:terminal
cls
echo.
echo Generating terminal summary...
node portfolio_calculator.js
pause
goto menu

:html
cls
echo.
echo Generating HTML reports...
node report_generator.js
echo.
echo Reports created in: portfolio-analyzer\reports\
echo   - portfolio_analysis.html
echo   - scenario_comparison.html
echo.
pause
start "" explorer.exe "reports"
goto menu

:dashboard
cls
echo.
echo Starting web dashboard...
echo Opening browser to http://localhost:3000/dashboard
echo Press Ctrl+C to stop the dashboard
echo.
timeout /t 2
start "" http://localhost:3000/dashboard
node dashboard.js
goto menu

:folder
cls
explorer.exe "%CD%\reports"
goto menu

:exit
echo.
echo Thank you for using Portfolio Analyzer!
echo.
exit /b 0
