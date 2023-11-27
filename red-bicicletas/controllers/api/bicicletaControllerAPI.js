var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function (req, res){
    Bicicleta.find({}, function (err, bicicletas) {
        res.status(200).json({
            bicicletas: bicicletas
        });
    });
}

exports.bicicleta_create = function(req, res){
    let bici = Bicicleta.createInstance(req.body.id, req.body.color, req.body.modelo, [req.body.lat, req.body.lng]);
    bici.save(function(err){
        if(err) return res.status(500).json(err);
        res.status(200).json({
            bicicleta: bici
        });
    });
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeById(req.body.id);
    res.status(204).send();
}