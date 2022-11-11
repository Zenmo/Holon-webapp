from draftjs_exporter.dom import DOM


def term_link_entity(props):
    print(props)
    link_props = {}

    link_props["linktype"] = "term"
    link_props["introduction"] = props.get("introduction")
    link_props["id"] = props.get("id")

    return DOM.create_element("a", link_props, props["children"])
