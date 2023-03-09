import jinja2

with open("dieseltruck.json.j2", 'r') as infile:
    template = jinja2.Template(infile.read())

i_0 = 1000
for i in range(20):
    i = i_0 + i
    print(template.render(
        pk=i,
        gridconnection=2
    )
    )
