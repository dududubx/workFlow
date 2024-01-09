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
                    <div class="taskContainer taskBorder ${element.class ? element.class : ''}" title="${name}">
                        <svg class="icon svgIcon" aria-hidden="true">
                            <use xlink:href=${svgName}></use>
                        </svg>
                        <div class="taskName sponsor_name">
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
                    <div class="gateContainer ${element.class ? element.class : ''}">
                       <div class='gateName sponsor_name'>
                       ${name}
                       </div>
                    </div>
                    `
                title.innerHTML = name
            }
            else {
                div = `
                    <div class="otherContainer ${element.class ? element.class : ''}">
                        <svg class="icon otherSvg" aria-hidden="true">
                            <use xlink:href=${svgName}></use>
                        </svg>
                    </div>
                    `
                title.innerHTML = pointName
            }
            //将html标签添加到foreignObject节点中
            customIcon?.insertAdjacentHTML('beforeend', div)
            let nextSibEle = document.querySelector(`g[data-element-id=${element.id}] rect`) as HTMLElement
            if (nextSibEle) {
                nextSibEle.innerHTML = ''
                svgAppend(nextSibEle, title)
            }
            // if (element.type == 'bpmn:Task' || element.type == 'bpmn:UserTask'|| element.type == '') {

            // }
            // console.log(element);

            if (element.businessObject.$attrs.configData) {
                let configData = JSON.parse(element.businessObject.$attrs.configData)
                let hoverEle = $(`.djs-group g[data-element-id=${element.id}]`)
                if (configData.hasOwnProperty('checkerArr') && hoverEle && configData.checkerArr.length > 0) {
                    hoverEle.hover((e) => {
                        const hasCheckerHtml = document.querySelector(`#${element.id}`) as HTMLDivElement
                        let nextSibEle = document.querySelector(`g[data-element-id=${element.id}]`) as HTMLElement
                        // console.log(nextSibEle.getBoundingClientRect());
                        if (!hasCheckerHtml) {
                            const checkerHtml = document.createElement('div')
                            checkerHtml.setAttribute('class', 'show_checker')
                            checkerHtml.setAttribute('id', `${element.id}`)
                            checkerHtml.style.position = 'absolute'
                            checkerHtml.style.left = nextSibEle.getBoundingClientRect().left + 7 + 'px'
                            checkerHtml.style.top = nextSibEle.getBoundingClientRect().top + element.height + 7 + 'px'
                            // let checkerHtml = `<div class='show_checker'>

                            //     </div>`
                            let checkerTop = `<div class='hoverChecker_top hoverChecker_text'>
                                    ${(window as any).maslg.get(`${name}`)}
                                </div>`
                            checkerHtml.insertAdjacentHTML('beforeend', checkerTop)
                            configData.checkerArr.forEach(item => {
                                let checkerContent = ''
                                if (typeof item.inputItem == 'object') {
                                    checkerContent = `<div class='hoverChecker_text hover_name'>
                                        ${item.inputItem.label}
                                    </div>`
                                }
                                else {
                                    checkerContent = `<div class='hoverChecker_text hover_name'>
                                        ${item.inputItem}
                                    </div>`

                                }
                                checkerHtml.insertAdjacentHTML('beforeend', checkerContent)
                            })
                            document.body.appendChild(checkerHtml)
                        }
                        else {
                            hasCheckerHtml.style.display = 'flex'
                        }
                    })
                    hoverEle.on('mouseleave', function () {
                        const hasCheckerHtml = document.querySelector(`#${element.id}`) as HTMLDivElement
                        if (hasCheckerHtml) {
                            hasCheckerHtml.style.display = 'none'
                        }
                    })
                }

            }

            // console.log($('.djs-shape'));
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
    // console.log(connection);

}
//连接线方法
CustomRenderer.prototype.getShapePath = function (shape) {
    // console.log(shape);
}