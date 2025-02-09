const errorController = {}

errorController.triggerError = (req, res, next) => {
    try {
        throw new Error("This is an intentional server error.");
    } catch (error) {
        next(error); // Pass error to middleware
    }
}

module.exports = errorController;
