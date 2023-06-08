module.exports = (sequelize, Sequelize) => {
	var User_Transaction = sequelize.define("user", {
		name: {
			type: Sequelize.STRING
		},
		role_id: {
			type: Sequelize.TEXT
		},
		email: {
			type: Sequelize.TEXT
		},
		accessToken: {
			type: Sequelize.TEXT
		},
		password: {
			type: Sequelize.TEXT
		},
		createdAt: {
			type: Sequelize.DATE
		},
		updatedAt: {
			type: Sequelize.DATE
		}
	});

	return User_Transaction;
};