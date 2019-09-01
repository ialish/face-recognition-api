const saltRounds = 10; // for the bcrypt

const handleRegister = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json('Incorrect form submission');
	}

	bcrypt.hash(password, saltRounds, function (err, hash) {
		// Storing hash in `login` DB
		db.transaction(trx => {
			trx('login')
				.insert({
					hash: hash,
					email: email
				})
				.returning('email')
				.then(async loginEmail => {
					const user = await trx('users')
						// insert into `users` (name, ...) values (name, ...)
						.insert({
							name: name,
							email: loginEmail[0],
							joined: new Date()
						})
						// return all columns by the insert
						.returning('*');
					return res.json(user[0]);
				})
				.then(trx.commit)
				.catch(trx.rollback);
		}).catch(err => res.status(400).json('Unable to register'));
	});
};

module.exports = {
	handleRegister: handleRegister
};