import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from .database import pool

def create_app():
    """
    Flask app factory

    Returns:
        app (Flask): flask app
    """    
    app = Flask(__name__)
    CORS(app)
    load_dotenv()
    from .bp_anova import anova
    app.register_blueprint(anova)

    return app

def shutdown_app():
    """
    Close connection pool
    """    

    pool.closeall()
    print("POOL IS CLOSED")