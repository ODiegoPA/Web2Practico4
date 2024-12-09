const db = require('../models');

exports.listCarreteras = async (req, res) => {
    try {
        const carreteras = await db.carretera.findAll({
            order: [['nombre', 'ASC']],
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
                {
                    model: db.usuario,
                    as: 'usuarioUltimoCambioCarretera',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json(carreteras);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.getCarreteraById = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await db.carretera.findByPk(id, {
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
                {
                    model: db.usuario,
                    as: 'usuarioUltimoCambioCarretera',
                    attributes: ['nombre']
                }
            ]
        });
        if (carretera) {
            res.status(200).json(carretera);
        } else {
            res.status(404).json({
                message: 'Carretera no encontrada'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getCarreterasByTipoIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const carreteras = await db.carretera.findAll({
            include: [
                {
                    model: db.incidentes,
                    as: 'incidentes',
                    where: { idTipoIncidente: id }
                },
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
                {
                    model: db.usuario,
                    as: 'usuarioUltimoCambioCarretera',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json(carreteras);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.verificarrEstadoCarretera = async (req, res) => { 
    const id = req.params.id;
    try {
        const incidentes = await db.incidentes.findAll({
            where: { idCarretera: id }
        });

        const estaBloqueada = incidentes.length > 0;
        console.log(incidentes);
        const carretera = await db.carretera.findByPk(id);
        if (carretera) {
            carretera.estaBloqueada = estaBloqueada;
            await carretera.save();
            res.status(200).json({
                message: `El estado de la carretera con ID ${id} fue actualizado.`,
                estaBloqueada
            });
        } else {
            res.status(404).json({
                message: 'Carretera no encontrada'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.createCarretera = async (req, res) => {
    try {
        const carretera = {
            nombre: req.body.nombre,
            estaBloqueada: req.body.estaBloqueada,
            idMunicipioOrigen: req.body.idMunicipioOrigen,
            idMunicipioDestino: req.body.idMunicipioDestino,
            ultimoCambioId: req.body.ultimoCambioId,
        }
        const carreteraCreada = await db.carretera.create(carretera);
        res.status(201).json(carreteraCreada);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.updateCarretera = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await db.carretera.findByPk(id);
        if (carretera) {
            carretera.nombre = req.body.nombre;
            carretera.estaBloqueada = req.body.estaBloqueada;
            carretera.idMunicipioOrigen = req.body.idMunicipioOrigen;
            carretera.idMunicipioDestino = req.body.idMunicipioDestino;
            carretera.ultimoCambioId = req.body.ultimoCambioId;
            await carretera.save();
            res.status(200).json(carretera);
        } else {
            res.status(404).json({
                message: 'Carretera no encontrada'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
exports.cambiarNombreCarretera = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await db.carretera.findByPk(id);
        if (carretera) {
            carretera.nombre = req.body.nombre;
            carretera.ultimoCambioId = req.body.ultimoCambioId;
            await carretera.save();
            res.status(200).json(carretera);
        } else {
            res.status(404).json({
                message: 'Carretera no encontrada'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
exports.deleteCarretera = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await db.carretera.findByPk(id);
        if (carretera) {
            await carretera.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({
                message: 'Carretera no encontrada'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
