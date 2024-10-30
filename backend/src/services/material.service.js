"use strict";
// Importa el modelo de datos material
const Material = require("../models/material.model.js");
const { handleError } = require("../utils/errorHandler");

async function getMaterial() {
    try {
        const materiales = await Material.find().exec();
        if (!materiales) return [null, "No se encontraron materiales"];

        return [materiales, null];
    } catch (error) {
        handleError(error, "Material.service -> getMaterial");
        return [null, error.message];
    }
}

async function createMaterial(material) {
    try {
      const newMaterial = new Material({
        nombre: material.nombre,
        descripcion: material.descripcion,
        tipo: material.tipo,
        unidad: material.unidad,
        codigoBarra: material.codigoBarra || null,
        imageUrl: material.imageUrl || null, // Nueva URL de imagen
      });
      await newMaterial.save();
      return [newMaterial, null];
    } catch (error) {
      handleError(error, "Material.service -> createMaterial");
      return [null, error.message];
    }
  }

async function getMaterialById(id) {
    try {
        const material = await Material.findById(id).exec();
        if (!material) return [null, "El Material no existe"];

        return [material, null];
    } catch (error) {
        handleError(error, "Material.service -> getMaterialById");
        return [null, error.message];
    }
}

async function getMaterialByBarcode(codigoBarra) {
    try {
        const material = await Material.findOne({ codigoBarra }).exec();
        if (!material) return [null, "Material no encontrado con el código de barra proporcionado"];

        return [material, null];
    } catch (error) {
        handleError(error, "Material.service -> getMaterialByBarcode");
        return [null, error.message];
    }
}

async function updateMaterial(id, material) {
    try {
        // Obtén el material actual de la base de datos
        const currentMaterial = await Material.findById(id).exec();
        if (!currentMaterial) return [null, "El Material no existe"];

        // Si no se proporciona una nueva URL de imagen, mantén la existente
        const updatedData = {
            nombre: material.nombre || currentMaterial.nombre,
            descripcion: material.descripcion || currentMaterial.descripcion,
            tipo: material.tipo || currentMaterial.tipo,
            unidad: material.unidad || currentMaterial.unidad,
            codigoBarra: material.codigoBarra || currentMaterial.codigoBarra,
            imageUrl: material.imageUrl || currentMaterial.imageUrl, // Mantén la imagen existente si no se envía una nueva
        };

        // Realiza la actualización con los datos modificados
        const updatedMaterial = await Material.findByIdAndUpdate(id, updatedData, { new: true });
        return [updatedMaterial, null];
    } catch (error) {
        handleError(error, "Material.service -> updateMaterial");
        return [null, error.message];
    }
}


async function deleteMaterial(id) {
    try {
        const materialFound = await Material.findById(id);
        if (!materialFound) return [null, "El material no existe"];

        const deletedMaterial = await Material.findByIdAndDelete(id);
        return [deletedMaterial, null];
    } catch (error) {
        handleError(error, "Material.service -> deleteMaterial");
        return [null, error.message];
    }
}

module.exports = {
    getMaterial,
    createMaterial,
    getMaterialById,
    getMaterialByBarcode,
    updateMaterial,
    deleteMaterial,
};
