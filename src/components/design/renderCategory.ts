
//自定义元素的类型
const customElements = ['bpmn:Task', 'bpmn:EndEvent', 'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:ParallelGateway', 'bpmn:UserTask']
//自定义元素的配置
const customConfig = {
    'bpmn:Task': {
        'svgName': '#icon-checker',
        'className': 'task',
        'pointName': '审核节点',
        'attr': { x: 0, y: 0, width: 140, height: 50 }
    },
    'bpmn:EndEvent': {
        'svgName': '#icon-node-stop',
        'className': 'end',
        'pointName': '结束节点',
        'attr': { x: 0, y: 0, width: 53, height: 53 }
    },
    'bpmn:IntermediateThrowEvent': {
        'svgName': '#icon-node-sendread',
        'className': 'translate',
        'pointName': '传阅节点',
        'attr': { x: 0, y: 0, width: 53, height: 53 }
    },
    'bpmn:IntermediateCatchEvent': {
        'svgName': '#icon-node-start',
        'className': 'start',
        'pointName': '开始节点',
        'attr': { x: 0, y: 0, width: 53, height: 53 }
    },
    'bpmn:ParallelGateway': {
        'svgName': '#icon-node-condition',
        'className': 'gate',
        'pointName': '条件判断节点',
        'attr': { x: 0, y: 0, width: 100, height: 100 }
    },
    'bpmn:UserTask': {
        'svgName': '#icon-node-sonwf',
        'className': 'task',
        'pointName': '子流程节点',
        'attr': { x: 0, y: 0, width: 140, height: 50 }
    }
}
export { customElements, customConfig }