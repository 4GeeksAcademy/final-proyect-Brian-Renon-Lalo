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
    },

    {"city": {"id": 2 , "name": "London", "continent": "Europe"},
        "routes": [
            {
                "id": 4,
                "name": "Ruta 1 (LON 24H )",
                "city_id": 2,
                "days": {
                    "Day 1": [
                        {"name": "Big Ben (Westminster Palace)", "latitude": 51.5006, "longitude": -0.1245},
                        {"name": "Westminster Abbey",              "latitude": 51.4994,  "longitude": -0.1273},
                        {"name": "London Eye",                     "latitude": 51.5033,  "longitude": -0.1194},
                        {"name": "Trafalgar Square",               "latitude": 51.5080,"longitude": -0.128217},
                        {"name": "Piccadilly Circus",              "latitude": 51.5100,"longitude": -0.1338},
                        {"name": "Soho",                           "latitude": 51.513,   "longitude": -0.131},
                        {"name": "Chinatown",                      "latitude": 51.5118,"longitude": -0.1316},
                        {"name": "British Museum",                 "latitude": 51.5194, "longitude": -0.1269},
                        {"name": "St. Paul's Cathedral",           "latitude": 51.5138, "longitude": -0.098362},
                        {"name": "Millennium Bridge",              "latitude": 51.5101,"longitude": -0.0984},
                        {"name": "London Tower",                   "latitude": 51.5082,  "longitude": -0.0761},
                        {"name": "Tower Bridge",                   "latitude": 51.5055, "longitude": -0.0752}
                    ]
                }
            },

             {
                "id": 5,
                "name": "Ruta 2 (LON 48H)",
                "city_id": 2,
                "days": {
                    "Day 1": [
                        {"name": "Buckingham Palace",              "latitude": 51.5014,"longitude": -0.1406,},
                        {"name": "Hyde Park",                      "latitude": 51.5086, "longitude": -0.1636},
                        {"name": "Natural History Museum",         "latitude": 51.4961, "longitude": -0.1761},
                        {"name": "Trafalgar Square",               "latitude": 51.5080,"longitude": -0.1282},
                        {"name": "Piccadilly Circus",              "latitude": 51.5100,"longitude": -0.1338},
                        {"name": "Soho",                           "latitude": 51.513,   "longitude": -0.131},
                        {"name": "Chinatown",                      "latitude": 51.5118,"longitude": -0.1316}
                    ],
                    "Day 2": [
                        {"name": "St. Paul's Cathedral",           "latitude": 51.5138, "longitude": -0.0983},
                        {"name": "Millennium Bridge",              "latitude": 51.5101,"longitude": -0.0984},
                        {"name": "The City of London",             "latitude": 51.5155, "longitude": -0.0930},
                        {"name": "London Tower",                   "latitude": 51.5082,  "longitude": -0.0761},
                        {"name": "Tower Bridge",                   "latitude": 51.5055, "longitude": -0.0752}
                    ]
                }
            },
            {
                "id": 6,
                "name": "Ruta 3 (LON 72H)",
                "city_id": 2,
                "days": {
                    "Day 1": [
                        {"name": "Buckingham Palace",              "latitude": 51.5014,"longitude": -0.1406},
                        {"name": "Big Ben (Westminster Palace)",  "latitude": 51.5006, "longitude": -0.1245},
                        {"name": "Westminster Abbey",              "latitude": 51.4994,  "longitude": -0.12736},
                        {"name": "London Eye",                     "latitude": 51.5033,  "longitude": -0.1194},
                        {"name": "Trafalgar Square",               "latitude": 51.5080,"longitude": -0.1282},
                        {"name": "Piccadilly Circus",              "latitude": 51.5100,"longitude": -0.1338},
                        {"name": "Soho",                           "latitude": 51.513,   "longitude": -0.131},
                        {"name": "Chinatown",                      "latitude": 51.5118,"longitude": -0.1316}
                    ],
                    "Day 2": [
                        {"name": "St. Paul's Cathedral",           "latitude": 51.5138, "longitude": -0.0983},
                        {"name": "Millennium Bridge",              "latitude": 51.5101,"longitude": -0.0984},
                        {"name": "The City of London",             "latitude": 51.5155, "longitude": -0.09306},
                        {"name": "London Tower",                   "latitude": 51.5082,  "longitude": -0.0761 },
                        {"name": "Tower Bridge",                   "latitude": 51.5055, "longitude": -0.0752},
                        {"name": "British Museum",                 "latitude": 51.5194, "longitude": -0.1269}
                    ],
                    "Day 3": [
                        {"name": "Camden Town",                    "latitude": 51.541,   "longitude": -0.1433},
                        {"name": "St Pancras Station",             "latitude": 51.5318,"longitude": -0.1268},
                        {"name": "Notting Hill",                   "latitude": 51.5109,"longitude": -0.2055},
                        {"name": "Portobello Market",              "latitude": 51.5085,  "longitude": -0.2023},
                        {"name": "Hyde Park",                      "latitude": 51.5086, "longitude": -0.1636},
                        {"name": "Natural History Museum",         "latitude": 51.4961, "longitude": -0.1761}
                    ]
                }
            }
        ]
    },
    {
        "city": {"id": 3, "name": "Barcelona", "continent": "Europe"},
        "routes": [
            {
                "id": 7,
                "name": "Ruta 1 (BCN 24H)",
                "city_id": 3,
                "days": {
                    "Day 1": [
                        {"name": "Plaza Catalunya",        "latitude": 41.3870, "longitude": 2.1700},
                        {"name": "Passeig de Gracia",      "latitude": 41.3882, "longitude": 2.1703},
                        {"name": "Casa Batllo",            "latitude": 41.3918, "longitude": 2.1649},
                        {"name": "La Pedrera",             "latitude": 41.3955, "longitude": 2.1620},
                        {"name": "Sagrada Familia",        "latitude": 41.4037, "longitude": 2.1744},
                        {"name": "Arc de Triomf",          "latitude": 41.3912, "longitude": 2.1807},
                        {"name": "Palau de la Musica",     "latitude": 41.3878, "longitude": 2.1754},
                        {"name": "El Born",                "latitude": 41.3842, "longitude": 2.1821},
                        {"name": "Barrio Gótico",          "latitude": 41.3841, "longitude": 2.1762},
                        {"name": "Plaça Sant Jaume",       "latitude": 41.3829, "longitude": 2.1772},
                        {"name": "Las Ramblas",            "latitude": 41.3858, "longitude": 2.1697},
                        {"name": "Mercado de la Boquería", "latitude": 41.3819, "longitude": 2.1716},
                        {"name": "La Barceloneta",         "latitude": 41.3691, "longitude": 2.1905}
                    ]
                }
            },
            {
                "id": 8,
                "name": "Ruta 2 (BCN 48H)",
                "city_id": 3,
                "days": {
                    "Day 1": [
                        {"name": "Plaza Catalunya",        "latitude": 41.3870, "longitude": 2.1700},
                        {"name": "Passeig de Gracia",      "latitude": 41.3882, "longitude": 2.1703},
                        {"name": "Casa Batllo",            "latitude": 41.3918, "longitude": 2.1649},
                        {"name": "La Pedrera",             "latitude": 41.3955, "longitude": 2.1620},
                        {"name": "Sagrada Familia",        "latitude": 41.4037, "longitude": 2.1744},
                        {"name": "Arc de Triomf",          "latitude": 41.3912, "longitude": 2.1807},
                        {"name": "Palau de la Musica",     "latitude": 41.3878, "longitude": 2.1754},
                        {"name": "El Born",                "latitude": 41.3842, "longitude": 2.1821}
                    ],
                    "Day 2": [
                        {"name": "Barrio Gótico",          "latitude": 41.3841, "longitude": 2.1762},
                        {"name": "Plaça Sant Jaume",       "latitude": 41.3829, "longitude": 2.1772},
                        {"name": "Las Ramblas",            "latitude": 41.3858, "longitude": 2.1697},
                        {"name": "Mercado de la Boquería", "latitude": 41.3819, "longitude": 2.1716},
                        {"name": "Museo Picasso",          "latitude": 41.3855, "longitude": 2.1810},
                        {"name": "Montjuïc",               "latitude": 41.3648, "longitude": 2.1676},
                        {"name": "MNAC",                   "latitude": 41.3686, "longitude": 2.1535},
                        {"name": "La Barceloneta",         "latitude": 41.3691, "longitude": 2.1905}
                    ]
                }
            },
            {
                "id": 9,
                "name": "Ruta 3 (BCN 72H)",
                "city_id": 3,
                "days": {
                    "Day 1": [
                        {"name": "Plaza Catalunya",        "latitude": 41.3870, "longitude": 2.1700},
                        {"name": "Passeig de Gracia",      "latitude": 41.3882, "longitude": 2.1703},
                        {"name": "Casa Batllo",            "latitude": 41.3918, "longitude": 2.1649},
                        {"name": "La Pedrera",             "latitude": 41.3955, "longitude": 2.1620},
                        {"name": "Sagrada Familia",        "latitude": 41.4037, "longitude": 2.1744},
                        {"name": "Arc de Triomf",          "latitude": 41.3912, "longitude": 2.1807},
                        {"name": "Palau de la Musica",     "latitude": 41.3878, "longitude": 2.1754}
                    ],
                    "Day 2": [
                        {"name": "El Born",                "latitude": 41.3842, "longitude": 2.1821},
                        {"name": "Museo Picasso",          "latitude": 41.3855, "longitude": 2.1810},
                        {"name": "Barrio Gótico",          "latitude": 41.3841, "longitude": 2.1762},
                        {"name": "Plaça Sant Jaume",       "latitude": 41.3829, "longitude": 2.1772},
                        {"name": "Las Ramblas",            "latitude": 41.3858, "longitude": 2.1697},
                        {"name": "Mercado de la Boquería", "latitude": 41.3819, "longitude": 2.1716},
                        {"name": "La Barceloneta",         "latitude": 41.3691, "longitude": 2.1905}
                    ],
                    "Day 3": [
                        {"name": "Parc Güell",             "latitude": 41.4147, "longitude": 2.1527},
                        {"name": "Eixample",               "latitude": 41.3813, "longitude": 2.1445},
                        {"name": "Spotify Camp Nou",       "latitude": 41.3812, "longitude": 2.1227},
                        {"name": "Montjuïc",               "latitude": 41.3648, "longitude": 2.1676},
                        {"name": "MNAC",                   "latitude": 41.3686, "longitude": 2.1535},
                        {"name": "Tibidabo",               "latitude": 41.4243, "longitude": 2.1200}
                    ]
                }
            }
        ]
    },
    {
        "city": {"id": 4 , "name": "Tokyo", "continent": "Asia"},
        "routes": [
            {
                "id": 10,
                "name": "Ruta 1 (TYO 24H)",
                "city_id": 4,
                "days": {
                    "Day 1": [
                        {"name": "Asakusa - Kaminarimon Gate",        "latitude": 35.7112, "longitude": 139.7963},
                        {"name": "Senso-ji Temple (Asakusa)",        "latitude": 35.7147, "longitude": 139.7966},
                        {"name": "Ueno Park",                         "latitude": 35.7149, "longitude": 139.7734},
                        {"name": "Ameya-Yokocho Market",              "latitude": 35.7112, "longitude": 139.7754},
                        {"name": "Akihabara Electric Town",           "latitude": 35.7014, "longitude": 139.7709},
                        {"name": "Shinjuku Station Area",             "latitude": 35.6909, "longitude": 139.7002},
                        {"name": "Tokyo Metropolitan Government Building", "latitude": 35.6896, "longitude": 139.6921}
                    ]
                }
            },
            {
                "id": 11,
                "name": "Ruta 2 (TYO 48H )",
                "city_id": 4,
                "days": {
                    "Day 1": [
                        {"name": "Asakusa - Kaminarimon Gate",        "latitude": 35.7112, "longitude": 139.7963},
                        {"name": "Senso-ji Temple (Asakusa)",        "latitude": 35.7147, "longitude": 139.7966},
                        {"name": "Ueno Park",                         "latitude": 35.7149, "longitude": 139.7734},
                        {"name": "Akihabara Electric Town",           "latitude": 35.7014, "longitude": 139.7709},
                        {"name": "Ginza District",                    "latitude": 35.6719, "longitude": 139.7658},
                        {"name": "Palacio Imperial de Tokio",         "latitude": 35.6853, "longitude": 139.7526},
                        {"name": "Puente Nijubashi",                  "latitude": 35.6804, "longitude": 139.7535}
                    ],
                    "Day 2": [
                        {"name": "Shibuya Crossing",                  "latitude": 35.6594, "longitude": 139.7004},
                        {"name": "Hachiko Statue",                    "latitude": 35.6590, "longitude": 139.7006},
                        {"name": "Harajuku Takeshita Street",         "latitude": 35.6702, "longitude": 139.7029},
                        {"name": "Meiji Jingu Shrine",                "latitude": 35.6764, "longitude": 139.6993},
                        {"name": "Shinjuku Kabukicho",                "latitude": 35.6940, "longitude": 139.7034},
                        {"name": "Tokyo Metropolitan Government Building", "latitude": 35.6896, "longitude": 139.6921}
                    ]
                }
            },
            {
                "id": 12,
                "name": "Ruta 3 (TYO 72H )",
                "city_id": 4,
                "days": {
                    "Day 1": [
                        {"name": "Asakusa - Kaminarimon Gate",        "latitude": 35.7112, "longitude": 139.7963},
                        {"name": "Senso-ji Temple (Asakusa)",        "latitude": 35.7147, "longitude": 139.7966},
                        {"name": "Ueno Park",                         "latitude": 35.7149, "longitude": 139.7734},
                        {"name": "Ameya-Yokocho Market",              "latitude": 35.7112, "longitude": 139.7754},
                        {"name": "Akihabara Electric Town",           "latitude": 35.7014, "longitude": 139.7709},
                        {"name": "Ginza District",                    "latitude": 35.6719, "longitude": 139.7658}
                    ],
                    "Day 2": [
                        {"name": "Palacio Imperial de Tokio",         "latitude": 35.6853, "longitude": 139.7526},
                        {"name": "Puente Nijubashi",                  "latitude": 35.6804, "longitude": 139.7535},
                        {"name": "Shibuya Crossing",                  "latitude": 35.6594, "longitude": 139.7004},
                        {"name": "Hachiko Statue",                    "latitude": 35.6590, "longitude": 139.7006},
                        {"name": "Harajuku Takeshita Street",         "latitude": 35.6702, "longitude": 139.7029},
                        {"name": "Meiji Jingu Shrine",                "latitude": 35.6764, "longitude": 139.6993}
                    ],
                    "Day 3": [
                        {"name": "Shinjuku Station Area",             "latitude": 35.6909, "longitude": 139.7002},
                        {"name": "Omoide Yokocho",                    "latitude": 35.6938, "longitude": 139.7007},
                        {"name": "Kabukicho",                         "latitude": 35.6940, "longitude": 139.7034},
                        {"name": "Tokyo Metropolitan Government Building", "latitude": 35.6896, "longitude": 139.6921},
                        {"name": "Nakano Broadway",                   "latitude": 35.7083, "longitude": 139.6655}
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