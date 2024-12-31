const Joi = require("joi");

const comentarioSchema = Joi.object({
    usuario: Joi.string().required().messages({
        "string.empty": "El autor del comentario no puede estar vacío.",
        "any.required": "El autor del comentario es obligatorio.",
    }),
    contenido: Joi.string().required().min(8).max(3000).messages({
        "string.empty": "El contenido del comentario no puede estar vacío.",
        "any.required": "El contenido del comentario es obligatorio.",
        "string.min": "El contenido del comentario debe tener al menos 8 caracteres.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

module.exports = { comentarioSchema };
