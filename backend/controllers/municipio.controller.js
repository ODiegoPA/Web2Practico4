const db = require('../models');

exports.listMunicipios = async (req, res) => {
    try {
        const municipios = await db.municipio.findAll({
            order: [['nombre', 'ASC']]
        });
        res.status(200).json(municipios);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getMunicipioById = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await db.municipio.findByPk(id);
        if (municipio) {
            res.status(200).json(municipio);
        } else {
            res.status(404).json({
                message: 'Municipio no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
exports.createMunicipio = async (req, res) => {
    try{
        const municipio = {
            nombre: req.body.nombre,
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            ultimoCambioId: req.body.ultimoCambioId,
        }
        const municipioCreado = await db.municipio.create(municipio);
        res.status(201).json(municipioCreado);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
exports.updateMunicipio = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await db.municipio.findByPk(id);
        if (municipio) {
            municipio.nombre = req.body.nombre;
            municipio.latitud = req.body.latitud;
            municipio.longitud = req.body.longitud;
            municipio.ultimoCambioId = req.body.ultimoCambioId;
            await municipio.save();
            res.status(200).json(municipio);
        } else {
            res.status(404).json({
                message: 'Municipio no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
exports.deleteMunicipio = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await db.municipio.findByPk(id);
        if (municipio) {
            await municipio.destroy();
            res.status(200).json({
                message: 'Municipio eliminado'
            });
        } else {
            res.status(404).json({
                message: 'Municipio no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}