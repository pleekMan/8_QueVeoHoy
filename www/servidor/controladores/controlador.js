var db = require("../lib/conexionbd");

module.exports = {
	obtenerResultados: function(req,res){

		db.query("select * from pelicula", function(error, datos){
			
			if(error){
				return res.send(500,error); //  (errorCode, errorLog)
			}

			res.send(200, {peliculas:datos});



		});

	}
}

