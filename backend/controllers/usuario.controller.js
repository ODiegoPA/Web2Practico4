const db = require('../models');
const bcrypt = require('bcrypt');

exports.listUsuarios = async (req, res) => {
    try {
        const usuarios = await db.usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await db.usuario.findByPk(id);
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUsuario = async (req, res) => {
    try {
        // Validación y hashing de la contraseña
        if (!req.body.password) {
            return res.status(400).json({ message: 'La contraseña es requerida' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const usuario = {
            nombre: req.body.nombre,
            correo: req.body.email,
            contrasena: hashedPassword,
            esAdmin: req.body.esAdmin || false,
        };

        const usuarioCreado = await db.usuario.create(usuario);
        res.status(201).json(usuarioCreado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.authUsuario = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const usuario = await db.usuario.findOne({ where: { email } });

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    const id = req.params.id;

    try {
        const usuario = await db.usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualización de datos
        usuario.nombre = req.body.nombre || usuario.nombre;
        usuario.email = req.body.email || usuario.email;
        if (req.body.password) {
            usuario.password = await bcrypt.hash(req.body.password, 10);
        }
        usuario.ultimoCambioId = req.body.ultimoCambioId || usuario.ultimoCambioId;
        usuario.esAdmin = req.body.esAdmin || usuario.esAdmin;

        await usuario.save();
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUsuario = async (req, res) => {
    const id = req.params.id;

    try {
        const usuario = await db.usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
