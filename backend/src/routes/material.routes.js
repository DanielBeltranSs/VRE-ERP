"use strict";

const express = require("express");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const materialController = require("../controllers/material.controller.js");
const router = express.Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Rutas para obtener y crear materiales
router.get("/", materialController.getMaterial);
router.get("/:id", materialController.getMaterialById);
router.post("/", materialController.createMaterial);

// Nueva ruta para obtener un material por código de barra
router.get("/codigoBarra/:codigoBarra", materialController.getMaterialByBarcode);

// Rutas para actualizar y eliminar materiales
router.put("/:id", materialController.updateMaterial);
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;
