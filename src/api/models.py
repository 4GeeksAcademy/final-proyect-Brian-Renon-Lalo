
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean,ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List



db = SQLAlchemy()




#Tablas
class User(db.Model):
    __tablename__ ="user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    places: Mapped [List["Place"]]=relationship(back_populates="user", cascade="all, delete-orphan")
    
    
    def serialize(self) :
        return {
                "id": self.id,
                "email": self.email,
                "is_active":self.is_active,          
                }
    
#metodo estatico CRUD
    @staticmethod
    def create_user(email,password):

        if User.query.filter_by(email=email).first():
            return None,"Email already registered."
    
        new_user = User(email=email, password=password)
        
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



class City(db.Model) :
    __tablename__ = "city"
    id: Mapped[int] = mapped_column(primary_key=True)
    name:Mapped[str]= mapped_column(String(100),nullable=False, index=True)
    continent: Mapped [str]= mapped_column (String(20), nullable=True)
    places: Mapped [List["Place"]]=relationship(back_populates="city", cascade="all, delete-orphan")
    
    def serialize(self):
        return {
                "id": self.id,
                "name": self.name,
                "continent":self.continent
                }
    
        

class Place(db.Model) :
    __tablename__="place"
    id: Mapped[int]= mapped_column(primary_key=True)
    name: Mapped[str]=mapped_column(String(150),nullable=False)
    level:Mapped[int]= mapped_column(Integer, nullable=False, default=1)
    city_id: Mapped[int]= mapped_column(ForeignKey("city.id"),nullable=False)
    user_id: Mapped[int]=mapped_column(ForeignKey("user.id"),nullable=True)
    city: Mapped[City]= relationship(back_populates="places")
    user: Mapped[User]= relationship(back_populates="places")
   
   
    def serialize(self):
        return {
                "id": self.id,
                "name": self.name,
                "level":self.level,
                "city_id":self.city_id,
                "user_id":self.user_id
                }

