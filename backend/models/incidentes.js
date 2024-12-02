module.exports = (sequelize, Sequelize) => {
    const Incidentes = sequelize.define("incidentes", {
        estaConfirmada: {
            type: Sequelize.BOOLEAN
        },
        latitud: {
            type: Sequelize.FLOAT
        },
        longitud: {
            type: Sequelize.FLOAT
        },
        tipoId: {
            type: Sequelize.INTEGER
        },
        ultimoCambioId: {
            type: Sequelize.INTEGER
        },
    });
    return Incidentes;
}