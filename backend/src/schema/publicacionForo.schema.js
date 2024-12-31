"use strict";

const Joi = require("joi");

/**
 * Esquema de validación para el cuerpo de la solicitud de publicación de foro.
 * @constant {Object}
 */
const publicacionForoBodySchema = Joi.object({
  titulo: Joi.string().required().min(5).max(200).pattern(/^(?!\d+$)[\s\S]*$/).messages({
    "string.empty": "El título no puede estar vacío.",
    "any.required": "El título es obligatorio.",
    "string.base": "El título debe ser de tipo string.",
    "string.min": "El título debe tener al menos 5 caracteres.",
    "string.max": "El título debe tener como máximo 200 caracteres.",
    "string.pattern.base": "El título no puede ser solo números.",
  }),
  contenido: Joi.string().required().min(10).max(3000).pattern(/^(?!\d+$)[\s\S]*$/).messages({
    "string.empty": "El contenido no puede estar vacío.",
    "any.required": "El contenido es obligatorio.",
    "string.base": "El contenido debe ser de tipo string.",
    "string.min": "El contenido debe tener al menos 10 caracteres.",
    "string.max": "El contenido debe tener como máximo 3000 caracteres.",
    "string.pattern.base": "El contenido no puede ser solo números.",
  }),
  imagen: Joi.string().allow('', "").optional().messages({
    "string.base": "La imagen debe ser de tipo string.",
  }),
  comentarios: Joi.array()
  .items(
    Joi.object({
      autor: Joi.string().required().messages({
        "string.empty": "El autor del comentario no puede estar vacío.",
        "any.required": "El autor del comentario es obligatorio.",
      }),
      contenido: Joi.string().required().min(8).max(3000).messages({
        "string.empty": "El contenido del comentario no puede estar vacío.",
        "any.required": "El contenido del comentario es obligatorio.",
        "string.min": "El contenido del comentario debe tener al menos 8 caracteres.",
      }),
    }).unknown(false)
  )
  .optional(),

  autor: Joi.string().required().messages({
    "string.empty": "El autor no puede estar vacío.",
    "any.required": "El autor es obligatorio.",
    "string.base": "El autor debe ser de tipo string.",
  }),
  fechaCreacion: Joi.date().optional().messages({
    "date.base": "La fecha de creación debe ser de tipo date.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

/**
 * Esquema de validación para el id de la publicación de foro.
 * @constant {Object}
 */
const publicacionForoIdSchema = Joi.object({
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

module.exports = { publicacionForoBodySchema, publicacionForoIdSchema };
