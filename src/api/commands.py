from flask.cli import with_appcontext
import click
from seeder import seed_data, SEED_DATA
from api.models import db, User

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

#-----------------comando seed--------------
    @app.cli.command("seed-db")
    @with_appcontext
    def seed_db():
        """Ejecuta la función seed_data para poblar la DB."""
        try:
            seed_data(app, SEED_DATA)
        except Exception as e:
            # Captura y muestra errores de siembra
            click.echo(f"❌ Error durante la siembra de datos: {e}")
            return 1 # Devuelve un código de error
        
        click.echo("🎉 Siembra de datos completada exitosamente.")
        return 0 # Devuelve un código de éxito

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass