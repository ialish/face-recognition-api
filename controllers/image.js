const Clarifai = require('clarifai');

// Instantiate a new Clarifai app by passing in my API key.
const app = new Clarifai.App({
	apiKey: 'ea60833320214105a2b1d40eaf9f6ef6'
});

const handleApiCall = (req, res) => {
	// Predict the contents of an image by passing in a URL.
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => res.json(data))
		.catch(err => res.status(400).json('Unable to work with API'));
};

const handleImage = (req, res, db) => {
	const { id } = req.body;

	db('users')
		.where({ id: id })
		.increment('entries', 1)
		.returning('entries')
		.then(entries => res.json(entries[0]))
		.catch(err => res.status(404).json('Error getting entries'));
};

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
};