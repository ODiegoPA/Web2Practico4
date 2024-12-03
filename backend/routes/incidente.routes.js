module.exports = (app) => {
  const incidenteController = require("../controllers/incidente.controller.js");
  let router = require("express").Router();

  router.get("/", incidenteController.listIncidentes);
  router.get("/:id", incidenteController.getIncidenteById);
  router.get("/carretera/:id", incidenteController.getCarreteraByIncidenteId);
  router.post("/", incidenteController.createIncidente);
  router.get("/foto/:id", incidenteController.getImagenIncidente);
  router.put("/:id", incidenteController.updateIncidente);
  router.delete("/:id", incidenteController.deleteIncidente);

  app.use("/incidente", router);
};
