'use strict'

var path = require('path');//path y fs es para trabajar con el sistema de ficheros
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}
		}
	});
}

function saveArtist(req, res){
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {
		/*esta funcion va  arecibir o el error o el artista que ha guardado
		se hacen de flecha las funciones porque no se instancian, 
		son locales y al no tener nombre
		no se podran llamar desde otro sitio*/
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado'});	
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	});
}

function getArtists(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
		if(err){
			res.status(500).send({message: 'Error en la paeticion'});
		}else{
			if(!artists){
				res.status(400).send({message: 'No hay artistas'});
			}else{
				return res.status(200).send({
					pages: total,
					artists: artists
				});
			}
		}
	});
}

function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'El artista no ha sido actualizado'});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err){
			res.status(500).send({message: 'Error al eliminar el artista'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				console.log(artistRemoved);

				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) =>{
					if(err){
						res.status(500).send({message: 'Error al eliminar el album'});
					}else{
						if(!albumRemoved){
							res.status(404).send({message: 'El album no ha sido eliminado'});
						}else{
							console.log(albumRemoved);

							Song.find({album: albumRemoved._id}).remove((err, songRemoved) =>{
								if(err){
									res.status(500).send({message: 'Error al eliminar la cancion'});
								}else{
									if(!songRemoved){
										res.status(404).send({message: 'La cancion no ha sido eliminada'});
									}else{
										console.log(songRemoved);
										res.status(200).send({artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
				if(!artistUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el artista'});
				}else{
					res.status(200).send({artist: artistUpdated});
				}
			});
		}else{
			res.status(500).send({message: 'Extension del archivo no valida'});
		}
		console.log(ext_split);
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}

}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artists/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};