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

	obtenerPeliculaData: function(request, response){

		var peliId = request.params.id;

		var queryString_PeliData = "select titulo, anio, poster, trama, fecha_lanzamiento, genero.nombre, director, duracion, puntuacion from pelicula join genero on pelicula.genero_id = genero.id where pelicula.id = " + peliId;
		var queryStringActores = "select nombre from actor	join actor_pelicula on actor_pelicula.actor_id = actor.id where actor_pelicula.pelicula_id = " + peliId;

		db.query(queryString_PeliData, function(error,datosPeli){
			if(error){
				return response.status(500);
			}
			
			db.query(queryStringActores, function(error,datosActores){
				if(error){
					return response.status(500);
				}
			
			var peliFull = {
				pelicula : datosPeli[0],
				actores: datosActores,

			}
			
			

			response.send(200, peliFull)

			});
		})
	},

	obtenerRecomendacion: function(request, response){

		var genero = request.query.genero;
		var anio_inicio = request.query.anio_inicio;
		var anio_fin = request.query.anio_fin;
		var puntuacion = request.query.puntuacion;
		
		var queryString = "select pelicula.id, titulo, poster, trama, genero.nombre from pelicula join genero on pelicula.genero_id = genero.id where ";

		var whereString = "";

		if(genero != undefined){
			whereString += "genero.nombre = '" + genero + "' and ";
		}
		if(anio_inicio != undefined || anio_fin != undefined){
			whereString += "pelicula.anio between " + anio_inicio + " and " + anio_fin + " and ";
		}
		if(puntuacion != undefined){
			whereString += "puntuacion >= " + puntuacion + " and ";
		}

		whereString = whereString.slice(0,-5);
		queryString += whereString;
		//queryString += " order by rand() limit 1"

		console.log("-|| QUERY STRING: " + queryString);

		db.query(queryString, function(error,datos){
			if(error){
				return response.send(500,error);
			}

			var resultado = {
				peliculas: datos,
			};

			response.send(200, resultado)
		})
	},
}

