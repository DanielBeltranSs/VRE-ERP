const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map((err) => err.message);
            return res.status(400).json({
                message: "Error de validación",
                details: errorMessages,
            });
        }
        next();
    };
};

module.exports = { validateBody };
