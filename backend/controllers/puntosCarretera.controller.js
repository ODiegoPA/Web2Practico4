const db = require('../models');

exports.listPuntosCarretera = async (req, res) => {
    try {
        const puntosCarrera = await db.puntosCarretera.findAll();
        res.status(200).json(puntosCarrera);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getPuntosCarreteraById = async (req, res) => {
    const id = req.params.id;
    try {
        const puntosCarrera = await db.puntosCarretera.findByPk(id);
        if (puntosCarrera) {
            res.status(200).json(puntosCarrera);
        } else {
            res.status(404).json({
                message: 'PuntosCarrera no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getPuntosByCarreteraId = async (req, res) => {
    const id = req.params.id;
    try {
        const puntosCarrera = await db.puntosCarretera.findAll({
            where: {
                idCarretera: id
            }
        });
        if (puntosCarrera) {
            res.status(200).json(puntosCarrera);
        } else {
            res.status(404).json({
                message: 'PuntosCarrera no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.createPuntosCarretera = async (req, res) => {
    try{
        const puntosCarretera = {
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            idCarretera: req.body.idCarretera,
        }
        const puntosCarreraCreado = await db.puntosCarretera.create(puntosCarretera);
        res.status(201).json(puntosCarreraCreado);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.deletePuntosCarreteraByCarreteraId = async (req, res) => {
    const id = req.params.id;
    try {
        const puntosCarrera = await db.puntosCarretera.destroy({
            where: {
                idCarretera: id
            }
        });
        if (puntosCarrera) {
            res.status(200).json(puntosCarrera);
        } else {
            res.status(404).json({
                message: 'PuntosCarrera no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}



