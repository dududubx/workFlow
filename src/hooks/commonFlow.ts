import { ElMessage } from "element-plus"
import { Connection, Shape } from 'bpmn-js/lib/model/Types'

export const commonUtils = () => {
    const onlyCreateShow = ['create', 'againCreate', 'draftCreate', 'chlid', 'againChild']
    const onlyAuditShow = ['audit', 'signAudit', 'refer']
    const windowForm = window as any
    const gradeOptions = [{
        label: '普通',
        value: '0'
    }, {
        label: '重要',
        value: '1'
    }, {
        label: '紧急',
        value: '2'
    }]
    const agreegzData = [{
        label: '处理人就是提交人',
        value: '1'
    }, {
        label: '处理人和上一步的处理人相同',
        value: '2'
    }, {
        label: '处理人审批过',
        value: '3'
    }]
    const noPeopleData = [{
        label: '1',
        value: '超级管理员处理'
    }, {
        label: '2',
        value: '跳过此步骤'
    }, {
        label: '3',
        value: '不能提交'
    }]
    const isAuditorData = {
        chooseauditorData: [{
            label: '1',
            value: '只需其中一人审核'
        }, {
            label: '2',
            value: '所有审核者都需要审核'
        }],
        auditExecutData: [{
            label: '1',
            value: '有人不同意流转'
        }, {
            label: '2',
            value: '所有人审核完'
        }, {
            label: '3',
            value: '按比例执行%'
        }],
        auditorAgainData: [{
            label: '1',
            value: '已通过的无需审核'
        }, {
            label: '2',
            value: '已通过的需要再次审核'
        }],
        auditorData: [{
            label: '1',
            value: '并行'
        }, {
            label: '2',
            value: '串行'
        }]
    }
    //处理节点
    const loadFlowInfo = (nodes: any[], taskInfo, info, currentIds) => {
        let nodeInfoes = {}
        const strcurrentIds = currentIds

        taskInfo.map(item => {
            let nameList = <any[]>[]
            item.nWFUserInfoList.map(nitem => {
                if (nitem.Mark == 0) {
                    nameList.push(nitem.Id)
                }
            })
            let point = {
                nameList
            }
            nodeInfoes[item.F_NodeId] = nodeInfoes[item.F_NodeId] || []
            nodeInfoes[item.F_NodeId].push(point)
        })
        info?.TaskLogList?.map(item => {
            nodeInfoes[item.F_NodeId] = nodeInfoes[item.F_NodeId] || [];
            nodeInfoes[item.F_NodeId].push(item);
        })
        nodes.map(item => {
            item.state = '3' //0正在处理 1 已处理同意 2 已处理不同意 3 未处理 
            if (nodeInfoes[item.id]) {
                item.history = nodeInfoes[item.id]
                if (item.history && item.history.length > 0) {
                    let last = item.history[item.history.length - 1]
                    if (last.F_OperationCode && last.F_OperationCode == 'disagree') {
                        item.state = '2'
                    }
                    else {
                        item.state = '1'
                    }
                }
            }
            if (strcurrentIds?.indexOf(item.id) > -1) {
                item.state = '0';
            }
            if (item.isAllAuditor == "2") {
                item.name += '<br/>【多人审核:';
                if (item.auditorType == "1") {
                    item.name += '并行】';
                }
                else {
                    item.name += '串行】';
                }
            }
        })
    }
    //获取当前节点之前的节点
    const getPrefaceNodes = (lines: any[], id: string) => {
        let nodes = <any[]>[]
        lines.map(item => {
            if (item.agreeList == "agree" && item.to == id) {
                nodes.push({ nodeid: item.from, nodename: "" })
                const preNodes = getPrefaceNodes(lines, item.from)
                preNodes.map(pitem => {
                    nodes.push(pitem)
                })
            }
        })
        return nodes
    }
    //获取审核路径上的上一个节点的id
    const getPrefaceNodeId = (nodes: any[], lines: any[], id: string) => {
        let nodeId = ''
        lines.map(item => {
            if (item.agreeList == "agree" && item.to == id) {
                nodeId = item.from
            }
            //如果是开始节点
            if (item.to == id) {
                let node = nodes.find(sitem => {
                    return sitem.id == item.from
                })
                if (node && node.type == 'startround') {
                    nodeId = item.from
                }
            }
        })
        return nodeId
    }
    const findWindow = (formData: any, urlObj: any, isLook?: boolean,) => {
        const ifrSave = window.frames[0] as any
        ifrSave.setAuthorize && ifrSave.setAuthorize(formData.authorize, isLook);
        ifrSave.page && ifrSave.page.setAuthorize && ifrSave.page.setAuthorize(formData.authorize, isLook);
        ifrSave.setFormData && ifrSave.setFormData(urlObj.processId, '', '', () => { });
        ifrSave.page && ifrSave.page.setFormData && ifrSave.page.setFormData(urlObj.processId, '', '', () => { });
    }
    //验证表单
    const validForm = (scheme: any, code: string, wfForms: any[]) => {
        if (code == "disagree" && scheme.DisagreeSaveData != undefined) {
            if (scheme.DisagreeSaveData.DisagreeSaveData == "2" || scheme.DisagreeSaveData.DisagreeSaveData == 2)
                return true;
        }
        if (wfForms && wfForms.length > 0) {
            const form = wfForms[0];
            if (form.type == '1') {// 自定义表单
                // if (!$.lrValidCustmerform()) {// 自定义表单
                //     return false;
                // }
                // //子表部分判断 czq 20210206
                // for (var item in form.girdCompontMap) {
                //     var reslut = $("#" + form.girdCompontMap[item].id).jfGridValid();
                //     if (!reslut) {
                //         learun.alert.error('表单信息输入有误,请检查！</br>表格未输入完整');
                //     }
                // }
            }
            else {// 系统表单
                const ifrSave = window.frames[0] as any

                if (ifrSave.validForm && !ifrSave.validForm(code)) {
                    return false;
                }
                else if (ifrSave.page && ifrSave.page.validForm && !ifrSave.page.validForm(code)) {
                    return false;
                }
            }
        }
        return true;
    }
    //创建加签图形
    const createShape = async (bpmnModeler: any, scheme: any, currentNode: any, checkerArr: any[]) => {
        const canvas = bpmnModeler.get('canvas')
        const elementRegistry = bpmnModeler.get('elementRegistry')
        const modeling = bpmnModeler.get('modeling')
        //获取画布的根节点
        const rootElement = canvas.getRootElement()
        //生成一个审核节点
        const createElement = (bpmnModeler.get('elementFactory') as any).createShape({
            type: 'bpmn:Task'
        })
        //获取到插入节点
        const startElemt = elementRegistry.get(currentNode.value.id) as Shape
        let childNode = <any[]>[]
        //获取插入节点的所有子节点
        scheme.lines.forEach(item => {
            if (item.from == currentNode.value.id && item.to != startElemt.incoming![0].source?.id)
                childNode.push(item)
        })
        //创建一个审核节点并加入到画布中
        const newShape = modeling.createShape(createElement, { x: startElemt.x + startElemt.width + 120, y: startElemt.y + startElemt.height / 2 }, rootElement)
        newShape['class'] = 'dealing_overlay'
        let hasDisagreeLine = false
        //遍历插入节点的子节点
        childNode.forEach((fitem) => {
            //获取节点实例
            const lastElemt = elementRegistry.get(fitem.to) as Shape
            //插入节点后移动与该节点关联的其他节点位置
            const findNextNode = (shape: Shape, moveShap: Shape) => {
                let oldX = shape.x
                if (oldX <= moveShap.x + moveShap.width && Math.abs((shape.y + shape.height) - (moveShap.y + moveShap.height)) <= 20) {
                    //移动节点位置
                    modeling.moveShape(shape, { x: (moveShap.x + moveShap.width - oldX + 80), y: 0 })
                    // await nextTick()
                    if (shape.outgoing.length > 0) {
                        shape.outgoing.map((item: any) => {
                            if (item.target.id == currentNode.value.id) {
                                hasDisagreeLine = true
                            }
                            if (item.target.id != currentNode.value.id) {
                                modeling.updateWaypoints(item, [{ x: shape.x + shape.width, y: shape.y + shape.height / 2 },
                                { x: item.target.x, y: shape.y + shape.height / 2 }])
                                findNextNode(item.target, shape)
                            }
                        })

                    }
                }
            }
            //
            findNextNode(lastElemt, newShape)
            //获取插入节点跟其他子节点的连接线
            const oldLine = elementRegistry.get(fitem.id) as Connection
            //删除连接线
            modeling.removeConnection(oldLine)
            //重新连接新增的节点与子节点
            modeling.connect(newShape, lastElemt, null as any)
        })
        //连接插入节点与新增节点
        modeling.connect(startElemt, newShape, null as any)
        //反向连接插入节点与新增节点，并返回连接线实例
        let newLine = modeling.connect(newShape, startElemt, null as any)
        //设置反向连接线的颜色
        modeling.setColor([newLine], {
            stroke: '#ff4747'
        })
        //修改连接线的拐点位置
        modeling.updateWaypoints(newLine, [{ x: newShape.x + newShape.width / 2, y: newShape.y },
        { x: newShape.x + newShape.width / 2, y: startElemt.y - (hasDisagreeLine ? 20 : 50) },
        { x: startElemt.x + startElemt.width / 2 + (hasDisagreeLine ? 10 : 0), y: startElemt.y - (hasDisagreeLine ? 20 : 50) }
            , { x: startElemt.x + startElemt.width / 2 + (hasDisagreeLine ? 10 : 0), y: startElemt.y }])
        //更新连接线的名称为驳回
        modeling.updateLabel(newLine, '驳回')
        //更新节点让增加的类名生效
        modeling.updateAttachment(newShape)
        if (checkerArr.length > 0) {
            modeling?.updateProperties(newShape, {
                configData: JSON.stringify({ checkerArr })
            })
        }
        let xml;
        //保存bpmn流程图中数据为xml格式，并转换为Json格式保存到数据库中
        await bpmnModeler.saveXML({ format: true }).then((res: any) => {
            xml = res.xml
        }).catch(err => {
            return ElMessage({
                type: 'error',
                message: windowForm.maslg.get('保存流程模板失败')
            })
        })
        return {
            newShape,
            allElement: elementRegistry.getAll(),
            xml
        }
    }

    return {
        agreegzData,
        noPeopleData,
        isAuditorData,
        gradeOptions,
        loadFlowInfo,
        getPrefaceNodes,
        getPrefaceNodeId,
        findWindow,
        validForm,
        createShape,
        onlyCreateShow,
        onlyAuditShow,
    }
}