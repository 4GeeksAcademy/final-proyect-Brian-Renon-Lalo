from sqlalchemy.exc import IntegrityError
# Asegúrate de que db, User, City, Route estén correctamente importados
# desde el módulo de modelos de tu proyecto.
from api.models import db, User, City, Route, RoutePlace 

# --- 2. DICCIONARIOS DE DATOS ---

# Nota: El 'id' aquí es solo una referencia en el diccionario y no se usa
# al crear el objeto City, ya que el ID se autogenera en la DB.
our_cities = [
    {"name": "New York", "continent": "America", "id":1},
]

our_routes = {
    "New York": {
        "Ruta 1(NYC 24H)": {
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
        },

        "Ruta 2(NYC 48H)": {
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
        },

        "Ruta 3(NYC 72H)": {
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
}

 
# --- 3. FUNCIÓN DE SEEDING PRINCIPAL ---

def seed_data(app):
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
            

            # --- 2. Insertar Ciudades (City) ---
            print("\nCiudad: Insertando...")
            for data in our_cities:

                city_id= data.get("id")

                city = City(
                    id=city_id if city_id else None, 
                    name=data["name"], 
                    continent=data["continent"]
                )
                db.session.add(city)
                print(f"-> Added {city.name}cit with the {city.id}")

            
            # Commit ahora para que se generen los IDs de las ciudades
            db.session.commit() 
            print(f"✅ Ciudades insertadas: {len(our_cities)}")

            # --- 3. Insertar Rutas (Route) y enlazarlas a la ciudad ---
            
            for city_name, routes_data in our_routes.items():
                # Recuperar el objeto City insertado (necesitamos el city.id)
                city = db.session.execute(db.select(City).filter_by(name=city_name)).scalar_one_or_none()
                
                if not city:
                    print(f"⚠️ Ciudad '{city_name}' no encontrada en la DB. Saltando sus rutas.")
                    continue
                
                print(f"\nRutas: Procesando rutas para {city_name} (ID: {city.id})...")
                
                # Iterar solo sobre los nombres PRINCIPALES de las rutas:
                # Esto manejará "Ruta 1(24H)", "Ruta 2(48H)", etc., sin importar si el valor es una lista o un diccionario anidado.
                for route_name, places_data in routes_data.items(): 
                    
                    # Crear el objeto ROUTE, enlazándolo a la ciudad
                    route = Route(name=route_name, city_id=city.id)
                    db.session.add(route)
                    db.session.flush()
                    print(f"   -> Ruta creada: {route_name} (Route ID: {route.id})")


                    if isinstance(places_data, dict):
                        for day,  day_places_list in places_data.items():
                            for place_entry in day_places_list:
                                place = RoutePlace(
                                    name = place_entry["name"],
                                    route_id = route.id,
                                    day = day,
                                    latitude = place_entry.get("latitude"),
                                    longitude =  place_entry.get("longitude")
                                )
                                db.session.add(place)       
                                print(f"->  PLace for {day} added: {place_entry['name']}")

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