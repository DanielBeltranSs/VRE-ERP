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
    }
}

async function createMaterial(material) {
    try {
        const { nombre, descripcion, tipo, unidad, codigoBarra } = material;

        const materialFound = await Material.findOne({ nombre });
        if (materialFound) return [null, "El Material ya existe"];

        const newMaterial = new Material({
            nombre,
            descripcion,
            tipo,
            unidad,
            codigoBarra, // Incluimos el código de barra
        });
        await newMaterial.save();

        return [newMaterial, null];
    } catch (error) {
        handleError(error, "Material.service -> createMaterial");
    }
}

async function getMaterialById(id) {
    try {
        const material = await Material.findById(id).exec();
        if (!material) return [null, "El Material no existe"];

        return [material, null];
    } catch (error) {
        handleError(error, "Material.service -> getMaterialById");
    }
}

async function getMaterialByBarcode(codigoBarra) {
    try {
        const material = await Material.findOne({ codigoBarra }).exec();
        if (!material) return [null, "Material no encontrado con el código de barra proporcionado"];

        return [material, null];
    } catch (error) {
        handleError(error, "Material.service -> getMaterialByBarcode");
    }
}

async function updateMaterial(id, material) {
    try {
        const materialFound = await Material.findById(id).exec();
        if (!materialFound) return [null, "El Material no existe"];

        const materialDuplicado = await Material.findOne({ nombre: material.nombre });
        if (materialDuplicado && materialDuplicado._id.toString() !== id) {
            return [null, "El material ya existe"];
        }

        const { nombre, descripcion, tipo, unidad, codigoBarra } = material;

        const materialUpdated = await Material.findByIdAndUpdate(
            id,
            { nombre, descripcion, tipo, unidad, codigoBarra },
            { new: true }
        );

        return [materialUpdated, null];
    } catch (error) {
        handleError(error, "Material.service -> updateMaterial");
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
    }
}

module.exports = {
    getMaterial,
    createMaterial,
    getMaterialById,
    getMaterialByBarcode, // Exportar la nueva función
    updateMaterial,
    deleteMaterial,
};
