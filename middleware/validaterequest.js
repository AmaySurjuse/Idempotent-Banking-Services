export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next(); 
        } catch (error) {
            if (error.errors) {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            console.error("Validation Middleware Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error during validation" });
        }
    };
};