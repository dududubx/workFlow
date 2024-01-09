<template>
    <div ref="container" class="container_box"></div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import minimapModule from 'diagram-js-minimap'
import { xmlStr } from '@/utils/xmlStr'
import CustomModeler from '@/components/palette/customModeler'
import { getUrlParams } from '@/utils/util'
import { basicApi } from '@/api/basic'
import { ElLoading, ElMessage } from 'element-plus'

const { proxy } = <ComponentInternalInstance>getCurrentInstance()

const container = ref<HTMLElement>()
let bpmnModeler: BpmnModeler
let xml;
const init = () => {
    try {
        bpmnModeler = new CustomModeler({
            container: container.value,
            additionalModules: [
                {
                    //禁用/清空左侧工具栏
                    paletteProvider: ["value", ''],
                    //禁止移动画布
                    moveCanvas: ['value', ''],
                    //禁止鼠标滚轮缩小放大画布
                    zoomScroll: ['value', ''],
                    // 禁止双击节点出现label编辑框
                    labelEditingProvider: ['value', ''],
                    //禁用连线拖动
                    bendpoints: ['value', {}],
                    //禁用鼠标焦点移动到画布边缘，画布自动滚动功能
                    autoScroll: ['value', {}],
                    //禁止移动图形
                    move: ['value', {}],
                    //禁用图形菜单
                    contextPadProvider: ['value', {}]
                },
                minimapModule
            ]
        })
        renderData()
    } catch (error) {
        // console.log(error)
    }
}
const renderData = async () => {
    try {
        let result = await bpmnModeler.importXML(xml)
        let canvas: any = bpmnModeler.get('canvas')
        canvas.zoom(0.9)
        let minimap: any = bpmnModeler.get('minimap')
        nextTick(() => {
            minimap.open()
        })
    } catch (error) {

    }
}
onMounted(async () => {
    let paramsObj: { schemeId?: string } = getUrlParams(['schemeId'])
    if (paramsObj.schemeId) {
        const loading = ElLoading.service({
            lock: true,
            text: proxy?.maslg('加载中'),
            background: 'rgba(0, 0, 0, 0.7)',
        })
        await basicApi.getFlowSchemeData({ code: paramsObj.schemeId }).then((res: any) => {
            loading.close()
            if (res.code == 200) {
                let schemeData = JSON.parse(res.data.scheme.F_Content)
                xml = schemeData.bpmXml ? schemeData.bpmXml : xmlStr
            }
        }).catch(err => {
            loading.close()
            ElMessage.error(proxy?.maslg('获取模板数据失败'))
        })
    }
    else {
        xml = xmlStr
    }
    await nextTick()
    init()
})
</script>

<style scoped lang="less">
.container_box {
    width: 100%;
    height: 100%;
    background-image: url('../../assets/image/img_girid-point.png');
    background-repeat: repeat;

    svg {
        height: 500%;
        width: 500% !important;
    }
}
</style>