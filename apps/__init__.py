# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present Boomy.us
"""

import os

from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from importlib import import_module
import pygame

db = SQLAlchemy()
login_manager = LoginManager()
appHasRunBefore:bool = False

def register_extensions(app):
    db.init_app(app)
    login_manager.init_app(app)


def register_blueprints(app):
    for module_name in ('authentication', 'home', 'api'):
        module = import_module('apps.{}.routes'.format(module_name))
        app.register_blueprint(module.blueprint)

def play_audio():
    pygame.mixer.init()
    pygame.mixer.music.load("./apps/static/assets/audio/on.mp3")
    pygame.mixer.music.play()

def configure_database(app):
    
    @app.before_request
    def initialize_database():
        global appHasRunBefore
        if not appHasRunBefore:
            try:
                db.create_all()
            except Exception as e:

                print('> Error: DBMS Exception: ' + str(e) )

                # fallback to SQLite
                basedir = os.path.abspath(os.path.dirname(__file__))
                app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite3')

                print('> Fallback to SQLite ')
                db.create_all()
            appHasRunBefore = True

    @app.teardown_request
    def shutdown_session(exception=None):
        db.session.remove()

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    register_extensions(app)
    register_blueprints(app)
    configure_database(app)
    play_audio()
    return app
