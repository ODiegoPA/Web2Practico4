module.exports = (app) => {
    require('./tipoIncidente.routes')(app);
    require('./municipio.routes')(app);
    require('./carretera.routes')(app);
    require('./puntosCarretera.routes')(app);
    require('./incidente.routes')(app);
    require('./usuario.routes')(app);
    
}