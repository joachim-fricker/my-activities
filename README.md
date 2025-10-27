#  Introduction

Goal of this project is to provide a UI for all my garmin activities which i have done so far.
For doing so the summary of the activities are store in a SqlLite database where the UI then connects to.

# Prerequsite

The garmin activities have to be exported by https://github.com/petergardfjall/garminexport. The activities have to be stored in the curent folder.

garmin-backup --password XXXX joachim_fricker@yahoo.com -f json_summary

Node.js must be installed see https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows for installing on windows

# Loading the data into the database

 ``node ./import-json-files.js``

 This will create the data.db in the current folder

https://sqlitebrowser.org/  is a great tool for viewing and analyzing the database                                          

# Data Cleanup
My first garmin watch had no skitouring activities. In my case these have been recorded as "other" activities. As part of the loading these will be converted to "backcountry_skiing".

This processing can be switched off by passing -n or -nocleanup as command line parameter.