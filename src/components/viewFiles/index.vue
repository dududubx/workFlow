<template>
    <div>
        <el-dialog v-model="viewDialog" width="65%" :title="maslg('预览文件')" align-center draggable
            :close-on-click-modal="false">
            <div class="viewer_Contain">

                <!-- <img :src="iframefile.viewSrc" /> -->
                <el-image v-if="imageType.includes(iframefile.viewType)" :src="iframefile.viewSrc" fit="fit" />
                <!-- <audio v-else-if="iframefile.viewType.toLowerCase() == 'mp4'">
                    <source :src="iframefile.viewSrc" />
                </audio> -->
                <iframe :src="iframefile.viewSrc" v-else></iframe>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, nextTick } from 'vue'
const viewDialog = ref(false)
const iframefile = ref<{
    viewSrc: string,
    viewType: string
}>({
    viewSrc: '',
    viewType: ''
})
const showView = (file: any) => {
    viewDialog.value = true
    iframefile.value = file
}
const imageType = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'jpg']
defineExpose({ showView })
onMounted(() => {

})
</script>

<style scoped lang="less">
.viewer_Contain {
    height: 100%;
    width: 100%;
    min-height: 700px;

    iframe {
        width: 100%;
        // overflow: hidden;
        height: 700px;
        border: none;

        body {
            ::-webkit-scrollbar {
                width: 5px !important;
                height: 5px !important;
            }
        }

    }
}
</style>