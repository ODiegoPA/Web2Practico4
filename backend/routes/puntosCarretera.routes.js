module.exports = app => {
    const puntosCarreteraController = require("../controllers/puntosCarretera.controller.js");
    let router = require("express").Router();

    router.get("/", puntosCarreteraController.listPuntosCarretera);
    router.get("/:id", puntosCarreteraController.getPuntosCarreteraById);
    router.get("/carretera/:id", puntosCarreteraController.getPuntosByCarreteraId);
    router.post("/", puntosCarreteraController.createPuntosCarretera);
    router.delete("/carretera/:id", puntosCarreteraController.deletePuntosCarreteraByCarreteraId);

    app.use('/puntosCarretera', router);
}