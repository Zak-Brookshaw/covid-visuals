import numpy as np
import pandas as pd
from scipy import stats

def parameter_ci(beta: np.array, var_hat: float, inv_info: np.array, dof: int, feature_names: list):
    """
    Calculates the 95% confidence that a parameter is significant, for fitted model

    Args:
        beta (np.array): model parameters
        var_hat (float): estimate of variance
        inv_info (np.array): inverse of fischer's information matrix 
        dof (int): degrees of freedom

    Returns:

        beta_stats (dict): dictionary containing the feature's name, parameter value and statistical significance
    """    
    noise_probe = np.sqrt(inv_info.diagonal()*var_hat)
    beta_probe = beta / noise_probe
    t_stat = stats.t.ppf(.975, dof)
    significance = np.abs(beta_probe) > t_stat
    beta_stats = {
        feature_names[i]: {
            'parameter': float(beta[i]),
            '95% CI': bool(significance[i])
        }
        for i in range(len(beta))
    }
    return beta_stats



