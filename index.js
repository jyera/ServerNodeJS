'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977; //la primera opcion es por si lo tenemos configurado por variables de entorno y el otro es el que le ponemos nosotros fijo si no hay
//sera el puerto de nuestro servidor backend de node

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err,res) => {
	if (err) {
		throw err;
	}else{
		console.log("La bdd esta funcionando correctamente");

		app.listen(port, function(){
			console.log("Servidor del API REST escuchando en http://localhost:"+port);
		});
	}
})