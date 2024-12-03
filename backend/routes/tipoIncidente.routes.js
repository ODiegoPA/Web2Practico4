module.exports = app => {
    const tipoIncidenteController = require("../controllers/tipoIncidente.controller.js");
    let router = require("express").Router();

    router.get("/", tipoIncidenteController.listTipoIncidentes);
    router.get("/:id", tipoIncidenteController.getTipoIncidenteById);
    router.post("/", tipoIncidenteController.createTipoIncidente);
    router.put("/:id", tipoIncidenteController.updateTipoIncidente);
    router.delete("/:id", tipoIncidenteController.deleteTipoIncidente);

    app.use('/tipoIncidente', router);
}