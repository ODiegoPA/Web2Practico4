module.exports = app => {
    const carreteraController = require("../controllers/carretera.controller.js");
    let router = require("express").Router();

    router.get("/", carreteraController.listCarreteras);
    router.get("/:id", carreteraController.getCarreteraById);
    router.post("/", carreteraController.createCarretera);
    router.put("/:id", carreteraController.updateCarretera);
    router.delete("/:id", carreteraController.deleteCarretera);
    router.put("/verificar/:id", carreteraController.verificarrEstadoCarretera);
    app.use('/carretera', router);
}