@ECHO off

::verify compiler present
IF NOT EXIST ~compiler.jar GOTO missingcompiler

::check needed files exist
IF NOT EXIST ~header.js GOTO missingfile
IF NOT EXIST ~footer.js GOTO missingfile
IF NOT EXIST ~wrapperStart.js GOTO missingfile
IF NOT EXIST ~wrapperEnd.js GOTO missingfile

::compile all needed files
CALL iancoleman_bip39\~build.bat Y

::verify files exist
IF NOT EXIST bip39.min.js GOTO missingfile

::compile files to 1 file
IF EXIST ~~temp.js DEL ~~temp.js
::                                                                                                     
COPY /b ~header.js + bip39.min.js + ~footer.js ..\libraries.min.js 1>NUL
DEL bip39.min.js
IF NOT EXIST ..\libraries.min.js GOTO failed
ECHO Success


PAUSE
GOTO endBuild


::Compiler Missing
:missingcompiler
ECHO Failed: Google Closure Compiler missing.
PAUSE
GOTO endBuild

::Show generic error message
:missingfile
ECHO Failed: Needed file was missing
PAUSE
GOTO endBuild

::Expected output file missing
:failed
ECHO Failed: Couldn't create digiQR.min.js
PAUSE

:endBuild