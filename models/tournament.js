module.exports = (sequelize, DataTypes) => {
    const Tournament = sequelize.define('Tournament', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      }
    });
  
    return Tournament;
  };
  