var db = require("../lib/conexionbd");

module.exports = {
	obtenerResultados: function(req,res){

		db.query("select * from pelicula limit 100", function(error, datos){
			
			if(error){
				return res.send(500,error); //  ((error)Code, errorLog)
			}

			res.send(200, {peliculas:datos});



		});

	},

	obtenerGeneros: function(request, response){
		db.query("select nombre,id from genero", function(error,datos){
			if(error){
				return response.send(500,error);
			}

			response.send(200, {generos:datos})
		})
	},
}

