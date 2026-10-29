module.exports = (handler) => {
    return function(req, res, next) {
        handler(req, res, next).catch(next);
    };
};