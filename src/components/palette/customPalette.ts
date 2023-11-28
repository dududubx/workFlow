
//自定义左侧节点选择器
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import Create from 'diagram-js/lib/features/create/Create'
import { category } from './cutomCategory'
import {assign} from 'min-dash'
export default function PaletteProvider(this, palette, create:Create, elementFactory:ElementFactory,spaceTool, lassoTool, handTool, globalConnect,translate){
        this.palette = palette;
        this.create = create;
        this.elementFactory = elementFactory;
        this.spaceTool = spaceTool;
        this.lassoTool = lassoTool;
        this.handTool = handTool;
        this.globalConnect = globalConnect;
        this.translate = translate;

        palette.registerProvider(this)
}

PaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'spaceTool',
    'lassoTool',
    'handTool',
    'globalConnect',
    'translate'
]
//重写原型上的节点类型方法
PaletteProvider.prototype.getPaletteEntries  = function(element){
    const {
        create,
        elementFactory,
        globalConnect,
        translate
    } = this
    let actions = {}

    function createAction(type:string, group:string, className:string, title:string, options?){ 
        function createTast(){
            return function(event){  
                const shape = elementFactory.createShape(assign({type:type}, options))
                //只在拖到或点击节点时触发
                create.start(event, shape)
            }
        }
        let shortType = type.replace(/^bpmn:/, '')
        return {
            group:type=='bpmn:SequenceFlow' ? 'tools' : group , //节点分裂
            className:className, //节点class名
            title:title, //节点名称
            action:{ //节点操作方法
                dragstart: type=='bpmn:SequenceFlow'? () => {} : createTast(),
                //当为连接线时需要调用原型上的globalConnect方法，创建连接线
                click: type=='bpmn:SequenceFlow' ? function(event) {
                    globalConnect.start(event);
                  } : createTast() 
            }
            
        }
    } 
    //批量创建节点类型
    category.map(item => {
        let obj = {}
        obj[`create.${item.className}`] = createAction(item.type, 'model', item.className, item.name)
        assign(actions, obj)
    })
    return actions
}