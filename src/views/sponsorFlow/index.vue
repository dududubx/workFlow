<template>
    <div class="sponsor_vessel">
        <div class="sponsor_vessel-top">
            <el-button type="primary" :icon="Position" class="sponsor_btn" round>{{ maslg('发起流程') }}</el-button>
            <el-button :icon="List" class="draft_btn" round>{{ maslg('保存草稿') }}</el-button>
        </div>
        <div class="sponsor_vessel-center">
            <div class="center_title center_box">
                <div class="center_name">
                    {{ maslg('流程标题：') }}
                </div>
                <div class="center_input">
                    <el-input v-regCharacter :maxlength="maxlength" :placeholder="maslg('请输入流程标题')"
                        v-model="sponsorFlowData.title" clearalbe></el-input>
                </div>
                <div class="center_title-grade">
                    <el-select :placeholder="maslg('请选择等级')" popper-class="grade_select" v-model="sponsorFlowData.grade"
                        clearalbe>
                        <el-option v-for="item in gradeOptions" :key="item.value" :label="maslg(item.label)"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="center_receive center_box">
                <div class="center_name">
                    {{ maslg('接收对象：') }}
                </div>
                <div class="center_input">
                    <el-input :readonly="true" :placeholder="maslg('请选择接收对象')" v-model="sponsorFlowData.receiveInput"
                        :suffix-icon="UserFilled" class="select_obj"></el-input>
                </div>
                <div class="center_receive-btn">
                    <el-button round :icon="View">{{ maslg('查看流程') }}</el-button>
                    <el-button round :icon="Edit">{{ maslg('编辑流程') }}</el-button>
                </div>
            </div>
            <div class="center_accessory center_box">
                <div class="center_name">
                    {{ maslg('附件：') }}
                </div>
                <div class="center_upload">
                    <el-upload action="#" multiple v-model:file-list="sponsorFlowData.accessoryData" class="upload-demo"
                        :auto-upload="false" ref="upload">
                        <el-button round :icon="Plus">{{ maslg('添加') }}</el-button>
                        <template #file="{ file }">
                            <div class="diy_upload">
                                <el-icon class="upload_append">
                                    <Link />
                                </el-icon>
                                <div class="upload_name">
                                    {{ file.name }}
                                </div>
                                <span class="upload_del" @click="handleRemoveAccessory(upload, file)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </div>
                        </template>
                    </el-upload>
                </div>
            </div>
            <div class="center_accessory center_box">
                <div class="center_name">
                    {{ maslg('文档：') }}
                </div>
                <div class="center_upload">
                    <el-upload action="#" class="upload-demo" :auto-upload="false" multiple
                        v-model:file-list="sponsorFlowData.document" ref="documentUpload">
                        <el-button round :icon="Plus">{{ maslg('添加') }}</el-button>
                        <template #file="{ file }">
                            <div class="diy_upload">
                                <el-icon class="upload_append upload_docu">
                                    <Document />
                                </el-icon>
                                <div class="upload_name">
                                    {{ file.name }}
                                </div>
                                <span class="upload_del" @click="handleRemoveAccessory(documentUpload, file)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </div>
                        </template>
                    </el-upload>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, ComponentInternalInstance, getCurrentInstance, onMounted, nextTick } from 'vue'
import { Position, List, UserFilled, View, Edit, Plus, Link, Delete, Document } from '@element-plus/icons-vue'
import { sponsorConfig } from '@/hooks/sponsorFlow'
import type { UploadProps, UploadUserFile, UploadFile, UploadInstance } from 'element-plus'

const { proxy } = <ComponentInternalInstance>getCurrentInstance()
const upload = ref<UploadInstance>()
const documentUpload = ref<UploadInstance>()
const { sponsorFlowData, gradeOptions, handleRemoveAccessory } = sponsorConfig()

// const handleRemoveAccessory = (file: UploadFile) => {
//     upload.value!.handleRemove(file)
//     // sponsorFlowData.accessoryData.map((item, index) => {
//     //     if (item.name == file.name && item.uid == file.uid) {
//     //         sponsorFlowData.accessoryData.splice(index, 1)
//     //     }
//     // })
// }
</script>

<style scoped>
@import '@/assets/style/sponsor.less';
</style>