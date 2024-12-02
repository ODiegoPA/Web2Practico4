module.exports = (sequelize, Sequelize) => {
    const Carretera = sequelize.define("carretera", {
        nombre: {
            type: Sequelize.STRING
        },
        estaBloqueada: {
            type: Sequelize.BOOLEAN
        },
        latitud: {
            type: Sequelize.FLOAT
        },
        longitud: {
            type: Sequelize.FLOAT
        },
        idMunicipioOrigen: {
            type: Sequelize.INTEGER
        },
        idMunicipioDestino: {
            type: Sequelize.INTEGER
        },
        incidenteId: {
            type: Sequelize.INTEGER
        },
        ultimoCambioId: {
            type: Sequelize.INTEGER
        },
    });
    return Carretera;
}