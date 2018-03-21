module.exports = (sequelize,DataTypes) => {
    return sequelize.define("user",{
        name : DataTypes.STRING,
        licenseNumber : DataTypes.STRING
        // etc....
    },{
        classMethods: {

        }
    });
};