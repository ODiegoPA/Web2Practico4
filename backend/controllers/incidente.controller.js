const db = require('../models');
const path = require('path');
const fs = require('fs');


exports.listIncidentes = async (req, res) => {
    try {
        const incidentes = await db.incidentes.findAll({
            where: {
                estaConfirmada: true
            },
            include: [
                {
                    model: db.carretera,
                    as: 'carretera',
                    include: [
                        {
                            model: db.municipio,
                            as: 'municipioOrigen',
                        },
                        {
                            model: db.municipio,
                            as: 'municipioDestino',
                        },
                        {
                            model: db.puntosCarretera,
                            as: 'puntosCarretera',
                            attributes: ['latitud', 'longitud']
                        },
                    ],
                },
                {
                    model: db.tipoIncidente,
                    as: 'tipoIncidente',
                    attributes: ['nombre']
                },
                {
                    model: db.usuario,
                    as: 'usuarioUltimoCambioIncidente',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json(incidentes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
exports.getIncidentesSinConfirmar = async (req, res) => {
    try {
        const incidentes = await db.incidentes.findAll({
            where: {
                estaConfirmada: false
            },
            include: [
                {
                    model: db.carretera,
                    as: 'carretera',
                    include: [
                        {
                            model: db.municipio,
                            as: 'municipioOrigen',
                        },
                        {
                            model: db.municipio,
                            as: 'municipioDestino',
                        },
                    ],
                },
                {
                    model: db.tipoIncidente,
                    as: 'tipoIncidente',
                    attributes: ['nombre']
                },
                {
                    model: db.usuario,
                    as: 'usuarioUltimoCambioIncidente',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json(incidentes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
exports.getIncidenteById = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await db.incidentes.findByPk(id, {
            include: [
                {
                    model: db.carretera,
                    as: 'carretera',
                    include: [
                        {
                            model: db.municipio,
                            as: 'municipioOrigen',
                        },
                        {
                            model: db.municipio,
                            as: 'municipioDestino',
                        },
                    ],
                },
                {
                    model: db.tipoIncidente,
                    as: 'tipoIncidente',
                    attributes: ['nombre']
                },
                {
                    model: db.usuario,
                    as: 'usuarioUltimoCambioIncidente',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json(incidente);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getIncidenteByCarreteraId = async (req, res) => {
    const carreteraId = req.params.id;
    try {
        const incidentes = await db.incidentes.findAll({
            where: {
                idCarretera: carreteraId,
                estaConfirmada: true
            },
            include: [
                {
                    model: db.carretera,
                    as: 'carretera',
                    include: [
                        {
                            model: db.municipio,
                            as: 'municipioOrigen',
                        },
                        {
                            model: db.municipio,
                            as: 'municipioDestino',
                        },
                    ],
                },
                {
                    model: db.tipoIncidente,
                    as: 'tipoIncidente',
                    attributes: ['nombre']
                },
            ]
        });
        res.status(200).json(incidentes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


exports.confirmarIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await db.incidentes.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ message: 'Incidente no encontrado' });
        }
        incidente.estaConfirmada = true;
        incidente.latitud = req.body.latitud;
        incidente.longitud = req.body.longitud;
        incidente.ultimoCambioId = req.body.ultimoCambioId;

        await incidente.save();
        res.status(200).json(incidente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.createIncidente = async (req, res) => {
    const image = req.files.photo;
    try{
        const incidente = {
            estaConfirmada: req.body.estaConfirmada,
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            idTipoIncidente: req.body.idTipoIncidente,
            ultimoCambioId: req.body.ultimoCambioId,
            idCarretera: req.body.idCarretera
        }
        const incidenteCreado = await db.incidentes.create(incidente);
        const path =  __dirname + '/../public/images/incidentes/' + incidenteCreado.id + '.jpg';
        image.mv(path, (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({
                    message: error.message
                });
            }
        });
        res.status(201).json(incidenteCreado);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
exports.updateIncidente = async (req, res) => {
    const id = req.params.id;
    const photo = req.files ? req.files.photo : null;
    try{
        const incidente = await db.incidentes.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ message: "El incidente no existe." });
        }

        incidente.estaConfirmada = req.body.estaConfirmada;
        incidente.latitud = req.body.latitud;
        incidente.longitud = req.body.longitud;
        incidente.ultimoCambioId = req.body.ultimoCambioId;
        incidente.idCarretera = req.body.idCarretera;
        incidente.idTipoIncidente = req.body.idTipoIncidente;
        if (photo) {
            const path =  __dirname + '/../public/images/incidentes/' + incidente.id + '.jpg';
            photo.mv(path, function(err){
                if (err) {
                    return res.status(500).json({error: err});
                }
            });
        }
        await incidente.save();
        res.status(200).json(incidente);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getImagenIncidente = async (req, res) => {
    const id = req.params.id;
    const imagePath =  path.join(__dirname + '/../public/images/incidentes/' + id + '.jpg');

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({
                message: 'Imagen no encontrada',
            });
        }
        res.sendFile(imagePath);
    });
}
exports.deleteIncidente = async (req, res) => {
    const id = req.params.id;
    try{
        const incidente = await db.incidentes.findByPk(id);
        if (!incidente){
            res.status(404).json({
                message: 'Incidente no encontrado'
            });
        }
        await incidente.destroy();
        res.status(200).json();
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
