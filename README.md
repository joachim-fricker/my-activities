#  Introduction

Goal of this project is to provide a UI for all my garmin activities which i have done so far.
For doing so the summary of the activities are store in a SqlLite database where the UI then connects to.

# Prerequsite

The garmin activities have to be exported by https://github.com/petergardfjall/garminexport. The activities have to be stored in the curent folder.

garmin-backup --password XXXX joachim_fricker@yahoo.com -f json_summary

Node.js must be installed see https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows for installing on windows

On linux i used nvm
```
sudo apt update
sudo apt install -y curl wget build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 24
nvm use 24

```

# Loading the data into the database

 ``node ./import-json-files.js``

 This will create the data.db in the current folder

https://sqlitebrowser.org/  is a great tool for viewing and analyzing the database                                          

# Data Cleanup
My first garmin watch had no skitouring activities. In my case these have been recorded as "other" activities. As part of the loading these will be converted to "backcountry_skiing".

This processing can be switched off by passing -n or -nocleanup as command line parameter.

# Screenshot of the UI

## Yearly Summary
![Yearly Summary](https://github.com/joachim-fricker/my-activities/blob/master/uiScreenshot/Summary.png?raw=true)

## All Activities
![All Activities](https://github.com/joachim-fricker/my-activities/blob/master/uiScreenshot/AllActivities.png?raw=true)

## World Map

![World Map ](https://github.com/joachim-fricker/my-activities/blob/master/uiScreenshot/WorldMap.png?raw=true)

# Starting 

For the moment only the dev setup is supported and the backend and frontend has to be startet separatly

## start the backend

`` 
cd  backend; node server.js
`` 

## start the frontend

`` 
cd my-ativities-viewer;npm run dev
`` 
## open UI

`` http://localhost:5173 ``


