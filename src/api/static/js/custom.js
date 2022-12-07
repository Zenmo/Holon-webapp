const interactiveTypeInput = "#panel-type-content #id_type";
const selectSection = "#panel-options-section";
const contiuousSection = "#panel-continuous_values-section";

// Shows or hides options in the Interactive Input CMS based on the type of interactive element that is chosen
$(document).ready(function () {
    setVisibleElements($(interactiveTypeInput).val());

    $(interactiveTypeInput).change(function (e) {
        setVisibleElements($(this).val());
    });

    function setVisibleElements(type) {
        switch (type) {
            case "single_select":
            case "multi_select":
                $(selectSection).show();
                $(contiuousSection).hide();
                break;
            case "continuous":
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
