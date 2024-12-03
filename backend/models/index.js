const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.municipio = require("./municipio.js")(sequelize, Sequelize);
db.carretera = require("./carretera.js")(sequelize, Sequelize);
db.tipoIncidente = require("./tipoIncidente.js")(sequelize, Sequelize);
db.incidentes = require("./incidentes.js")(sequelize, Sequelize);
db.puntosCarretera = require("./puntosCarretera.js")(sequelize, Sequelize);
db.usuario = require("./usuario.js")(sequelize, Sequelize);

//carretera y municipios
db.municipio.hasMany(db.carretera, {
    foreignKey: "idMunicipioOrigen",
    as: "carreterasOrigen",
});
db.municipio.hasMany(db.carretera, {
    foreignKey: "idMunicipioDestino",
    as: "carreterasDestino",
});
db.carretera.belongsTo(db.municipio, {
    foreignKey: "idMunicipioOrigen",
    as: "municipioOrigen",
});
db.carretera.belongsTo(db.municipio, {
    foreignKey: "idMunicipioDestino",
    as: "municipioDestino",
});

//puntos de carretera
db.carretera.hasMany(db.puntosCarretera, {
    foreignKey: "idCarretera",
    as: "puntosCarretera",
});
db.puntosCarretera.belongsTo(db.carretera, {
    foreignKey: "idCarretera",
    as: "carretera",
});

//tipoincidentes
db.tipoIncidente.hasMany(db.incidentes, {
    foreignKey: "idTipoIncidente",
    as: "incidentes",
});
db.incidentes.belongsTo(db.tipoIncidente, {
    foreignKey: "idTipoIncidente",
    as: "tipoIncidente",
});

//carreteras e incidentes

db.carretera.hasMany(db.incidentes, {
    foreignKey: "idCarretera",
    as: "incidentes",
});
db.incidentes.belongsTo(db.carretera, {
    foreignKey: "idCarretera",
    as: "carretera",
});

//usuariosUltimoCambio

// Usuarios último cambio
db.usuario.hasMany(db.municipio, {
    foreignKey: "ultimoCambioId",
    as: "municipiosUltimoCambio", // Alias único
});
db.municipio.belongsTo(db.usuario, {
    foreignKey: "ultimoCambioId",
    as: "usuarioUltimoCambio", // Alias único
});

db.usuario.hasMany(db.carretera, {
    foreignKey: "ultimoCambioId",
    as: "carreterasUltimoCambio", // Alias único
});
db.carretera.belongsTo(db.usuario, {
    foreignKey: "ultimoCambioId",
    as: "usuarioUltimoCambioCarretera", // Alias único
});

db.usuario.hasMany(db.tipoIncidente, {
    foreignKey: "ultimoCambioId",
    as: "tipoIncidentesUltimoCambio", // Alias único
});
db.tipoIncidente.belongsTo(db.usuario, {
    foreignKey: "ultimoCambioId",
    as: "usuarioUltimoCambioTipoIncidente", // Alias único
});

db.usuario.hasMany(db.incidentes, {
    foreignKey: "ultimoCambioId",
    as: "incidentesUltimoCambio", // Alias único
});
db.incidentes.belongsTo(db.usuario, {
    foreignKey: "ultimoCambioId",
    as: "usuarioUltimoCambioIncidente", // Alias único
});

db.usuario.hasMany(db.usuario, {
    foreignKey: "ultimoCambioId",
    as: "usuariosUltimoCambio", // Alias único
});
db.usuario.belongsTo(db.usuario, {
    foreignKey: "ultimoCambioId",
    as: "usuarioUltimoCambioUsuario", // Alias único
});

module.exports = db;



