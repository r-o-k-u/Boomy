
def seed_settings(app, db):
    from apps.models import Settings
    with app.app_context():
        # Check if there are any existing settings, if not, seed the database
        if not Settings.query.first():
            default_settings = Settings(camera_ip='192.168.0.107', camera_port=81, droid_name='R2-D2', language='English')
            db.session.add(default_settings)
            db.session.commit()
