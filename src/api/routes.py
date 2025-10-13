
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route ('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg":"Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg":"User already exists"}), 400
    
    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    user, message = User.create_user(email=email, password=hashed_password.decode('utf-8'))
    if user is None:
        return jsonify({"msg": message}), 400
    
    return jsonify(user.serialize()), 201



@api.route ('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"msg":"Email and password are required"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg":"Incorrect Credentials"}), 401
    
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"msg": "Incorrect credentials"}), 401
    
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 201



@api.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_single_user(user_id):
    user = User.get_user_by_id(user_id)

    if user is None:
        return jsonify({"msg":"User not found"}), 404
    
    current_user_id = get_jwt_identity()
    
    if str(current_user_id) != str(user_id):
        return jsonify({"msg":"Acces denied"}), 403
    
    return jsonify(user.serialize()), 200

@api.route ('user/<int:user_id>', methods= ['DELETE'])
@jwt_required()
def delete_user_route(user_id):
    current_user_id = get_jwt_identity()
    user_deleting = User.get_user_by_id(current_user_id)

    if not user_deleting:
        return jsonify({"msg": "Invalid token identity"}), 401
     
    
    succes, msg = User.delete_user(user_id)
    if succes:
        return jsonify({"msg":"User deleted successfully"}), 201
    else:
        return jsonify({"msg":"Error deleting user"}), 404



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
