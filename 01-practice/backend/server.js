import express from 'express';
import cors from 'cors';
import jokes from './jokes.js';

const port = process.env.PORT || 3000;

const app = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use (cors());

app.listen (port, () => {
	console.log (`Server is running on port ${port}`);
});

app.get ('/', (_request, response) => {
	response.send ('Hello from the backend!');
});

app.get ('/api/jokes', (_request, response) => {
	response.json (jokes);
});