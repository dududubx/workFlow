<script setup lang="ts">
import { piniaStore } from './store';
import { checkPointApi } from "@/api/checkpoint";
import { ElMessage } from "element-plus";
import { getCurrentInstance, ComponentInternalInstance, inject, ref, computed } from 'vue'


const { proxy } = <ComponentInternalInstance>getCurrentInstance()
const store = piniaStore()
checkPointApi.getNoticeData({}).then((res: any) => {
    if (res.code == 200) {
        store.getInfromData(res.data)
    }
    else {
        ElMessage({
            type: 'error',
            message: res.info
        })
    }
}).catch(err => {
    ElMessage({
        type: 'error',
        message: proxy?.maslg('获取通知策略数据失败')
    })
})
const iframeApi = import.meta.env.MODE == 'development' ? '/iframeApi' : '';
(window as any)['flowIframApi'] = iframeApi

</script>

<template>
    <!-- <design></design> -->

    <router-view></router-view>
</template>

<style scoped></style>
