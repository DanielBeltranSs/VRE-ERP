"use strict";

const { respondSuccess, respondError, respondInternalError } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");
const materialService = require("../services/material.service");
const { materialBodySchema, materialId } = require("../schema/material.schema");
const multer = require("multer");
const path = require("path");

// Configuración de multer para almacenamiento de imágenes de materiales
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // Carpeta de almacenamiento de imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });
exports.upload = upload; // Exportar el middleware de carga

// Obtener todos los materiales
async function getMaterial(req, res) {
  try {
    const [materials, error] = await materialService.getMaterial();
    if (error) return respondError(req, res, 404, error);

    materials.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, materials);
  } catch (error) {
    handleError(error, "Material.controller -> getMaterial");
    respondError(req, res, 400, error.message);
  }
}

// Crear un nuevo material con imagen opcional
async function createMaterial(req, res) {
  try {
      console.log("Body received:", req.body);
      console.log("File received:", req.file);

      const { body } = req;
      const { error: bodyError } = materialBodySchema.validate(body);
      if (bodyError) return respondError(req, res, 400, bodyError.message);

      // Si hay archivo, añade la URL de la imagen
      if (req.file) {
          body.imageUrl = `/uploads/${req.file.filename}`;
      }

      const [newMaterial, error] = await materialService.createMaterial(body);
      if (error) return respondError(req, res, 400, error);

      respondSuccess(req, res, 201, newMaterial);
  } catch (error) {
      console.error("Error en createMaterial:", error); // Log del error completo
      handleError(error, "Material.controller -> createMaterial");
      respondError(req, res, 500, "No se pudo crear el material");
  }
}


// Obtener un material por ID
async function getMaterialById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = materialId.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { id } = params;
    const [material, error] = await materialService.getMaterialById(id);
    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, material);
  } catch (error) {
    handleError(error, "Material.controller -> getMaterialById");
    respondInternalError(req, res);
  }
}

// Actualizar un material con imagen opcional
async function updateMaterial(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = materialId.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    if (req.file) {
      body.imageUrl = `/uploads/${req.file.filename}`;
    }

    const [updatedMaterial, error] = await materialService.updateMaterial(params.id, body);
    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, updatedMaterial);
  } catch (error) {
    handleError(error, "Material.controller -> updateMaterial");
    respondInternalError(req, res);
  }
}

// Eliminar un material
async function deleteMaterial(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = materialId.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { id } = params;
    const [deletedMaterial, error] = await materialService.deleteMaterial(id);
    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, deletedMaterial);
  } catch (error) {
    handleError(error, "Material.controller -> deleteMaterial");
    respondInternalError(req, res);
  }
}

// Obtener un material por código de barras
async function getMaterialByBarcode(req, res) {
  try {
    const { codigoBarra } = req.params;
    const [material, error] = await materialService.getMaterialByBarcode(codigoBarra);
    if (error) return respondError(req, res, 404, "Material no encontrado con el código de barra proporcionado");

    respondSuccess(req, res, 200, material);
  } catch (error) {
    handleError(error, "Material.controller -> getMaterialByBarcode");
    respondInternalError(req, res);
  }
}

module.exports = {
  getMaterial,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  getMaterialByBarcode,
  upload, // Exportar `upload` para manejo de archivos
};
