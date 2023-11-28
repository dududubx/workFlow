import { forEach, isDefined } from 'min-dash';


const preExecute = function (this: any, context) {
    var modeling = this._modeling;

    var elements = context.elements,
        alignment = context.alignment;
    forEach(elements, function (element: any, index) {
        var delta = {
            x: 0,
            y: 0
        };
        if (isDefined(alignment.left)) {
            delta.x = alignment.left - element.x;

        } else if (isDefined(alignment.right)) {
            delta.x = (alignment.right - element.width) - element.x;

        } else if (isDefined(alignment.center)) {
            delta.x = (alignment.center - Math.round(element.width / 2)) - element.x;

        } else if (isDefined(alignment.top)) {
            delta.y = alignment.top - element.y;

        } else if (isDefined(alignment.bottom)) {
            delta.y = (alignment.bottom - element.height) - element.y;

        } else if (isDefined(alignment.middle)) {
            delta.y = (alignment.middle - Math.round(element.height / 2)) - element.y;
        }
        else if (isDefined(alignment.horizonta)) {
            delta.y = (alignment.horizonta.y - Math.round(element.height / 2) - element.y)
            if (index != 0 && index != elements.length - 1) {
                delta.x = alignment.horizonta.x + elements[index - 1].width + elements[index - 1].x - element.x
            }
        }
        modeling.moveElements([element], delta, element.parent);
    });
};

export default preExecute
