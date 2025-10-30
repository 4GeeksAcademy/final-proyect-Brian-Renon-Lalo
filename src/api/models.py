from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, String, Boolean,ForeignKey, Integer, Column, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional



db = SQLAlchemy()

DEFAULT_AVATAR_URL ="/profile_pictures/rz-profile-img.png"





class User(db.Model):
    __tablename__ ="user"
    __allow_unmapped__ = True
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(15), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    profile_picture_url = db.Column(db.Text, default=DEFAULT_AVATAR_URL)
    saved_routes: Mapped[List["Route"]] = relationship(secondary="saved_user_routes", lazy='dynamic', overlaps='savers')
    saved_route_links: Mapped[List["SavedRoute"]] = relationship(back_populates="user", cascade="all, delete-orphan", overlaps="saved_routes, savers")
    
    def serialize(self) :
        return {
                "id": self.id,
                "name": self.name,
                "email": self.email,
                "is_active":self.is_active, 
                "profile_picture_url": self.profile_picture_url,
                "saved_routes_count": self.saved_routes.count()         
                }
    

    @staticmethod
    def create_user(name, email, password):

        if User.query.filter_by(email=email).first():
            return None,"Email already registered."
        
        new_user = User(name=name, email=email, password=password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            return new_user, "User Created successfully"
        
        except Exception as e:
            db.session.rollback()
            return None, f"Error creating user: {e}"


    @staticmethod
    def get_user_by_id(user_id):
        return db.session.get(User, user_id)

    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod 
    def delete_user(user_id):
        user_to_delete = User.get_user_by_id(user_id)
        if user_to_delete:
            try:
                db.session.delete(user_to_delete)
                db.session.commit()
                return True, "User deleted successfully"
            
            except Exception as e:
                db.session.rollback()
                return False, f"Error deleting user: {e}"
        return False, "User not found."



class SavedRoute(db.Model): 
    __tablename__='saved_user_routes'
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    route_id = Column(Integer, ForeignKey('route.id'), primary_key=True)
    user: Mapped["User"] = relationship(back_populates="saved_route_links", overlaps="savers,saved_routes")
    route: Mapped["Route"] = relationship(back_populates="savers_links", overlaps="saved_routes, savers")
    
    def __repr__(self):
        return f'<SavedRoute User: {self.user_id} => Route:{self.route_id}>'
    
    def serialize_basic(self):
        return {
            "user_id": self.user_id,
            "route_id": self.route_id
        }




class City(db.Model) :
    __tablename__ = "city"
    id: Mapped[int] = mapped_column(primary_key=True)
    name:Mapped[str]= mapped_column(String(100),nullable=False, index=True)
    continent: Mapped [str]= mapped_column (String(20), nullable=True)
    routes: Mapped[List["Route"]] = relationship(back_populates="city", cascade="all, delete-orphan")
  
    def __repr__(self):
        return f'<City {self.name}>'
    
    def serialize(self):
        return {
                "id": self.id,
                "name": self.name,
                "continent":self.continent,
                }
    

class Route (db.Model) :
    __tablename__="route"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    city_id: Mapped[int] = mapped_column(ForeignKey("city.id"))
    city: Mapped["City"] = relationship(back_populates="routes")
    places: Mapped[List["RoutePlace"]] = relationship(back_populates="route", cascade="all, delete-orphan")
    savers_links: Mapped[List["SavedRoute"]] = relationship(back_populates="route", cascade="all, delete-orphan", overlaps="saved_routes, savers")
    
    def __repr__(self):
        return f'Route: {self.name}'
    
    # 💡 ESTE ES EL MÉTODO QUE FALTA Y DEBES AÑADIR:
    def serialize_basic(self):
        # Devuelve la información esencial para mostrar la lista de rutas guardadas
        return {
            "id": self.id,
            "name": self.name,
            "city_name": self.city.name if self.city else "N/A" 
        }
        
    def serialize(self):
        
        return{
            "id": self.id,
            "name": self.name,
            "city_id": self.city_id,
            "places": [place.serialize() for place in self.places]
        }

class RoutePlace(db.Model):
    __tablename__="route_place"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    day: Mapped[str] = mapped_column(String(50), nullable=True)
    route_id: Mapped[int] = mapped_column(ForeignKey("route.id"))
    route: Mapped["Route"] = relationship(back_populates="places")
    latitude: Mapped[float] = mapped_column(db.Float, nullable=True)
    longitude: Mapped[float] = mapped_column(db.Float, nullable=True)
    
    def __repr__(self):
        route_name = self.route.name if self.route else "Unknown Route"
        return f'Place:{self.name} | Day:{self.day} | Route:{route_name}'
    
    def serialize(self):
        return{
            "name": self.name,
            "day": self.day,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "route_id": self.route_id,
            "route": self.route.name if self.route else None
        }



