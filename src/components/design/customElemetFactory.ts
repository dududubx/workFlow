import BpmnElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import inherits from 'inherits';
import {
    getBusinessObject,
    getDi,
    is
} from 'bpmn-js/lib/util/ModelUtil';
import {
    isExpanded
} from 'bpmn-js/lib/util/DiUtil';
export default function CustomElementFactory(this, bpmnFactory, moddle, translate) {
    BpmnElementFactory.call(this, bpmnFactory, moddle, translate);

    this._bpmnFactory = bpmnFactory;
    this._moddle = moddle;
    this._translate = translate;
}

inherits(CustomElementFactory, BpmnElementFactory);

CustomElementFactory.$inject = [
    'bpmnFactory',
    'moddle',
    'translate'
];
// 重写bpmn中BpmnElementFactory的一些方法
CustomElementFactory.prototype.getDefaultSize = function (element, di) {

    var bo = getBusinessObject(element);
    di = di || getDi(element);

    if (is(bo, 'bpmn:SubProcess')) {
        if (isExpanded(bo, di)) {
            return { width: 350, height: 200 };
        } else {
            return { width: 100, height: 80 };
        }
    }

    if (is(bo, 'bpmn:Task')) {
        return { width: 140, height: 50 };
    }

    if (is(bo, 'bpmn:Gateway')) {
        return { width: 100, height: 100 };
    }

    if (is(bo, 'bpmn:Event')) {
        return { width: 53, height: 53 };
    }

    if (is(bo, 'bpmn:Participant')) {
        if (isExpanded(bo, di)) {
            return { width: 600, height: 250 };
        } else {
            return { width: 400, height: 60 };
        }
    }

    if (is(bo, 'bpmn:Lane')) {
        return { width: 400, height: 100 };
    }

    if (is(bo, 'bpmn:DataObjectReference')) {
        return { width: 36, height: 50 };
    }

    if (is(bo, 'bpmn:DataStoreReference')) {
        return { width: 50, height: 50 };
    }

    if (is(bo, 'bpmn:TextAnnotation')) {
        return { width: 100, height: 30 };
    }

    if (is(bo, 'bpmn:Group')) {
        return { width: 300, height: 300 };
    }

    return { width: 100, height: 80 };
};