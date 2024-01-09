<template>
    <div class="design">
        <div class="design-top">
            <div class="design-top_lefticon">
                <img src="../../assets/image/logo.png" />
            </div>
            <div class="design-top_centerHandle">
                <el-tooltip class="item" effect="dark" :content="maslg('撤销')" placement="bottom">
                    <el-button text @click="undo">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-undo"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('重做')" placement="bottom">
                    <el-button text @click="redo">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-redo"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <span class="handle_split">|</span>
                <el-tooltip class="item" effect="dark" :content="maslg('左对齐')" placement="bottom">
                    <el-button text @click="alignElements('left')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-layout-left"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('居中')" placement="bottom">
                    <el-button text @click="alignElements('middle')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-layout-vertical"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('右对齐')" placement="bottom">
                    <el-button text @click="alignElements('right')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-layout-right"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('顶部对齐')" placement="bottom">
                    <el-button text @click="alignElements('top')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-layout-top"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('垂直居中')" placement="bottom">
                    <el-button text @click="alignElements('center')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-layout-middle"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('底部对齐')" placement="bottom">
                    <el-button text @click="alignElements('bottom')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-layout-bottom"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('水平对齐')" placement="bottom">
                    <el-button text @click="alignElements('horizonta')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-layout-horizonta"></use>
                        </svg>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('开启/关闭小地图')" placement="bottom">
                    <el-button text @click="closeMiniMap()" :icon="Setting" class="minimap">
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="maslg('删除节点')" placement="bottom">
                    <el-button ref="deletPointBtn" text @click="deletePoint" :icon="Delete" class="delet_btn-point minimap">
                    </el-button>
                </el-tooltip>
            </div>
            <div class="design-top_rightBtn" v-if="!hiddenOrshow">
                <el-button type="primary" class="close_btn" :icon="SwitchButton" @click="closeFlow">
                    {{ maslg('关闭') }}
                </el-button>
                <el-button type="primary" class="save_btn" :icon="Check" @click="saveFlowData()">
                    {{ maslg('保存') }}
                </el-button>
            </div>
        </div>
        <div class="design-center">
            <div class="design-center_container" ref="container">
            </div>
            <div class="design-center_right" :style="{ width: drawer ? '460px' : '50px' }">
                <div :class="[drawer ? 'drawerClick' : 'hidden_drawer']" @click="showOrhidden">
                    <img v-if="drawer" src="../../assets/image/indent-decrease.png" />
                    <img v-else style="width: 24px;height: 24px;" src="../../assets/image/out-decrease.png" />
                    <div v-if="!drawer">
                        <div :class="['drawer_text', activeIndex == '1' ? 'select_drawer' : '']"
                            @click="() => activeIndex = '1'">
                            {{ maslg('流程') }}
                        </div>
                        <div v-if="showConfig" :class="['drawer_text', activeIndex == '2' ? 'select_drawer' : '']"
                            @click="() => activeIndex = '2'">
                            {{ maslg('节点') }}
                        </div>
                    </div>
                </div>
                <div class="drawcontent" v-if="drawer">
                    <el-menu :default-active="activeIndex" :ellipsis="false" class="el-menu-demo" mode="horizontal"
                        @select="handleSelect">
                        <el-menu-item index="1">{{ maslg('流程配置') }}</el-menu-item>
                        <el-menu-item index="2" v-if="showConfig">{{ maslg('节点配置')
                        }}</el-menu-item>
                    </el-menu>
                    <flow-config v-show="activeIndex == '1'" ref="flowBox"></flow-config>
                    <check-point v-if="showCheckPoint && activeIndex == '2'" :nodeList="nodeList"
                        @changPointName="changPointName" :connectionList="connectionList" v-model:checker-data="checkerData"
                        :clickElement="clickElement" @changeCheckerData="changeCheckerData"
                        :settingDefineFormData="definePointFormData" :key="clickElement.Id">
                    </check-point>
                    <condition-point v-else-if="clickElement.type == 'bpmn:ParallelGateway' && activeIndex == '2'"
                        @changPointName="changPointName" v-model:conditionData="conditionData" :nodeList="nodeList"
                        :clickElement="clickElement">
                    </condition-point>
                    <line-config v-else-if="clickElement.type == 'bpmn:SequenceFlow' && activeIndex == '2'"
                        @changPointName="changPointName" :clickElement="clickElement" v-model:lineData="lineFormData"
                        @changelineColor="changelineColor">
                    </line-config>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, getCurrentInstance, ComponentInternalInstance, onMounted, nextTick, watch, toRaw, computed, onUnmounted, toRefs, provide } from 'vue'
import { SwitchButton, Check, SuccessFilled, Right, Setting, Delete } from '@element-plus/icons-vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { xmlStr } from '@/utils/xmlStr'
import Selection from 'diagram-js/lib/features/selection/Selection'
import Modeling, { EventBus } from 'bpmn-js/lib/features/modeling/Modeling.js'
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import type { Connection, Root, Shape } from 'bpmn-js/lib/model/Types'
import CustomModeler from '@/components/palette/customModeler'
import type CommandStack from 'diagram-js/lib/command/CommandStack'
import { category } from '@/components/palette/cutomCategory'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import flowConfig from '@/components/flowConfig/index.vue'
import { customConfig } from '@/components/design/renderCategory'
import checkPoint from '@/components/checkPoint/index.vue'
import conditionPoint from '@/components/condition/index.vue'
import lineConfig from '@/components/lineConfig/index.vue'
import { generateUUID, getUrlParams } from '@/utils/util'
import { basicApi } from '@/api/basic'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import minimapModule from 'diagram-js-minimap'
import preExecute from '@/components/alignElements/rewriteAlign'
import { validSubmitData } from '@/hooks/validateSubmit'
import router from '@/router'
const { proxy } = <ComponentInternalInstance>getCurrentInstance()
type allShap = {
    _elements: Object,
    _eventBus: EventBus
}
let drawer = ref(true)
let activeIndex = ref('1')
let bpmnModeler: BpmnModeler

let container = ref<HTMLElement>()
const showOrhidden = () => {
    drawer.value = !drawer.value
}
const handleSelect = (index: any) => {
    activeIndex.value = index
}
watch(drawer, (val) => {
    nextTick(() => {
        let minmapDocument = document.querySelector('.djs-minimap') as HTMLDivElement
        if (minmapDocument) {
            if (val) {
                minmapDocument.style.right = 480 + 'px'
            }
            else {
                minmapDocument.style.right = 80 + 'px'
            }
        }
    })
}, {
    immediate: true
})

const showConfig = computed(() => {
    return Object.keys(clickElement.value).length > 0 && clickElement.value.type != 'bpmn:EndEvent' && clickElement.value.type != "bpmn:Process"
})
let editor = null;
let designStr = ''
//初始化流程画布
let initDesign = () => {
    try {
        bpmnModeler = new CustomModeler({
            container: container.value,
            additionalModules: [
                {
                    //禁用/清空左侧工具栏
                    // paletteProvider: ["value", ''],
                    //禁止移动画布
                    moveCanvas: ['value', ''],
                    //禁止鼠标滚轮缩小放大画布
                    // zoomScroll: ['value', ''],
                    // 禁止双击节点出现label编辑框
                    labelEditingProvider: ['value', ''],
                    //禁止拖动连接线
                    // bendpoints: ['value', {}],
                    //禁用鼠标焦点移动到画布边缘，画布自动滚动功能
                    autoScroll: ['value', {}],
                    // move: ['value', {}],
                    //禁用图形菜单
                    // contextPadProvider: ['value', {}]
                },
                minimapModule,
            ]
        })
        createNewDiagram()
    } catch (error) {
    }

}
//导入xml文件创建画布
let createNewDiagram = async () => {
    try {
        let result = await bpmnModeler.importXML(designStr)
        // bpmnModeler.get('minimap').open()
        Success()
    } catch (error) {
        console.log(error);
    }
}
//创建成功
let Success = () => {
    //修改左侧选择面板中各节点的展示图标
    category.map(item => {
        let node = document.querySelector('.' + item.className.split(' ')[1])
        let div = `<svg class="icon" aria-hidden="true">
                            <use xlink:href=${item.symbolName}></use>
                        </svg>`
        node?.insertAdjacentHTML('beforeend', div)
    })
    //操作函数
    Modelersuccess()
}
let Modelersuccess = () => {
    getmodelEvent()
    canvasOnEvents()
    elementBus()
    connectionEvent()
    bpmnEvent()
}

let modeling: Modeling | null = null
let selection: Selection | null = null
let align: any = null
let command: CommandStack | null = null
let canvas: any = null
let saveShape = new Map<string, object>()
let nodeList = ref<(Shape | Connection)[]>([])
let allNode = ref<Shape[]>([])
let connectionList = ref<Connection[]>([])
let allShape: allShap & ElementRegistry;
let evetBus: EventBus | null = null
let clickElement: any = ref({});
let lineFormData: any = ref({})
let conditionData: any = ref({})
let checkerData: any = ref({})
let lineArr = <any[]>[]
let connectonEvent: Connection
let elementFactory: ElementFactory;
let minimap: any
const saveConfig: object = {
    "bpmn:SequenceFlow": (element: Shape) => {
        const setFormData = {
            name: element.name ? element.name : '',
            color: 'black',
            lineStrategy: 'allthrough',
            advanceData: <advancedForm>{
                category: 'sql',
                database: '',
                agreeSQL: '',
                disagreeSQL: '',
                agreePort: '',
                disagreePort: ''
            }
        }
        let getbusineData = element.businessObject.$attrs.configData
        let configData = element.configData
        if (configData) {
            lineFormData.value = element.configData
        }
        else if (getbusineData) {
            lineFormData.value = JSON.parse(getbusineData)
        }
        else {
            lineFormData.value = setFormData
        }
        setEleData(element, lineFormData)
    },
    'bpmn:ParallelGateway': (element: Shape) => {
        const setconditionData = reactive<conditionData>({
            name: element.name ? element.name : '',
            formType: '',
            tableCode: '',
            formCode: '',
            conditionFormData: <conditionFormData[]>[]
        })
        let getbusineData = element.businessObject.$attrs.configData
        let configData = element.configData

        if (configData) {
            conditionData.value = reactive(element.configData)
        }
        else if (getbusineData) {
            conditionData.value = reactive(JSON.parse(getbusineData))
        }
        else {
            conditionData.value = setconditionData
        }
        setEleData(element, conditionData)
    },
    'bpmn:Task': (element: Shape) => {
        const setCheckerData = reactive<parentCheckData>({
            checkData: {
                name: element.name ? element.name : '',
                inform: '',
                agreerules: [],
                advice: false,
                mutipleCheck: false,
                manualChecker: false,
                countersign: true,
                conductor: '1',
                throughStrategy: '1',
                executiveStrategy: '1',
                proportionData: 0,
                auditorAgainType: '1',
                auditorType: '1'
            },
            checkerArr: [],
            pointFormData: [{
                formType: '1',
                selectForm: '',
                pcFormAddress: '',
                mtFormAddress: '',
                pcView: '',
                mtView: '',
                relevanceField: '',
                rowsData: {},
                tabsData: [],
                fieldData: [],
                customData: {},
                pcviewOptionData: [],
                mtViewData: [],
                cutomFieldData: []
            }],
            checkTime: {
                exceedSendNotice: 0,
                intervalSendNotice: 0,
                intervalApprove: 0,
                notificationStrategy: ''
            },
            agreeBtn: {
                name: '同意',
                hiddenBtn: false,
                signature: false,
                nextChecker: '1'
            },
            disagreeBtn: {
                name: '不同意',
                hiddenBtn: false,
                signature: false,
                nextChecker: '1',
                saveFormData: true,
                rejectWay: '1'
            },
            writeBack: [],
            adConfig: {
                watchFormData: [],
                otherForm: []
            }
        })
        let getbusineData = element.businessObject.$attrs.configData
        let configData = element.configData
        if (configData) {
            checkerData.value = configData
        }
        else if (getbusineData) {
            checkerData.value = JSON.parse(getbusineData)
        }
        else {
            checkerData.value = setCheckerData
        }
        setEleData(element, checkerData)
    },
    'bpmn:IntermediateThrowEvent': (element: Shape) => {
        const setCheckerData = reactive<parentCheckData>({
            checkData: {
                name: element.name ? element.name : '',
                inform: '',
                mutipleCheck: true,
                manualChecker: true,
            },
            checkerArr: [],
            pointFormData: [{
                formType: '1',
                selectForm: '',
                pcFormAddress: '',
                mtFormAddress: '',
                pcView: '',
                mtView: '',
                relevanceField: '',
                rowsData: {},
                tabsData: [],
                fieldData: [],
                customData: {},
                pcviewOptionData: [],
                mtViewData: [],
                cutomFieldData: []
            }],
            adConfig: {
                watchFormData: [],
                otherForm: []
            }
        })
        let getbusineData = element.businessObject.$attrs.configData
        let configData = element.configData

        if (configData) {
            checkerData.value = element.configData
        }
        else if (getbusineData) {
            checkerData.value = JSON.parse(getbusineData)
        }
        else {
            checkerData.value = setCheckerData
        }
        setEleData(element, checkerData)
    },
    //开始节点
    'bpmn:IntermediateCatchEvent': (element: Shape) => {
        const setCheckerData = reactive<parentCheckData>({
            checkData: {
                name: element.name ? element.name : '',
                inform: '',
                manualChecker: false,//下一审核节点无审核人员时可手动设置
                appointChecker: false,//允许手动指定下一节点审核人
                manualTitle: false,//是否允许自定义标题
                isSaveDraftValid: false //保存草稿时是否验证表单
            },
            pointFormData: [{
                formType: '1',
                selectForm: '',
                pcFormAddress: '',
                mtFormAddress: '',
                pcView: '',
                mtView: '',
                relevanceField: '',
                rowsData: {},
                tabsData: [],
                fieldData: [],
                customData: {},
                pcviewOptionData: [],
                mtViewData: [],
                cutomFieldData: []
            }],
            adConfig: {
                watchFormData: [],
                otherForm: []
            },
            titleConfig: [],
            titleWriteBack: []
        })
        let getbusineData = element.businessObject.$attrs.configData
        let configData = element.configData

        if (configData) {
            checkerData.value = element.configData
        }
        else if (getbusineData) {
            checkerData.value = JSON.parse(getbusineData)
        }
        else {
            checkerData.value = setCheckerData
        }
        setEleData(element, checkerData)
    },
    'bpmn:UserTask': (element: Shape) => {
        const setCheckerData = reactive<parentCheckData>({
            checkData: {
                name: element.name ? element.name : '',
                inform: '',
                manualChecker: false,//下节点无人员
                childType: '1',//子流程执行策略
                childFlow: {},//选择的子流程
                childFlowName: '',
            },
            checkerArr: [], //审核者
            pointFormData: [{
                formType: '1',
                selectForm: '',
                pcFormAddress: '',
                mtFormAddress: '',
                pcView: '',
                mtView: '',
                relevanceField: '',
                rowsData: {},
                tabsData: [],
                fieldData: [],
                customData: {},
                pcviewOptionData: [],
                mtViewData: [],
                cutomFieldData: []
            }],

            advanceData: <advancedForm>{
                category: 'sql',
                database: '',
                agreeSQL: '',
                disagreeSQL: '',
                agreePort: '',
                disagreePort: ''
            }
        })
        let getbusineData = element.businessObject.$attrs.configData
        let configData = element.configData
        if (configData) {
            checkerData.value = element.configData
        }
        else if (getbusineData) {
            checkerData.value = JSON.parse(getbusineData)
        }
        else {
            checkerData.value = setCheckerData
        }
        setEleData(element, checkerData)
    }
}
const canShowPoint = ['bpmn:Task', 'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:UserTask']
const showCheckPoint = computed(() => canShowPoint.includes(clickElement.value.type))

const setEleData = (ele: Shape, data: any) => {
    ele.configData = data.value
    // nextTick(() => {
    //     modeling?.updateProperties(ele, {
    //         data: data.value
    //     })
    // })

}

//获取modeler中的部分实列操作类
const getmodelEvent = () => {
    const bpmnjs = bpmnModeler
    const d = bpmnModeler.get('autoPlace')

    modeling = bpmnjs.get('modeling')
    let handlers = modeling?.getHandlers()
    //修改modeling原型上的元素对齐处理函数
    handlers['elements.align'].prototype.preExecute = preExecute
    selection = bpmnjs.get('selection')
    align = bpmnjs.get('alignElements')
    command = bpmnjs.get<CommandStack>('commandStack')
    canvas = bpmnjs.get('canvas')
    //自适应屏幕
    canvas.zoom('fit-viewport')
    allShape = bpmnjs.get('elementRegistry')
    evetBus = bpmnjs.get('eventBus')
    minimap = bpmnjs.get('minimap')
    nextTick(() => {
        minimap.open()
    })
    nodeList.value = []
    for (let i in allShape?._elements) {
        if (allShape?._elements[i].element.type != "bpmn:Process") {
            let ele: Shape = allShape?._elements[i].element
            let configData = ele.businessObject.$attrs.configData
            if (configData) {
                ele.configData = JSON.parse(configData)
            }
            nodeList.value.push(ele)
            // selectElement.push()
        }
    }
}
//事件绑定公共函数
let eventFunction = (events: string[], callback: (...args) => void) => {
    events.map(event => {
        evetBus?.on(event, (e: any) => {
            let elementRegistry: ElementRegistry = bpmnModeler.get('elementRegistry')
            let shape: Shape | Connection = e.element ? elementRegistry.get(e.element.id) : e.shape
            callback(event, elementRegistry, e, shape)
        })
    })
}
let designContainer

//是否为右侧增加的元素
let addByPad = false
let resultxData;
let resutYData;
let findParent = () => {
    resultxData = nodeList.value.sort((a, b) => { return a.x - b.x })[0]
    resutYData = nodeList.value.sort((a, b) => { return a.y - b.y })[0]
}
let connectionEvent = () => {
    // hasCondition.clear()
    let events = ['connection.added', 'connection.removed']
    let callback = (...args) => {
        let event = args[0]
        let shape: Connection = args[3]
        let elementRegistry = args[1]
        if (shape.type != 'label') {
            if (!addByPad) {
                clickElement.value = shape
            }
            saveConfig[shape.type](shape)
        }
        // debugger
        if (event == 'connection.added') {
            nodeList.value.push(shape)
            // if (shape.target!.type == "bpmn:ParallelGateway") {
            //     if (hasCondition.has(shape.target!.id)) {
            //         nextTick(() => {
            //             modeling?.removeConnection(shape as any)
            //         })
            //         return ElMessage({
            //             type: 'error',
            //             message: proxy?.maslg('一个判断节点只能有一个父级')
            //         })
            //     }
            //     else {
            //         hasCondition.set(shape.target!.id, shape)
            //     }
            // }
            if (shape.source!.type == 'bpmn:IntermediateThrowEvent') {
                nextTick(() => {
                    modeling?.removeConnection(shape)
                })
            }
        }
        if (event == 'connection.removed') {
            console.log(event);

            nodeList.value.map((item, index) => {
                if (item.id == shape.id) {
                    nodeList.value.splice(index, 1)
                }
            })
            // if (elementRegistry.get(shape.target!.id) && elementRegistry.get(shape.target!.id)!.incoming.length == 1) {
            //     hasCondition.delete(shape.target!.id)
            // }
        }
    }
    eventFunction(events, callback)
}
let bpmnEvent = () => {
    let events = ['shape.added', 'shape.removed', 'shape.move.end']
    let callback = async (...args) => {
        let event = args[0]
        let shape = args[3]
        let data = (command as any)._stack
        console.log(data);

        // let elementRegistry = args[1]
        if (event == 'shape.added') {
            //当新增节点超出可视区域后将cavas的滚动条设置到开始的节点
            if (shape.x + shape.width >= designContainer.clientWidth) {
                // designContainer.scrollLeft = designContainer.scrollLeft + 100
                await nextTick()
                findParent()
                if (resultxData) {
                    resultxData = toRaw(resultxData)
                    canvas.scrollToElement(resultxData)
                    designContainer.scrollLeft = designContainer.scrollLeft + shape.width + 77
                }
            }
            if (shape.y + shape.height >= designContainer.clientHeight) {
                await nextTick()
                findParent()
                if (resutYData) {
                    resutYData = toRaw(resutYData)
                    canvas.scrollToElement(resutYData)
                    designContainer.scrollTop = designContainer.scrollTop + shape.height
                }
            }
            if (shape.type == 'bpmn:IntermediateCatchEvent' || shape.type == "bpmn:EndEvent") {
                let hasShape = nodeList.value.find(item => {
                    return item.type == shape.type
                })
                if (hasShape) {
                    nextTick(() => {
                        modeling?.removeShape(shape)
                    })
                    return ElMessage({
                        type: 'error',
                        message: proxy?.maslg(shape.type == "bpmn:IntermediateCatchEvent" ? '只能有一个开始节点' : '只能有一个结束节点')
                    })
                }
            }
            nodeList.value.push(shape)
        }
        if (event == 'shape.move.end') {

        }
        if (shape.type != 'label') {
            if (shape.hasOwnProperty('padAdd')) {
                addByPad = true
            }
            clickElement.value = shape
        }
        if (event == 'shape.removed') {
            nodeList.value.map((item, index) => {
                if (item.id == shape.id) {
                    nodeList.value.splice(index, 1)
                }
            })
        }
    }
    eventFunction(events, callback)
}
//连接线事件
let hasCondition = new Map()

//点击鼠标拖动选中元素事件
const canvasOnEvents = () => {
    let svg = canvas._svg
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let hasMouseDown = false
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.addEventListener('mousedown', (e) => {
        hasMouseDown = true
        e.stopPropagation()
        //目标元素为svg且没有按下shift按钮生成一个canvas画布根据鼠标拖动绘制矩形
        if (e.target == svg && !e.shiftKey) {
            startX = e.offsetX
            startY = e.offsetY
            e.stopPropagation()
            //使用canvas画布来绘制矩形
            // let buildcanvas: HTMLCanvasElement = document.createElement('canvas')
            // buildcanvas.setAttribute('class', 'selectCanvas')
            // buildcanvas.width = container.value?.clientWidth as number //设置canvas元素的宽度和高度
            // buildcanvas.height = container.value?.clientHeight as number
            // container.value?.appendChild(buildcanvas) //将canvas元素添加到container容器中
            // let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            // ctx.beginPath()
            // ctx.moveTo(startX, startY)
            path.setAttribute('id', 'test')
            // rect.setAttribute('width', '100')
            // rect.setAttribute('height', '100')
            // rect.setAttribute('x', startX)
            // rect.setAttribute('y', startY)

            //监听canvas容器上的鼠标移动事件来绘制图形
            svg.addEventListener('mousemove', moveMove)
        }


    })

    svg.addEventListener('mouseup', (event) => {
        endX = event.offsetX
        endY = event.offsetY
        removeSvgPath()

        //移除canvas画布
        // container.value?.removeChild(buildcanvas)

        lineArr = []
        if (startX != endX && startY != endY && hasMouseDown) {
            let selectElement: Shape[] = []
            let minX = Math.min(startX, endX)
            let maxX = Math.max(startX, endX)
            let minY = Math.min(startY, endY)
            let maxY = Math.max(startY, endY)
            for (let i in allShape?._elements) {
                if (allShape?._elements[i].element.type != "bpmn:Process") {
                    let ele: Shape = allShape?._elements[i].element
                    //判断容器是否在所框选的矩形内
                    if ((ele.x >= minX && ele.x + ele.width <= maxX) && (ele.y >= minY && ele.y + ele.height <= maxY)) {
                        selectElement.push(ele)
                    }
                    // selectElement.push()
                }
                if (allShape?._elements[i].element.type == 'bpmn:SequenceFlow') {
                    lineArr.push(allShape?._elements[i].element)
                }
            }
            lineArr.map(item => {
                let source = selectElement.find(sitem => {
                    return item.source.id == sitem.id
                })
                let target = selectElement.find(sitem => {
                    return item.target.id == sitem.id
                })
                if (source && target) {
                    selectElement.push(item)
                }
            })
            hasMouseDown = false
            //将矩形内的元素设置为框选状态
            selection?.select(selectElement)
        }


    })

    //鼠标移动事件，必须写出来，不然在鼠标抬起时无法清除鼠标移动事件
    const moveMove = (event) => {
        event.stopPropagation()
        // M:起点
        // H:水平画直线到某个点
        // V:垂直画直线到某个点
        // Z:从当前画一条直线到路径的起点
        let linePath = `M ${startX + ',' + startY} H ${event.offsetX} V ${event.offsetY} H ${startX}  Z`
        path.setAttribute('d', linePath)
        //线条颜色
        path.setAttribute('stroke', 'var(--element-selected-outline-stroke-color)')
        //填充色
        path.setAttribute('fill', 'var(--snap-line-stroke-color)')
        svg.appendChild(path)
        // //先清空canvas图形上绘制的图形
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        // ctx.lineTo(event.offsetX, startY)
        // ctx.lineTo(event.offsetX, event.offsetY)
        // ctx.lineTo(startX, event.offsetY)
        // ctx.lineTo(startX, startY)
        // //将线条颜色设置为透明
        // ctx.strokeStyle = 'transparent'
        // //容器的填充色
        // ctx.fillStyle = 'rgba(0, 128, 255, .3)'
        // ctx.stroke()
        // ctx.closePath()
        // ctx.fill()

    }
    //移除svg绑定的鼠标移动事件以及删除所绘制的矩形
    const removeSvgPath = () => {
        svg.removeEventListener('mousemove', moveMove)
        if (svg.childNodes[svg.childNodes.length - 1].id && svg.childNodes[svg.childNodes.length - 1].id == 'test') {
            svg.removeChild(path)
        }
    }
    //鼠标移入到配置栏时删除掉svg中绘制的矩形
    let centerDocument = document.querySelector('.design-center') as HTMLDivElement
    centerDocument.addEventListener('mousemove', (event) => {
        if (event.x > container.value!.clientWidth) {
            removeSvgPath()
        }
    })
    //鼠标移入到头部时删除掉svg中绘制的矩形
    let designTop = document.querySelector('.design-top') as HTMLDivElement
    designTop.addEventListener('mousemove', (ev) => {
        removeSvgPath()

    })
}

//画布元素事件
const elementBus = () => {
    let events = ['element.click']
    let callback = (...args) => {
        drawer.value = true
        let e = args[2]
        if (saveShape.has(e.element.id)) {

        }
        clickElement.value = e.element
        // nodeList.value = []
        connectionList.value = []
        for (let i in allShape?._elements) {
            if (allShape?._elements[i].element.type != "bpmn:Process") {
                let ele: Shape = allShape?._elements[i].element
                if (ele.type == "bpmn:SequenceFlow" && ele.target.id == e.element.id) {
                    connectionList.value.push(ele.source)
                }
                // nodeList.value.push(ele)
                // selectElement.push()
            }
        }
    }
    eventFunction(events, callback)
}
const seletData = (callback: Function) => {
    if (modeling && selection) {
        const SelectedElements = selection.get()
        callback && callback(SelectedElements)
    }
}
//顶部对齐操作
const alignElements = (tag: string) => {
    seletData((SelectedElements: any[]) => {
        if (!SelectedElements || SelectedElements.length <= 1) {
            return ElMessage({
                message: proxy?.maslg('请选择至少两个元素'),
                type: 'warning'
            })
        }
        align.trigger(SelectedElements, tag)
    })
    // if (tag == 'horizonta') {
    //     let selectArr = JSON.parse(JSON.stringify(SelectedElements))
    //     let flowArr: Object[] = []
    //     var delta = {
    //         x: 0,
    //         y: 0
    //     };
    //     SelectedElements.map(item => {
    //         // if (item.type == "bpmn:SequenceFlow") {
    //         //     flowArr.push(item)
    //         // }
    //         // delta.x = item.x
    //         // delta.y = item.y
    //         lineArr.map(litem => {
    //             if (litem.target.id == item.id || litem.source.id == item.id) {
    //                 flowArr.push(litem)
    //             }
    //         })
    //     })
    // tag = 'middle'
    //需要先删除已有线条
    // flowArr.map((fitem: any) => {
    //     canvas.removeShape(fitem.id)
    // })
    // let alignElement = selectArr.sort((a, b) => { return b.y - a.y })[0]
    // let x = alignElement.x
    // let y = alignElement.y
    // SelectedElements.map((item, index) => {
    //     if (item.id != alignElement.id) {
    //         item.y = y + alignElement.height - item.height
    //     }

    // })
    // let distance = SelectedElements.sort((a, b) => { return a.x - b.x })
    // let elemtDistance = distance[distance.length - 1].x - distance[0].x
    // distance.map((item, index) => {
    //     if (index != distance.length - 1) {
    //         elemtDistance -= distance[index].width
    //     }

    // })

    // let averageDistance = elemtDistance / (SelectedElements.length - 1)
    // distance.map((ditem, index) => {
    //     if (index != 0 && index != distance.length - 1) {
    //         ditem.x = parseFloat(distance[index - 1].x + averageDistance + distance[index - 1].width)

    //     }
    // })

    // let attr: any = null
    // if (flowArr.length > 0) {
    //     flowArr.map((fitem: any) => {
    //         // let source = SelectedElements.find(item => {
    //         //     return fitem.source.id == item.id
    //         // })
    //         // let target = SelectedElements.find(item => {
    //         //     return fitem.target.id == item.id
    //         // })
    //         modeling?.connect(fitem.source, fitem.target, attr)
    //     })
    // }

    // }

}
//撤销
const undo = () => {
    command && command.canUndo() && command.undo()
    clickElement.value = {}
}
//重做
const redo = () => {
    command && command.canRedo() && command.redo()
}
//移除撤销数组中部分操作
const removeUndoArr = (moveName: string, shape?: Shape) => {
    let data = (command as any)._stack
    data.map((item, index) => {
        if (item.command.indexOf(moveName) != -1) {
            if (moveName == 'shape.move' && item.context.shape.id == shape?.id) {
                data.splice(index, 1);
                (command as any)._stackIdx--
            }
            else {
                data.splice(index, 1);
                (command as any)._stackIdx--
            }

        }
    })

}
//修改节点名称
const changPointName = (name) => {
    //将变量改为非响应式的数据，不然修改时会报错
    const newElement = toRaw(clickElement.value)
    if (clickElement.value.type != "bpmn:SequenceFlow") {
        clickElement.value.name = name
        //更新元素修改名称
        modeling?.updateAttachment(newElement)
        removeUndoArr('.updateAttachment')
    }
    else {
        //更新修改元素的bussionObj.name属性
        modeling?.updateLabel(newElement, name)
        removeUndoArr('.updateLabel')
        // let data = (command as any)._stack
        // data.map((item, index) => {
        //     if (item.command.indexOf('.updateLabel') != -1) {
        //         data.splice(index, 1);
        //         (command as any)._stackIdx--
        //     }
        // })
        //重新将点击元素设置为连接线,不然会设置为label框
        // clickElement.value = newElement
    }

    //更新修改元素中的bussionObj.$attr自定义元素的属性值
    // modeling?.updateProperties(e.element, {
    //     pointname: '33333'
    // })

}
const changelineColor = (val) => {
    const newElement = toRaw(clickElement.value)
    modeling?.setColor(newElement, {
        stroke: val == 'red' ? '#ff4747' : '#212930'
    })
    removeUndoArr('.setColor')
    removeUndoArr('.updateProperties')
}
const closeMiniMap = () => {
    minimap && minimap.toggle()
}


const deletePoint = () => {
    seletData((SelectedElements: any[]) => {
        if (!SelectedElements || SelectedElements.length <= 0) {
            return ElMessage({
                message: proxy?.maslg('请选择要删除的元素'),
                type: 'warning'
            })
        }
        nextTick(() => {
            modeling?.removeElements([...SelectedElements])
        })
        // modeling?.removeElements(SelectedElements)
        // SelectedElements.forEach(item => {
        //     modeling?.removeShape(item)
        // })
    })
}
watch(clickElement, (val) => {
    if (val) {
        drawer.value = true
        activeIndex.value = '2'
        addByPad = false
        const newElement = toRaw(val) as Shape
        if (saveConfig.hasOwnProperty(val.type)) {
            saveConfig[val.type](newElement)
        }
        else {
            activeIndex.value = '1'
        }

        // if (val.type == 'bpmn:SequenceFlow') {
        //     if (!val.businessObject.$attrs.hasOwnProperty('lineFormData')) {
        //         //更新修改元素中的bussionObj.$attrs自定义元素的属性值
        //         modeling?.updateProperties(newElement, {
        //             lineFormData: reactive<lineForm>({
        //                 name: '',
        //                 color: '',
        //                 lineStrategy: ''
        //             })
        //         })
        //     }
        //     else {
        //         const data = reactive(JSON.parse(val.businessObject.$attrs.lineFormData))
        //         modeling?.updateProperties(newElement, {
        //             lineFormData: data
        //         })
        //     }

        // }
    }
})
const changeCheckerData = (val) => {
    checkerData.value = val

}
const flowBox = ref<InstanceType<typeof flowConfig>>()
const saveParam = {
    keyValue: '',
    schemeInfo: '',
    shcemeAuth: '',
    scheme: '',
    type: 1,
    schemeid: ''
}
//流程配置项信息
let schemeInfo = {
    cuid: '',
    F_SchemeId: '',
    F_Code: '',
    F_Name: '',
    F_Category: '',
    F_Mark: '',
    F_IsInApp: '',
    DisagreeSaveData: '',
    F_CloseDoType: '',
    F_CloseDoDbId: '',
    F_CloseDoSql: '',
    F_CloseDoIocName: '',
    F_CloseDoInterface: '',
    F_Description: ''
}
//流程各节点信息
let scheme = {
    nodes: <object[]>[],
    lines: <object[]>[],
    DisagreeSaveData: {
        DisagreeSaveData: '',
    },
    closeDo: {
        F_CloseDoType: '',
        F_CloseDoDbId: '',
        F_CloseDoSql: '',
        F_CloseDoIocName: '',
        F_CloseDoInterface: '',

    },
    bpmXml: ''
}
const saveNodesAndLines: { [key: string]: <T extends Connection | Shape>(val: T) => void } = {
    "bpmn:SequenceFlow": (element) => {
        let obj = {
            id: '',
            from: '',
            to: '',
            sp: '',//连接线开始点
            ep: '',//连接线结束点
            name: '',
            color: '',
            type: '',//lr直线, td曲线
            cuid: '',
            operationType: '',
            dbId: '',
            strSql: '',
            strSqlR: '',
            strategy: '',
            agreeList: '',
            strInterface: '',
            strInterfaceR: ''
        }
        obj.id = element.id
        obj.from = element.source!.id
        obj.to = element.target!.id
        obj.sp = linePosition(element)[0]
        obj.ep = linePosition(element)[1]
        obj.type = element.waypoints.length > 2 ? 'td' : 'lr'
        obj.name = element.configData?.name ? element.configData.name : ''
        obj.color = element.configData.color == 'black' ? '1' : '2'
        obj.strategy = element.configData.lineStrategy == 'allthrough' ? '1' : '2'
        obj.agreeList = element.configData.lineStrategy == 'allthrough' ? '' : element.configData.lineStrategy
        obj.operationType = element.configData.advanceData.category.toLowerCase()
        obj.dbId = element.configData.advanceData.database
        obj.strSql = element.configData.advanceData.agreeSQL
        obj.strSqlR = element.configData.advanceData.disagreeSQL
        obj.strInterface = element.configData.advanceData.agreePort
        obj.strInterfaceR = element.configData.advanceData.disagreePort
        scheme.lines.push(obj)
        return false
    },
    'bpmn:ParallelGateway': (element) => {
        let obj = {
            id: element.id,
            type: 'conditionnode',
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            name: element.name,
            conditions: <any[]>[],
            cuid: '',
            notice: '',
            appointSetUser: '1',
            isNext: '2',
            isTitle: '1',
            isAllAuditor: '1',
            auditExecutType: '1',
            scaleExecut: '',
            auditorAgainType: '1',
            auditorType: '1',
            isSign: '1',
            isNeedCheckText: '2',
            isBatchAudit: '2',
            agreeGz: '',
            noPeopleGz: '1',
            confluenceType: '1',
            confluenceRate: '',
            childFlow: '',
            childType: '1',
            dbConditionId: '',
            conditionSql: '',
            formCode: ''
        }
        let data = element.configData
        let hasError;
        const { validateCondition } = validSubmitData()
        hasError = validateCondition(data.conditionFormData)
        data.conditionFormData.map(item => {
            let conditionObj = {
                dbId: 'lrsystemdb',
                table: item.databaseTable ? item.rowsData.name : data.tableCode,
                field1: item.primaryKeyField,
                field2: item.compareField,
                compareType: item.compareType,
                value: item.dataValue,
                id: generateUUID()
            }
            obj.conditions.push(conditionObj)
        })
        obj.formCode = data.formCode
        scheme.nodes.push(obj)
        if (hasError) {
            return true
        }
        else
            return false
    },
    'bpmn:Task': (element) => {
        let obj = {
            id: element.id,
            type: 'stepnode',
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            name: element.name,
            auditors: <any[]>[],
            wfForms: <wfobj[]>[],
            btnList: <any[]>[],
            cuid: '',
            notice: '',
            appointSetUser: '',
            isNext: '2',
            isTitle: '1',
            isAllAuditor: '',
            auditExecutType: '',
            scaleExecut: '',
            auditorAgainType: '1',
            auditorType: '1',
            isSign: '',
            isNeedCheckText: '',
            isBatchAudit: '',
            agreeGz: '',
            noPeopleGz: '',
            confluenceType: '1',
            confluenceRate: '',
            childFlow: '',
            childType: '1',
            timeoutNotice: '',
            timeoutInterval: '',
            timeoutStrategy: '',
            timeoutAction: '',
            messagewritebackList: <any[]>[],
            formCode: ''
        }
        let data = element.configData
        obj.notice = data.checkData.inform
        obj.isAllAuditor = data.checkData.throughStrategy
        obj.auditExecutType = data.checkData.executiveStrategy
        obj.scaleExecut = data.checkData.proportionData
        obj.auditorAgainType = data.checkData.auditorAgainType
        obj.auditorType = data.checkData.auditorType
        obj.isSign = data.checkData.countersign ? '1' : '2'
        obj.isNeedCheckText = data.checkData.advice ? '1' : '2'
        obj.isBatchAudit = data.checkData.mutipleCheck ? '1' : '2'
        obj.agreeGz = data.checkData.agreerules.join(',')
        obj.noPeopleGz = data.checkData.conductor
        obj.appointSetUser = data.checkData.manualChecker ? '2' : '1'
        obj.timeoutNotice = data.checkTime.exceedSendNotice
        obj.timeoutInterval = data.checkTime.intervalSendNotice
        obj.timeoutAction = data.checkTime.intervalApprove
        obj.timeoutStrategy = data.checkTime.notificationStrategy

        let agreeBtn = {
            id: '1',
            name: data.agreeBtn.name ? data.agreeBtn.name : '同意',
            code: 'agree',
            file: '1',
            next: data.agreeBtn.nextChecker,
            IsSaveFormData: '1',
            isHide: data.agreeBtn.hiddenBtn ? '1' : '2',
            isSign: data.agreeBtn.signature ? '1' : '2',
            reject: '1'
        }
        let disagreeBtn = {
            id: '2',
            name: data.disagreeBtn.name ? data.disagreeBtn.name : '不同意',
            code: 'disagree',
            file: '1',
            next: data.disagreeBtn.nextChecker,
            IsSaveFormData: data.disagreeBtn.saveFormData ? '1' : '2',
            isHide: data.disagreeBtn.hiddenBtn ? '1' : '2',
            isSign: data.disagreeBtn.signature ? '1' : '2',
            reject: data.disagreeBtn.rejectWay
        }
        obj.btnList = obj.btnList.concat([agreeBtn, disagreeBtn])
        let hasError = <any[]>[]
        //保存节点表单设置
        data.pointFormData.map(item => {
            setWfForm(obj, item)
        })
        obj.formCode = obj.wfForms[0].formcode
        //保存审核者
        hasError.push(setAuditors(element, obj))
        //保存消息回写数据
        hasError.push(saveMessageWriteBack(data, obj))
        scheme.nodes.push(obj)
        if (hasError.some(item => {
            return item == true
        })) {
            return true
        }
        else
            return false
    },
    'bpmn:IntermediateThrowEvent': (element) => {
        let obj = {
            id: element.id,
            type: 'auditornode',
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            name: element.name,
            auditors: <any[]>[],
            wfForms: <wfobj[]>[],
            cuid: '',
            notice: '',
            appointSetUser: '',
            isNext: '2',
            isTitle: '1',
            isAllAuditor: '1',
            auditExecutType: '1',
            scaleExecut: '',
            auditorAgainType: '1',
            auditorType: '1',
            isSign: '1',
            isNeedCheckText: '2',
            isBatchAudit: '',
            agreeGz: '',
            noPeopleGz: '1',
            confluenceType: '1',
            confluenceRate: '',
            childFlow: '',
            childType: '1',
            formCode: ''
        }
        let data = element.configData
        obj.notice = data.checkData.inform
        obj.isBatchAudit = data.checkData.mutipleCheck ? '1' : '2'
        obj.appointSetUser = data.checkData.manualChecker ? '2' : '1'
        let hasError;
        //保存节点表单设置
        data.pointFormData.map(item => {
            setWfForm(obj, item)
        })
        obj.formCode = obj.wfForms[0].formcode
        //保存审核者
        hasError = setAuditors(element, obj)
        scheme.nodes.push(obj)
        return hasError
    },
    //开始节点
    'bpmn:IntermediateCatchEvent': (element) => {
        let obj = {
            id: '',
            name: '',
            left: 0,
            top: 0,
            type: 'startround',
            width: 53,
            height: 53,
            wfForms: <wfobj[]>[],
            notice: '',//通知策略
            isNext: '',//是否手动指定审核人 1:指定 2:不指定
            isTitle: '',//是否自定义标题 1:指定 2:不指定
            isSaveDraftValid: '',//草稿保存是否验证表单 0:不验证 1:验证
            appointSetUser: '',//是否手动设置审核人 1:不允许 2:允许
            isAllAuditor: '1',
            auditExecutType: '1',
            scaleExecut: '',
            auditorAgainType: '1',
            auditorType: '1',
            isSign: '1',
            isNeedCheckText: '2',
            isBatchAudit: '2',
            agreeGz: '',
            noPeopleGz: '1',
            confluenceType: '1',
            confluenceRate: '',
            childFlow: '',
            childType: '1',
            titleconfigList: <titleConfigList[]>[],
            titlewritebackconfigList: <writeBackConfigList[]>[],
            formCode: '',
            cuid: ''
        }
        obj.id = element.id
        obj.name = element.name
        obj.left = element.x
        obj.top = element.y
        obj.notice = element.configData.checkData.inform
        obj.isNext = element.configData.checkData.appointChecker ? '1' : '2'
        obj.isTitle = element.configData.checkData.manualTitle ? '1' : '2'
        obj.isSaveDraftValid = element.configData.checkData.isSaveDraftValid ? '0' : '1'
        obj.appointSetUser = element.configData.checkData.manualChecker ? '2' : '1'
        //保存节点表单设置
        setWfForm(obj, element.configData.pointFormData[0])
        obj.formCode = obj.wfForms[0].formcode
        //保存标题默认值配置数据
        let titleConfig = element.configData.titleConfig
        titleConfig.map(item => {
            let titleobj: titleConfigList = {
                id: generateUUID(),
                cuid: '',
                type: item.selectData,
                fixmsg: item.fixedValue
            }
            obj.titleconfigList.push(titleobj)
        })
        //保存标题回写配置数据
        let titleWrite = element.configData.titleWriteBack
        titleWrite.map(item => {
            let backObj: writeBackConfigList = {
                cuid: '',
                pageid: item.fieldSelect?.pageid,
                page: item.fieldSelect?.page,
                fieldid: item.fieldSelect?.fieldid,
                field: item.fieldSelect?.label,
                tableCode: item.fieldSelect?.tableCode,
                fillmode: item.writeSelect,
                id: generateUUID(),
                type: item.fieldSelect?.type,
                nFormId: item.fieldSelect?.nFormId
            }
            obj.titlewritebackconfigList.push(backObj)
        })
        scheme.nodes.push(obj)
        return false
    },
    'bpmn:UserTask': (element) => {
        let obj = {
            id: element.id,
            type: 'childwfnode',
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            name: element.name,
            auditors: <any[]>[],
            formCode: '',
            appointSetUser: '',
            childFlow: '',
            childType: '',
            notice: '',
            operationType: '',
            dbId: '',
            strSql: '',
            strSqlR: '',
            strInterface: '',
            strInterfaceR: ''
        }
        obj.appointSetUser = element.configData.checkData.manualChecker ? '2' : '1'
        obj.childFlow = element.configData.checkData.childFlowName
        obj.childType = element.configData.checkData.childType
        obj.notice = element.configData.checkData.inform
        obj.operationType = element.configData.advanceData.category.toLowerCase()
        obj.dbId = element.configData.advanceData.database
        obj.strSql = element.configData.advanceData.agreeSQL
        obj.strSqlR = element.configData.advanceData.disagreeSQL
        obj.strInterface = element.configData.advanceData.agreePort
        obj.strInterfaceR = element.configData.advanceData.disagreePort
        const config = element.configData.pointFormData[0]
        obj.formCode = config.formType == '2' ? config.rowsData.FormNo : config.formType == '1' ? config.rowsData.F_No : config.rowsData.value
        let hasError;
        // obj.formCode = obj.wfForms[0].formcode
        //保存审核者
        hasError = setAuditors(element, obj)
        scheme.nodes.push(obj)
        return hasError
    },
    'bpmn:EndEvent': (element) => {
        let obj = {
            id: element.id,
            name: '结束',
            left: element.x,
            top: element.y,
            type: 'endround',
            width: element.width,
            height: element.height
        }
        scheme.nodes.push(obj)
        return false
    }
}
//保存表单配置项数据
const setWfForm = (obj, configData) => {
    let config = configData
    let wfobj: wfobj = {
        cuid: '',
        type: config.formType,
        nFormId: config.formType == '2' ? config.rowsData.value : '',
        formId: config.formType == '2' ? config.pcView : config.rowsData.value,
        viewId: config.pcView,
        formcode: config.formType == '2' ? config.rowsData.FormNo : config.formType == '1' ? config.rowsData.F_No : config.rowsData.value,
        appViewId: config.mtView == 'relevancePCView' ? config.pcView : config.mtView,
        field: config.relevanceField,
        systemmenu: config.formType == '0' ? config.rowsData.id : '',
        id_systemmenucode: config.formType == '0' ? config.rowsData.value : '',
        name: config.selectForm,
        url: config.pcFormAddress,
        appurl: config.mtFormAddress,
        id: '',
        formType: config.rowsData.formType,
        formNo: config.formType == '0' ? config.rowsData.value : '',
        authorize: {}
    }
    let fieldData = JSON.parse(JSON.stringify(config.fieldData))
    fieldData.map(item => {
        item.isEdit = item.isEdit ? 1 : 0
        item.isLook = item.isLook ? 1 : 0
        item.isNotNull = item.isNotNull ? 1 : 0
        wfobj.authorize[item.id] = {
            ...item
        }
    })
    wfobj.id = generateUUID()

    obj.wfForms.push(wfobj)
}
//连接线位置信息
const linePosition = (element) => {
    let sp = ''
    let ep = ''
    if (element.waypoints[0].x >= element.source!.x + element.source!.width) {
        sp = 'right'
    }
    else if (element.waypoints[0].x == element.source!.x) {
        sp = 'left'
    }
    else if (element.waypoints[0].y == element.source!.y) {
        sp = 'top'
    }
    else {
        sp = 'bottom'
    }

    if (element.waypoints[element.waypoints.length - 1].x >= element.target!.x + element.target!.width) {
        ep = 'right'
    }
    else if (element.waypoints[element.waypoints.length - 1].x == element.target!.x) {
        ep = 'left'
    }
    else if (element.waypoints[element.waypoints.length - 1].y == element.target!.y) {
        ep = 'top'
    }
    else {
        ep = 'bottom'
    }
    return [sp, ep]
}
//保存审核者数据
const setAuditors = (element, obj) => {
    let auditorsData = element.configData.checkerArr
    let formtype = element.configData.pointFormData![0].formType
    const { validateChecker } = validSubmitData()
    let emptyData = validateChecker(auditorsData, formtype)
    if (emptyData) {
        auditorsData.map(item => {
            switch (item.seletItem) {
                case 'company':
                    obj.auditors.push({
                        cuid: '',
                        auditorId: item.organizationData[0].id,
                        auditorName: item.organizationData[0].text,
                        type: '7',
                        id: generateUUID()
                    })
                    break;
                case 'department':
                    obj.auditors.push({
                        cuid: '',
                        auditorId: item.organizationData[0].id,
                        auditorName: item.organizationData[0].text,
                        type: '8',
                        id: generateUUID()
                    })
                    break;
                case 'post':
                    obj.auditors.push({
                        cuid: '',
                        auditorId: item.organizationData[0].F_PostId,
                        auditorName: item.organizationData[0].F_Name,
                        condition: item.departmentItem.value,
                        type: '1',
                        id: generateUUID()
                    })
                    break;
                case 'role':
                    obj.auditors.push({
                        cuid: '',
                        auditorId: item.organizationData[0].F_RoleId,
                        auditorName: item.organizationData[0].F_FullName,
                        condition: item.departmentItem.value,
                        type: '2',
                        id: generateUUID()
                    })
                    break;
                case 'user':
                    obj.auditors.push({
                        cuid: '',
                        auditorId: item.organizationData[0].F_UserId,
                        auditorName: item.organizationData[0].F_RealName,
                        department: item.organizationData[0].F_DepartmentId,
                        type: '3',
                        id: generateUUID()
                    })
                    break;
                case 'executor':
                    obj.auditors.push({
                        cuid: '',
                        auditorId: item.inputItem.value,
                        auditorName: item.inputItem.label,
                        type: '6',
                        id: generateUUID()
                    })
                    break;
                case 'field':
                    obj.auditors.push({
                        auditorId: `lrsystemdb|${item.fieldForm.name}|${formtype == '2' ? (item.fieldForm.IsMain == '1' ? 'ID' : 'MainId') : item.relativeField.value}|${formtype == '2' ? item.inputItem.FieldCode : item.inputItem.value}|${item.fieldCategory}`,
                        auditorName: `【${item.fieldForm.name}】${item.inputItem.value}`,
                        type: '5',
                        id: generateUUID()
                    })
                    break;
                case 'reciprocalRole':
                    obj.auditors.push({
                        cuid: '',
                        objectId: item.inputItem.value,
                        relativeId: item.departmentItem.value,
                        objectId_Text: item.inputItem.label,
                        relativeId_Text: item.departmentItem.label,
                        auditorId: item.inputItem.value + '|' + item.departmentItem.value,
                        auditorName: '[' + item.inputItem.label + ']' + item.departmentItem.label,
                        type: '9',
                        id: generateUUID()
                    })
                    break;
            }
        })
        return false
    }
    else {
        return true
    }

}
//保存消息回写数据
const saveMessageWriteBack = (data, obj) => {
    let messageData = data.writeBack
    // if (messageData.length > 0 && messageData[0].backField == '') {
    //     ElMessage({
    //         type: 'error',
    //         message: proxy?.maslg('消息回写字段表单字段不能为空')
    //     })
    //     return true
    // }
    messageData.map(item => {
        let backObj = {
            pageid: item.backField.pageid,
            page: item.backForm.label,
            type: data.pointFormData[0].formType,
            fieldid: item.backField.fieldid,
            field: item.backField.label,
            tableCode: item.backField.tableCode,
            cumulative: item.addBack ? '1' : '0',
            cumulativecn: item.addBack ? '累加' : '不累加',
            splitchar: item.splitString,
            fillmode: item.backContent,
            id: generateUUID()
        }
        obj.messagewritebackList.push(backObj)
    })
    return false
}
//保存流程
const saveFlowData = (callback?: Function) => {
    const allElement = allShape.getAll()
    let noEndShape = allElement.find(item => {
        return item.type != "bpmn:SequenceFlow" && item.type != "bpmn:IntermediateThrowEvent" &&
            item.type != "bpmn:EndEvent" && item.outgoing.length == 0 && item.type != "bpmn:Process"
    })
    if (noEndShape) {
        return ElMessage.error(proxy?.maslg(`请将${noEndShape.name}连接至结束节点`))
    }
    flowBox.value?.validForm(async () => {
        //流程配置项数据保存
        let flowData = flowBox.value?.flowFormData
        let advanceData = flowBox.value?.advanceData
        // schemeInfo.F_SchemeId = ''
        schemeInfo.F_Code = flowData!.code
        schemeInfo.F_Name = flowData!.name
        schemeInfo.F_Category = flowData!.category
        schemeInfo.F_Mark = flowData!.canagent ? '1' : '2'
        schemeInfo.F_IsInApp = flowData!.platform.length == 2 ? '0' : flowData!.platform[0]
        schemeInfo.DisagreeSaveData = flowData!.validateForm ? '1' : '2'
        schemeInfo.F_CloseDoType = advanceData!.category.toLowerCase()
        schemeInfo.F_CloseDoDbId = advanceData!.database
        schemeInfo.F_CloseDoSql = advanceData!.agreeSQL
        schemeInfo.F_CloseDoInterface = advanceData!.agreePort
        schemeInfo.F_Description = flowData!.remark as string

        //流程设计器中各节点数据保存
        scheme.DisagreeSaveData.DisagreeSaveData = flowData!.validateForm ? '1' : '2'
        scheme.closeDo.F_CloseDoType = advanceData!.category.toLowerCase()
        scheme.closeDo.F_CloseDoDbId = advanceData!.database
        scheme.closeDo.F_CloseDoSql = advanceData!.agreeSQL
        scheme.closeDo.F_CloseDoInterface = advanceData!.agreePort
        //将所有流程节点的数据配置转为流程节点属性保存，方便保存后进行回写
        let hasError = <any[]>[];
        nodeList.value.map((item: (Shape | Connection)) => {
            if (item.hasOwnProperty('configData')) {
                modeling?.updateProperties(toRaw(item), {
                    configData: JSON.stringify(item.configData)
                })
            }
            if (item.hasOwnProperty('name')) {
                modeling?.updateProperties(toRaw(item), {
                    configName: item.name
                })
            }
            if (saveNodesAndLines.hasOwnProperty(item.type)) {
                hasError.push(saveNodesAndLines[item.type](item))
            }

        })
        if (hasError.every(item => {
            return item == false
        })) {
            //保存bpmn流程图中数据为xml格式，并转换为Json格式保存到数据库中
            await bpmnModeler.saveXML({ format: true }).then((res: any) => {
                scheme.bpmXml = res.xml
            }).catch(err => {
                return ElMessage({
                    type: 'error',
                    message: proxy?.maslg('保存数据失败')
                })
            })
            saveParam.schemeInfo = JSON.stringify(schemeInfo)
            saveParam.scheme = JSON.stringify(scheme)
            saveParam.shcemeAuth = JSON.stringify([{ F_Id: generateUUID(), F_ObjType: 4 }])
            let formData = new FormData()
            for (let i in saveParam) {
                formData.append(i, saveParam[i])
            }
            const loading = ElLoading.service({
                lock: true,
                text: '保存中',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            schemeInfo = {
                cuid: '',
                F_SchemeId: '',
                F_Code: '',
                F_Name: '',
                F_Category: '',
                F_Mark: '',
                F_IsInApp: '',
                DisagreeSaveData: '',
                F_CloseDoType: '',
                F_CloseDoDbId: '',
                F_CloseDoSql: '',
                F_CloseDoIocName: '',
                F_CloseDoInterface: '',
                F_Description: ''
            }
            scheme = {
                nodes: <object[]>[],
                lines: <object[]>[],
                DisagreeSaveData: {
                    DisagreeSaveData: '',
                },
                closeDo: {
                    F_CloseDoType: '',
                    F_CloseDoDbId: '',
                    F_CloseDoSql: '',
                    F_CloseDoIocName: '',
                    F_CloseDoInterface: '',

                },
                bpmXml: ''
            }
            basicApi.saveFlowData(formData).then((res: any) => {
                loading.close()
                if (res.code == 200) {
                    if (location.href.indexOf('?') == -1) {
                        location.href = location.href + `?keyValue=${res.data}&shcemeCode=${flowData?.code}`
                    }
                    if (callback) {
                        callback && callback()
                    }
                    ElMessage({
                        type: 'success',
                        message: proxy?.maslg('保存成功')
                    })
                    saveParam.keyValue = res.data
                    basicApi.getFlowSchemeData({ code: flowData?.code }).then((res: any) => {
                        if (res.code == 200) {
                            schemeInfo.F_SchemeId = res.data.info.F_SchemeId
                        }
                    }).catch(err => {

                    })
                    // saveParam.keyValue = res.data

                }
                else {
                    ElMessage({
                        type: 'error',
                        message: proxy?.maslg(res.info)
                    })
                }
            }).catch(err => {
                console.log(err);

                ElMessage({
                    type: 'error',
                    message: proxy?.maslg('保存流程失败')
                })
                loading.close()
            })
        }
    })
}
(window as any)['saveDesignFlow'] = saveFlowData
let closeWindow = true
const closeFlow = () => {

    window.removeEventListener('beforeunload', handleWindowClose);
    ElMessageBox.confirm(proxy?.maslg('是否确认关闭设计器?'), proxy?.maslg('提示'), {
        confirmButtonText: proxy?.maslg('确认'),
        cancelButtonText: proxy?.maslg('取消'),
        cancelButtonClass: 'cancel_btn',
        type: 'warning'
    }).then(() => {
        closeWindow = true
        window.close()
    }).catch(() => {
        closeWindow = false
        ElMessage({
            type: 'info',
            message: proxy?.maslg('已取消')
        })
    })

}
let handleWindowClose = (event) => {
    event.preventDefault();
    event.returnValue = '关闭提示';
    if (confirm('您确定要关闭窗口吗？')) {
        // 关闭窗口
        window.removeEventListener('beforeunload', handleWindowClose);
    }
    return '关闭提示'
}
const keyDownEvent = (event: KeyboardEvent) => {
    if (event.code == 'Backspace' && event.target == document.body) {
        deletePoint()
    }
}
let definePointFormData: pointFormData[] = []
let hiddenOrshow = ref(false)
onMounted(async () => {
    document.addEventListener('keydown', keyDownEvent)
    let paramsObj: {
        keyValue?: string, shcemeCode?: string, editsource?: string, formDeployId?: string, isHideSave?: string
    } = getUrlParams(['keyValue', 'shcemeCode', 'editsource', 'formDeployId', 'isHideSave'])
    if (paramsObj.hasOwnProperty('isHideSave') && paramsObj.isHideSave == '1') {
        hiddenOrshow.value = true
    }
    else {
        hiddenOrshow.value = false
    }
    if (paramsObj.hasOwnProperty('keyValue') && paramsObj.hasOwnProperty('shcemeCode')) {
        saveParam.keyValue = paramsObj.keyValue as string
        const loading = ElLoading.service({
            lock: true,
            text: proxy?.maslg('加载中'),
            background: 'rgba(0, 0, 0, 0.7)',
        })
        await basicApi.getFlowSchemeData({ code: paramsObj.shcemeCode }).then((res: any) => {
            loading.close()
            if (res.code == 200 && res.data) {
                let data = res.data
                let schemeData = JSON.parse(data.scheme.F_Content)
                let flowFormData = {
                    name: data.info.F_Name,
                    code: data.info.F_Code,
                    category: data.info.F_Category,
                    platform: data.info.F_IsInApp == '0' ? ["2", '1'] : data.info.F_IsInApp == '1' ? ['1'] : ['2'],
                    validateForm: schemeData.DisagreeSaveData.DisagreeSaveData == '1' ? true : false,
                    canagent: data.info.F_Mark == '1' ? true : false,
                    remark: data.info.F_Description
                }
                for (let i in flowFormData) {
                    flowBox.value!.flowFormData[i] = flowFormData[i]
                }
                let advanceData = {
                    category: schemeData.closeDo.F_CloseDoType,
                    database: schemeData.closeDo.F_CloseDoDbId,
                    agreeSQL: schemeData.closeDo.F_CloseDoSql,
                    agreePort: schemeData.closeDo.F_CloseDoInterface,
                }
                for (let i in advanceData) {
                    flowBox.value!.advanceData[i] = advanceData[i]
                }
                schemeInfo.F_SchemeId = data.info.F_SchemeId
                if (schemeData.bpmXml) {
                    designStr = schemeData.bpmXml
                }
                else {
                    designStr = xmlStr
                    if (!paramsObj.hasOwnProperty('editsource')) {
                        ElMessage({
                            type: 'error',
                            message: proxy?.maslg('获取流程模板失败')
                        })
                    }
                }
                if (paramsObj.hasOwnProperty('editsource') && paramsObj.hasOwnProperty('formDeployId')) {
                    new Promise((resolve, reject) => {
                        basicApi.getDeployData({ keyValue: paramsObj.formDeployId }).then((res: any) => {
                            if (res.code == 200) {
                                resolve(res.data)
                            }
                            else {
                                ElMessage({
                                    type: 'error',
                                    message: proxy?.maslg(res.info)
                                })
                            }
                        }).catch(err => {
                            ElMessage({
                                type: 'error',
                                message: proxy?.maslg('获取表单数据失败')
                            })
                        })
                    }).then((resolve: any) => {
                        basicApi.getXANForm({ keyValue: resolve.FormId }).then((res: any) => {
                            if (res.code == 200 && res.data.XA_NForm) {
                                res.data.XA_NForm['formType'] = 'workForm'
                                res.data.XA_NForm['label'] = res.data.XA_NForm.FormName
                                res.data.XA_NForm['value'] = res.data.XA_NForm.ID
                                definePointFormData = [{
                                    formType: '2',
                                    selectForm: res.data.XA_NForm.FormName,
                                    pcFormAddress: '/pages/smartform/render/form.html?' + `id=${resolve.PcViewId}&formId=${resolve.FormId}`,
                                    mtFormAddress: resolve.AppViewId ? '/pages/smartform/render/form.html?' + `id=${resolve.AppViewId}&formId=${resolve.FormId}` : '',
                                    pcView: resolve.PcViewId,
                                    mtView: resolve.AppViewId,
                                    relevanceField: '',
                                    rowsData: res.data.XA_NForm,
                                    tabsData: [],
                                    fieldData: [],
                                    customData: {},
                                    pcviewOptionData: [],
                                    mtViewData: [],
                                    cutomFieldData: []
                                }]
                                // console.log(definePointFormData);

                            }
                            else {
                                ElMessage({
                                    type: 'error',
                                    message: proxy?.maslg(res.info)
                                })
                            }

                        }).catch(err => {
                            console.log(err);

                            ElMessage({
                                type: 'error',
                                message: proxy?.maslg('获取表单详细信息失败')
                            })
                        })
                    })

                }
            }
        }).catch(err => {
            designStr = xmlStr
            loading.close()
            ElMessage({
                type: 'error',
                message: proxy?.maslg('获取流程模板失败')
            })
        })
    }
    else {
        designStr = xmlStr
    }
    await nextTick()
    initDesign()
    designContainer = document.querySelector('.djs-parent')
    //关闭前进行提示
    window.addEventListener('beforeunload', handleWindowClose)
})
onUnmounted(() => {
    document.removeEventListener('keydown', keyDownEvent)
    window.removeEventListener('beforeunload', handleWindowClose);
})
// import main from '@/components/main/index.vue'
</script>


<style scoped lang="less">
@import '@/assets/style/index.less';
</style>