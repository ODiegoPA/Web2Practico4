module.exports = app => {
    const usuarioController = require("../controllers/usuario.controller.js");
    let router = require("express").Router();

    router.get("/", usuarioController.listUsuarios);
    router.get("/:id", usuarioController.getUsuarioById);
    router.post("/", usuarioController.createUsuario);
    router.put("/:id", usuarioController.updateUsuario);
    router.delete("/:id", usuarioController.deleteUsuario);
    router.post("/login", usuarioController.authUsuario);
    router.put("/password/:id", usuarioController.cambiarContrasena);
    app.use('/usuario', router);
}