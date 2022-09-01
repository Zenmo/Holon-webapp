#%%
import json
import seaborn as sns

scale_low = sns.diverging_palette(10, 60, s=60, l=60, as_cmap=False, n=50, sep=1)
scale_high = sns.diverging_palette(60, 115, s=60, l=60, as_cmap=False, n=51, sep=1)

scale = [*scale_low.as_hex(), *scale_high.as_hex()]
s = json.dumps(scale, indent=2)
s = "export const resultScale = " + s + ";"
with open("resultScale.ts", "w") as outfile:
    outfile.write(s)
