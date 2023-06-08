module.exports = (sequelize, Sequelize) => {
	var Role_Transaction = sequelize.define("role", {
		role_name: {
			type: Sequelize.STRING
		},
		created: {
			type: Sequelize.DATE
		},
		updated: {
			type: Sequelize.DATE
		}
	});

	return Role_Transaction;
};