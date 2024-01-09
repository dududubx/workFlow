<template>
    <div class="pcCheck_box">
        <div class="pcCheck_box-top" v-if="!onlyCreateShow.includes(urlObj.type)">
            <div class="pcCheck_top-content">
                <div class="pcCheck_name">
                    {{ maslg(checkInfo.title) }}
                </div>
                <div class="pcCheck_detailInfo">
                    <span class="detail_userName">{{ maslg(checkInfo.checkName) }}</span>
                    <span class="detail_time">{{ maslg(checkInfo.createTime) }}</span>
                </div>
            </div>
        </div>
        <div class="pcCheck_box-bottom">
            <div class="bottom_left">
                <div class="sponsor_vessel">
                    <div class="sponsor_vessel-top" v-if="onlyCreateShow.includes(urlObj.type)">
                        <el-button type="primary" :icon="Position" class="sponsor_btn" round
                            @click="saveCreateCheck(userBox)">{{
                                maslg(urlObj.type == 'againCreate' ? '重新发起' : '发起流程') }}</el-button>
                        <el-button :icon="List" class="draft_btn" round @click="saveDraft"
                            v-if="urlObj.type != 'againCreate'">{{ maslg('保存草稿') }}</el-button>

                        <!-- <el-button round :icon="View">{{ maslg('查看流程') }}</el-button> -->
                        <el-button round :icon="Edit" @click="editFlow()">{{ maslg('编辑流程') }}</el-button>
                    </div>
                    <div class="sponsor_vessel-center">
                        <div class="center_content">
                            <div class="center_title center_box">
                                <div class="center_name" v-if="onlyCreateShow.includes(urlObj.type)">
                                    {{ maslg('流程标题：') }}
                                </div>
                                <div class="sponsor_box" v-if="onlyCreateShow.includes(urlObj.type)">
                                    <div class="center_input">
                                        <el-input clearable :maxlength="maxlength"
                                            :placeholder="maslg(currentNode?.isTitle != '1' ? '' : '请输入流程标题')"
                                            v-model="sponsorFlowData.title" :disabled="currentNode?.isTitle != '1'">
                                        </el-input>
                                    </div>
                                    <!-- <div class="center_disabled">
                                        {{ maslg(sponsorFlowData.title) }}
                                    </div> -->
                                    <div class="center_title-grade">
                                        <el-select :placeholder="maslg('请选择等级')" clearable popper-class="grade_select"
                                            v-model="sponsorFlowData.grade">
                                            <el-option v-for="item in gradeOptions" :key="item.value"
                                                :label="maslg(item.label)" :value="item.value"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                            <div class="center_receive center_box"
                                v-if="onlyAuditShow.includes(urlObj.type) || urlObj.type == 'look'">
                                <div class="center_name">
                                    {{ maslg('接收对象：') }}
                                </div>
                                <div class="center_disabled">
                                    {{ maslg(sponsorFlowData?.receiveInput?.join('、')) }}
                                </div>
                                <!-- <div class="sponsor_box">
                                    <div class="center_input">
                                        <el-input :readonly="true" :placeholder="maslg('请选择接收对象')"
                                            v-model="sponsorFlowData.receiveInput" class="select_obj"
                                            @click.stop="openSelectUser('sponsor')">
                                            <template #suffix>
                                                <el-icon @click="openSelectUser('sponsor')">
                                                    <UserFilled />
                                                </el-icon>
                                            </template>
                                        </el-input>
                                    </div>
                                </div> -->
                            </div>
                            <div class="center_accessory center_box"
                                v-if="onlyCreateShow.includes(urlObj.type) || sponsorFlowData.accessoryData.length > 0">
                                <div class="center_name">
                                    {{ maslg('附件：') }}
                                </div>
                                <div class="center_upload">
                                    <el-upload action="#" multiple v-model:file-list="sponsorFlowData.accessoryData"
                                        class="upload-demo" :on-change="handleSuccess" :limit="10" :auto-upload="false"
                                        ref="upload">
                                        <el-button round :icon="Plus" v-if="onlyCreateShow.includes(urlObj.type)">{{
                                            maslg('添加')
                                        }}</el-button>
                                        <template #file="{ file }">
                                            <div class="diy_upload">
                                                <el-icon class="upload_append">
                                                    <Link />
                                                </el-icon>
                                                <div class="upload_name" @click="reviewAnnexesFile(file, viewPage)">
                                                    {{ file.name }}
                                                </div>
                                                <span class="upload_del" @click="downloadAnnexesFile(file)">
                                                    <el-icon>
                                                        <Download />
                                                    </el-icon>
                                                </span>
                                                <span class="upload_del" @click="handleRemoveAccessory(upload, file)"
                                                    v-if="onlyCreateShow.includes(urlObj.type)">
                                                    <el-icon>
                                                        <Delete />
                                                    </el-icon>
                                                </span>
                                            </div>
                                        </template>
                                    </el-upload>
                                </div>
                            </div>
                            <div class="center_accessory center_box"
                                v-if="onlyCreateShow.includes(urlObj.type) || sponsorFlowData.document.length > 0">
                                <div class="center_name">
                                    {{ maslg('文档：') }}
                                </div>
                                <div class="center_upload upload_document">
                                    <el-button round :icon="Plus" @click="uploadDocument('sponsor')"
                                        v-if="onlyCreateShow.includes(urlObj.type)">{{ maslg('添加')
                                        }}</el-button>
                                    <div v-for="(item, index) in sponsorFlowData.document" :key="index"
                                        class="bottom_right-upload">
                                        <div class="diy_upload">
                                            <el-icon class="upload_append upload_docu">
                                                <Document />
                                            </el-icon>
                                            <div class="upload_name" @click="reviewAnnexesFile(item, viewPage)">
                                                {{ item.docName }}
                                            </div>
                                            <!-- <span class="upload_del">
                                                <el-icon>
                                                    <Download />
                                                </el-icon>
                                            </span> -->
                                            <span class="upload_del"
                                                @click.stop="handleRemoveDocument(sponsorFlowData.document, item)"
                                                v-if="onlyCreateShow.includes(urlObj.type)">
                                                <el-icon>
                                                    <Delete />
                                                </el-icon>
                                            </span>

                                        </div>
                                    </div>
                                    <!-- <el-upload action="#" class="upload-demo" :auto-upload="false" multiple
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
                                                <span class="upload_del"
                                                    @click="handleRemoveAccessory(documentUpload, file)">
                                                    <el-icon>
                                                        <Delete />
                                                    </el-icon>
                                                </span>
                                            </div>
                                        </template>
                                    </el-upload> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sponsor_vessel-bottom">
                        <div class="bottom_content">
                            <div class="bottom_tabs">
                                <el-tabs v-model="sponsorTabs">
                                    <el-tab-pane :label="maslg('表单信息')" name="formInfor" class="pane_ifrme">
                                        <div class="pane_container">
                                            <el-tabs type="border-card" v-model="iframePane" v-if="ifrmArr.length > 1"
                                                class="ifrme_pane">
                                                <el-tab-pane v-for="(item, index) in ifrmArr"
                                                    :label="item.formType != 'lookForm' ? '当前表单' : item.name"
                                                    :key="item.formUrl"
                                                    :name="item.formType != 'lookForm' ? '当前表单' : item.name">
                                                    <iframe :src="item.formUrl" :id="item.id"></iframe>
                                                </el-tab-pane>
                                            </el-tabs>
                                            <iframe ref="paneIframe" v-else></iframe>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane :label="maslg('流程信息')" name="flowInfor">
                                        <div ref="container" class="pane_container draw_container"></div>
                                        <div class="container_tip">
                                            <div class="tip_box dealing">
                                                {{ maslg('正在处理') }}
                                            </div>
                                            <div class="tip_box dealed">
                                                {{ maslg('已处理') }}
                                            </div>
                                            <div class="tip_box nodeal">
                                                {{ maslg('未处理') }}
                                            </div>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </div>
                        <div class="advise_box" v-if="onlyAuditShow.includes(urlObj.type) || urlObj.type == 'look'">
                            <div class="advise_box-title">
                                <span class="title_left">{{ maslg('审批意见') }}</span>
                                <span class="title_count">{{ maslg(`(${checkInfo.checkAdvise.length}条)`) }}</span>
                            </div>
                            <div class="advise_box-list">
                                <div class="list_item" v-for="(item, index) in checkInfo.checkAdvise" :key="item.F_Id">
                                    <div class="list_item-title">
                                        <div class="title_user">
                                            <div class="title_user-icon">{{ maslg(item.F_TaskUserName?.slice(0, 1)) }}</div>
                                            <div class="title_user-name">{{ maslg(item.F_TaskUserName) }}</div>
                                            <div class="title_user-agree title_user-result">{{
                                                maslg(item.F_OperationCode.indexOf('agree') != -1
                                                    ? '同意' : iitem.F_OperationCode.indexOf('disagree') != -1 ? '不同意' :
                                                        item.F_OperationName)
                                            }}</div>
                                        </div>
                                        <div class="title_time">
                                            {{ item.F_CreateDate }}
                                        </div>
                                    </div>
                                    <div class="list_item-content">
                                        <div class="content_advise">
                                            <div class="content_advise-text">
                                                <div class="left_text">
                                                    <span class="text_name">{{ maslg('审批意见：') }}</span>
                                                    <span class="text_content">{{ maslg(item.adviseContent) }}</span>
                                                </div>
                                                <div class="right_img" v-if="item.signImgUrl || item.stampImgUrl">
                                                    <el-image class="sign_img"
                                                        :src="item.signImgUrl ? item.signImgUrl : item.stampImgUrl"
                                                        fit="fill"
                                                        :preview-src-list="[item.signImgUrl ? item.signImgUrl : item.stampImgUrl]">
                                                    </el-image>
                                                </div>
                                            </div>
                                            <div class="content_advise-document">
                                                <div class="document_detail"
                                                    v-for="(citem, index) in item.XAWFTaskFilesList" :key="index">
                                                    <div class="diy_upload">
                                                        <el-icon class="upload_append upload_docu">
                                                            <Document v-if="citem.RelationType != 0" />
                                                            <Link v-else />
                                                        </el-icon>
                                                        <div class="upload_name"
                                                            @click="reviewAnnexesFile(citem, viewPage)">
                                                            {{ maslg(citem.RelationType == 0 ? citem.F_FileName :
                                                                citem.F_Title) }}
                                                        </div>
                                                        <span class="upload_del" v-if="citem.RelationType == 0"
                                                            @click="downloadAnnexesFile(citem)">
                                                            <el-icon>
                                                                <Download />
                                                            </el-icon>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="bottom_right" v-if="onlyAuditShow.includes(urlObj.type)">
                <div class="bottom_right-top">
                    <div class="top_title">{{ maslg('审批信息') }}</div>
                </div>
                <div class="bottom_right-content">
                    <div class="bottom_right-middle" v-if="currentNode?.isSign == '1' && urlObj.type != 'refer'">
                        <el-button round :icon="Avatar" @click="openSignConfig">{{ maslg('加签')
                        }}</el-button>
                    </div>
                    <div class="bottom_right-bottom">
                        <div class="bottom_top" v-if="urlObj.type != 'refer'">
                            <el-radio-group v-model="checkInfo.checkRadio" class="bottom_top-radioGroup">
                                <el-radio label="agree" v-if="!checkInfo.hideAgree">{{ maslg('同意') }}</el-radio>
                                <el-radio label="disagree" v-if="!checkInfo.hideDisagree">{{ maslg('不同意') }}</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="bottom_center" v-if="urlObj.type != 'refer'">
                            <el-input type="textarea" :autosize="{ minRows: 7 }" :placeholder="maslg('请输入审批意见')"
                                v-model="checkInfo.infoAdvise"></el-input>
                        </div>
                        <div class="bottom_bottom">
                            <el-upload action="#" class="upload-demo" accept="image/*,.pdf,.doc,.txt,.docx,.xls,.xlsx"
                                :auto-upload="false" multiple v-model:file-list="checkInfo.link" :on-change="handleSuccess"
                                ref="checkLink">
                                <el-tooltip :content="maslg('上传附件')">
                                    <el-button :icon="Link"></el-button>
                                </el-tooltip>
                            </el-upload>
                            <el-tooltip :content="maslg('上传文档')">
                                <el-button :icon="Document" @click="uploadDocument('check')"></el-button>
                            </el-tooltip>
                            <!-- <el-upload action="#" class="upload-demo" :auto-upload="false" multiple
                                v-model:file-list="checkInfo.document" ref="checkDocument">
                                <el-tooltip :content="maslg('上传文档')">
                                    <el-button :icon="Document"></el-button>
                                </el-tooltip>
                            </el-upload> -->
                        </div>
                    </div>
                    <div v-for="( item, index ) in  checkInfo.link " :key="index" class="bottom_right-upload">
                        <div class="diy_upload">
                            <el-icon class="upload_append">
                                <Link />
                            </el-icon>
                            <!-- <div class="upload_name">
                                {{ item.name }}
                            </div> -->
                            <div class="upload_name" @click="reviewAnnexesFile(item, viewPage)">
                                {{ item.name }}
                            </div>
                            <span class="upload_del" @click="downloadAnnexesFile(item)">
                                <el-icon>
                                    <Download />
                                </el-icon>
                            </span>
                            <span class="upload_del" @click="handleRemoveAccessory(checkLink, item)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </span>
                        </div>
                    </div>
                    <div v-for="( item, index ) in  checkInfo.document " :key="index" class="bottom_right-upload">
                        <div class="diy_upload">
                            <el-icon class="upload_append upload_docu">
                                <Document />
                            </el-icon>
                            <div class="upload_name" @click="reviewAnnexesFile(item)">
                                {{ item.docName }}
                            </div>
                            <span class="upload_del" @click="handleRemoveDocument(checkInfo.document, item)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </span>
                        </div>
                    </div>
                    <el-button type="primary" round :icon="Check" class="submit_btn" @click="saveAuditFlow(userBox)">{{
                        maslg(urlObj.type == 'refer' ? '确认阅读' : '提交')
                    }}</el-button>
                </div>
            </div>
        </div>
        <el-dialog v-model="visibleObj.dialogVisible" width="600" :title="maslg('流程加签')" align-center draggable
            :close-on-click-modal="false">
            <div class="sign_content">
                <el-form :model="signForm" @submit.native.prevent label-width="110">
                    <el-form-item :label="maslg('审核人员')" prop="auditorString">
                        <el-input :readonly="true" :placeholder="maslg('请选择审核人员')" v-model="signForm.auditorString"
                            class="select_obj" @click.stop="openSelectUser('check', userBox)">
                            <template #suffix>
                                <el-icon @click="openSelectUser('check', userBox)">
                                    <UserFilled />
                                </el-icon>
                            </template></el-input>
                    </el-form-item>
                    <el-form-item :label="maslg('审核方式')" prop="auditorType">
                        <el-radio-group v-model="signForm.auditorType">
                            <el-radio v-for=" item  in  isAuditorData.auditorData " :key="item.label" :label="item.label">{{
                                item.value
                            }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="maslg('通知策略')" prop="timeoutStrategy">
                        <el-select v-model="signForm.timeoutStrategy" :placeholder="maslg('请选择通知策略')" clearable>
                            <el-option v-for=" item  in  informData " :key="item.F_Id" :label="item.F_StrategyName"
                                :value="item.F_StrategyCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="maslg('自动同意规则')" prop="agreeGz">
                        <el-select multiple collapse-tags collapse-tags-tooltip v-model="signForm.agreeGz"
                            :placeholder="maslg('请选择自动同意规则')" clearable>
                            <el-option v-for=" item  in  agreegzData " :key="item.value" :label="maslg(item.label)"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="other_config" v-if="showMoreConfig">
                        <el-form-item :label="maslg('审批意见必填')" prop="isNeedCheckText">
                            <el-switch v-model="signForm.isNeedCheckText" active-value='1' inactive-value='0' />
                        </el-form-item>
                        <el-form-item :label="maslg('允许批量审核')" prop="isBatchAudit">
                            <el-switch v-model="signForm.isBatchAudit" active-value='1' inactive-value='0' />
                        </el-form-item>
                        <el-form-item :label="maslg('手动设置审核人')" prop="appointSetUser">
                            <el-switch v-model="signForm.appointSetUser" active-value='2' inactive-value='1' />
                        </el-form-item>
                        <el-form-item :label="maslg('允许加签')" prop="isSign">
                            <el-switch v-model="signForm.isSign" active-value='1' inactive-value='0' />
                        </el-form-item>
                        <el-form-item :label="maslg('无对应处理人')" prop="noPeopleGz">
                            <el-radio-group v-model="signForm.noPeopleGz">
                                <el-radio v-for=" item  in  noPeopleData " :key="item.label" :label="item.label">{{
                                    item.value
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="maslg('审核通过策略')" prop="isAllAuditor">
                            <el-radio-group v-model="signForm.isAllAuditor">
                                <el-radio v-for=" item  in  isAuditorData.chooseauditorData " :key="item.label"
                                    :label="item.label">{{ item.value
                                    }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="auditor_box" v-if="signForm.isAllAuditor == '2'">
                            <div class="auditor_box-content">
                                <el-form-item :label="maslg('审核执行策略')" prop="auditExecutType">
                                    <el-radio-group v-model="signForm.auditExecutType">
                                        <el-radio v-for=" item  in  isAuditorData.auditExecutData " :key="item.label"
                                            :label="item.label">
                                            <template #>
                                                {{ item.value }}
                                                <el-input-number size="small" controls-position="right"
                                                    v-model="signForm.scaleExecut" :min="0" :max="100"
                                                    v-if="signForm.auditExecutType == '3' && item.label == '3'"
                                                    class="proportionInput">
                                                </el-input-number>
                                            </template>
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item :label="maslg('再次审核')" prop="auditorAgainType">
                                    <el-radio-group v-model="signForm.auditorAgainType">
                                        <el-radio v-for=" item  in  isAuditorData.auditorAgainData " :key="item.label"
                                            :label="item.label">{{
                                                item.value
                                            }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item :label="maslg('审核方式')" prop="auditorType" class="auditor_form-last">
                                    <el-radio-group v-model="signForm.auditorType">
                                        <el-radio v-for=" item  in  isAuditorData.auditorData " :key="item.label"
                                            :label="item.label">{{
                                                item.value
                                            }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    <div class="last_btn">
                        <el-button @click="changeConfig" text class="moreConfig_btn">
                            <template #icon>
                                <span>{{ maslg('高级') }}</span>
                                <img :src="moreBtnImg" />
                            </template>
                        </el-button>
                    </div>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="signFlow(userBox)">
                        {{ maslg('确定') }}
                    </el-button>
                    <el-button @click="visibleObj.dialogVisible = false">{{ maslg('关闭') }}</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="documentVisible" width="85%" :title="maslg('关联文档')" align-center draggable
            :close-on-click-modal="false">
            <div class="dv_contain">
                <div class="dv_contain-left">
                    <el-tabs v-model="documentTas" @tab-change="changeDTab">
                        <el-tab-pane :label="maslg('协同')" name="tab1">
                        </el-tab-pane>
                        <!-- <el-tab-pane :label="maslg('文档中心')" name="tab2">
                        </el-tab-pane> -->
                    </el-tabs>
                    <div class="contain_table">
                        <div class="contain_table-tree" v-if="documentTas == 'tab2'">
                            <div class="tree_title">
                                {{ maslg('文件目录') }}
                            </div>
                            <div class="tree_content">
                                <el-tree default-expand-all :data="documentTree" node-key="id">
                                </el-tree>
                            </div>
                        </div>
                        <div class="contain_table-tab">
                            <el-table :data="documentTableData" border @selection-change="handleSelectionChange"
                                ref="multipleTableRef" :empty-text="maslg('无数据')">
                                <el-table-column type="index" width="50" />
                                <el-table-column type="selection" width="55" />
                                <el-table-column v-for=" item  in  tableColumn " :prop="item.prop"
                                    :show-overflow-tooltip="true" :key="item.prop" :label="item.label"
                                    :min-width="item.minwidth">
                                    <template #default="scope">
                                        <div class="level_content" v-if="item.prop == 'F_Level'"> {{
                                            maslg(computedLevel(scope.row.F_Level)) }} </div>
                                        <div class="operation_content" v-if="item.prop == 'operation'"
                                            @click="lookRow(scope.row)">
                                            {{ maslg('查看') }}
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination :total="total" :small="true" :pageSize="pageSize" @sizeChange="handleSizeChange"
                                @currentChange="handleCurrentChange" ref="paginaBox">
                            </pagination>
                        </div>
                    </div>
                </div>
                <div class="dv_contain-right">
                    <div class="right_top">
                        {{ maslg('已选择') }}
                    </div>
                    <div class="right_content">
                        <div v-for="( item, index ) in  selectDocData " :key="index" class="bottom_right-upload">
                            <div class="diy_upload">
                                <el-icon class="upload_append upload_docu">
                                    <Document />
                                </el-icon>
                                <div class="upload_name" :title="item.docName">
                                    {{ item.docName }}
                                </div>
                                <span class="upload_del" @click="removeSelectData(item)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="saveDocumentVis">
                        {{ maslg('确定') }}
                    </el-button>
                    <el-button @click="documentVisible = false">{{ maslg('关闭') }}</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="visibleObj.seletNextUserVisible" width="40%" :title="maslg('选择下一节点审核人员')" align-center draggable
            :close-on-click-modal="false">
            <div class="nextAuditor_box">
                <div class="nextAuditor_box-content" v-for=" item  in  nextAuditorsDialog " :key="item.id">
                    <div class="nextAuditor_box-title">
                        {{ maslg(item.name) }}
                    </div>
                    <el-select v-model="item.selectData" collapse-tags collapse-tags-tooltip multiple clearable
                        :placeholder="maslg('请选择审核者')">
                        <el-option v-for=" citem  in  item.optionData " :key="citem.Id" :value="citem.Id"
                            :label="citem.Name"></el-option>
                    </el-select>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleSaveNextAuditors">
                        {{ maslg('确定') }}
                    </el-button>
                    <el-button @click="visibleObj.seletNextUserVisible = false">{{ maslg('关闭') }}</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="visibleObj.rejectVisible" width="40%" :title="maslg('选择驳回节点')" align-center draggable
            :close-on-click-modal="false">
            <div class="reject_box">
                <div class="reject_box-title">{{ maslg('驳回节点') }}</div>
                <el-select v-model="rejectData.select" clearable :placeholder="maslg('请选择驳回节点')">
                    <el-option v-for=" item  in  rejectData.option " :key="item.nodeid" :label="item.nodename"
                        :value="item.nodeid">
                    </el-option>
                </el-select>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleSaveReject(userBox)">
                        {{ maslg('确定') }}
                    </el-button>
                    <el-button @click="visibleObj.rejectVisible = false">{{ maslg('关闭') }}</el-button>
                </span>
            </template>
        </el-dialog>
        <user ref="userBox" class="user_box" :type="2" :title="userTitle" @chooseReault="comeBackRoleandUser" :userIds="''"
            :height="'82%'" :width="'95%'">
        </user>
        <signPage v-model:signShow="signDialog" @returnSignImg="signImgSave"></signPage>
        <viewFiles ref="viewPage"></viewFiles>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, ComponentInternalInstance, getCurrentInstance, onMounted, nextTick, computed, watch, onUnmounted } from 'vue'
import { Position, List, UserFilled, View, Edit, Plus, Link, Delete, Document, Avatar, Check, Download } from '@element-plus/icons-vue'
import { sponsorConfig } from '@/hooks/sponsorFlow'
import { documentHooks } from '@/hooks/documentDia'
import { getImgUrl } from '@/utils/getImgurl'
import user from '@/components/organization/user.vue'
import pagination from '@/components/pagination/index.vue'
import signPage from '@/components/signPage/index.vue'
import { commonUtils } from '@/hooks/commonFlow'
import { piniaStore } from '@/store'
import viewFiles from '@/components/viewFiles/index.vue'
import type { UploadProps, UploadUserFile, UploadFile, UploadInstance, TableInstance } from 'element-plus'


const { proxy } = <ComponentInternalInstance>getCurrentInstance()
const upload = ref<UploadInstance>()
const checkLink = ref<UploadInstance>()
const paneIframe = ref<HTMLIFrameElement>()
const paginaBox = ref<InstanceType<typeof pagination>>()
const multipleTableRef = ref<TableInstance>()
const sponsorTabs = ref('formInfor')
const informData = piniaStore().informData
const { gradeOptions, noPeopleData, agreegzData, isAuditorData, onlyCreateShow, onlyAuditShow } = commonUtils()
const {
    sponsorFlowData,
    urlObj, getIfrmUrl, ifrmArr, editFlow, saveCreateCheck,
    currentNode, checkInfo,
    saveDraft, openSelectUser, comeBackRoleandUser, signForm, userTitle, nextAuditorsDialog
    , handleSaveNextAuditors, saveAuditFlow, rejectData, handleSaveReject, visibleObj, signFlow, signDialog, signImgSave
    , openSignConfig }
    = sponsorConfig()

const { getTableData, downloadAnnexesFile, handleRemoveAccessory, handleSuccess, reviewAnnexesFile, handleRemoveDocument, } = documentHooks()
const iframePane = ref('')
watch(ifrmArr, (val) => {
    if (val.length > 1) {
        val.map(item => {
            if (item.formType != "lookForm") {
                iframePane.value = '当前表单'
            }
        })
    }
})
const viewPage = ref<InstanceType<typeof viewFiles>>()
let container = ref<HTMLElement>()
const documentVisible = ref(false)
const showMoreConfig = ref(false)
let moreBtnImg = ref(getImgUrl('sponsor/ico_moredown.png'))
const changeConfig = () => {
    showMoreConfig.value = !showMoreConfig.value
    if (!showMoreConfig.value) {
        moreBtnImg.value = getImgUrl('sponsor/ico_moredown.png')
    }
    else {
        moreBtnImg.value = getImgUrl('sponsor/ico_more_up.png')
    }
}
const userBox = ref<InstanceType<typeof user>>()
const documentTas = ref('tab1')
let formBtn = 'sponsor'
const selectDocData = ref<any[]>([])
const uploadDocument = (val: string) => {
    formBtn = val
    documentVisible.value = true
    getTableData(docuParam, total, documentTableData, async (data) => {
        await nextTick()
        if (formBtn == 'sponsor') {
            selectDocData.value = sponsorFlowData.document
        }
        else {
            selectDocData.value = checkInfo.document
        }
        selectDocData.value.map(sitem => {
            data.map(item => {
                if (item.F_Id == sitem.F_Id) {
                    multipleTableRef.value?.toggleRowSelection(item, undefined)
                }
            })
        })

    })


}
const documentTree = ref<any[]>([])
const tableColumn = ref<{ label: string, prop: string, minwidth?: number }[]>([
    { label: '等级', prop: 'F_Level' },
    { label: '标题', prop: 'F_SchemeName', minwidth: 200 },
    { label: '发起者', prop: 'F_CreateUserName', },
    { label: '发起时间', prop: 'F_CreateDate', minwidth: 200 },
    { label: '操作', prop: 'operation' }])
const total = ref(0)
const pageSize = [10, 20, 30, 50]
const documentTableData = ref<any[]>([])
const docuParam = {
    rows: 10,
    page: 1,
    sidx: 'F_CreateDate DESC'
}
const levelCss = reactive({
    color: '#528cc8',
    backgroundColor: '#dfecfa'
})

const computedLevel = computed(() => {
    return (val: string) => {
        // await 
        if (val) {
            levelCss.color = val == '0' ? '#528cc8' : val == '1' ? '#ceb15f' : '#d9534f'
            levelCss.backgroundColor = val == '0' ? '#dfecfa' : val == '1' ? '#fff5da' : '#f8e7e7'
        }
        return val == '0' ? '普通' : val == '1' ? '重要' : '紧急'
    }
})

const changeDTab = (val: string) => {
    if (val == 'tab1') {
        tableColumn.value = [
            { label: '等级', prop: 'F_Level' },
            { label: '标题', prop: 'F_Title', minwidth: 200 },
            { label: '发起者', prop: 'F_CreateUserName', },
            { label: '发起时间', prop: 'F_CreateDate', minwidth: 200 },
            { label: '操作', prop: 'operation' }]
    }
    else {
        tableColumn.value = [{ label: '名称', prop: 'F_FileName', minwidth: 200 },
        { label: '类型', prop: 'F_FileType' },
        { label: '创建人', prop: 'F_CreateUserName', },
        { label: '创建时间', prop: 'F_CreateTime', minwidth: 200 },
        { label: '操作', prop: 'operation' }]
    }
}
const handleSelectionChange = (val: any[]) => {
    val.map(item => {
        item['docName'] = item.F_Title
        item['docTime'] = item.F_CreateDate
        item['RelationType'] = item.F_SchemeCode ? 1 : 0
    })
    selectDocData.value = val
}
const handleSizeChange = (val: number) => {
    docuParam.rows = val
    docuParam.page = 1
    getTableData(docuParam, total, documentTableData)
}
const handleCurrentChange = (val: number) => {
    docuParam.page = val
    getTableData(docuParam, total, documentTableData)


}
const lookRow = (val: any) => {
    let features = 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,resizable=no,status=no,menubar=no,scrollbars=yes,toolbar=no'
    window.open(`#/check?shcemeCode=${val.F_SchemeCode}&type=look&processId=${val.F_Id}`, val.F_Title, features)
}

const removeSelectData = (val: any) => {
    selectDocData.value.map((item, index) => {
        if (item.F_Id == val.F_Id) {
            selectDocData.value.splice(index, 1)
        }
    })
    multipleTableRef.value!.toggleRowSelection(val, undefined)
}
const saveDocumentVis = () => {
    if (formBtn == 'sponsor') {
        sponsorFlowData.document = selectDocData.value
    }
    else {
        checkInfo.document = selectDocData.value
    }
    documentVisible.value = false
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
onMounted(() => {
    // initDesign(container.value!, designStr)
    getIfrmUrl(paneIframe.value!, container.value!)
    //关闭前进行提示
    // window.addEventListener('beforeunload', handleWindowClose)
})
onUnmounted(() => {
    // window.removeEventListener('beforeunload', handleWindowClose);
})
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

.level_content {
    font-size: 14px;
    width: 44px;
    height: 23px;
    background: v-bind('levelCss.backgroundColor');
    color: v-bind('levelCss.color');
    border-radius: 2px;
    text-align: center;
}

.operation_content {
    color: #0080ff;
    font-size: 14px;
    cursor: pointer;
}
</style>