const objectIdValidator = (value, helpers) => {
    if (!mongoose.isValidObjectId(value)) {
        return helpers.error('any.invalid');
    }
    return value;

};

export default objectIdValidator;