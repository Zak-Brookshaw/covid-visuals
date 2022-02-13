import os
from dotenv import load_dotenv
from api import create_app, shutdown_app
import atexit
load_dotenv()
HOST = os.environ.get('FLASK_RUN_HOST')
PORT = os.environ.get('FLASK_RUN_PORT')

if __name__ == '__main__':
    app = create_app()
    atexit.register(shutdown_app)
    app.run(host=HOST, port=PORT, debug=True)

