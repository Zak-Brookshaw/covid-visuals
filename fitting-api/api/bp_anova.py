from flask import Blueprint, request, current_app, jsonify
import psycopg2
import psycopg2.extras
import pandas as pd
import numpy as np
from . import pool
from modelling import a_model

anova = Blueprint('anova', __name__, url_prefix='/anova')

@anova.route('fit-model', methods=['POST'])
def fit_model():
    data = request.json
    x_names = data['x']
    y_name = data['y']
    all_names = x_names + [y_name]
    print(x_names)
    print(y_name)
    print(all_names)
    dataset = {
        key:[]
        for key in all_names
    }
    s_string = ','.join([ name for name in all_names])
    query = f"""
    SELECT {s_string} FROM open_covid
    """
    conn = pool.getconn()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(query, tuple(all_names))
    rows = cursor.fetchall()
    dataset = pd.DataFrame(np.array(rows))
    dataset.dropna(inplace=True)
    print(dataset.head())
    dataset.rename(columns={
        i: all_names[i]
        for i in range(len(all_names))
        },
        inplace=True
    )
    beta_stats = a_model(dataset, y_name, x_names)
    
    pool.putconn(conn)
    return beta_stats


