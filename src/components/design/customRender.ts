import inherits from 'inherits'

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

import {
    append as svgAppend,
    create as svgCreate,
    classes as svgClasses
} from 'tiny-svg'
import {
    isObject,
    assign,
    forEach
} from 'min-dash';
import { customElements, customConfig } from './renderCategory'
export default function CustomRenderer(this: any, eventBus, styles, textRenderer) {
    BaseRenderer.call(this, eventBus, 2000)
    var computeStyle = styles.computeStyle
    //重写renderer中的drawShape方法修改节点的展示
    this.drawCustomElements = function (parentNode, element) {
        const type = element.type
        if (customElements.includes(type)) {
            const { svgName, attr, className, pointName } = customConfig[type]
            //在svg中创建一个foreignObject节点，然后可以在该节点中写html标签
            const customIcon = svgCreate('foreignObject', {
                ...attr
            })
            // element['width'] = attr.width
            // element['height'] = attr.height
            //将创建的节点加到渲染节点中
            svgAppend(parentNode, customIcon)
            //给父节点加类名
            svgClasses(parentNode).add(className)
            const title = svgCreate('title')
            let confiName = element.businessObject.$attrs.configName
            let name = pointName
            if (element.name) {
                name = element.name
            }
            else if (confiName) {
                name = confiName
                element.name = confiName
            }
            else {
                element.name = pointName
            }
            let div = ''
            if (type == "bpmn:Task" || type == 'bpmn:UserTask') {

                div = `
                    
                    <div class="taskContainer taskBorder" title="${name}">
                        <svg class="icon svgIcon" aria-hidden="true">
                            <use xlink:href=${svgName}></use>
                        </svg>
                        <div class="taskName">
                            ${name}
                        </div>
                    </div>
                    `
                title.innerHTML = name
                // console.log(parentNode.parentNode);
                // parentNode.parentNode.setAttribute('title', name)
                // parentNode.setAttribute('title', name)
            }
            else if (type == 'bpmn:ParallelGateway') {
                // let name = pointName
                // if(element.name){
                //     name = element.name
                // }
                // else{
                //     element.name = pointName
                // }
                div = `
                    <div class="gateContainer">
                       <div class='gateName'>
                       ${name}
                       </div>
                    </div>
                    `
                title.innerHTML = name
            }
            else {
                div = `
                    <div class="otherContainer">
                        <svg class="icon otherSvg" aria-hidden="true">
                            <use xlink:href=${svgName}></use>
                        </svg>
                    </div>
                    `
                title.innerHTML = pointName
            }
            //将html标签添加到foreignObject节点中
            customIcon?.insertAdjacentHTML('beforeend', div)
            let nextSibEle = document.querySelector(`.${className}`)?.nextSibling as HTMLElement
            if (nextSibEle) {
                nextSibEle.innerHTML = ''
                svgAppend(nextSibEle, title)
            }
            return customIcon

        }
        const shape = this.bpmnRenderer?.drawShape(parentNode, element)
        return shape
    }
}

inherits(CustomRenderer, BaseRenderer)

CustomRenderer.$inject = ['eventBus', 'styles']

CustomRenderer.prototype.canRender = function (element) {
    // return !element.labelTarget
    return true
}
//重写drawShape方法，该方法是renderer模块的核心
CustomRenderer.prototype.drawShape = function (p, element) {
    return this.drawCustomElements(p, element)
}
//重写连接线方法
CustomRenderer.prototype.drawConnection = function (visuals, connection) {

}
//连接线方法
CustomRenderer.prototype.getShapePath = function (shape) {
    // console.log(element);
}