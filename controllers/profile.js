const handleProfile = (req, res, db) => {
	const { id } = req.params;

	// select * from users where id = id
	db('users')
		.where({ id: id })
		.then(user => {
			user.length ?
				res.json(user[0])
			: res.status(404).json('not found');
		})
		.catch(err => res.status(404).json('Error getting user'));
};

module.exports = {
	handleProfile: handleProfile
};