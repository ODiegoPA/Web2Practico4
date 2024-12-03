module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        nombre: {
            type: Sequelize.STRING
        },
        correo: {
            type: Sequelize.STRING
        },
        contrasena: {
            type: Sequelize.STRING
        },
        esAdmin: {
            type: Sequelize.BOOLEAN
        },
        ultimoCambioId: {
            type: Sequelize.INTEGER
        },
    });
    return Usuario;
}