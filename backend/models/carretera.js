module.exports = (sequelize, Sequelize) => {
    const Carretera = sequelize.define("carretera", {
        nombre: {
            type: Sequelize.STRING
        },
        estaBloqueada: {
            type: Sequelize.BOOLEAN
        },
        idMunicipioOrigen: {
            type: Sequelize.INTEGER
        },
        idMunicipioDestino: {
            type: Sequelize.INTEGER
        },
        ultimoCambioId: {
            type: Sequelize.INTEGER
        },
    });
    return Carretera;
}