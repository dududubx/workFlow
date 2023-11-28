
type Injector = import('didi').Injector;
type EventBus = import('diagram-js/lib/core/EventBus').default;
type ContextPad = import('diagram-js/lib/features/context-pad/ContextPad').default;
type Modeling = import('diagram-js/lib/features/modeling/Modeling').default;
type ElementFactory = import('bpmn-js/lib/features/modeling/ElementFactory').default;
type Connect = import('diagram-js/lib/features/connect/Connect').default;
type Create = import('diagram-js/lib/features/create/Create').default;
type PopupMenu = import('diagram-js/lib/features/popup-menu/PopupMenu').default;
type Canvas = any;
type Rules = import('diagram-js/lib/features/rules/Rules').default;
type Translate = typeof import("diagram-js/lib/i18n/translate/translate").default;
type Element = import('bpmn-js/lib/model/Types').Element;
type ModdleElement = import('bpmn-js/lib/model/Types').ModdleElement;
type BaseContextPadProvider = import('diagram-js/lib/features/context-pad/ContextPadProvider').default<Element>;
type ContextPadEntries = import('diagram-js/lib/features/context-pad/ContextPadProvider').ContextPadEntries;
type ContextPadEntry = import('diagram-js/lib/features/context-pad/ContextPadProvider').ContextPadEntry;
type ContextPadConfig = {
    autoPlace?: boolean;
};
import { assign } from 'min-dash'
import { category } from '../palette/cutomCategory'
import { nextTick } from 'vue';
export default function ContextPadProvider(this: any, config: ContextPadConfig, injector: Injector, eventBus: EventBus,
    contextPad: ContextPad, modeling: Modeling, elementFactory: ElementFactory,
    connect: Connect, create: Create, popupMenu: PopupMenu,
    canvas: Canvas, rules: Rules, translate: Translate) {
    this._contextPad = contextPad;
    this._modeling = modeling;
    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._rules = rules;
    this._translate = translate;
    config = config || {};
    if (config.autoPlace !== false) {
        this._autoPlace = injector.get('autoPlace', false);
    }
    contextPad.registerProvider(this);
}
ContextPadProvider.$inject = [
    'config.contextPad',
    'injector',
    'eventBus',
    'contextPad',
    'modeling',
    'elementFactory',
    'connect',
    'create',
    'popupMenu',
    'canvas',
    'rules',
    'translate'
];
ContextPadProvider.prototype.getContextPadEntries = function (element: Element) {
    const {
        _autoPlace,
        _create,
        _elementFactory,
        _translate,
        _connect,
        _modeling
    } = this
    let actions = {}
    if (element.type === 'label') {
        return actions;
    }
    function startConnect(event, element) {
        _connect.start(event, element);
    }
    function removeElement(e, element) {
        _modeling.removeElements([element]);
    }
    function appendActions(type: string, className: string, title: string, options?) {
        function appendTask(event, element) {
            if (_autoPlace) {
                const shape = _elementFactory.createShape(assign({ type: type }, options))
                shape['padAdd'] = true
                _autoPlace.append(element, shape)
            }
            else {
                appendTaskStart(event, element)
            }
        }

        function appendTaskStart(event, element) {
            const shape = _elementFactory.createShape(assign({ type: type }, options))
            _create.start(event, shape, element)
        }

        return {
            group: 'model',
            className: className,
            title: _translate(title),
            action: {
                click: type == 'bpmn:SequenceFlow' ? startConnect : appendTask,
                dragstart: type == 'bpmn:SequenceFlow' ? startConnect : appendTaskStart
            }
        }
    }
    if (element.type != 'bpmn:EndEvent' && element.type != 'bpmn:SequenceFlow') {
        category.map((item, index) => {
            let obj = {}
            if (index != 0) {
                obj[`create.${item.className}`] = appendActions(item.type, item.className, item.name)
                assign(actions, obj)
                nextTick(() => {
                    let parentNode = document.querySelector('.djs-context-pad')
                    parentNode?.setAttribute('class', 'djs-context-pad open startCpad')
                    let node = document.querySelector('.' + item.className.split(' ')[1])
                    while (node?.firstChild) {
                        node.removeChild(node.firstChild)
                    }
                    let div = `<svg class="icon padIcon" aria-hidden="true">
                                        <use xlink:href=${item.symbolName}></use>
                                    </svg>`
                    node?.insertAdjacentHTML('beforeend', div)
                })
            }
        })
    }
    assign(actions, {
        'delete': {
            group: 'edit',
            className: 'bpmn-icon-trash',
            title: _translate('删除'),
            action: {
                click: removeElement
            }
        }
    });
    nextTick(() => {
        let parentNode = document.querySelector('.djs-context-pad') as HTMLElement
        if (parentNode)
            parentNode.classList.toggle('noalignPad')
    })
    return actions
}