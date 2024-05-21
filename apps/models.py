from apps import db

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    camera_ip = db.Column(db.String(100))
    camera_port = db.Column(db.Integer)
    droid_name = db.Column(db.String(100))
    language = db.Column(db.String(100))
