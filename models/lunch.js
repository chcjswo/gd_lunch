/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('lunch', {
		lunch_date: {
			type: DataTypes.STRING(100),
			allowNull: false,
			primaryKey: true
		},
		restaurant_name: {
			type: DataTypes.STRING(100),
			allowNull: false
		}
	}, {
		tableName: 'lunch',
		timestamps: false
	});
};
