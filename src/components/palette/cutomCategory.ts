type category = {
    name: string,
    type: string,
    className: string,
    symbolName: string
}[]
//节点分类
export const category: category = [
    {
        name: '开始节点',
        type: 'bpmn:IntermediateCatchEvent',
        className: 'icon-custom startPoint',
        symbolName: '#icon-node-start'
    },
    {
        name: '结束节点',
        type: 'bpmn:EndEvent',
        className: 'icon-custom endPoint',
        symbolName: '#icon-node-stop'
    },
    {
        name: '传阅节点',
        type: 'bpmn:IntermediateThrowEvent',
        className: 'icon-custom transPoint',
        symbolName: '#icon-node-sendread'
    },
    {
        name: '审核节点',
        type: 'bpmn:Task',
        className: 'icon-custom taskPoint',
        symbolName: '#icon-checker'
    },
    {
        name: '条件判断节点',
        type: 'bpmn:ParallelGateway',
        className: 'icon-custom gatewayPoint',
        symbolName: '#icon-node-condition'
    },
    {
        name: '流程连线',
        type: 'bpmn:SequenceFlow',
        className: 'icon-custom flowPoint',
        symbolName: '#icon-line'
    },
    {
        name: '子流程节点',
        type: 'bpmn:UserTask',
        className: 'icon-custom childPoint',
        symbolName: '#icon-node-sonwf'
    }
]