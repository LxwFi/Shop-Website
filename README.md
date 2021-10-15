## Dependencies required

Running "npm i" downloads all the dependencies but below are the ones listed incase that does not work
 
* express
* handlebars 
* express-handlebars
* sqlite3
* @handlebars/allow-prototype-access
* dotenv (you can skip this one)

**Below dependencies are for if you want to run tests in "index.test.js"**

* jest
* supertest
* @types/jest

## How to run the website

Running the website on your local machine is super simple, simply download the project or clone it to your machine using "git clone https://github.com/LxwFi/Shop-Website", then do "node .\index.js" (you can write "node i" and hit tab) and hit enter, now you are hosting the website on localhost:3000 (port can be changed at the top), and to access it you put the same link (localhost:3000) into your browser

## Features

* When a category is added via the items page, it is displayed on the nav bar
* Persistent shopping cart when the website is closed
* "Buy" feature that removes items from the database after being bought
* Admin panel with login to add products and change descriptions

## Key notes

* In "Index.js" on line 14 change the name of the file you are using for your database
* Set your own port for localhost if you want to change it on line 4
* Below is the structure for inputting your own items using POST requests
*   {"title": "",  "price": num,   "description": "",   "category": "",   "image": ""  }
* If you want to run tests put "npm run test" in the terminal
* Make sure to change the password in the index file to whatever you want it to be


## Design decisions

We decided to focus on function over form, and because we were constantly adding features we decided it would be easier to just make the website minimalistic so that if we ever needed to implement something it would go smoothly. It also just looks nice being more minimal

## Database Design

![alt text](https://i.ibb.co/jgLFYHP/diagram.png)

## Roles and responsibilities 

**Back end**
* Tymoteusz (LxwFi) - Express + bug testing
* William - Database manager + supertest

**Front End**
* Peace & Jamie - Together did the entire HTML, Handlebars and CSS programming



