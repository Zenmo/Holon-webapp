const interactiveTypeInput = "#panel-type-content #id_type";
const selectSection = "#panel-options-section";
const contiuousSection = "#panel-continuous_values-section";

const ruleModelTypeSelect = "";

$(document).ready(function () {
    function setModelSubtypeSelectors(data) {
        $("select[id$='-model_type']").change(function (e) {
            const model_type = e.target.value;

            const input = $(e.target)
                .closest(".w-panel__content")
                .find("input[id$='-model_subtype']");
            let select;
            if (input) {
                const attributes = input.prop("attributes");

                select = $("<select></select>");

                $.each(attributes, function () {
                    $(select).attr(this.name, this.value);
                });

                input.replaceWith(select);
            }

            select = $(e.target)
                .closest(".w-panel__content")
                .find("select[id$='-model_subtype']");
            select.find("option").remove().end();
            if (!data[model_type]) return;

            for (const [key, value] of Object.entries(
                data[model_type].model_subtype
            )) {
                select.append(
                    $("<option>", {
                        value: key,
                        text: key,
                    })
                );
            }
            select.change(function (e) {
                const attributeInputs = select
                    .closest(".w-panel__content")
                    .find("input[id$='-asset_attribute']");

                attributeInputs.each(function () {
                    const attributes = $(this).prop("attributes");

                    select = $("<select></select>");

                    $.each(attributes, function () {
                        $(select).attr(this.name, this.value);
                    });

                    $(this).replaceWith(select);

                    data[model_type].model_subtype[e.target.value].forEach(
                        (element) => {
                            select.append(
                                $("<option>", {
                                    value: element,
                                    text: element,
                                })
                            );
                        }
                    );
                });
            });
        });
    }
    $.ajax({
        url: "/wt/cms/modelconfig",
        success: function (data, status) {
            setModelSubtypeSelectors(data);
            $("#id_rules-ADD").click(function (e) {
                setModelSubtypeSelectors(data);
            });
        },
    });
    setVisibleElements($(interactiveTypeInput).val());

    $(interactiveTypeInput).change(function (e) {
        setVisibleElements($(this).val());
    });

    function setVisibleElements(type) {
        switch (type) {
            case "CHOICE_SINGLESELECT":
            case "CHOICE_MULTISELECT":
                $(selectSection).show();
                $(contiuousSection).hide();
                break;
            case "CHOICE_CONTINUOUS":
                $(selectSection).hide();
                $(contiuousSection).show();
                break;
            default:
                $(selectSection).hide();
                $(contiuousSection).hide();
                break;
        }
    }
});
