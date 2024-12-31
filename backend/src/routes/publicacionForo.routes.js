"use strict";

const express = require("express");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const publicacionForoController = require("../controllers/publicacionForo.controller.js");
const router = express.Router();
const { comentarioSchema } = require("../schema/comentario.schema");
const { validateBody } = require("../middlewares/validateBody.middleware");

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Rutas para obtener publicaciones del foro
router.get("/", publicacionForoController.getPublicacionesForo);
router.get("/:id", publicacionForoController.getPublicacionForoById);
router.post("/", publicacionForoController.createPublicacionForo);
// Rutas para crear, actualizar y eliminar publicaciones del foro
router.put("/:id", publicacionForoController.updatePublicacionForo);
router.delete("/:id", publicacionForoController.deletePublicacionForo);
router.delete("/:idPublicacion/comentario/:idComentario", publicacionForoController.deleteComentario);
router.put("/comentar/:id", validateBody(comentarioSchema), publicacionForoController.comentar);
router.get("/mispublicaciones/:author", publicacionForoController.getPublicacionesForoByAutor);

module.exports = router;