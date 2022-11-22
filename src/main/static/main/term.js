const React = window.React;
const Modifier = window.DraftJS.Modifier;
const EditorState = window.DraftJS.EditorState;

class TermModalWorkflowSource extends window.draftail.ModalWorkflowSource {
    getChooserConfig(entity, selectedText) {
        let url = window.chooserUrls.pageChooser;
        const urlParams = {
            page_type: "main.WikiPage",
            link_text: selectedText,
        };

        if (entity) {
            const data = entity.getData();

            if (data.id) {
                if (data.parentId !== null) {
                    url = `${window.chooserUrls.pageChooser}${data.parentId}/`;
                } else {
                    url = window.chooserUrls.pageChooser;
                }
            }
        }

        return {
            url,
            urlParams,
            onload: window.PAGE_CHOOSER_MODAL_ONLOAD_HANDLERS,
            responses: {
                pageChosen: (data) => {
                    data.prefer_this_title_as_link_text = true;
                    data.title = data.adminTitle;
                    return this.onChosen(data);
                },
            },
        };
    }

    filterEntityData(data) {
        if (data.id) {
            return {
                url: data.url,
                id: data.id,
                parentId: data.parentId,
            };
        }

        return {
            url: data.url,
        };
    }
}

const LINK_ICON = React.createElement(window.wagtail.components.Icon, {
    name: "link",
});
const BROKEN_LINK_ICON = React.createElement(window.wagtail.components.Icon, {
    name: "warning",
});

const getLinkAttributes = (data) => {
    const url = data.url || null;
    let icon;
    let label;

    if (!url) {
        icon = BROKEN_LINK_ICON;
        label = gettext("Broken link");
    } else if (data.id) {
        icon = LINK_ICON;
        label = url;
    }

    return {
        url,
        icon,
        label,
    };
};

const Link = (props) => {
    const { entityKey, contentState } = props;
    const data = contentState.getEntity(entityKey).getData();

    var _extends =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };

    return React.createElement(
        window.draftail.TooltipEntity,
        _extends({}, props, getLinkAttributes(data))
    );
};

window.draftail.registerPlugin({
    type: "TERM",
    source: TermModalWorkflowSource,
    decorator: Link,
});
