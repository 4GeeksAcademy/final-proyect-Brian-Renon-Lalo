from sqlalchemy.exc import IntegrityError
# Asegúrate de que db, User, City, Route estén correctamente importados
# desde el módulo de modelos de tu proyecto.
from api.models import db, User, City, Route, RoutePlace 

# --- 2. DICCIONARIOS DE DATOS ---

# Nota: El 'id' aquí es solo una referencia en el diccionario y no se usa
# al crear el objeto City, ya que el ID se autogenera en la DB.

    
SEED_DATA = [
    {
        "city": {"id": 1, "name": "New York", "continent": "America"},
        "routes": [
            {
                "id": 1,
                "name": "Ruta 1 (NYC 24H)",
                "city_id": 1,
                "days": {
                    "Day 1": [
                        {"name": "Dumbo Pebble Beach", "latitude": 40.7045, "longitude": -73.9901},
                        {"name": "Wall Street", "latitude": 40.7057, "longitude": -74.0134},
                        {"name": "The World Trade Center", "latitude": 40.7127, "longitude": -74.0133},
                        {"name": "Central Station", "latitude": 40.7526, "longitude": -73.9722},
                        {"name": "The Channel Garden", "latitude": 40.7585, "longitude": -73.9780},
                        {"name": "St.Patrick's Cathedral", "latitude": 40.7581, "longitude": -73.9754},
                        {"name": "5th Avenue", "latitude": 40.7612, "longitude": -73.9752},
                        {"name": "Central Park", "latitude": 40.7739, "longitude": -73.9710},
                        {"name": "Times Square", "latitude": 40.7561, "longitude": -73.9859}
                    ]
                }
            },
            {
                "id": 2,
                "name": "Ruta 2 (NYC 48H)",
                "city_id": 1,
                "days": {
                    "Day 1": [
                        {"name": "Brooklyn Bridge", "latitude": 40.7062, "longitude": -73.9967},
                        {"name": "Wall Street", "latitude": 40.7057, "longitude": -74.0134},
                        {"name": "The World Trade Center", "latitude": 40.7127, "longitude": -74.0133},
                        {"name": "Chinatown NYC", "latitude": 40.7143, "longitude": -73.9979},
                        {"name": "Central Station", "latitude": 40.7526, "longitude": -73.9722},
                        {"name": "Bryan Park", "latitude": 40.7535, "longitude": -73.9831},
                        {"name": "Broadway", "latitude": 40.7595, "longitude": -73.9852},
                        {"name": "Times Square", "latitude": 40.7561, "longitude": -73.9859}
                    ],
                    "Day 2": [
                        {"name": "5th Avenue", "latitude": 40.7612, "longitude": -73.9752},
                        {"name": "St.Patrick's Cathedral", "latitude": 40.7581, "longitude": -73.9754},
                        {"name": "The Channel Garden", "latitude": 40.7585, "longitude": -73.9780},
                        {"name": "Empire State", "latitude": 40.7486, "longitude": -73.9850},
                        {"name": "Soho NYC", "latitude": 40.7246, "longitude": -74.0021},
                        {"name": "Washington Park", "latitude": 40.7311, "longitude": -73.9973},
                        {"name": "Dumbo Pebble Beach", "latitude": 40.7045, "longitude": -73.9901}
                    ]
                }
            },
            {
                "id": 3,
                "name": "Ruta 3 (NYC 72H)",
                "city_id": 1,
                "days": {
                    "Day 1": [
                        {"name": "Brooklyn Bridge", "latitude": 40.7062, "longitude": -73.9967},
                        {"name": "Wall Street", "latitude": 40.7057, "longitude": -74.0134},
                        {"name": "The World Trade Center", "latitude": 40.7127, "longitude": -74.0133},
                        {"name": "Chinatown NYC", "latitude": 40.7143, "longitude": -73.9979},
                        {"name": "Bryan Park", "latitude": 40.7535, "longitude": -73.9831},
                        {"name": "Broadway", "latitude": 40.7595, "longitude": -73.9852},
                        {"name": "Times Square", "latitude": 40.7561, "longitude": -73.9859}
                    ],
                    "Day 2": [
                        {"name": "Statue of Liberty", "latitude": 40.6893, "longitude": -74.0445},
                        {"name": "Washington Park", "latitude": 40.7311, "longitude": -73.9973},
                        {"name": "Soho NYC", "latitude": 40.7246, "longitude": -74.0021},
                        {"name": "The High Line", "latitude": 40.7399, "longitude": -74.0083},
                        {"name": "Little Island", "latitude": 40.7420, "longitude": -74.0104},
                        {"name": "The Vessel", "latitude": 40.7540, "longitude": -74.0021}
                    ],
                    "Day 3": [
                        {"name": "Central Park", "latitude": 40.7739, "longitude": -73.9710},
                        {"name": "5th Avenue","latitude": 40.7612, "longitude": -73.9752},
                        {"name": "St.Patrick's Cathedral", "latitude": 40.7581, "longitude": -73.9754},
                        {"name": "The Channel Garden", "latitude": 40.7585, "longitude": -73.9780},
                        {"name": "Empire State", "latitude": 40.7486, "longitude": -73.9850},
                        {"name": "Flatiron Building", "latitude": 40.7411, "longitude": -73.9897},
                        {"name": "Dumbo Pebble Beach", "latitude": 40.7045, "longitude": -73.9901}
                    ]
                }
            }
        ]
    }
]   

 
# --- 3. FUNCIÓN DE SEEDING PRINCIPAL ---

def seed_data(app, seed_data):
    """Puebla la base de datos con datos de ciudades y rutas."""
    
    # ⚠️ IMPORTANTE: Esta función DEBE ser llamada dentro de un contexto de aplicación de Flask
    # para que tenga acceso a la configuración de la DB.
    with app.app_context():
        try:
            print("▶️ Iniciando la siembra de datos...")
            
            # 1. Limpiar datos existentes (Route DEBE eliminarse antes que City debido a la FK)
            # Usando la sintaxis moderna de SQLAlchemy 2.0 (recomendada)
            db.session.execute(db.delete(RoutePlace)) 
            db.session.execute(db.delete(Route)) 
            db.session.execute(db.delete(City))
            
            # No es necesario borrar Users si son permanentes. Si quieres borrarlos:
            # db.session.execute(db.delete(User))
            
            db.session.commit()
            print("✅ Tablas limpiadas: Route, City. (User no modificado).")
            

            # ---  Insertar Ciudades,rutas y lugares (City) ---
            print("\nCiudad: Insertando...")
            for entry in seed_data:
                city_data = entry["city"]
                city = City(
                    id=city_data["id"], 
                    name=city_data["name"], 
                    continent=city_data.get("continent")
                )

                db.session.add(city)
                db.session.flush()


                for route_data in entry.get("routes",[]):
                    route = Route(
                        id=route_data["id"], 
                        name=route_data["name"], 
                        city_id=city.id
                    )

                    db.session.add(route)
                    db.session.flush()

                    for day, places in route_data.get("days", {}).items():
                        for place in places:
                            route_place = RoutePlace(
                                name = place["name"],
                                day = day,
                                latitude = place.get("latitude"),
                                longitude = place.get("longitude"),
                                route_id = route.id
                            )   
                            db.session.add(route_place)
           

             
            # Commit final para todas las nuevas rutas
            db.session.commit() 
            print("✅ Todas las rutas han sido insertadas y enlazadas.")

            print("\n" + "="*50)
            print("🎉 Datos insertados y enlazados correctamente en todas las tablas.")
            print("="*50)
            
        except IntegrityError as e:
            db.session.rollback()
            print("\n" + "="*50)
            print("⚠️ ERROR DE INTEGRIDAD: La siembra falló debido a una restricción de la DB (FK, NOT NULL, UNIQUE).")
            print(f"DETALLE: {e}") 
            print("="*50 + "\n")
            # Mantenemos el raise para que el script se detenga en caso de error
            raise 
        except Exception as e:
            db.session.rollback()
            print("\n" + "="*50)
            print("❌ ERROR INESPERADO al sembrar los datos.")
            print(f"DETALLE: {e}") 
            print("="*50 + "\n")
            raise