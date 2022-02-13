import unittest
from modelling import a_model
import pandas as pd

class TestAnova(unittest.TestCase):

    def test_a_model(self):
        df = pd.DataFrame({'x': [1, 2, 3, 4, 5], 'not':[12, 402, -3, 41, 1055]})
        params = [2, 1]
        df['y'] = df['x'].map(lambda x: x*params[0] + params[1])
        beta_stats = a_model(df, 'y', ['x', 'not'])
        print(beta_stats)