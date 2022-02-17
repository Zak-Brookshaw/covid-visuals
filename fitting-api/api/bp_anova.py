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
    conn = pool.getconn()
    try:
        data = request.json
        x_names = data['x']
        y_name = data['y']
        all_names = x_names + [y_name, 'date']
        print(x_names)
        print(y_name)
        print(all_names)
        dataset = {
            key:[]
            for key in all_names
        }
        s_string = ','.join([ name for name in all_names])
        query = f"""
        SELECT {s_string} FROM open_covid ORDER BY date ASC
        """
        
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(query, tuple(all_names))
        rows = cursor.fetchall()
        dataset = pd.DataFrame(np.array(rows))
        dataset.dropna(inplace=True)
        dataset.rename(columns={
            i: all_names[i]
            for i in range(len(all_names))
            },
            inplace=True
        )
        # check if columns only has  -- safety for linearly indep. from bias constant
        for col in dataset.columns:
            if len(dataset[col].unique()) == 1:
                dataset.drop(labels=col, inplace=True)
        beta_stats, y_hat, mapping = a_model(dataset, y_name, x_names)
        resp = {
            'stats': beta_stats,
            'y': dataset[y_name].tolist(),
            'y_hat': y_hat.tolist(),
            'residuals': (dataset[y_name] - y_hat).tolist(),
            'date': [pd.to_datetime(day).strftime("%Y-%m-%dT%H:%M:%SZ") for day in dataset['date']]
        }
    except:
        resp = {
            'status': 500,
            'message': 'could not fit data'
        }

    finally:
        pool.putconn(conn)

    return resp
