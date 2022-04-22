exports.guard = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash('warning','Sorry, you must be authenticate to access to this page !')
        return res.redirect('/users/login');
    }
    next();
}