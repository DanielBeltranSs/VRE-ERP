"use strict";

const express = require("express");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const materialController = require("../controllers/material.controller.js");
const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Ruta para obtener todos los materiales
router.get("/", materialController.getMaterial);

// Ruta para obtener un material por ID
router.get("/:id", materialController.getMaterialById);

// Ruta para obtener un material por código de barra
router.get("/codigoBarra/:codigoBarra", materialController.getMaterialByBarcode);

// Ruta para crear un nuevo material con opción de subir imagen
router.post("/uploadPhoto", materialController.upload.single("image"), materialController.createMaterial);

// Ruta para actualizar un material con opción de subir imagen
router.put("/:id", materialController.upload.single("image"), materialController.updateMaterial);

// Ruta para eliminar un material
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;
