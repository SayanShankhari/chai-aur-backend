import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
	const [jokes, setJokes] = useState ([])

	useEffect(() => {
		axios.get ('/api/jokes')
			.then (response => {
				setJokes (response.data)
			})
			.catch (error => {
				console.error ('Error fetching jokes:', error)
			})
	}, []);

	return (
		<>
			<h1>Welcome to Chai aur Fullstack!</h1>
			<p>Jokes[{jokes.length}]:</p>
			{
				jokes.map((joke, _index) => (
					<div key={joke.id}>
						<h2>{joke.title}</h2>
						<p>{joke.punchline}</p>
					</div>
				))
			}
		</>
	)
}

export default App