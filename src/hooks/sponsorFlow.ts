import { Ref, onMounted, ref, reactive, nextTick } from 'vue'
import { type UploadProps, type UploadUserFile, type UploadInstance, type UploadFile, ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { xmlStr } from '@/utils/xmlStr'
import CustomModeler from '@/components/palette/customModeler'

import { generateUUID, getUrlParams, formatDate, confirmBox } from '@/utils/util'
import { checkSponsorApi } from '@/api/check'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import { Connection, Shape } from 'bpmn-js/lib/model/Types'
import { Base64 } from 'js-base64'
import { commonUtils } from './commonFlow'
// import { useRouter } from 'vue-router'

// const router = useRouter()
interface sponsorFlow {
    title: string,
    grade: string,
    receiveArr: any[],
    receiveTree: object,
    receiveInput: any[],
    reactiveObj: any[],
    accessoryData: UploadUserFile[],
    document: any[]
}

interface nextAudiotrsType {
    id: string,
    name: string,
    selectData: string[],
    optionData: any[]
}
// const { proxy } = <ComponentInternalInstance>getCurrentInstance()
export function sponsorConfig() {
    const sponsorFlowData = reactive<sponsorFlow>({
        title: '',
        grade: '0',
        receiveArr: [],
        receiveTree: {},
        receiveInput: [],
        reactiveObj: [],
        accessoryData: [],
        document: []
    })
    let modeling: Modeling
    let elementRegistry: ElementRegistry
    let canvas: any
    //流程设计器画布
    let bpmnModeler: BpmnModeler
    let initDesign = (container: HTMLElement, designStr: any) => {
        try {
            bpmnModeler = new CustomModeler({
                container: container,
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
                ]
            })
            createNewDiagram(designStr)
        } catch (error) {

        }

    }
    //导入xml文件创建画布
    let createNewDiagram = async (designStr: any) => {
        try {
            let xml = designStr.bpmXml ? designStr.bpmXml : xmlStr
            let result = await bpmnModeler.importXML(xml)
            // bpmnModeler.get('minimap').open()
            canvas = bpmnModeler.get('canvas')
            elementRegistry = bpmnModeler.get('elementRegistry')
            modeling = bpmnModeler.get('modeling')
            const overlays = bpmnModeler.get('overlays')
            canvas.zoom(0.9)
            //根据节点处理状态设置不同的类名
            designStr.bpmXml && designStr?.nodes?.map(item => {
                if (isFinished && isFinished == 1 && item.type == "endround") {
                    item.state = '1'
                }
                let element = elementRegistry.get(item.id) as Shape
                element['class'] = item.state == '3' ? 'nodeal_overlay' : item.state == '0' ? 'dealing_overlay' : 'dealed_overlay'
                modeling?.updateAttachment(element)
                // const overlayHtml = $(`<div class="${}">`).css({
                //     width: element.width,
                //     height: element.height,
                //     borderRadius: item.type == 'startround' ? '50%' : ''
                // })
                // // modeling?.setColor(element, {
                // //     fill: item.state == '3' ? 'rgb(153, 153, 153)' : item.state == '0' ? 'rgba(0, 128, 255, 1)' : '#5cb85c'
                // // })
                // overlays.add(element.id, {
                //     position: { top: 0, left: 0 },
                //     html: overlayHtml
                // })
            })
        } catch (error) {
        }
    }
    const checkInfo = reactive({
        infoAdvise: '',
        link: <UploadFile[]>[],
        document: <any[]>[],
        title: '',
        checkName: '',
        createTime: '',
        checkAdvise: <any[]>[],
        checkRadio: 'agree',
        hideAgree: false,
        hideDisagree: false
    })
    const signForm = reactive({
        auditor: <any[]>[],
        auditorTree: {},
        auditorString: '',
        timeoutStrategy: '',
        agreeGz: <string[]>[],
        isNeedCheckText: '1',
        isBatchAudit: '1',
        appointSetUser: '2',
        isSign: '1',
        noPeopleGz: '1',
        isAllAuditor: '1',
        auditExecutType: '1',
        auditorAgainType: '1',
        scaleExecut: 0,
        auditorType: '2',
    })

    //驳回节点弹窗数据保存字段
    const rejectData = reactive({
        select: '',
        option: <{ nodeid: string, nodename: string }[]>[]
    })
    const nextAuditorsDialog = ref<nextAudiotrsType[]>([])
    const windowForm = window as any
    const urlObj = getUrlParams(['shcemeCode', 'tabIframeId', 'type', 'createUserId', 'processId', 'taskId', 'isCopy'])
    const ifrmArr = ref<any[]>([])
    const iframePane = ref('')
    const signDialog = ref(false)
    const visibleObj = reactive({
        //加签弹窗
        dialogVisible: false,
        //下一节点审核人弹窗
        seletNextUserVisible: false,
        //驳回节点弹窗
        rejectVisible: false,
    })
    let currentNode = ref()
    let isFinished;//流程是否结束
    let processEntity;//当前流程进程实体数据
    let currentTaskEntity;//当前任务实体数据
    let taskRelationEntity;//当前任务执行情况实体数据
    let currentIds;// 当前需要审核的节点
    let pProcessId;// 父级流程实例主键
    let flowAppointNodeId = '';//流程指定驳回的节点id
    let scheme;
    let nextUsers;
    let getFlowSchemeId = '';
    let btnData;
    let appointUserId = '';
    let appointNodeId = '';
    let childProcessId = '';
    let childFlow = ''
    let ischeck = ref(false)
    const userTitle = ref('选择用户')
    let folderId = generateUUID()
    const { loadFlowInfo, getPrefaceNodes, getPrefaceNodeId, findWindow, validForm, createShape, onlyAuditShow, onlyCreateShow } = commonUtils()
    const init = (bpm: any, container: HTMLElement) => {
        if (bpm) {
            initDesign(container, bpm)
        }
        else {
            initDesign(container, '')
        }
    }
    //打开审核者选择弹窗
    const openSelectUser = (type: string, userBox: any) => {
        userBox.getFromData('')
        if (type == 'sponsor') {
            userTitle.value = '选择下一节点审核人员'
            ischeck.value = false
            userBox.clearSelectData(sponsorFlowData.receiveArr, sponsorFlowData.receiveTree)
        }
        else {
            userTitle.value = '选择审核人员'
            ischeck.value = true
            userBox.clearSelectData(signForm.auditor, signForm.auditorTree)
        }
    }
    //选择完审核者后保存选择的信息
    const comeBackRoleandUser = (val: any[], treeobj: object) => {
        let str = val.reduce((pervalue, currentvalue, index) => {
            if (index == val.length - 1) {
                return pervalue + currentvalue.F_RealName
            }
            else {
                return pervalue + currentvalue.F_RealName + '、'
            }
        }, '')
        let userId = val.reduce((pre, currentValue, index) => {
            if (index == val.length - 1) {
                return pre + currentValue.F_UserId
            }
            else {
                return pre + currentValue.F_UserId + ','
            }
        }, '')
        if (ischeck.value) {
            signForm.auditor = val
            signForm.auditorString = str
            signForm.auditorTree = treeobj
        }
        else {
            sponsorFlowData.receiveInput = sponsorFlowData.receiveInput.concat(str.split('、'))
            sponsorFlowData.receiveArr = val
            sponsorFlowData.receiveTree = treeobj
            appointUserId = userId
            if (urlObj.type == 'create') {
                save(urlObj.processId, currentNode.value.wfForms, () => {
                    createFlow({
                        appointUserId: userId
                    })
                })
            }
            else {
                handleSaveAudit()
            }
        }
        // signForm.auditorString = 

    }

    //流程发起
    const createType = (code: any, el: HTMLIFrameElement, container: HTMLElement, callback: Function) => {
        checkSponsorApi.getSchemeByCode({ code: code }).then((res: any) => {
            if (res.code == 200) {
                scheme = JSON.parse(res.data.F_Content);
                init(scheme, container)
                scheme.nodes.map(item => {
                    if (item.type == 'startround') {
                        currentNode.value = item
                        loadForm(el, item.wfForms)
                        return false
                    }
                })
                callback && callback(res.data)
            }
            else {
                ElMessage.error(windowForm.maslg.get(res.info))
            }
        }).catch(err => {
            ElMessage.error(windowForm.maslg.get('获取流程模板失败'))
        })
    }
    //获取流程信息
    const getProcessInfo = (el: HTMLIFrameElement, container: HTMLElement, callback: Function, isChild?: any) => {
        checkSponsorApi.getProcessInfoApi({ processId: urlObj.processId, taskId: urlObj.taskId ? urlObj.taskId : '' }).then((res: any) => {
            if (res.code == 200) {
                checkInfo.title = res.data.processEntity?.F_SchemeName
                checkInfo.checkName = res.data.processEntity?.F_CreateUserName
                checkInfo.createTime = res.data.processEntity?.F_CreateDate
                isFinished = res.data.info?.isFinished
                processEntity = res.data?.processEntity;//当前流程进程信息
                currentTaskEntity = res.data?.currentTaskEntity;//当前待办任务信息
                taskRelationEntity = res.data?.taskRelationEntity;
                scheme = JSON.parse(res.data.info.Scheme);
                if (urlObj.type.indexOf('ch') == -1) {
                    init(scheme, container)
                }
                sponsorFlowData.receiveInput = []
                //获取当前节点
                scheme.nodes.forEach(sitem => {
                    if (sitem.id == res.data.info.CurrentNodeId) {
                        currentNode.value = sitem
                    }
                    if (!res.data.info.CurrentNodeId && res.data.info.CurrentNodeIds.length > 0 && sitem.id == res.data.info.CurrentNodeIds[0]) {
                        currentNode.value = sitem
                    }
                    if (sitem.auditors) {
                        sitem.auditors.map(item => {
                            let name = item.auditorName
                            if (item.type == '5') {
                                let mainForm = sitem.wfForms.find(witem => {
                                    return witem.formType == "workForm"
                                })
                                let mainField = mainForm.authorize
                                let fieldArr = item.auditorId.split('|')
                                for (let i in mainField) {
                                    if (mainField[i].tableCode == fieldArr[1] && mainField[i].fieldId == fieldArr[3]) {
                                        name = item.auditorName + '(' + mainField[i].fieldName + ')'
                                    }
                                }
                            }
                            sponsorFlowData.receiveInput.push(name)
                        })
                    }
                })
                currentNode.value?.btnList?.map(item => {
                    if (item.code == 'agree') {
                        if (item.isHide == '1') {
                            checkInfo.hideAgree = true
                            checkInfo.checkRadio = 'disagree'
                        }
                        else {
                            checkInfo.hideAgree = false
                            checkInfo.checkRadio = 'agree'
                        }
                    }
                    if (item.code == 'disagree') {
                        if (item.isHide == '1') {
                            checkInfo.hideDisagree = true
                        }
                        else {
                            checkInfo.hideDisagree = false
                        }
                    }
                })
                currentIds = res.data.info?.CurrentNodeIds;
                if (res.data.info.parentProcessId) {
                    pProcessId = res.data.info.parentProcessId;
                }
                if (!isChild) {
                    loadFlowInfo(scheme.nodes, res.data.task || [], res.data.info || {}, currentIds);
                    loadTimeLine(res.data.task || [], res.data.info || {});
                }

                callback(res.data)
            }
            else {
                ElMessage.error(windowForm.maslg.get(res.info))
            }
        }).catch(err => {
            console.log(err);

            ElMessage.error(windowForm.maslg.get('获取流程进程信息失败'))
        })
    }
    //根据流程ID获取流程信息
    const getSchemeByProcessId = (el: HTMLIFrameElement, container: HTMLElement, callback: Function) => {
        checkSponsorApi.getSchemeByProcessId({ processId: urlObj.processId }).then((res: any) => {
            if (res.code == 200) {
                scheme = JSON.parse(res.data.F_Content)
                init(scheme, container)
                if (urlObj.type != "draftCreate") {
                    currentIds = res.data.info.currentIds || [];
                }
                currentNode.value = scheme.nodes.find(item => {
                    return item.type == 'startround'
                })
                loadFlowInfo(scheme.nodes, res.data.task || [], res.data.info || {}, currentIds)
                loadTimeLine(res.data.task || [], res.data.info || {});
                callback(res.data)
            }
            else {
                ElMessage.error(windowForm.maslg.get(res.info))
            }
        }).catch(err => {
            ElMessage.error(windowForm.maslg.get('获取流程模板信息失败'))
        })
    }

    //流程类型
    const differentType: { [key: string]: (el: HTMLIFrameElement, container: HTMLElement) => void } = {
        'create': (el, container) => {
            createType(urlObj.shcemeCode, el, container, (data: any) => {
                urlObj['processId'] ? urlObj['processId'] = urlObj.processId : urlObj['processId'] = generateUUID()
                if (!currentNode.value) {
                    return ElMessage.error(windowForm.maslg.get('流程缺少开始节点'))
                }
                loadFlowInfo(scheme.nodes, [], {}, currentIds)
                setTitle()
            })
        },
        'look': (el, container) => {
            getProcessInfo(el, container, (data: any) => {
                loadForm(el, currentNode.value.wfForms, true)
                loadBtn()
            })
        },
        'audit': (el, container) => {
            getProcessInfo(el, container, (data: any) => {


                loadForm(el, currentNode.value.wfForms)
                loadBtn()
                // if (currentNode.value.isSign == '1') {
                //     allowSign.value = true
                // }
                // else {
                //     allowSign.value = false
                // }
            })
        },
        'againCreate': (el, container) => {
            getProcessInfo(el, container, (data: any) => {
                sponsorFlowData.title = data?.processEntity?.F_Title ? data?.processEntity?.F_Title : ''
                loadForm(el, currentNode.value.wfForms)
                loadBtn()
            })
        },
        'draftCreate': (el, container) => {
            checkSponsorApi.getProcessEntity({ processId: urlObj.processId }).then((res: any) => {
                if (res.code == 200) {
                    sponsorFlowData.title = res.data?.F_Title ? res.data.F_Title : ''
                    getSchemeByProcessId(el, container, (data) => {
                        loadForm(el, currentNode.value.wfForms)
                    })
                }
            }).catch(err => {
                ElMessage.error(windowForm.maslg.get('获取流程进程实体信息失败'))
            })
        },
        'signAudit': (el, container) => {
            getProcessInfo(el, container, (data: any) => {
                loadForm(el, currentNode.value.wfForms)
            })
        },
        //传阅
        'refer': (el, container) => {
            getProcessInfo(el, container, (data: any) => {
                loadForm(el, currentNode.value.wfForms)
            })
        },
        'chlid': (el, container) => {
            getProcessInfo(el, container, (data: any) => {
                childProcessId = data.info.childProcessId
                childFlow = currentNode.value?.childFlow
                createType(currentNode.value?.childFlow, el, container, (cdata: any) => {
                    loadFlowInfo(scheme.nodes, data.task || [], data.info || {}, currentIds)
                    loadTimeLine([], {})
                })
            }, true)
        },
        'childlook': (el, container) => {
            getProcessInfo(el, container, (data: any) => {
                childProcessId = data.info.childProcessId
                childFlow = currentNode.value.childFlow
                createType(currentNode.value.childFlow, el, container, (cdata: any) => {
                    loadFlowInfo(scheme.nodes, data.task || [], data.info || {}, currentIds)
                    loadTimeLine(data.task || [], data.info || {})
                })
            }, true)
        },
        'againChild': (el, container) => {
            getProcessInfo(el, container, (data: any) => {
                childProcessId = data.info.childProcessId
                childFlow = currentNode.value.childFlow
                createType(currentNode.value.childFlow, el, container, (cdata: any) => {
                    loadFlowInfo(scheme.nodes, data.task || [], data.info || {}, currentIds)
                    loadTimeLine(data.task || [], data.info || {})
                })
            }, true)
        }

    }
    //获取表单和流程信息
    const getIfrmUrl = (el: HTMLIFrameElement, container: HTMLElement) => {
        if (differentType[urlObj.type]) {
            differentType[urlObj.type](el, container)
        }
    }
    //加载表单
    const loadForm = function (el: HTMLIFrameElement, formData: any, isLook?: boolean) {
        ifrmArr.value = formData
        if (formData.length == 0) {
            return false
        }
        //单个表单
        else if (formData.length == 1) {
            let form = formData[0]
            //查看模式不判断是否独占
            if (urlObj.type != "look" && urlObj.type != "refer" && urlObj.type != "childlook") {
                //需要判断是否独占【只针对智能表单】
                checkSponsorApi.getFormGfus({ formId: form.nFormId, keyValue: urlObj.processId ? urlObj.processId : generateUUID() }).then((res: any) => {
                    if (res.code == 200) {
                        if (res.data == "1") {
                            $(window.document.body).html('<div style="color:red;text-align:Center;font-size:12pt;line-height:50px;">' + res.info + '</div>');
                            return false;
                        }
                    }
                }).catch(err => {
                    ElMessage({
                        type: 'error',
                        message: windowForm.maslg.get('获取表单是否独占信息失败')
                    })
                })

            }
            //自定义表单
            if (form.type == '1') {

            }
            else {
                let formUrl = windowForm.flowIframApi + form.url
                if (form.type == '2') {
                    if (formUrl.indexOf('independent=') < 0) {
                        formUrl += "&independent=1";
                    }
                    if (formUrl.indexOf('wftype=') < 0) {
                        formUrl += "&wftype=" + (formData.formType == "lookForm" ? "lookForm" : urlObj.type);
                    }
                    if (formUrl.indexOf('isCopy=') < 0) {
                        formUrl += "&isCopy=" + (urlObj.isCopy ? urlObj.isCopy : '0');
                    }
                    if (formUrl.indexOf('formcode=') < 0) {
                        formUrl += "&formCode=" + form.formcode;
                    }
                }
                el.src = formUrl;
                el.addEventListener('load', function () {
                    findWindow(formData, urlObj, isLook)
                });

                // el.attr('src', formUrl)
            }
        }
        //多表单
        else {
            formData.forEach((item, index) => {
                if (item.type == '1') {

                }
                else {
                    let formUrl = windowForm.flowIframApi + item.url
                    if (item.type == '2') {
                        if (formUrl.indexOf('independent=') < 0) {
                            formUrl += "&independent=1";
                        }
                        if (formUrl.indexOf('wftype=') < 0) {
                            formUrl += "&wftype=" + (item.formType == "lookForm" ? "lookForm" : urlObj.type);
                        }
                        if (formUrl.indexOf('isCopy=') < 0) {
                            formUrl += "&isCopy=" + (urlObj.isCopy ? urlObj.isCopy : '0');
                        }
                        if (formUrl.indexOf('formcode=') < 0) {
                            formUrl += "&formCode=" + item.formcode;
                        }
                    }
                    item['formUrl'] = formUrl
                    nextTick(() => {
                        $(`#${item.id}`)[0].addEventListener('load', function () {
                            findWindow(formData, urlObj, isLook)
                        })
                    })

                }
            })
        }
    }
    //获取上传附件和关联文档的数据
    const saveUploadFile = () => {
        const annexArr = <string[]>[]
        let doceArr = ''
        let accessoryData = onlyCreateShow.includes(urlObj.type) ? sponsorFlowData.accessoryData : checkInfo.link
        let documentData = onlyCreateShow.includes(urlObj.type) ? sponsorFlowData.document : checkInfo.document
        accessoryData.map((item: any) => {
            if (item?.raw && item?.raw!['guid']) {
                annexArr.push(item.raw!['guid'])
            }
            else if (item.FileID) {
                annexArr.push(item.FileID)
            }
        })
        doceArr = documentData.reduce((preValue, newValue, index) => {
            if (index != sponsorFlowData.document.length - 1) {
                return preValue + (newValue.F_Id ? newValue.F_Id : newValue.FileID) + ','
            }
            else {
                return preValue + (newValue.F_Id ? newValue.F_Id : newValue.FileID)
            }
        }, '')
        return { annexArr, doceArr }
    }
    //保存数据通用验证
    const save = (processId: string, wfForms: any[], callback: Function) => {
        try {
            let btnName = btnData && btnData.name || ''
            if (currentNode.value) {
                if (currentNode.value.messagewritebackList) {
                    currentNode.value.messagewritebackList.map(item => {
                        let fillcontent = "";
                        switch (item.fillmode) {
                            case "content":
                                fillcontent = checkInfo.infoAdvise;
                                break;
                            case "time":
                                fillcontent = formatDate(date, "yyyy-MM-dd hh:mm:ss");
                                break;
                            case "hum":
                                fillcontent = thisUserName;
                                break;
                            case "merge":
                                fillcontent = '【' + btnName + '】' + checkInfo.infoAdvise + " " + formatDate(date, "yyyy-MM-dd hh:mm:ss") + " " + thisUserName;
                                break;
                            case "btn":
                                fillcontent = btnName;
                                break;
                        }
                        if (item.type == "0") {
                            //系统表单
                            let fieldControl = $(window.frames[0].document).find("#" + item.fieldid + "");
                            if (item.cumulative == "1") {
                                fieldControl.val(fieldControl.val() + ((item.splitchar == "" || !item.splitchar) ? '\r\n' : item.splitchar) + fillcontent);
                            } else {
                                fieldControl.val(fillcontent);
                            }
                        } else {
                            //智能表单
                            let iframes = $('.pane_container').find('iframe'), writeform;
                            if (iframes.length == 1) {
                                writeform = iframes[0].contentWindow.$('[data-table=' + item.tableCode + ']');
                            } else if (iframes.length > 1) {
                                //流程绑定多个表单时根据当前焦点表确定要打印的表单
                                for (let i = 0; i < iframes.length; i++) {
                                    writeform = iframes[i].contentWindow.$('[data-table=' + item.tableCode + ']');
                                    if (writeform) break;
                                }
                            }
                            //找到对应字段
                            let fieldControl = writeform.find('#' + item.fieldid);
                            //如果是追加
                            if (item.cumulative == "1") {
                                if (fieldControl.val()) {
                                    fieldControl.val(fieldControl.val() + ((item.splitchar == "" || !item.splitchar) ? '\r\n' : item.splitchar) + fillcontent);
                                }
                                else {
                                    fieldControl.val(fillcontent)
                                }
                            } else {
                                //如果是覆盖
                                fieldControl.val(fillcontent);
                            }
                        }
                    })
                }
            }
        } catch (error) {

        }
        //审核信息回绑控件
        if (wfForms.length > 0) {
            const loading = ElLoading.service({
                lock: true,
                text: windowForm.maslg.get('保存表单数据中'),
                background: 'rgba(0, 0, 0, 0.7)',
            })
            const form = wfForms[0]
            if (form.type == '1') {
                loading.close()
            }
            else {
                const ifrSave = window.frames[0] as any
                ifrSave.save && ifrSave.save(processId, function (res) {
                    loading.close()
                    if (res.code == 200) {
                        ifrSave.isUpdate = true;
                        ifrSave.removeFormIsUsing && ifrSave.removeFormIsUsing(null, processId);//解除独占
                        callback();
                    }
                    else {
                        ElMessage.error(windowForm.maslg.get(res.info))
                    }
                }, urlObj.type);
                ifrSave.page && ifrSave.page.save && ifrSave.page.save(processId, function (res) { // 系统表单保存成功后需要将状态设置为更新状态（草稿并不会关闭页面）
                    loading.close()
                    if (res.code == 200) {
                        ifrSave.isUpdate = true;
                        ifrSave.removeFormIsUsing && ifrSave.removeFormIsUsing(null, processId);//解除独占
                        callback();
                    }
                    else {
                        ElMessage.error(windowForm.maslg.get(res.info))
                    }
                }, urlObj.type);
                // if (!windowForm.save && !windowForm.page) {
                //     loading.close()
                //     callback()
                // }
            }
        }
    }
    //获取节点的审批意见以及上传的文档
    const loadTimeLine = (taskInfo: any[], info: any) => {
        let history = info.TaskLogList || []
        history.map(async item => {
            if (item.F_OperationName != '同意' && item.F_OperationName != '不同意') {
                item['adviseContent'] = item.F_OperationName
            }
            else {
                item['adviseContent'] = ''
            }
            if (item.F_Des) {
                item['adviseContent'] += item.F_Des
            }
            if (item.F_TaskType != '0' && item.F_TaskType != '4' && item.F_TaskType != '5' && item.F_TaskType != '6') {
                if (item.F_SignImg) {
                    await checkSponsorApi.getSignImg({ id: item.F_SignImg }).then((res: any) => {
                        let blob = new Blob([res], { type: 'image/png' })
                        let url = window.URL.createObjectURL(blob)
                        item['signImgUrl'] = url
                    }).catch(err => {
                        ElMessage.error(windowForm.maslg.get('获取签字信息失败'))
                    })
                }
                if (item.F_StampImg) {
                    await checkSponsorApi.getStampImg({ keyValue: item.F_StampImg }).then((res: any) => {
                        let blob = new Blob([res], { type: 'image/png' })
                        let url = window.URL.createObjectURL(blob)
                        item['stampImgUrl'] = url
                    }).catch(err => {
                        ElMessage.error(windowForm.maslg.get('获取盖章信息失败'))
                    })
                }
                checkInfo.checkAdvise.unshift(item)
            }
            else if (item.F_TaskType == '0' && item.XAWFTaskFilesList && item.XAWFTaskFilesList.length > 0 && item.F_OperationCode.toLowerCase() != 'create' && urlObj.type.toLowerCase() != "create" && urlObj.type.toLowerCase() != "draftcreate" && urlObj.type.toLowerCase() != "againcreate") {
                checkInfo.checkAdvise.unshift(item)
            }
            if (item.XAWFTaskFilesList && item.XAWFTaskFilesList.length > 0 && item.F_OperationCode.toLowerCase() == 'create') {
                sponsorFlowData.accessoryData = []
                sponsorFlowData.document = []
                item.XAWFTaskFilesList.map(xitem => {
                    if (xitem.RelationType == 0) {
                        xitem['name'] = xitem.F_FileName
                        sponsorFlowData.accessoryData.push(xitem)
                    }
                    else if (xitem.RelationType == 1) {
                        xitem['docName'] = xitem.F_Title
                        sponsorFlowData.document.push(xitem)
                    }

                })
            }
        })
        if (history.length == 0) {
            checkSponsorApi.getXAWFTaskFile({ queryJson: JSON.stringify({ WFProcessID: urlObj.processId, WFTaskID: "0" }) }).then((res: any) => {
                if (res.code == 200) {
                    sponsorFlowData.accessoryData = []
                    sponsorFlowData.document = []
                    res.data.map(xitem => {
                        if (xitem.RelationType == 0) {
                            xitem['name'] = xitem.F_FileName
                            sponsorFlowData.accessoryData.push(xitem)
                        }
                        else if (xitem.RelationType == 1) {
                            xitem['docName'] = xitem.F_Title
                            sponsorFlowData.document.push(xitem)
                        }

                    })
                }
                else {
                    ElMessage.error(windowForm.maslg.get(res.info))
                }

            }).catch(err => {
                ElMessage.error(windowForm.maslg.get('获取上传文件失败'))
            })
        }
    }
    //加载下一节点审核人
    const loadNextUsers = (btn: any, callback: Function) => {
        let isNext = currentNode.value.isNext;//下一节点审核人：1允许手动指定2不允许手动指定
        if (btn.next && btn.next == '2') {
            //下一节点审核人：1不能手动设置2能手动设置
            isNext = '1'
        }
        // 获取下一节点数据
        if (isNext == '1') {
            const params = {
                code: urlObj.shcemeCode,
                processId: urlObj.processId,
                taskId: urlObj.taskId,
                nodeId: currentNode.value.id,
                operationCode: btn.code,
                appointNodeId: flowAppointNodeId
            }
            checkSponsorApi.getNextAuditorData(params).then((res: any) => {
                if (res.code == 200) {
                    let _flag = false;
                    for (let i in res.data) {
                        if (res.data[i].length > 1) {
                            _flag = true
                            break;
                        }
                    }
                    if (_flag) {
                        nextUsers = res.data
                        visibleObj.seletNextUserVisible = true
                        nextAuditorsDialog.value = []
                        Object.keys(res.data).map(item => {
                            scheme.nodes.map(sitem => {
                                if (sitem.id == item && res.data[item].length > 1) {
                                    let obj: nextAudiotrsType = {
                                        id: item,
                                        name: sitem.name,
                                        selectData: [],
                                        optionData: res.data[item]
                                    }
                                    nextAuditorsDialog.value.push(obj)
                                }
                            })
                        })
                    }
                    else {
                        callback && callback()
                    }
                }
            }).catch(err => {
                ElMessage.error(windowForm.maslg.get('获取流程下一节点审核人员失败'))
            })
        }
        else {
            callback && callback()
        }
    }
    //获取下一节点审核者选择数据
    const handleSaveNextAuditors = () => {
        visibleObj.seletNextUserVisible = false
        let obj = {}
        nextAuditorsDialog.value.map(item => {
            if (item.selectData.length > 0) {
                obj[item.id] = item.selectData.reduce((preValue, currentValue, currentIndex) => {
                    if (currentIndex == item.selectData.length - 1) {
                        return preValue + currentValue
                    }
                    else {
                        return preValue + currentValue + ','
                    }
                }, '')

            }
        })
        let auditors = JSON.stringify(obj)
        if (urlObj.type == 'create') {
            save(urlObj.processId, currentNode.value.wfForms, () => {
                createFlow({ auditors: auditors })
            })
        }
        else {
            saveAuditApi(auditors)
        }

    }
    const loadBtn = () => {

    }
    //判断是否需要手动指定审核人
    const getappointUserId = (userBox: any, type: string) => {
        //判断是否需要手动指定审核人  1不允许手动设置2允许手动设置
        if (currentNode.value?.appointSetUser == "2") {
            const postData = {
                schemeCode: urlObj.shcemeCode,
                processId: urlObj.processId,
                nodeType: type == 'create' ? 'start' : 'stepnode',
                taskId: type == 'create' ? "" : urlObj.taskId,
                operationCode: type == 'create' ? "" : btnData?.code,
                schemeid: getFlowSchemeId
            }
            let formData = new FormData()
            for (let i in postData) {
                formData.append(i, postData[i])
            }
            checkSponsorApi.getNextAuditorsState(formData).then((res: any) => {
                if (!res.data) {
                    openSelectUser('sponsor', userBox)
                }
                else {
                    if (type == 'create') {
                        save(urlObj.processId, currentNode.value.wfForms, function () {
                            createFlow({})
                        })
                    }
                    else {
                        handleSaveAudit()
                    }

                }
            }).catch(err => {
                ElMessage.error(windowForm.maslg.get('获取流程下一节点是否有审核人信息失败'))
            })
        }
        else {
            if (type == 'create') {
                loadNextUsers({ code: 'agree' }, function (auditors) {
                    save(urlObj.processId, currentNode.value.wfForms, () => {
                        createFlow({ auditors: auditors })
                    })
                })
            }
            else {
                handleSaveAudit()
            }
        }
    }
    let ds = localStorage.getItem('TOKEN')?.split('.')
    let payload = JSON.parse(Base64.decode(ds![1]))
    let thisUserName = payload.UserName
    let date = new Date()
    //默认标题名称
    const setTitle = () => {
        if (currentNode.value.titleconfigList) {
            sponsorFlowData.title = ''
            currentNode.value.titleconfigList.map(item => {
                switch (item.type) {
                    case "username":
                        sponsorFlowData.title += thisUserName;
                        break;
                    case "fixmsg":
                        sponsorFlowData.title += item.fixmsg.replace("&nbsp", " ");
                        break;
                    case "yyyy-MM-dd hh:mm:ss":
                        sponsorFlowData.title += formatDate(date, "yyyy-MM-dd hh:mm:ss");
                        break;
                    case "yyyyMMddhhmmss":
                        sponsorFlowData.title += formatDate(date, "yyyyMMddhhmmss");
                        break;
                    case "yyyy-MM-dd":
                        sponsorFlowData.title += formatDate(date, "yyyy-MM-dd");
                        break;
                    case "yyyyMMdd":
                        sponsorFlowData.title += formatDate(date, "yyyyMMdd");
                        break;
                    case "hh:mm:ss":
                        sponsorFlowData.title += formatDate(date, "hh:mm:ss");
                        break;
                    case "hhmmss":
                        sponsorFlowData.title += formatDate(date, "hhmmss");
                        break;
                }
            })
        }
    }
    //编辑流程
    const editFlow = () => {
        let features = 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,resizable=no,status=no,menubar=no,scrollbars=yes,toolbar=no'
        window.open(`${window.location.pathname}?keyValue=${urlObj.tabIframeId}&shcemeCode=${urlObj.shcemeCode ? urlObj.shcemeCode : processEntity?.F_SchemeCode ? processEntity?.F_SchemeCode : ''}&lraccount=${urlObj.createUserId}`, 'blank', features)
    }
    //发起流程
    const saveCreateCheck = (userBox: any) => {
        if (!validForm(scheme, urlObj.type, currentNode.value?.wfForms)) {
            ElMessage.error(windowForm.maslg.get('流程表单验证不通过'))
            return false
        }
        if (urlObj.type == 'chlid' || urlObj.type == 'againChild') {
            save(urlObj.processId, currentNode.value.wfForms, () => {
                const loading = ElLoading.service({
                    lock: true,
                    text: windowForm.maslg.get('创建子流程中'),
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                const postData = {
                    schemeCode: childFlow,
                    processId: childProcessId,
                    parentProcessId: pProcessId ? pProcessId : urlObj.processId,
                    parentTaskId: urlObj.taskId
                }
                const formData = new FormData()
                for (let i in postData) {
                    formData.append(i, postData[i])
                }
                checkSponsorApi.createChildFlow(formData).then((res: any) => {
                    loading.close()
                    if (res.code == 200) {
                        ElMessage.success(windowForm.maslg.get('子流程创建成功'))
                        window.close()
                    }

                }).catch(err => {
                    loading.close()
                    ElMessage.error(windowForm.maslg.get('子流程创建失败'))
                })
            })

        }
        else if (urlObj.type != 'againCreate') {
            if (urlObj.isCopy == '1') {
                urlObj.processId = generateUUID()
            }
            try {
                if (!!currentNode.value) {
                    if (currentNode.value.titlewritebackconfigList != undefined) {
                        let getTitle = sponsorFlowData.title
                        currentNode.value.titlewritebackconfigList.map(item => {
                            let titleToField = $(window.frames[0].document).find("#" + item.fieldid + "");
                            if (titleToField) {
                                switch (item.fillmode) {
                                    case "replace":
                                        titleToField.val(getTitle);
                                        break;
                                    case "accumulation":
                                        titleToField.val(titleToField.val() + getTitle);
                                        break;
                                    case "nooperation":
                                        if (titleToField.val() == '') {
                                            titleToField.val(getTitle);
                                        }
                                        break;
                                }
                            }
                        })
                    }
                }
            } catch (e) {

                //catch的作用为了防止用户把表设置错误而导致取输入框对象报错
            }
            if (urlObj.shcemeCode == "freeflow") {
                //为自由协同指定模板内容id
                sponsorFlowData.title = $(window.frames[0].document).find("#Titile").val();
                getFlowSchemeId = $(window.frames[0].document).find("#SchemeId").val();
            }
            getappointUserId(userBox, 'create')
        }
        else {
            confirmBox('是否重新发起流程', () => {
                const loading = ElLoading.service({
                    lock: true,
                    text: windowForm.maslg.get('流程发起中'),
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                try {
                    const { annexArr, doceArr } = saveUploadFile()
                    const formData = new FormData()
                    formData.append('processId', urlObj.processId)
                    formData.append('taskAnnex', annexArr.join(','))
                    formData.append('taskDoce', doceArr)
                    checkSponsorApi.againCreateFlow(formData).then((res: any) => {
                        loading.close()
                        if (res.code == 200) {
                            ElMessage.success(windowForm.maslg.get('流程发起成功'))
                            window.close()
                        }
                    }).catch(err => {
                        loading.close()
                        ElMessage.error(windowForm.maslg.get('重新发起流程失败'))
                    })
                } catch (error) {
                    loading.close()
                }

            })

        }


    }
    //创建流程接口
    const createFlow = (params: object) => {
        const { annexArr, doceArr } = saveUploadFile()
        const postData = {
            schemeCode: urlObj.shcemeCode ? urlObj.shcemeCode : '',
            processId: urlObj.processId,
            title: sponsorFlowData.title,
            level: sponsorFlowData.grade,
            auditors: '',
            createUserId: urlObj.createUserId ? urlObj.createUserId : '',
            schemeid: getFlowSchemeId,
            taskAnnex: annexArr.join(','),
            taskDoce: doceArr
        }
        const newParams = { ...postData, ...params }
        const loading = ElLoading.service({
            lock: true,
            text: windowForm.maslg.get('创建流程中'),
            background: 'rgba(0, 0, 0, 0.7)',
        })
        let formData = new FormData()
        for (let i in newParams) {
            formData.append(i, newParams[i])
        }
        checkSponsorApi.createFlowApi(formData).then((res: any) => {
            loading.close()
            if (res.code == 200) {
                ElMessage.success(windowForm.maslg.get('流程创建成功'))
                window.close()
            }

        }).catch(err => {
            loading.close()
            ElMessage.error(windowForm.maslg.get('流程创建失败'))
        })
    }
    //获取上传的附件列表数据
    const getUploadFile = () => {
        checkSponsorApi.getTaskFilesList({ folderId: folderId }).then(res => {
        }).catch(err => {
            ElMessage.error(windowForm.maslg.get('获取流程上传文件列表失败'))
        })
    }
    //保存草稿
    const saveDraft = () => {
        if (urlObj.isCopy == '1') {
            urlObj.processId = generateUUID()
        }
        // getUploadFile()
        save(urlObj.processId, currentNode.value.wfForms, () => {
            const loading = ElLoading.service({
                lock: true,
                text: windowForm.maslg.get('保存流程草稿中'),
                background: 'rgba(0, 0, 0, 0.7)',
            })
            const { annexArr, doceArr } = saveUploadFile()
            const param = {
                title: sponsorFlowData.title,
                schemeCode: urlObj.shcemeCode ? urlObj.shcemeCode : '',
                processId: urlObj.processId,
                createUserId: urlObj.createUserId ?? '',
                taskAnnex: annexArr.join(','),
                taskDoce: doceArr
            }
            const formData = new FormData()
            for (let i in param) {
                formData.append(i, param[i])
            }
            checkSponsorApi.saveDraft(formData).then((res: any) => {
                loading.close()
                if (res.code == 200) {
                    ElMessage.success(windowForm.maslg.get('保存流程草稿成功'))
                    window.close()
                }

            }).catch(err => {
                loading.close()
                ElMessage.error(windowForm.maslg.get('保存流程草稿失败'))
            })
        })
    }
    //处理不同意按钮中选择的驳回方式
    const handleReject: { [key: string]: (userBox: any) => void } = {
        //顺序驳回
        '1': (userBox) => {
            getappointUserId(userBox, 'audit')
        },
        //指定节点驳回
        '2': () => {
            const nodes = getPrefaceNodes(scheme.lines, currentNode.value.id)
            let startPoint = scheme.nodes.find(item => {
                return item.type == "startround"
            })
            nodes.push({ nodeid: startPoint.id, nodename: "" })
            scheme.nodes.map(item => {
                nodes.map(nitem => {
                    if (item.id == nitem.nodeid) {
                        nitem.nodename = item.name
                    }
                })
            })
            rejectData.option = nodes
            visibleObj.rejectVisible = true
        },
        //驳回到上一个节点
        '3': (userBox: any) => {
            const nodes = getPrefaceNodeId(scheme.nodes, scheme.lines, currentNode.value.id)
            if (nodes.length == 0) {
                return ElMessage.error(windowForm.maslg.get('未找到当前节点的上一节点，请检查流程配置'))
            }
            appointNodeId = nodes
            getappointUserId(userBox, 'audit')
        },
        //驳回直接结束流程
        '4': (userBox) => {
            const startPoint = scheme.nodes.find(item => {
                return item.type == "startround"
            })
            if (!startPoint) {
                return ElMessage.error(windowForm.maslg.get('未找到开始节点，请检查流程配置'))
            }
            appointNodeId = startPoint.id
            getappointUserId(userBox, 'audit')
        }
    }
    //提交审核
    const saveAuditFlow = (userBox, bth?: any) => {
        if (urlObj.type != 'refer') {
            let findbtnData = currentNode.value.btnList.find(item => {
                return item.code == checkInfo.checkRadio
            })
            btnData = bth ? bth : findbtnData
            if (btnData.IsSaveFormData != "2" && !validForm(scheme, btnData.code, currentNode.value.wfForms)) {
                return ElMessage.error(windowForm.maslg.get('表单验证不通过'))
            }
            if (currentNode.value.isNeedCheckText == '1' && !checkInfo.infoAdvise) {
                return ElMessage.error(windowForm.maslg.get('审批意见不能为空'))
            }
            if (urlObj.type == 'audit') {
                if (btnData.code == "disagree" && btnData.reject) {
                    handleReject[btnData.reject](userBox)
                }
                else {
                    getappointUserId(userBox, 'audit')
                }
            }
            else {
                signAudit()
            }
        }
        else {
            confirmBox('是否确认阅读', () => {
                const loading = ElLoading.service({
                    lock: true,
                    text: windowForm.maslg.get('阅读中'),
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                try {
                    const formData = new FormData()
                    formData.append('processId', urlObj.processId)
                    formData.append('taskId', urlObj.taskId)
                    checkSponsorApi.referFlow(formData).then((res: any) => {
                        loading.close()
                        if (res.code == 200) {
                            ElMessage.success(windowForm.maslg.get('阅读完成'))
                            window.close()
                        }
                        else {
                            ElMessage.error(windowForm.maslg.get(res.info))
                        }

                    }).catch(err => {
                        loading.close()
                        ElMessage.error(windowForm.maslg.get('阅读失败'))
                    })
                } catch (error) {
                    loading.close()
                }

            })
        }

    }
    //获取选择的驳回节点数据
    const handleSaveReject = (userBox: any) => {
        if (!rejectData.select) {
            return ElMessage.warning(windowForm.maslg.get('请选择驳回节点'))
        }
        appointNodeId = rejectData.select
        getappointUserId(userBox, 'audit')
        visibleObj.rejectVisible = false
    }
    //审核节点公共保存
    const handleSaveAudit = () => {
        flowAppointNodeId = appointNodeId
        try {
            if (btnData.isSign == '1') {
                signDialog.value = true
            }
            else {
                loadNextUsers(btnData, function () {
                    saveAuditApi('')
                })
            }
        } catch (error) {

        }

    }
    //同意签字保存
    const signImgSave = (val: string) => {
        loadNextUsers(btnData, function () {
            saveAuditApi('', val)
        })
    }
    //审核保存接口
    const saveAuditApi = (auditos: string, signUrl?: string) => {
        const { annexArr, doceArr } = saveUploadFile()
        const saveApi = () => {
            const loading = ElLoading.service({
                lock: true,
                text: windowForm.maslg.get('审批流程中'),
                background: 'rgba(0, 0, 0, 0.7)',
            })
            const postData = {
                operationCode: btnData.code,
                operationName: btnData.name,
                processId: urlObj.processId,
                taskId: urlObj.taskId,
                des: checkInfo.infoAdvise,
                auditors: auditos,
                signUrl: signUrl ? signUrl : '',
                stamp: '',
                taskAnnex: annexArr.join(','),
                taskDoce: doceArr,
                appointNodeId: appointNodeId,
                appointUserId: appointUserId
            }
            const formData = new FormData
            for (let i in postData) {
                formData.append(i, postData[i])
            }
            checkSponsorApi.auditFlow(formData).then((res: any) => {
                loading.close()
                if (res.code == 200) {
                    ElMessage.success(windowForm.maslg.get('流程审批成功'))
                    window.parent.close()
                    // window.open('about:blank', '_self').close()
                }
            }).catch(err => {
                loading.close()
                ElMessage.error(windowForm.maslg.get('流程审批失败'))
            })
        }
        if (btnData.IsSaveFormData == "2") {
            saveApi()
        }
        else {
            save(urlObj.processId, currentNode.value.wfForms, function () {
                saveApi()
            })
        }
    }
    //打开加签页面
    const openSignConfig = () => {
        if (!validForm(scheme, 'sign', currentNode.value.wfForms)) {
            return ElMessage.error(windowForm.maslg.get('表单验证不通过'))
        }
        if (currentNode.value.isNeedCheckText == '1' && !checkInfo.infoAdvise) {
            return ElMessage.error(windowForm.maslg.get('审批意见不能为空'))
        }
        visibleObj.dialogVisible = true
    }
    //流程加签后进行审批
    const signAudit = () => {
        const loading = ElLoading.service({
            lock: true,
            text: windowForm.maslg.get('加签审批流程中'),
            background: 'rgba(0, 0, 0, 0.7)',
        })
        const { annexArr, doceArr } = saveUploadFile()
        const postData = {
            operationCode: btnData.code,
            processId: urlObj.processId,
            taskId: urlObj.taskId,
            des: checkInfo.infoAdvise,
            taskAnnex: annexArr.join(','),
            taskDoce: doceArr
        }
        const formData = new FormData()
        for (let i in postData) {
            formData.append(i, postData[i])
        }
        checkSponsorApi.signAuditFlow(formData).then((res: any) => {
            loading.close()
            if (res.code == 200) {
                ElMessage.success(windowForm.maslg.get('加签审批成功'))
                window.close()
            }
        }).catch(err => {
            loading.close()
            ElMessage.error(windowForm.maslg.get('加签审批流程失败'))
        })
    }
    //流程加签设置
    const signFlow = (userBox: any) => {
        if (!validForm(scheme, 'sign', currentNode.value.wfForms)) {
            return ElMessage.error(windowForm.maslg.get('表单验证不通过'))
        }
        const loading = ElLoading.service({
            lock: true,
            text: windowForm.maslg.get('流程加签中'),
            background: 'rgba(0, 0, 0, 0.7)',
        })
        checkSponsorApi.getSchemeEntityById({ processId: urlObj.processId }).then(async (res: any) => {
            if (res.code == 200) {
                let schemeContent = JSON.parse(res.data.F_Content)
                const oldNodeList = schemeContent.nodes
                const newContent = { nodes: <any[]>[], lines: <any[]>[], closeDo: '', sige: '', bpmXml: '' }
                const checkerArr = <any[]>[]
                signForm.auditor.forEach(item => {
                    checkerArr.push({ inputItem: item.F_RealName })
                })
                const { newShape, allElement, xml } = await createShape(bpmnModeler, scheme, currentNode, checkerArr)
                const defaultNode = {
                    id: newShape.id,
                    name: '审核节点',
                    left: newShape.x,
                    top: newShape.y,
                    type: "stepnode",
                    width: newShape.width,
                    height: newShape.height,
                    auditors: <any[]>[],
                    wfForms: currentNode.value.wfForms,
                    btnList: [{
                        id: '1',
                        name: '同意',
                        code: 'agree',
                        file: '1',
                        next: '1'
                    }, {
                        id: '2',
                        name: '不同意',
                        code: 'disagree',
                        file: '1',
                        next: '1'
                    }],
                    appointSetUser: '2'
                }
                signForm.auditor.forEach(item => {
                    let obj = {
                        cuid: '',
                        auditorId: item.F_UserId,
                        auditorName: item.F_RealName,
                        department: item.F_DepartmentId,
                        type: '3',
                        id: generateUUID()
                    }
                    defaultNode.auditors.push(obj)
                })
                const cantSetKey = ['agreeGz', 'auditor', 'auditorString', 'auditorTree',]
                for (let i in signForm) {
                    if (!cantSetKey.includes(i)) {
                        defaultNode[i] = signForm[i]
                    }
                }
                defaultNode['agreeGz'] = signForm.agreeGz.join(',')
                const newNodeList = <any[]>[]
                oldNodeList.forEach(item => {
                    allElement.forEach(aitem => {
                        if (item.id == aitem.id) {
                            item.left = aitem.x
                            item.top = aitem.y
                            newNodeList.push(item)
                        }
                    })
                })
                newNodeList.push(defaultNode)
                const newLineList = <any[]>[]
                schemeContent.lines.forEach(item => {
                    if (item.from == currentNode.value.id) {
                        if (!item.strategy || item.strategy == '1' || (item.strategy == "2" && item.agreeList == "agree")) {
                            item.from = defaultNode.id
                            newLineList.push(item)
                        }
                        else {
                            newLineList.push(item)
                        }
                    }
                    else {
                        newLineList.push(item)
                    }
                })

                let agreeLine = allElement.find(item => {
                    return item.type == 'bpmn:SequenceFlow' && item.source.id == currentNode.value.id && item.target.id == defaultNode.id
                })
                newLineList.push({
                    id: agreeLine.id,
                    from: currentNode.value.id,
                    to: defaultNode.id,
                    sp: 'right',
                    ep: 'left',
                    name: '同意',
                    color: '1',
                    type: 'sl',
                    strategy: '2',
                    agreeList: 'agree',
                    operationType: 'sql',
                    dbId: '',
                    strSql: '',
                    strSqlR: ''
                })
                let disagreeLine = allElement.find(item => {
                    return item.type == 'bpmn:SequenceFlow' && item.source.id == defaultNode.id && item.target.id == currentNode.value.id
                })
                newLineList.push({
                    id: disagreeLine.id,
                    to: currentNode.value.id,
                    from: defaultNode.id,
                    sp: 'top',
                    ep: 'top',
                    name: '驳回',
                    color: '2',
                    type: 'tb',
                    strategy: '2',
                    agreeList: 'disagree',
                    operationType: 'sql',
                    dbId: '',
                    strSql: '',
                    strSqlR: '',
                })
                let sige = ''
                if (!schemeContent.sige) {
                    sige = '第一次加签'
                    res.data.F_Id = generateUUID()
                }
                newContent.sige = '有加签了'
                newContent.closeDo = schemeContent.closeDo
                newContent.nodes = newNodeList
                newContent.lines = newLineList
                newContent['bpmXml'] = xml
                let postData = res.data
                postData.F_Content = JSON.stringify(newContent)
                const formData = new FormData()
                formData.append('scheme', JSON.stringify(postData))
                formData.append('sige', sige)
                formData.append('processId', urlObj.processId)
                checkSponsorApi.saveSchemeEntity(formData).then((res: any) => {
                    loading.close()
                    if (res.code == 200) {
                        btnData = {
                            code: "agree",
                            file: "1",
                            id: "1",
                            name: "同意",
                            next: "1"
                        }
                        saveAuditFlow(userBox, btnData)
                        ElMessage.success(windowForm.maslg.get('流程加签成功'))
                        visibleObj.dialogVisible = false
                        // window.close()
                    }
                    else {
                        ElMessage.success(windowForm.maslg.get(res.info))
                    }
                }).catch(err => {
                    loading.close()
                    ElMessage.error(windowForm.maslg.get('流程加签失败'))
                })
            }
        }).catch(err => {
            loading.close()
            ElMessage.error(windowForm.maslg.get('获取模板信息失败'))
        })
    }
    return {
        sponsorFlowData,
        urlObj,
        getIfrmUrl,
        ifrmArr,
        iframePane,
        editFlow,
        saveCreateCheck,
        currentNode,
        checkInfo,
        saveDraft,
        openSelectUser,
        comeBackRoleandUser,
        signForm,
        userTitle,
        nextAuditorsDialog,
        handleSaveNextAuditors,
        saveAuditFlow,
        rejectData,
        handleSaveReject,
        visibleObj,
        signFlow,
        signDialog,
        signImgSave,
        openSignConfig
    }
}