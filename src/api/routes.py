
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import bcrypt
import os
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, City, Route
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import timedelta


api = Blueprint('api', __name__, url_prefix='/api')



CORS(api)

#------------------------Endpoint login, register, edit profile---------------------
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 400

    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    user, message = User.create_user(
        name=name, email=email, password=hashed_password.decode('utf-8'))
    if user is None:
        return jsonify({"msg": message}), 400

    return jsonify(user.serialize()), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Incorrect Credentials"}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"msg": "Incorrect credentials"}), 401

    token = create_access_token(identity=str(
        user.id), expires_delta=timedelta(hours=1))
    return jsonify({"token": token, "user": user.serialize()}), 200


@api.route('/user/<int:user_id>', methods=['GET', 'PATCH'])
@jwt_required()
def get_single_user(user_id):
    current_user_id = get_jwt_identity()

    if str(current_user_id) != str(user_id):
        return jsonify({"msg": "Access denied"}), 403
    
    user = db.session.get(User, user_id)
    
    if user is None:
        return jsonify({"msg": "User not found"}), 404
    
    if request.method == 'GET':
        return jsonify(user.serialize()), 200
    
    elif request.method == 'PATCH':
        data = request.get_json()
        new_name = data.get("name")
        new_email = data.get("email")

        if new_email and new_email != user.email:
            if User.query.filter_by(email=new_email).first():
                return({"msg": "Email already taken"}), 400
            user.email = new_email

        if new_name:
            user.name = new_name
        
        try:
            db.session.commit()
            return jsonify(user.serialize()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": f"Database error during profile update: ${str(e)}"}), 500
    
    return jsonify(user.serialize()), 200

@api.route('/user/<int:user_id>/photo', methods=['PATCH'])
@jwt_required()
def upload_user_photo(user_id):
    current_user_id = get_jwt_identity()

    if str(current_user_id) != str(user_id):
        return jsonify({"msg":"Access denied"}), 403
    
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"msg":"User not found"}), 404
    
    data = request.get_json()
    base64_image= data.get("base64_image")

    if not base64_image:
        return jsonify({"msg": "No Base64 image data provided"}), 400
    
    try:
        user.profile_picture_url = base64_image
        db.session.commit()
        return jsonify(user.serialize()), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error guardando Base64: {str(e)}")
        return jsonify({"msg": f"Error saving profile picture: {str(e)}"}),500
    


@api.route('/user/<int:user_id>/saved-routes', methods=['GET'])
@jwt_required()
def get_user_saved_routes(user_id):
    current_user_id = get_jwt_identity()        

    if str(current_user_id) != str(user_id):
        return jsonify({"msg": "Forbidden: Cannot access other user's saved routes"}), 403

    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    saved_routes = user.saved_routes.all()

    routes_data = [route.serialize_basic() for route in saved_routes]

    return jsonify({"routes": routes_data}), 200
    




#----------------endpoints de datos(cities y routes)-----------------------------------



@api.route('/cities', methods=['GET'])
def get_cities():
    cities = db.session.execute(db.select(City)).scalars().all()

    if not cities:
        return jsonify({"msg": "No cities found in database"}), 404

    serialized_cities = [city.serialize() for city in cities]
    return jsonify(serialized_cities), 200




@api.route('/cities/<int:city_id>', methods=['GET'])
def get_single_city(city_id):
    city = db.session.get(City, city_id)

    if not city:
        return jsonify({"msg": "No city found in database"}), 404

    return jsonify(city.serialize()), 200





@api.route('/routes', methods=['GET'])
def get_all_routes():
    routes = db.session.execute(db.select(Route)).scalars().all()

    if not routes:
        return jsonify({"msg": "No routes found in database"}), 404

    serialized_routes = [route.serialize() for route in routes]
    return jsonify(serialized_routes), 200





@api.route('/cities/<int:city_id>/routes', methods=['GET'])
def get_routes_by_city(city_id):

    city = db.session.get(City, city_id)
    if not city:
        return jsonify({"msg": f"City with ID {city_id} not found"}), 404

    routes = db.session.execute(
        db.select(Route).where(Route.city_id == city_id)
    ).scalars().all()

    if not routes:
        return jsonify({"msg": f"No routes found for city {city.name}"}), 404

    
    serialized_routes = [r.serialize() for r in routes]

    return jsonify({
        "city_id": city.id,
        "city_name": city.name,
        "routes": serialized_routes
    }), 200


@api.route('/routes/<int:route_id>', methods=['GET'])
def get_route_by_id(route_id):
    route = db.session.get(Route, route_id)

    if not route:
        return jsonify({"msg": "No route found in database"}), 404

    return jsonify(route.serialize()), 200



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
