const db = require("../models");

exports.listTipoIncidentes = async (req, res) => {
    try {
        const tipoIncidente = await db.tipoIncidente.findAll({
            order: [['nombre', 'ASC']],
            include: [
                {
                    model: db.usuario,
                    as: 'usuarioUltimoCambioTipoIncidente',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json(tipoIncidente);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getTipoIncidenteById = async (req, res) => {
    const id = req.params.id;
    try {
        const tipoIncidente = await db.tipoIncidente.findByPk(id, {
            include: [
                {
                    model: db.usuario,
                    as: 'usuarioUltimoCambioTipoIncidente',
                    attributes: ['nombre']
                }
            ]
        });
        if (tipoIncidente) {
            res.status(200).json(tipoIncidente);
        } else {
            res.status(404).json({
                message: 'TipoIncidente no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.createTipoIncidente = async (req, res) => {
    try{
        const tipoIncidente = {
            nombre: req.body.nombre,
            ultimoCambioId: req.body.ultimoCambioId,
        }
        const tipoIncidenteCreado = await db.tipoIncidente.create(tipoIncidente);
        res.status(201).json(tipoIncidenteCreado);
    } catch {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateTipoIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const tipoIncidente = await db.tipoIncidente.findByPk(id);
        if (tipoIncidente) {
            tipoIncidente.nombre = req.body.nombre;
            tipoIncidente.ultimoCambioId = req.body.ultimoCambioId;
            await tipoIncidente.save();
            res.status(200).json(tipoIncidente);
        } else {
            res.status(404).json({
                message: 'TipoIncidente no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.deleteTipoIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const tipoIncidente = await db.tipoIncidente.findByPk(id);
        if (tipoIncidente) {
            await tipoIncidente.destroy();
            res.status(200).json({
                message: 'TipoIncidente eliminado'
            });
        } else {
            res.status(404).json({
                message: 'TipoIncidente no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}