import { ref, reactive, Ref, nextTick } from 'vue'
import { checkSponsorApi } from '@/api/check'
import { ElMessage, type UploadProps, type UploadUserFile, type UploadInstance, type UploadFile, ElLoading } from 'element-plus'
import { generateUUID } from '@/utils/util'

export const documentHooks = () => {
    const windowForm = window as any
    let folderId = generateUUID()
    const tableLoading = ref(false)
    const getTableData = (param: object, total: Ref<number>, returnData: Ref<any[]>, callback?: (data?: any) => void) => {
        tableLoading.value = true
        checkSponsorApi.getProcessPageList(param).then((res: any) => {
            tableLoading.value = false
            if (res.code == 200) {
                returnData.value = res.data.rows
                callback && callback(res.data.rows)
                // returnData = res.data
            }

        }).catch(err => {
            tableLoading.value = false
            ElMessage.error((window as any).maslg.get('获取协同文档数据失败'))
        })
    }
    //下载附件
    const downloadAnnexesFile = (file: any) => {
        let formData = new FormData()
        let fileId = file.FileID ? file.FileID : file.raw!['guid']
        formData.append('fileId', fileId)
        checkSponsorApi.downloadAnnexesFild(formData).then((res: any) => {
            if (res) {
                let blob = new Blob([res], { type: 'application/octet-stream' })
                let fileName = file.name ? file.name : file.F_FileName
                // let downName = fileName
                let a = document.createElement('a');
                let url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName
                let body = document.getElementsByTagName('body')[0];
                body.appendChild(a);
                a.click();
                body.removeChild(a);
                window.URL.revokeObjectURL(url)
            }

        }).catch(err => {
            ElMessage.error(windowForm.maslg.get('下载附件失败'))
        })
    }
    //预览附件
    const reviewAnnexesFile = (file: any, setSrc?: any) => {
        if (file.F_SchemeCode && file.RelationType && file.RelationType == 1) {
            let features = 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,resizable=no,status=no,menubar=no,scrollbars=yes,toolbar=no'
            window.open(`#/check?shcemeCode=${file.F_SchemeCode}&type=look&processId=${file.F_Id ? file.F_Id : file.WFProcessID}`, file.F_Title, features)
        }
        else {
            let newfileId = file.F_FolderId ? file.F_FolderId : folderId
            let newfolderId = file.FileID ? file.FileID : file.raw!['guid']
            checkSponsorApi.getPreviewFile({ fileId: newfolderId }).then((res: any) => {
                let url = window.URL.createObjectURL(res);
                file['viewSrc'] = url
                file['viewType'] = file.F_FileType ? file.F_FileType : file.name ? file.name.split('.')[file.name.split('.').length - 1] : ''
                setSrc.showView(file)

            }).catch(err => {
                console.log(err);

                ElMessage.error(windowForm.maslg.get('获取预览文件失败'))
            })
            // windowForm.layer.open({
            //     type: 2,
            //     title: windowForm.maslg.get('文件预览'),
            //     btn: null,
            //     area: ['800px', '650px'],
            //     maxmin: true,
            //     content: windowForm.flowIframApi + `/SystemModule/Annexes/PreviewForm?fileId=${newfileId}` + `&fileSelectedId=${newfolderId}`
            //     // content: windowForm.iframApi + ''
            // })
        }

    }
    //删除附件
    const handleRemoveAccessory = (dom: any, file: any) => {
        // dom.handleRemove(file)
        let formData = new FormData()
        formData.append('fileId', file.raw ? file.raw!['guid'] : file.FileID ? file.FileID : '')
        checkSponsorApi.deletAnnexesFild(formData).then((res: any) => {
            if (res.code == 200) {
                dom.handleRemove(file)
            }

        }).catch(err => {
            ElMessage.error(windowForm.maslg.get('删除附件失败'))
        })
    }
    //删除关联文档
    const handleRemoveDocument = (data: any[], val: any) => {
        data.map((item, index) => {
            if (item.F_Id == val.F_Id) {
                data.splice(index, 1)
            }
        })
    }
    //切片上传附件
    const handleSuccess: UploadProps['onChange'] = (UploadFile, UploadFiles) => {
        let chunSize = 5 * 1024 * 1024
        const loading = ElLoading.service({
            lock: true,
            text: windowForm.maslg.get('上传附件中'),
            background: 'rgba(0, 0, 0, 0.7)',
        })
        let hasFiles: any = UploadFiles.find((item: any) => {
            return item.F_FolderId
        })
        if (hasFiles) {
            folderId = hasFiles.F_FolderId
        }
        UploadFiles.map((item: any) => {
            // item.size = item.F_FileSize ? Number(item.F_FileSize) : item.size
            if (item.raw) {
                let formData = new FormData()
                const totalChunks = Math.ceil(item.size! / chunSize)
                let chunks: any[] = []
                for (let i = 0; i < totalChunks; i++) {
                    let start = i * chunSize
                    let end = Math.min(item.size!, start + chunSize)
                    let blob = item.raw!.slice(start, end)
                    chunks.push(blob)
                }
                let guid = generateUUID()
                if (item.raw) {
                    item.raw!['guid'] = guid
                }
                formData.append('fileGuid', guid)
                formData.append('name', item.name)
                formData.append('type', item.raw ? item.raw?.type as any : item.F_FileType)
                // formData.append('lastModifiedDate', item.raw!['lastModifiedDate'])
                formData.append('size', item.raw?.size as any)
                formData.append('chunks', chunks.length as any)
                let i = 0
                for (let j = 0; j < chunks.length; j++) {
                    formData.append('chunk', j as any)
                    formData.append('file', chunks[j])
                    checkSponsorApi.uploadAnnexesFild(formData).then((res: any) => {
                        if (res.code == 200) {
                            i++;
                            if (i == chunks.length) {
                                let mergeFormData = new FormData
                                mergeFormData.append('folderId', folderId)
                                mergeFormData.append('fileGuid', guid)
                                mergeFormData.append('fileName', item.name)
                                mergeFormData.append('chunks', chunks.length as any)
                                mergeFormData.append('typeCode', '')
                                checkSponsorApi.mergeAnnexesFild(mergeFormData).then((res: any) => {
                                    if (res.code == 200) {
                                        loading.close()
                                        ElMessage.success(windowForm.maslg.get('上传附件成功'))
                                    }

                                }).catch(err => {
                                    loading.close()
                                    ElMessage.error(windowForm.maslg.get('合并分片文件失败'))
                                })
                            }
                        }

                    }).catch(err => {
                        loading.close()
                        ElMessage.error(windowForm.maslg.get('上传分片文件失败'))
                    })
                }
            }
        })
    }
    return {
        tableLoading,
        getTableData,
        downloadAnnexesFile,
        reviewAnnexesFile,
        handleRemoveAccessory,
        handleSuccess,
        handleRemoveDocument,
    }
}