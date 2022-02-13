import pandas as pd
from pandas.api.types import is_numeric_dtype
import numpy as np
from scipy.optimize import minimize
from .stats import parameter_ci

def model(df: pd.DataFrame, y_name: str, x_names: list):
    """
    Creates an anova type model of the DataFrame provided

    Args:
        df (pd.DataFrame): [description]
        y_name (str): [description]
        x_names (list): [description]

    Returns:
        [type]: [description]
    """    
    mappings = {}
    # convert to categorical
    for nm in x_names:
        series = df[nm]
        if not is_numeric_dtype(series):
            values = series.unique()
            mappings[nm] = {values[i]: i for i in range(len(values))}
            df[nm] = df[nm].map(lambda val: mappings[nm][val])
        df[nm] = df[nm].astype(np.float64)
    features = df[x_names]
    feature_names = [f'X{i + 1}' for i in range(len(x_names))]
    features.rename({x_names[i]:f'X{i + 1}' for i in range(len(x_names))})
    y = df[y_name].astype(np.float64).values
    del df

    # add bias

    features['X0'] = np.ones(len(features), dtype=np.float64)
    feature_names.append('X0')

    X = features.values
    info_matrix = np.matmul(X.T, X)
    print(info_matrix)
    # perform fitting
    def y_func(beta):
        yhat = np.matmul(X, beta)
        e = y - yhat
        return np.matmul(e.T, e)
    def dy_func(beta):
        return -2*np.matmul(y.T, X) + 2*np.matmul(beta, info_matrix)
    _, beta_dim = X.shape
    sol = minimize(y_func, np.random.random(beta_dim), method='Newton-CG', jac=dy_func)
    beta = sol.x
    # get parameter significance
    dof = len(y) - beta_dim  # degrees of freedom
    var_hat = sol.fun / dof
    inv_info = np.linalg.inv(info_matrix)
    beta_stats = parameter_ci(beta, var_hat, inv_info, dof, feature_names)

    return beta_stats
    # return stats, mappings