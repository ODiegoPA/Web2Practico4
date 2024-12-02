module.exports = (sequelize, Sequelize) => {
    const Municipio = sequelize.define("municipio", {
        nombre: {
            type: Sequelize.STRING
        },
        latitud: {
            type: Sequelize.FLOAT
        },
        longitud: {
            type: Sequelize.FLOAT
        },
        ultimoCambioId: {
            type: Sequelize.INTEGER
        },
    });
    return Municipio;
}