const handleRoot = (res, db) => {
	db('users')
		.select()
		.then(users => res.json(users));
};

module.exports = {
	handleRoot: handleRoot
};