module.exports = (sequelize, Sequelize) => {
    const PuntosCarretera = sequelize.define("puntosCarretera", {
        latitud: {
            type: Sequelize.FLOAT
        },
        longitud: {
            type: Sequelize.FLOAT
        },
        idCarretera: {
            type: Sequelize.INTEGER
        },
    });
    return PuntosCarretera;
}