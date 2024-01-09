<template>
    <el-dialog v-model="signVisibile" width="600" :title="maslg('签名或盖章(请按着鼠标左键签字)')" align-center draggable
        :close-on-click-modal="false">
        <div class="sign_box">
            <div class="sign_box-content">
                <vue-esign v-if="!showStampImg" ref="signContainer" :width="560" :height="300"
                    :line-width="esignConfig.lineWidth" :line-color="esignConfig.lineColor" bg-color="rgb(211, 211, 211)">
                </vue-esign>
                <el-image :src="selectStamp.F_imgUrl" v-else style="width: 560px;height: 300px;" fit="contain"
                    :preview-src-list="[selectStamp.F_imgUrl]">
                    <template #error>
                        <div class="image-slot">
                            <el-icon><icon-picture /></el-icon>
                        </div>
                    </template>
                </el-image>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="openStamp">{{ maslg('盖章') }}</el-button>
                <el-button class="reset_sign" type="danger" @click="resetSign">{{ maslg('重置') }}</el-button>
                <el-button class="submit_sign" type="primary" @click="submitSign">{{ maslg('确认') }}</el-button>
            </span>
        </template>
        <el-dialog v-model="stampVisible" width="55%" :title="maslg('印章列表')" align-center draggable
            :close-on-click-modal="false">
            <div class="search_table">
                <el-input :placeholder="maslg('请输入印章名称')" v-debounce="SearchClick" v-model="param.keyword" clearable
                    v-regCharacter :maxlength="maxlength">
                </el-input>
                <el-button type="primary" class="search_btn searchform_btn" @click="SearchClick">{{
                    maslg('查询')
                }}</el-button>
                <el-button type="primary" class="reload_btn searchform_btn" @click="resetClick">{{
                    maslg('重置')
                }}</el-button>
            </div>
            <el-table v-loading="stampLoading" :data="stampTableData" highlight-current-row
                @current-change="handleColumnChange" height="300" border :empty-text="maslg('无数据')">
                <el-table-column prop="F_StampName" label="名称"></el-table-column>
                <el-table-column prop="F_imgUrl" label="印章">
                    <template #default="scope">
                        <el-image :src="scope.row.F_imgUrl" class="stamp_img">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><icon-picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="returnStampData" type="primary">{{ maslg('确认') }}</el-button>
                    <el-button @click="stampVisible = false">{{ maslg('关闭') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </el-dialog>
</template>

<script setup lang='ts'>
import vueEsign from 'vue-esign'
import { ref, reactive, onMounted, defineModel, useModel, nextTick, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { ElMessage } from 'element-plus';
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { checkSponsorApi } from '@/api/check';
import pagination from '@/components/pagination/index.vue'


const { proxy } = <ComponentInternalInstance>getCurrentInstance()
const props = withDefaults(defineProps<{
    signShow: boolean
}>(), {
    signShow: false
})
const emit = defineEmits<{
    'update:signShow': [val: boolean],
    'returnSignImg': [val: string]
}>()
const signVisibile = useModel(props, 'signShow')
const esignConfig = {
    lineWidth: 8,//画笔粗细
    lineColor: '#000',//画笔颜色
    bgColor: 'rgb(211, 211, 211)',//画布颜色
    isCrop: false //是否裁剪
}
const signContainer = ref<InstanceType<typeof vueEsign>>()
const stampVisible = ref(false)
const stampLoading = ref(false)
let selectStamp;
let showStampImg = ref(false)
let param = reactive({
    keyword: ''
})
const stampTableData = ref<any[]>([])

const resetSign = () => {
    showStampImg.value = false
    if (signContainer.value) {
        signContainer.value.reset()
    }
}
const submitSign = () => {
    if (!showStampImg.value) {
        signContainer.value.generate().then(res => {
            signVisibile.value = false
            emit('returnSignImg', res)
        }).catch(err => {
            ElMessage({
                type: 'error',
                message: proxy?.maslg('请设置签名')
            })
        })
    }
    else {
        signVisibile.value = false
        emit('returnSignImg', selectStamp.F_imgUrl)
    }
}
const getStampData = () => {
    stampLoading.value = true
    checkSponsorApi.getStampInfo(param).then((res: any) => {
        stampLoading.value = false
        if (res.code == 200) {
            stampTableData.value = res.data
            let promiseData = <Promise<string>[]>[]
            stampTableData.value.forEach(ele => {
                promiseData.push(new Promise((resolve, reject) => {
                    checkSponsorApi.getStampImg({ keyValue: ele.F_StampId }).then((res: any) => {
                        let blob = new Blob([res], { type: 'image/png' })
                        let url = window.URL.createObjectURL(blob);
                        resolve(url)
                    }).catch(err => {
                        ElMessage({
                            type: 'error',
                            message: proxy?.maslg('获取印章图片失败')
                        })
                        reject('error')
                    })
                }))

            });
            Promise.allSettled(promiseData).then((res: any) => {
                res.forEach((item, index) => {
                    if (item.status == 'fulfilled') {
                        stampTableData.value[index]['F_imgUrl'] = item.value
                    }
                })
            }).catch(err => {
            })
        }
        else {
            ElMessage({
                type: 'error',
                message: proxy?.maslg(res.info)
            })
        }

    }).catch(err => {
        stampLoading.value = false
        ElMessage({
            type: 'error',
            message: proxy?.maslg('获取印章数据失败')
        })
    })
}
const openStamp = () => {
    stampVisible.value = true
    getStampData()
}
const SearchClick = () => {
    getStampData()
}
const resetClick = () => {
    param.keyword = ''
    getStampData()
}
const handleColumnChange = (val) => {
    selectStamp = val
}
const returnStampData = () => {
    if (!selectStamp) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请选择印章')
        })
    }
    showStampImg.value = true
    stampVisible.value = false
}
onMounted(() => {
})
</script>

<style scoped lang="less">
.sign_box {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    &-content {

        flex: 1;

        canvas[data-v-14a9c9db] {
            height: 100%;
            background: rgb(211, 211, 211) !important;
        }
    }
}


:deep(.submit_sign) {
    margin-left: 12px !important;
    margin-right: 0 !important;
}

:deep(.reset_sign) {
    border-color: #ff4747 !important;
    background: #ffffff !important;
    color: #ff4747 !important;
}

:deep(.reset_sign:hover) {
    color: #ff4747 !important;
    border-color: #ff4747 !important;
}

:deep(.stamp_img) {
    height: 45px;
}

.search_table {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    :deep(.el-input) {
        width: 240px;
    }

    .search_btn {
        margin-left: 12px;
        margin-right: 0;
    }

    .reload_btn:hover {
        color: #666666;
        background: #f8f8f8;
        border: 1px solid #dcdfe6;
    }
}
</style>