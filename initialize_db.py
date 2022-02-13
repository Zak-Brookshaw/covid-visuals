import pandas as pd
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import datetime
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine

def main():
    """
    Database initialization function

    Returns:
        (int): classic 'c' format to return 0 on successfull run of program
    """    
    data = pd.read_csv('./data.csv')
    data['date'] = data['date'].map(lambda ts: datetime.datetime.strptime(ts, '%Y-%m-%d'))
    for key in data.keys():
        if data[key].isnull().all():
            data.drop(columns=[key], inplace=True)
    load_dotenv()
    user = os.getenv('POSTGRES_USERNAME')
    password = os.getenv('POSTGRES_PASSWORD')
    host = os.getenv("POSTGRES_HOST")
    dbname = os.getenv("POSTGRES_DBNAME")
    conn = psycopg2.connect(
        dbname='postgres',
        user=user, 
        host=host,
        password=password
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    password = password.replace('@', '%40')
    cursor.execute(f"CREATE DATABASE {dbname}")
    engine = create_engine(f'postgresql+psycopg2://{user}:{password}@{host}/{dbname}')
    data.to_sql('open_covid', con=engine)
    conn.close()

    return 0

if __name__ == '__main__':
    main()