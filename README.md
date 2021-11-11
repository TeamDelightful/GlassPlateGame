# GlassPlateGame

**Joint effort by:** Anthony Chin, Christopher Tevren, Jerry Smedley, Kristin Bell, Matthew Nelson and Rochele Randall

## License
This work is made available under the "MIT License". Please see the file LICENSE in this distribution for license terms.

## Description
This repository contains a code base that allows a user to host Glass Plate Games (for more information on the Glass Plate Game, visit https://glassplategame.com/ ). 

## Build and Run
To run this program, access the folder via your terminal then enter 

    npm start

In order to change where to host the websocket, there are three places you need to change the code:

public/javascripts/gamejs.js  Line 9

public/javascripts/maingamejs.js Lines 3 & 10

bin/www Line 9

## Screenshots

![Home Page](https://github.com/jakira-bot/GlassPlateGame-1/blob/main/public/images/HomePage.png)
![Board Selection](https://github.com/jakira-bot/GlassPlateGame-1/blob/main/public/images/BoardSelection.png)
![Inital Board](https://github.com/jakira-bot/GlassPlateGame-1/blob/main/public/images/InitalBoard.jpg)

## Dependcies
├── bufferutil@4.0.5
├── clipboard@2.0.8
├── cookie-parser@1.4.5
├── cors@2.8.5
├── ejs@3.1.6
├── express-ws-routes@1.1.0
├── express@4.17.1
├── http-errors@1.8.0
├── http@0.0.1-security
├── morgan@1.10.0
├── node@16.10.0
├── nodemon@2.0.13
└── websocket@1.0.34
