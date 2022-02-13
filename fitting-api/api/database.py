import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import pool
load_dotenv()
USERNAME = os.getenv('POSTGRES_USERNAME')
PASSWORD = os.getenv('POSTGRES_PASSWORD')
HOST = os.getenv('POSTGRES_HOST')
DATABASE = os.getenv('POSTGRES_DBNAME')

pool = psycopg2.pool.SimpleConnectionPool(
    2,
    100,
    user=USERNAME,
    password=PASSWORD,
    host=HOST,
    database=DATABASE,
)

print("POOL IS OPEN")

