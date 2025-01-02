"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler");
const ProyectoService = require("../services/proyecto.service");
const { handleError } = require("../utils/errorHandler");
const Proyecto = require('../models/proyecto.model');
const { respondInternalError } = require("../utils/resHandler");
const { parse } = require('date-fns');

// Función para formatear fechas a dd/mm/aaaa
function formatDateToDDMMYYYY(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('es-ES', options);
}

// Validar fechas de inicio y término
function validateFechas(fechaInicio, fechaTermino) {
  const fechaInicioParsed = new Date(fechaInicio);
  const fechaTerminoParsed = new Date(fechaTermino);
  return fechaInicioParsed <= fechaTerminoParsed;
}

// Obtener todos los proyectos
async function getProyectos(req, res) {
  try {
    const proyectos = await Proyecto.find().sort({ fecha_termino: 1 }).exec();

    if (proyectos.length === 0) {
      return respondSuccess(req, res, 204);
    }

    const proyectosFormateados = proyectos.map((proyecto) => ({
      ...proyecto.toObject(),
      fecha_inicio: formatDateToDDMMYYYY(proyecto.fecha_inicio),
      fecha_termino: formatDateToDDMMYYYY(proyecto.fecha_termino),
    }));

    respondSuccess(req, res, 200, proyectosFormateados);
  } catch (error) {
    handleError(error, "proyectos.controller -> getProyectos");
    respondError(req, res, 500, "Error al obtener los proyectos");
  }
}

// Crear un nuevo proyecto
async function createProyecto(req, res) {
  try {
    const { titulo, descripcion, empresa_licitante, fecha_inicio, fecha_termino, presupuesto, actividades } = req.body;

    // Validaciones de los campos
    if (!titulo || titulo.length < 2 || titulo.length > 70) {
      return respondError(req, res, 400, "Título inválido: mínimo 2 y máximo 70 caracteres.");
    }

    if (!descripcion || descripcion.length < 2 || descripcion.length > 600) {
      return respondError(req, res, 400, "Descripción inválida: mínimo 2 y máximo 600 caracteres.");
    }

    if (!empresa_licitante || empresa_licitante.length < 2 || empresa_licitante.length > 600) {
      return respondError(req, res, 400, "Empresa licitante inválida.");
    }

    const parsedPresupuesto = parseInt(presupuesto, 10);
    if (isNaN(parsedPresupuesto) || parsedPresupuesto <= 0 || parsedPresupuesto > 999999999) {
      return respondError(req, res, 400, "Presupuesto inválido.");
    }

    if (!validateFechas(fecha_inicio, fecha_termino)) {
      return respondError(req, res, 400, "Fechas inválidas: la fecha de inicio debe ser anterior a la de término.");
    }

    if (!Array.isArray(actividades)) {
      return respondError(req, res, 400, "Las actividades deben ser un array.");
    }

    const proyecto = { titulo, descripcion, empresa_licitante, fecha_inicio, fecha_termino, presupuesto, actividades };
    const [nuevoProyecto, errorProyectos] = await ProyectoService.createProyecto(proyecto);

    if (errorProyectos) {
      return respondInternalError(req, res, 404, errorProyectos);
    }

    respondSuccess(req, res, 201, nuevoProyecto);
  } catch (error) {
    handleError(error, "proyectos.controller -> createProyecto");
    respondError(req, res, 500, "Error al crear el proyecto");
  }
}

// Actualizar un proyecto
async function updateProyecto(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    Object.assign(proyecto, updateData);
    const updatedProyecto = await proyecto.save();

    respondSuccess(req, res, 200, updatedProyecto);
  } catch (error) {
    handleError(error, "proyectos.controller -> updateProyecto");
    respondError(req, res, 500, "Error al actualizar el proyecto");
  }
}

// Eliminar un proyecto
async function deleteProyecto(req, res) {
  try {
    const { id } = req.params;

    const proyecto = await Proyecto.findByIdAndRemove(id);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    handleError(error, "proyectos.controller -> deleteProyecto");
    respondError(req, res, 500, "Error al eliminar el proyecto");
  }
}

// Obtener un proyecto por ID
async function getProyectoById(req, res) {
  try {
      const { id } = req.params;
      const proyecto = await Proyecto.findById(id);

      if (!proyecto) {
          return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      return res.status(200).json(proyecto);
  } catch (error) {
      handleError(error, "proyecto.controller -> getProyectoById");
      return res.status(500).json({ message: 'Error al obtener la publicación' });
  }
}


// Actualizar el estado de una actividad
async function updateActividadEstado(req, res) {
  try {
    const { proyectoId, actividadIndex } = req.params;
    const { estado } = req.body;

    const proyecto = await Proyecto.findById(proyectoId);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    proyecto.actividades[actividadIndex].estado = estado;
    const updatedProyecto = await proyecto.save();

    respondSuccess(req, res, 200, updatedProyecto);
  } catch (error) {
    handleError(error, "proyectos.controller -> updateActividadEstado");
    respondError(req, res, 500, "Error al actualizar la actividad");
  }
}

// Agregar una actividad a un proyecto
async function addActividad(req, res) {
  try {
    const { proyectoId } = req.params;
    const actividadData = req.body;

    const proyecto = await Proyecto.findById(proyectoId);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    proyecto.actividades.push(actividadData);
    await proyecto.save();

    respondSuccess(req, res, 201, proyecto);
  } catch (error) {
    handleError(error, "proyectos.controller -> addActividad");
    respondError(req, res, 500, "Error al agregar la actividad");
  }
}

module.exports = {
  getProyectos,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  getProyectoById,
  updateActividadEstado,
  addActividad,
};
