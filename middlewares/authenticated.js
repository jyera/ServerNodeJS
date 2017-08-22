'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'});
	}

	var token = req.headers.authorization.replace(/['"]+/g,'');

	try{
		var payload = jwt.decode(token, secret);

		if(payload.exp <= moment.unix()){
			res.status(404).send({message: 'El token a expirado'});
		}
	}catch(ex){
		//console.log(ex);//capturamos error a la hora de recoger el token
		res.status(404).send({message: 'Token no valido'});
	}

	req.user = payload;

	next();//con esta funcion se sale del middleware
};