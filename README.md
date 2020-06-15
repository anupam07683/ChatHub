# ***ChatHub***
This is a real-time chat application developed using express, react.js, socket.io ,mongoose.
Messaging will be real-time( using socket.io) i.e. need not to refresh page to send or receive chat messages 
A user can signup, login then can chat with any of the other user registered on this application.
For user authentication purpose _passport.js_  is used 

## ***Getting Started***

download the project files or clone using
```
git clone https://github.com/anupam07683/ChatHub.git
```

### ***Prerequisites***
1. express<br>
2. node.js<br>
3. react.js<br>
4. mongodb<br>

### ***Installing***
```
cd chathub
yarn install

cd server
npm install
```

### ***Running Application***

Open the project directory and run the following commands to run the project on the local environment.

```
yarn start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
```
node server/app 
    or
cd server
npm start
```
runs the server at [http://localhost:8000](http://localhost:8000)
You will also see any <br />errors in the console.

signup at [http://localhost:3000/signup](http://localhost:3000/singup)
### ***Built With***
* react.js
* node.js
* mongodb ( database)
* socket.io (npm module)
* express ( framework)
* redux


### ***Quick Tour of application***
![alt login](/public/screenshots/login.png)

![alt signup](/public/screenshots/signup.png)

![alt chat](/public/screenshots/chatting.png)