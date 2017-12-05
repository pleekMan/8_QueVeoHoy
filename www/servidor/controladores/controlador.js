var db = require("../lib/conexionbd");

module.exports = {
	obtenerResultados: function(req,res){
		
		var querySelect = "select * from pelicula ";
		var queryRange = " limit " + req.query.cantidad + " offset " + ((req.query.pagina - 1) * req.query.cantidad) + ";";

		console.log("-|| genero: " + req.query.genero);
		console.log("-|| paginaSolicitada: " + req.query.pagina);
		

		var queryWhere = "";
		if(req.query.anio != undefined || req.query.titulo != undefined || req.query.genero != undefined){
			
			var queryWhere = "where ";

			if(req.query.anio != undefined){
				queryWhere += "anio = " + req.query.anio + "  and ";
			}
			
			if(req.query.titulo != undefined){
				queryWhere += "titulo = '" + req.query.titulo + "' and ";
			}
			
			if(req.query.genero != undefined){			
				queryWhere += "genero_id = " + req.query.genero + " and ";
			}

			queryWhere = queryWhere.slice(0,-4); // LE TRIMEAMOS EL ULTIMO "AND"

		}

		if(req.query.columna_orden != undefined){
			queryOrder = "order by " + req.query.columna_orden + " " + req.query.tipo_orden;
		}
		
		var query = querySelect + queryWhere + queryOrder + queryRange;
		
		console.log("-|| QUERY FINAL => " + query);

		db.query(query, function(error, datos){
			
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

