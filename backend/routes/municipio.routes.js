module.exports = app => {
    const municipioController = require("../controllers/municipio.controller.js");
    let router = require("express").Router();

    router.get("/", municipioController.listMunicipios);
    router.get("/:id", municipioController.getMunicipioById);
    router.post("/", municipioController.createMunicipio);
    router.put("/:id", municipioController.updateMunicipio);
    router.delete("/:id", municipioController.deleteMunicipio);

    app.use('/municipio', router);
}