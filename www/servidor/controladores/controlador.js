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
				queryWhere += "titulo like '%" + req.query.titulo + "%' and ";
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

		// ARMAMOS LA QUERY PARA OBTENER EL TOTAL DE PELIS, SIN EL LIMIT DE VIZ POR PAGINAS
		var totalPelisQuery = query.replace("*", "count(*) as total");
		var trimEndIndex = totalPelisQuery.indexOf("order");
		totalPelisQuery = totalPelisQuery.slice(0,trimEndIndex);


		console.log("-|| QUERY totalPelis => " + totalPelisQuery);




		db.query(totalPelisQuery, function(error, datoTotal){
			if(error){
				return res.status(500).send("ERROR AL BUSCAR CANTIDAD DE PELICULAS"); //  ((error)Code, errorLog)
			}

			var totalPelis = datoTotal[0].total;

			if(totalPelis != 0){

				db.query(query, function(error, datos){
			
					if(error){
						return res.status(500).send("ERROR AL BUSCAR DATOS DE CADA PELICULA"); //  ((error)Code, errorLog)
					}
					
					var pelis = {
						peliculas: datos,
						total:  totalPelis, 
					}

					//console.log("-|| Pelis => " + pelis.peliculas);
					//console.log("-|| Total => " + pelis.total);

					res.status(200).send(200, pelis);
		
					console.log("-|| ================");
		
				});

			}

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

