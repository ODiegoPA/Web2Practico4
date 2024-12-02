module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        correo: {
            type: Sequelize.STRING
        },
        contrasena: {
            type: Sequelize.STRING
        },
        ultimoCambioId: {
            type: Sequelize.INTEGER
        },
    });
    return Usuario;
}