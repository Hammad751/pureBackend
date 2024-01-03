const asyncHandler = (reqHandler) => {
    (req, res, nect) => {
        Promise
        .resolve(reqHandler(req,res,next))
        .catch((err)=> next(err));
    }
}

export { asyncHandler };