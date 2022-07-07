import json
import seaborn as sns

scale = sns.diverging_palette(10, 115, s=60, l=60, as_cmap=False, n=101, sep=1)
scale = scale.as_hex()
s = json.dumps(scale)
s = "export const resultScale = " + s + ";"
with open("resultScale.js", "w") as outfile:
    outfile.write(s)
