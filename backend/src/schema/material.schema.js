"use strict";

const Joi = require("joi");

const materialId = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.base": "El id debe ser de tipo string.",
      "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
    }),
});

/**
 * Esquema de validación para el cuerpo de la solicitud de inventario.
 * @constant {Object}
 */
const materialBodySchema = Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    descripcion: Joi.string().min(2).max(400).required(),
    tipo: Joi.string().min(2).max(200).required(),
    unidad: Joi.string().min(1).max(200).required(),
    codigoBarra: Joi.string().optional()  // Asegúrate de que sea opcional si no se envía
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

module.exports = { materialBodySchema, materialId };
