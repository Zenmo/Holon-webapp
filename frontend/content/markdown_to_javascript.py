import pandas as pd
from io import StringIO


table1 = """|             | Betrouwbaarheid | Betaalbaarheid   €/hh/y | Duurzaamheid % | Zelfconsumptie % |
| ----------- | --------------- | ----------------------- | -------------- | ---------------- |
| ondergrens  | -               | 2400                    | 10             | 40               |
| bovengrens | +               | 1800                    | 50             | 90               |
"""
df = (
    pd.read_table(
        StringIO(table1.replace(" ", "")), sep="|", header=0, index_col=1, skipinitialspace=True
    )
    .dropna(axis=1, how="all")
    .iloc[1:]
)

dd = df.to_dict()

import json

print(json.dumps(dd, indent=4))


#%%
import pandas as pd

df = pd.read_clipboard(header=None).set_index(0)

df = df.set_index(1, append=True)

df = df.unstack()

df.columns = df.columns.droplevel(0)

df.to_dict()
