const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const bodyParser = require('body-parser');
const cors = require('cors');

const knex = require('knex');
const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	}
});

const bcrypt = require('bcrypt');

const root = require('./controllers/root');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// parse application/json
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

app.get('/', (req, res) => {
	root.handleRoot(res, db);
});

app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
});

// another way of calling the function
app.post('/signin', signin.handleSignin(db, bcrypt));

// get the user for their homepage
app.get('/profile/:id', (req, res) => {
	profile.handleProfile(req, res, db);
});

// update the user to increase their entries count every time they submit an image
app.put('/image', (req, res) => {
	image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
	image.handleApiCall(req, res);
});

app.listen(port, () => {
	console.log(`Server is running at http://127.0.0.1:${port}`);
});