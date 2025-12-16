#  Introduction

Goal of this project is to provide a UI for all my garmin activities which I have done so far.
For doing so the summary of the activities are store in a SqlLite database where the UI then connects to.

# Prerequsite

##Node.js must be installed 

On linux i used nvm
```
sudo apt update
sudo apt install -y curl wget build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 24
nvm use 24
```

## Python3 needs to be installed

## https://github.com/cyberjunky/python-garminconnect has to be available as node module




# Loading the data into the database

 ```
 python3 my-export.py
 node ./import-json-files.js
 ```

 This will create the data.db in the current folder. Please note that the export is done smart so only new activities are loaded. This is done in order to reduce the call to Garmin.
 The import into the DB is always done full - prior to loading the DB will be deleted. The whole import is so fast that this approach was choosen :-)

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


