from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean,ForeignKey, Integer, Column, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional



db = SQLAlchemy()


#-------------Tablas SQL-------------------


class User(db.Model):
    __tablename__ ="user"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(15))
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    
    def serialize(self) :
        return {
                "id": self.id,
                "name": self.name,
                "email": self.email,
                "is_active":self.is_active,          
                }
    


#--------------------metodo estatico CRUD
    @staticmethod
    def create_user(name, email, password):

        if User.query.filter_by(email=email).first():
            return None,"Email already registered."
        
        new_user = User(name=name,email=email, password=password)
        
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

#----------------------


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
    
    def __repr__(self):
        return f'Route: {self.name}'
        
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
            "id": self.id,
            "name": self.name,
            "day": self.day,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "route_id": self.route_id,
            "route": self.route.name if self.route else None
        }



