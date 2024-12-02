module.exports = (sequelize, Sequelize) => {
    const TipoIncidente = sequelize.define("tipoIncidente", {
        nombre: {
            type: Sequelize.STRING
        },
        ultimoCambioId: {
            type: Sequelize.INTEGER
        },
    });
    return TipoIncidente;
}