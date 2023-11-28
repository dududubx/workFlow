<template>
    <div class="check_container">
        <el-collapse :accordion="isAccordion" @change="changeCollapse" v-model="collapseClick">
            <el-collapse-item :title="maslg('审核节点配置')" name="0">
                <el-form ref="checkForm" :model="checkerData.checkData" :rules="checkRules" label-position="left"
                    @submit.native.prevent label-width="110px">
                    <el-form-item :label="maslg('节点名称')" prop="name">
                        <el-input v-regCharacter v-model="checkerData.checkData!.name" :placeholder="maslg('请输入节点名称')"
                            @input="changPointName" clearable :maxlength="maxlength"></el-input>
                    </el-form-item>
                    <el-form-item :label="maslg('通知策略')" prop="inform">
                        <el-select v-model="checkerData.checkData!.inform" :placeholder="maslg('请选择通知策略')" clearable>
                            <el-option v-for="item in informData" :key="item.F_Id" :label="item.F_StrategyName"
                                :value="item.F_StrategyCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="maslg('自动同意规则')" prop="agreerules" v-if="isTask && !isStart">
                        <el-select multiple collapse-tags collapse-tags-tooltip v-model="checkerData.checkData!.agreerules"
                            :placeholder="maslg('请选择自动同意规则')" clearable>
                            <el-option :label="maslg('处理人就是提交人')" value="1"></el-option>
                            <el-option :label="maslg('处理人和上一步的处理人相同')" value="2"></el-option>
                            <el-option :label="maslg('处理人审批过')" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="maslg('审批意见必填')" prop="advice" class="switch_item" v-if="isTask && !isStart">
                        <el-switch v-model="checkerData.checkData!.advice"></el-switch>
                    </el-form-item>
                    <el-form-item :label="maslg('允许批量审核')" prop="mutipleCheck" class="switch_item" v-if="!isStart">
                        <el-switch v-model="checkerData.checkData!.mutipleCheck"></el-switch>
                    </el-form-item>
                    <el-form-item :label="maslg('手动设置审核人')" prop="manualChecker" class="switch_item hastip_item">
                        <el-switch v-model="checkerData.checkData!.manualChecker"></el-switch>
                    </el-form-item>
                    <div class="switch_tip">{{ maslg('(下一审核节点无审核人员时可手动设置)') }}</div>
                    <el-form-item :label="maslg('手动指定审核人')" prop="manualChecker" class="switch_item hastip_item"
                        v-if="isStart">
                        <el-switch v-model="checkerData.checkData!.appointChecker"></el-switch>
                    </el-form-item>
                    <div class="switch_tip" v-if="isStart">{{ maslg('(允许手动指定下一节点审核人)') }}</div>
                    <el-form-item :label="maslg('自定义标题')" prop="manualChecker" class="switch_item hastip_item"
                        v-if="isStart">
                        <el-switch v-model="checkerData.checkData!.manualTitle"></el-switch>
                    </el-form-item>
                    <div class="switch_tip" v-if="isStart">{{ maslg('(允许发起流程时设置流程标题)') }}</div>
                    <el-form-item :label="maslg('允许加签')" prop="countersign" class="switch_item" v-if="isTask && !isStart">
                        <el-switch v-model="checkerData.checkData!.countersign"></el-switch>
                    </el-form-item>
                    <el-form-item :label="maslg('无对应处理人')" prop="conductor" v-if="isTask && !isStart">
                        <el-radio-group v-model="checkerData.checkData!.conductor" class="verticalGroup">
                            <el-radio label="1">{{ maslg('超级管理员处理') }}</el-radio>
                            <el-radio label="2">{{ maslg('跳过此步骤') }}</el-radio>
                            <el-radio label="3">{{ maslg('不能提交') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="maslg('审核通过策略')" prop="throughStrategy" v-if="isTask && !isStart">
                        <el-radio-group v-model="checkerData.checkData!.throughStrategy" class="verticalGroup">
                            <el-radio label="1">{{ maslg('只需其中一人审核') }}</el-radio>
                            <el-radio label="2">{{ maslg('所有审核者都需要审核') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="executive_Contianer" v-if="checkerData.checkData!.throughStrategy == '2'">
                        <el-form-item :label="maslg('审核执行策略')" prop="executiveStrategy" class="">
                            <el-radio-group v-model="checkerData.checkData!.executiveStrategy" class="verticalGroup">
                                <el-radio label="1">{{ maslg('所有人审核完') }}</el-radio>
                                <el-radio label="2">{{ maslg('有人不同意流转') }}</el-radio>
                                <el-radio label="3">
                                    <div>
                                        {{ maslg('按比例执行%') }}
                                        <el-input-number size="small" controls-position="right"
                                            v-model="checkerData.checkData!.proportionData" :min="0" :max="100"
                                            v-if="checkerData.checkData!.executiveStrategy == '3'" class="proportionInput">
                                        </el-input-number>
                                    </div>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="maslg('再次审核')" prop="executiveStrategy">
                            <el-radio-group v-model="checkerData.checkData!.auditorAgainType" class="verticalGroup">
                                <el-radio label="1">{{ maslg('已通过不需要审核') }}</el-radio>
                                <el-radio label="2">{{ maslg('已通过需要审核') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="maslg('审核方式')" prop="executiveStrategy">
                            <el-radio-group v-model="checkerData.checkData!.auditorType" class="verticalGroup">
                                <el-radio label="1">{{ maslg('并行') }}</el-radio>
                                <el-radio label="2">{{ maslg('串行') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>

                </el-form>
            </el-collapse-item>
            <el-collapse-item :title="maslg('节点表单设置')" class="collapse_form" name="2">
                <div class="pointForm" v-for="(item, index) in checkerData.pointFormData" :key="index"
                    @click="pointClick(item)">
                    <div class="formType" :class="isParentForm(item) ? 'flexForm' : ''" :key="index">
                        <div class="typeName" :style="{ 'width': isParentForm(item) ? '114px' : '' }">{{ maslg('表单类型:') }}
                        </div>
                        <div class="typeRadio" v-show="!isParentForm(item)">
                            <el-radio-group v-model="item.formType" @change="changeType">
                                <el-radio label="2">{{ maslg('智能表单') }}</el-radio>
                                <el-radio label="0">{{ maslg('系统表单') }}</el-radio>
                                <el-radio label="1">{{ maslg('自定义表单') }}</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-show="isParentForm(item)">
                            <div class="typeName">{{ item.formType == '2' ? maslg('智能表单') : item.formType == '0' ?
                                maslg('系统表单')
                                : maslg('自定义表单') }}</div>
                        </div>
                    </div>

                    <div class="select_form flex_form must_item">
                        <div class="select_form-name form_name">
                            {{ maslg('选择表单') }}
                        </div>
                        <div class="select_form-input">
                            <el-input v-model="item.selectForm" class="select_input center_input"
                                @click="openChooseForm(item)" :readonly="true" :disabled="isParentForm(item)">
                                <template #append v-if="!isParentForm(item)">
                                    <el-icon @click="openChooseForm(item)">
                                        <MoreFilled />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                        <el-tooltip :content="maslg('表单权限')" placement="bottom" effect="dark">
                            <div class="select_form-icon form_icon" @click="openAuthority(item)">
                                <i class="fa fa-key" aria-hidden="true"></i>
                            </div>
                        </el-tooltip>
                    </div>
                    <div class="view flex_form must_item" v-show="item.formType == '2' && !isParentForm(item)">
                        <div class="view_name form_name">
                            {{ maslg('PC端视图') }}
                        </div>
                        <el-select v-model="item.pcView" class="view_select" placeholder=" " @change="pcSelected">
                            <el-option v-for="pitem in item.pcviewOptionData" :key="pitem.ID" :label="pitem.ViewName"
                                :value="pitem.ID"></el-option>
                        </el-select>
                        <el-tooltip :content="maslg('视图预览')" placement="bottom" effect="dark">
                            <div class="form_icon" @click="openView(item, 'pc')">
                                <i class="fa fa-eye" aria-hidden="true"></i>
                            </div>
                        </el-tooltip>
                    </div>
                    <div class="view flex_form notMust_item" v-show="item.formType == '2' && !isParentForm(item)">
                        <div class="view_name form_name">
                            {{ maslg('移动端视图') }}
                        </div>
                        <el-select v-model="item.mtView" class="view_select" placeholder=" " @change="mbSelected">
                            <el-option v-for="mitem in item.pcviewOptionData" :key="mitem.ID" :label="mitem.ViewName"
                                :value="mitem.ID"></el-option>
                        </el-select>
                        <el-tooltip :content="maslg('视图预览')" placement="bottom" effect="dark">
                            <div class="form_icon" @click="openView(item, 'mb')">
                                <i class="fa fa-eye" aria-hidden="true"></i>
                            </div>
                        </el-tooltip>
                    </div>
                    <div class="relevence flex_form must_item" v-show="item.formType == '1'">
                        <div class="form_name">
                            {{ maslg('关联字段') }}
                        </div>
                        <el-select v-model="item.relevanceField" placeholder=" " :disabled="isParentForm(item)">
                            <el-option v-for="citem in item.cutomFieldData" :label="citem.title" :value="citem.id"
                                :key="citem.id"></el-option>
                        </el-select>
                    </div>
                    <div class="form_address flex_form must_item">
                        <div class="form_name">
                            {{ maslg('PC端表单地址') }}
                        </div>
                        <el-input v-model="item.pcFormAddress" :placeholder="maslg('请输入PC端表单地址')" clearable
                            :disabled="isParentForm(item)"></el-input>
                    </div>
                    <div class="form_address flex_form notMust_item" v-show="item.formType != '1'">
                        <div class="form_name">
                            {{ maslg('移动端表单地址') }}
                        </div>
                        <el-input v-model="item.mtFormAddress" :placeholder="maslg('请输入移动端表单地址')" clearable
                            :disabled="isParentForm(item)"></el-input>
                    </div>
                    <div class="form_del">
                        <el-button class="form_del-btn" :icon="Delete" @click="delPointForm(index)"> {{ maslg('删除') }}
                        </el-button>
                    </div>
                </div>
                <el-button class="add_btn form_btn" :icon="Plus" @click="addPointForm"> {{ maslg('添加') }} </el-button>
                <el-button class="form_btn from_config" :icon="Setting" @click="configurationBtn">
                    {{ maslg('高级配置') }}
                </el-button>
            </el-collapse-item>
            <el-collapse-item :title="maslg('节点审核者')" name="1" v-if="!isStart">
                <div v-for="(item, index) in checkerData.checkerArr" :key="index" class="checker_box">
                    <el-select v-model="item.seletItem" :style="item.seletItem == '' ? 'flex:1' : ''" class="
                    left_select" placeholder=" " clearable @change="chooseChecker(item)">
                        <el-option v-for="(citem, index) in checkerCategory" :key="citem.value" :label="maslg(citem.label)"
                            :value="citem.value"></el-option>
                    </el-select>
                    <div :style="item.seletItem == '' ? '' : 'flex:1'">
                        <div v-show="item.seletItem == 'field'">
                            <el-select v-model="item.fieldForm" class="center_input field_input" clearable value-key="ID"
                                :placeholder="maslg('请选择表')" @change="selectFieldForm" filterable
                                @focus="showOptions(item)">
                                <el-option v-for="citem in checkerFieldFormData" :label="citem.TableName" :value="citem"
                                    :key="citem.ID"></el-option>
                            </el-select>
                            <el-select v-model="item.relativeField" clearable filterable class="center_input field_input"
                                v-show="checkerData.pointFormData![0].formType != '2'" :placeholder="maslg('请选择关联字段')"
                                @focus="choiceFieldForm(item)">
                                <el-option v-for="(sitem, index) in useSelectData" :key="((sitem.value as string) + index)"
                                    :value="sitem" :label="maslg(sitem.label)">
                                    <div v-if="item.seletItem == 'field'">
                                        <span style="float:left;color:#333333;font-size:13px;">{{ maslg(sitem.label)
                                        }}</span>
                                        <span style="float:right;color:#8198b5;font-size:13px;">{{
                                            maslg(sitem.value as string) }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                            <el-select v-model="item.fieldCategory" clearable class="center_input field_input"
                                :placeholder="maslg('请选择字段类型')">
                                <el-option label="公司" value="company"></el-option>
                                <el-option label="部门" value="department"></el-option>
                                <el-option label="用户" value="user"></el-option>
                            </el-select>
                        </div>
                        <el-select v-model="item.inputItem" clearable filterable class="center_input"
                            v-show="changeSelectData.hasOwnProperty(item.seletItem)" value-key="value"
                            :placeholder="maslg(item.seletItem == 'field' ? '请选择审核字段' : '请选择')" :key="index"
                            @focus="item.seletItem == 'field' ? choiceFieldForm(item) : showOptions(item)"
                            @change="selectAuditor">
                            <el-option v-for="(sitem, index) in useSelectData" :key="((sitem.value as string) + index)"
                                :value="sitem" :label="maslg(sitem.label)">
                                <div v-if="item.seletItem == 'field'">
                                    <span style="float:left;color:#333333;font-size:13px;">{{ maslg(sitem.label) }}</span>
                                    <span style="float:right;color:#8198b5;font-size:13px;">{{
                                        maslg(sitem.value as string) }}</span>
                                </div>
                            </el-option>
                        </el-select>
                    </div>
                    <el-input v-model="item.inputItem" class="center_input open_dialog"
                        v-show="!changeSelectData.hasOwnProperty(item.seletItem) && item.seletItem"
                        @click="openOrganization(item)" :readonly="true">
                        <template #append>
                            <el-icon @click="openOrganization(item)">
                                <MoreFilled />
                            </el-icon>
                        </template>
                    </el-input>
                    <el-select v-show="addLastSelect.hasOwnProperty(item.seletItem)" value-key="value"
                        v-model="item.departmentItem" placement="bottom-start" class="right_select"
                        :placeholder="maslg('请选择')" @focus="changeLastData(item)">
                        <el-option v-for="(ditem, index) in departmentCategory" :label="maslg(ditem.label)" :value="ditem"
                            :key="ditem.value"></el-option>
                    </el-select>
                    <el-button class="radiu_dele" style="margin-left:5px" :icon="Delete" circle
                        @click="deleteChecker(index)"></el-button>
                </div>
                <el-button class="add_btn form_btn" :icon="Plus" @click="addChecker"> {{ maslg('添加') }} </el-button>
            </el-collapse-item>
            <el-collapse-item :title="maslg('审核超时设置')" name="3" v-if="isTask && !isStart">
                <div class="exceed_time time_box">
                    <div class="time_name">
                        {{ maslg('流程在当前节点超过多少小时未处理发出通知') }}
                    </div>
                    <div class="time_input">
                        <el-input-number controls-position="right" v-model="checkerData.checkTime!.exceedSendNotice"
                            :min="0" :max="100" class="time_input-number">
                        </el-input-number>
                        {{ maslg('(时)') }}
                    </div>
                </div>
                <div class="interval_time time_box">
                    <div class="time_name">
                        {{ maslg('发出通知后间隔多少小时未处理再发通知') }}
                    </div>
                    <div class="time_input">
                        <el-input-number controls-position="right" v-model="checkerData.checkTime!.intervalSendNotice"
                            :min="0" :max="100" class="time_input-number">
                        </el-input-number>
                        {{ maslg('(时)') }}
                    </div>
                </div>
                <div class="approve_time time_box">
                    <div class="time_name">
                        {{ maslg('超过多少小时未审批强制流转下一审核节点') }}
                    </div>
                    <div class="time_input">
                        <el-input-number controls-position="right" v-model="checkerData.checkTime!.intervalApprove" :min="0"
                            :max="100" class="time_input-number">
                        </el-input-number>
                        {{ maslg('(时)') }}
                    </div>
                </div>
                <div class="strategy_box time_box">
                    <div class="time_name">
                        {{ maslg('通知策略') }}
                    </div>
                    <div class="strategy_box-select">
                        <el-select class="strategy_box-select_input" v-model="checkerData.checkTime!.notificationStrategy"
                            :placeholder="maslg('请选择通知策略')" clearable>
                            <el-option v-for="item in informData" :key="item.F_Id" :label="item.F_StrategyName"
                                :value="item.F_StrategyCode">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item :title="maslg('审核按钮设置')" name="4" v-if="isTask && !isStart">
                <el-tabs v-model="btnTab">
                    <el-tab-pane :label="maslg('同意')" name="agree" class="agree-tab">
                        <div class="btn-tab">
                            <div class="btn-tab_name title">
                                {{ maslg('隐藏按钮') }}
                            </div>
                            <div class="switch_item">
                                <el-switch v-model="checkerData.agreeBtn!.hiddenBtn"></el-switch>
                            </div>
                        </div>
                        <div class="btn-tab">
                            <div class="btn-tab_name title">
                                {{ maslg('需要签名盖章') }}
                            </div>
                            <div class="switch_item">
                                <el-switch v-model="checkerData.agreeBtn!.signature"></el-switch>
                            </div>
                        </div>
                        <div class="btn-tab next_checker">
                            <div class="btn-tab_name title">
                                {{ maslg('下一节点审核人') }}
                            </div>
                            <div class="btn-tab_radio btn-tab_radio-agree">
                                <el-radio-group v-model="checkerData.agreeBtn!.nextChecker">
                                    <el-radio label="2" class="first_radio">{{ maslg('可手动设置') }}</el-radio>
                                    <el-radio label="1">{{ maslg('不可手动设置') }}</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="maslg('不同意')" name="disagree" class="disagree-tab">
                        <div class="btn-tab">
                            <div class="btn-tab_name title">
                                {{ maslg('隐藏按钮') }}
                            </div>
                            <div class="switch_item">
                                <el-switch v-model="checkerData.disagreeBtn!.hiddenBtn"></el-switch>
                            </div>
                        </div>
                        <div class="btn-tab">
                            <div class="btn-tab_name title">
                                {{ maslg('需要签名盖章') }}
                            </div>
                            <div class="switch_item">
                                <el-switch v-model="checkerData.disagreeBtn!.signature"></el-switch>
                            </div>
                        </div>
                        <div class="btn-tab">
                            <div class="btn-tab_name title">
                                {{ maslg('审核时保存表单数据') }}
                            </div>
                            <div class="switch_item">
                                <el-switch v-model="checkerData.disagreeBtn!.saveFormData"></el-switch>
                            </div>
                        </div>
                        <div class="disagree-tab">
                            <div class="btn-tab_name title">
                                {{ maslg('下一节点审核人') }}
                            </div>
                            <div class="btn-tab_radio disagree-tab_checkerradio">
                                <el-radio-group v-model="checkerData.disagreeBtn!.nextChecker">
                                    <el-radio label="2" class="radio_first">{{ maslg('可手动设置') }}</el-radio>
                                    <el-radio label="1">{{ maslg('不可手动设置') }}</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="disagree-tab">
                            <div class="btn-tab_name title">
                                {{ maslg('驳回方式') }}
                            </div>
                            <div class="btn-tab_radio disagree-tab_rejectradio">
                                <el-radio-group v-model="checkerData.disagreeBtn!.rejectWay">
                                    <el-radio label="1">{{ maslg('顺序驳回') }}</el-radio>
                                    <el-radio label="2">{{ maslg('指定驳回节点') }}</el-radio>
                                    <el-radio label="3">{{ maslg('驳回到上一审核节点') }}</el-radio>
                                    <el-radio label="4">{{ maslg('驳回直接结束流程') }}</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-collapse-item>
            <el-collapse-item :title="maslg('审核消息回写')" class="collapse_form" name="5" v-if="isTask && !isStart">
                <div class="pointForm" v-for="(item, index) in checkerData.writeBack" :key="index">
                    <div class="write-form">
                        <div class="wirteName title">{{ maslg('回写表单') }}</div>
                        <div class="formType-select">
                            <el-select v-model="item.backForm" :placeholder="maslg('请选择回写表单')" clearable value-key="value"
                                :disabled="true">
                                <el-option v-for="citem in backFormData" :label="citem.label" :value="citem"
                                    :key="((citem.value as string) + (citem.label as string))"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="write-form">
                        <div class="wirteName title">{{ maslg('回写表单字段/控件') }}</div>
                        <div class="formType-select">
                            <el-select v-model="item.backField" :placeholder="maslg('请选择回写表单字段/控件')" value-key="value"
                                clearable>
                                <el-option v-for="(fitem, index) in backFieldData"
                                    :key="(fitem.value + fitem.label + index)" :value="fitem"
                                    :label="fitem.label"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="add-write write-form">
                        <div class="add-write_switch is-flex_center">
                            <div class="title">{{ maslg('回写追加') }}</div>
                            <div class="switch_item">
                                <el-switch v-model="item.addBack"></el-switch>
                            </div>
                        </div>
                        <div class="add-write_split is-flex_center" v-show="item.addBack">
                            <div class="title">{{ maslg('分隔符') }}</div>
                            <el-input class="add-write_split-input" clearable :placeholder="maslg('请输入分隔符')"
                                v-model="item.splitString" :maxlength="10"></el-input>
                        </div>
                    </div>
                    <div class="write-content write-form ">
                        <div class="title">{{ maslg('回写内容') }}</div>
                        <div class="write-content_group">
                            <el-radio-group v-model="item.backContent" class="write-content_group-radio">
                                <el-radio label="content">{{ maslg('审核意见') }}</el-radio>
                                <el-radio label="time">{{ maslg('审核时间') }}</el-radio>
                                <el-radio label="hum">{{ maslg('审核人') }}</el-radio>
                                <el-radio label="btn">{{ maslg('审核按钮') }}</el-radio>
                                <el-radio label="merge" class="all_radio">{{ maslg(`审核按钮+审核意见+审核人+
                                    审核时间`) }}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="form_del">
                        <el-button class="form_del-btn" :icon="Delete" @click="delWriteBack(index)"> {{ maslg('删除') }}
                        </el-button>
                    </div>
                </div>
                <el-button class="add_btn form_btn" :icon="Plus" @click="addWriteBack"> {{ maslg('添加') }} </el-button>
            </el-collapse-item>
            <el-collapse-item :title="maslg('标题默认值配置')" v-if="isStart" name="6">
                <div class="start_box">
                    <div class="switch_tip">
                        {{ maslg('多个默认值会自动拼接成一个文本串填入标题') }}
                    </div>
                    <div class="start_box-select" v-for="(item, index) in checkerData.titleConfig" :key="index">
                        <div class="start_select">
                            <el-select v-model="item.selectData" clearable :placeholder="maslg('请选择标题默认值')">
                                <el-option v-for="pitem in titleOptionData" :key="pitem.id" :value="pitem.id"
                                    :label="maslg(pitem.text)"></el-option>
                            </el-select>
                        </div>
                        <div class="start_fixedInput" v-show="item.selectData == 'fixmsg'">
                            <el-input v-regCharacter :maxlength="maxlength" v-model="item.fixedValue"
                                :placeholder="maslg('请输入固定值')" clearable></el-input>
                        </div>
                        <el-button class="radiu_dele" :icon="Delete" circle @click="deleteTitleConfig(index)"></el-button>
                    </div>
                    <el-button class="add_btn form_btn" :icon="Plus" @click="addTitleConfig"> {{ maslg('添加') }} </el-button>
                </div>
            </el-collapse-item>
            <el-collapse-item :title="maslg('标题回写配置')" v-if="isStart" name="7">
                <div class="start_box">
                    <div class="switch_tip">
                        {{ maslg('支持标题同时回写多个控件') }}
                    </div>
                    <div class="start_box-select" v-for="(item, index) in checkerData.titleWriteBack" :key="index">
                        <div class="start_select">
                            <el-select v-model="item.fieldSelect" value-key="value" clearable
                                :placeholder="maslg('请选择表单字段')">
                                <el-option v-for="(fitem, index) in backFieldData"
                                    :key="(fitem.value + fitem.label + index)" :value="fitem"
                                    :label="fitem.label"></el-option>
                            </el-select>

                        </div>
                        <div class="start_fixedInput">
                            <el-select v-model="item.writeSelect" clearable placeholder=" ">
                                <el-option v-for="pitem in writeBackOption" :key="pitem.id" :value="pitem.id"
                                    :label="maslg(pitem.text)"></el-option>
                            </el-select>
                        </div>
                        <el-button class="radiu_dele" :icon="Delete" circle
                            @click="deleteTitleWriteBack(index)"></el-button>
                    </div>
                    <el-button class="add_btn form_btn" :icon="Plus" @click="addTitleWriteBack"> {{ maslg('添加') }}
                    </el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-dialog style="height:260px" :width="400" v-model="dialogFromVisible" :title="maslg('设置表单字段/控件权限')"
            :close-on-click-modal="false" align-center :draggable="true" class="watch_dialog">
            <div class="watch_form">
                <div class="watch_form-tip">
                    {{ maslg('审核时需要查看的其他流程节点表单') }}
                </div>
                <el-checkbox-group v-model="checkerData.adConfig!.watchFormData" @change="watchCheckChange">
                    <el-checkbox v-for="item in watchCheckData" :label="item.checkId" :key="item.checkId">{{
                        maslg(item.checkName) }}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">{{ maslg('关闭') }}</el-button>
                    <el-button type="primary" @click="submitForm">
                        {{ maslg('确认') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog style="height:90%" :width="500" v-model="systemFormDialog" :title="maslg('选择表单挂载的功能菜单')"
            :close-on-click-modal="false" align-center :draggable="true" class="system_dialog">
            <div class="systemtree_box">
                <TreeFilter ref="treefilter" label="text" :title="maslg('')" :requestApi="checkPointApi.getSystemFormTree"
                    :param="{}" :isEmitFirst="false" :isExpandAll="false" @change="getPCode" :showHideBtn="false"
                    :isExpandonClick="true" :isAccordion="true" :showIcon="true" />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="systemDialogClose">{{ maslg('关闭') }}</el-button>
                    <el-button type="primary" @click="systemDialogSubmit">
                        {{ maslg('确认') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <company v-if="!isStart" ref="companyBox" :type="1" :title="'选择公司'" @chooseReault="comeBackCompany" :userIds="''"
            :height="'82%'" :width="'60%'">
        </company>
        <department v-if="!isStart" ref="departmentBox" :type="1" :title="'选择部门'" @chooseReault="comeBackCompany"
            :userIds="''" :height="'82%'" :width="'60%'">
        </department>
        <post ref="postBox" v-if="!isStart" :type="1" :title="'选择岗位'" @chooseReault="comeBackCompany" :userIds="''"
            :height="'82%'" :width="'95%'"></post>
        <role ref="roleBox" v-if="!isStart" :type="1" :title="'选择角色'" @chooseReault="comeBackRoleandUser" :userIds="''"
            :height="'82%'" :width="'95%'"></role>
        <user ref="userBox" v-if="!isStart" :type="1" :title="'选择用户'" @chooseReault="comeBackRoleandUser" :userIds="''"
            :height="'82%'" :width="'95%'"></user>
        <chooseForm ref="chooseBox" @sendClickData="getRowsData"></chooseForm>
        <authority ref="authorityBox" @sendFieldData="saveFieldData"></authority>
    </div>
</template>

<script setup lang='ts'>
import { FormRules, FormInstance, ElMessage, ElTree } from 'element-plus';
import { MoreFilled, Plus, Delete, Setting } from '@element-plus/icons-vue'
import { ref, reactive, getCurrentInstance, ComponentInternalInstance, toRef, toRefs, nextTick, Ref, toRaw, watch, computed, useModel } from 'vue'
import { Shape, Connection } from 'bpmn-js/lib/model/Types';
import company from '../organization/company.vue';
import department from '../organization/department.vue'
import post from '../organization/post.vue'
import role from '../organization/role.vue'
import user from '../organization/user.vue'
import chooseForm from '../chooseForm/index.vue'
import authority from '../authority/index.vue'
import { checkPointApi } from '@/api/checkpoint'
import { conditionApi } from '@/api/condition'
import { isArray } from '@/utils/is';
const { proxy } = <ComponentInternalInstance>getCurrentInstance()
defineOptions({
    name: 'cheker'
})
//接受父节点传过来的值
const props = defineProps<{
    nodeList: (Shape | Connection)[],
    connectionList: Connection[],
    checkerData: parentCheckData,
    clickElement: Shape
}>()
// const checkerData = toRef(props, 'checkerData')
//派发事件
const emit = defineEmits<{
    'changPointName': [name: string],
    'update:checkerData': [val: object]
}>()
//修改节点名称
const changPointName = () => {
    emit('changPointName', checkerData.value.checkData!.name!)
}
//获取checkerData并维持单向数据流
const checkerData = useModel(props, 'checkerData')
const nodeList = toRef(props, 'nodeList')
const collapseClick = ref<string[] | string>('1')
const isTask = ref(true)
const isStart = ref(false)
const isAccordion = ref(true)
const changeClickElement = ref(false)
watch(() => props.clickElement, async (val) => {
    if (val) {
        changeClickElement.value = true
        val.type == 'bpmn:Task' ? isTask.value = true : isTask.value = false
        val.type == 'bpmn:IntermediateCatchEvent' ? isStart.value = true : isStart.value = false
        collapseClick.value = '0'
        if (checkerData.value.adConfig!.watchFormData.length > 0) {
            checkerData.value.pointFormData!.map((item, index) => {
                if (item.rowsData?.value == checkerData.value.pointFormData![0].rowsData?.value && index != 0) {
                    checkerData.value.pointFormData!.splice(index, 1)
                }
            })
            checkerData.value.adConfig!.watchFormData.map((item, index) => {
                if (item == checkerData.value.pointFormData![0].rowsData?.value) {
                    checkerData.value.adConfig!.watchFormData.splice(index, 1)
                }
            })
            checkerData.value.adConfig!.otherForm.map((item, index) => {
                if (item.rowsData?.value == checkerData.value.pointFormData![0].rowsData?.value) {
                    checkerData.value.adConfig!.otherForm.splice(index, 1)
                }
            })
        }
        await nextTick()
        if (Object.keys(checkerData.value.pointFormData![0].rowsData!).length > 0) {
            getDifferentData[checkerData.value.pointFormData![0].formType](checkerData.value.pointFormData![0])
        }
        let hasSetField = checkerData.value.checkerArr?.find(item => {
            return item.seletItem == 'field' && item.fieldForm != ''
        })
        if (hasSetField) {
            selectFieldForm(hasSetField.fieldForm)
        }
    }
}, {
    immediate: true
})
let poinData;
//监听到节点表单发生变化后，清空选择的回写表单字段
watch(() => checkerData.value.pointFormData![0]?.rowsData, async (val) => {
    poinData = checkerData.value.pointFormData![0]
    await nextTick()
    backFieldData.value = []
    if (poinData && Object.keys(poinData.rowsData!).length > 0 && !changeClickElement.value) {
        checkerData.value.pointFormData![0].relevanceField = ''
        checkerData.value.writeBack?.map(witem => {
            witem.backField = ''
        })
        checkerData.value.checkerArr?.map(citem => {
            if (citem.seletItem == 'field') {
                citem.fieldForm = ''
                citem.fieldCategory = ''
                citem.relativeField = ''
                citem.inputItem = ''
            }
        })
        checkerData.value.titleWriteBack = [{
            fieldSelect: null,
            writeSelect: ''
        }]
        if (poinData.formType != '2') {
            getDifferentData[checkerData.value.pointFormData![0].formType](checkerData.value.pointFormData![0])
        }
    }
    changeClickElement.value = false
}, {
    immediate: true,
    deep: true,
    // flush: 'post'
})
watch(() => checkerData.value.pointFormData![0].pcView, (val) => {
    if (val) {
        getDifferentData[checkerData.value.pointFormData![0].formType](checkerData.value.pointFormData![0])
    }
})
const validCollapse = (active: string, message: string) => {
    collapseClick.value = [active]
    isAccordion.value = false
    return ElMessage({
        type: 'error',
        message: proxy?.maslg(message)
    })
}
const validRowsData = {
    '2': () => {
        if (!checkerData.value.pointFormData![0].pcView) {
            return validCollapse('2', '请选择节点视图')
        }
        // else {
        //     return true
        // }

    },
    '1': () => {
        if (!checkerData.value.pointFormData![0].relevanceField) {
            return validCollapse('2', '请选择关联字段')
        }
    },
    '0': () => {

    }
}
const changeCollapse = (active: string | string[]) => {
    isAccordion.value = true
    if (Object.keys(checkerData.value.pointFormData![0].rowsData!).length > 0) {
        if (!checkerData.value.pointFormData![0].pcFormAddress) {
            return validCollapse('2', 'pc端表单地址不能为空')
        }
        validRowsData[checkerData.value.pointFormData![0].formType]()
    }
    if (active.length > 0 && isArray(active)) {
        collapseClick.value = active[active.length - 1]
    }
    // collapseClick.value = active
    let hasActive = isArray(active) ? active[active.length - 1] : active
    if (hasActive == '5' || hasActive == '7') {
        backFormData.value = []
        checkerData.value.pointFormData!.map((item, index) => {
            if (Object.keys(item.rowsData!).length > 0 && index == 0) {
                // item.rowsData!['label'] = item.selectForm
                // item.rowsData!['value'] = item.formType == '0' ? item.rowsData?.ID : item.formType == '2' ? item.rowsData?.F_Id : item.rowsData?.value
                backFormData.value.push(item.rowsData!)

            }
        })
        setWriteSelect()
    }

}

//审核节点配置项
//审核节点配置表单实例
const checkForm = ref<FormInstance>()
//审核节点表单验证规则
const checkRules = reactive<FormRules<checkData>>({
    name: [{
        required: true, message: proxy?.maslg('请输入节点名称'), trigger: 'blur'
    }]
})
//获取通知策略选择框数据
const informData = ref<informData[]>([])
checkPointApi.getNoticeData({}).then((res: any) => {
    if (res.code == 200) {
        informData.value = res.data
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
        message: '获取通知策略数据失败'
    })
})



//节点审核者配置项
//新增节点审核者
const addChecker = () => {
    checkerData.value.checkerArr!.push({
        seletItem: '',
        inputItem: '',
        departmentItem: '',
        organizationData: [],
        clickTree: {},
        fieldForm: '',
        fieldCategory: '',
        relativeField: ''
    })
}
//删除节点审核
const deleteChecker = (index: number) => {
    checkerData.value.checkerArr!.splice(index, 1)
}
//审核者分类
const checkerCategory: checkerCategory = [{
    value: "company",
    label: '公司'
}, {
    value: 'department',
    label: '部门'
}, {
    value: 'post',
    label: '岗位'
},
{
    value: 'role',
    label: '角色'
}, {
    value: 'user',
    label: '人员'
}, {
    value: 'executor',
    label: '节点执行人'
}, {
    value: 'field',
    label: '表字段'
}, {
    value: 'reciprocalRole',
    label: '相对角色'
}]
//判断是否为岗位、角色以及相对角色人员
const addLastSelect = {
    'role': () => {
        departmentCategory = [{
            value: '1',
            label: '同一个部门'
        }, {

            value: '2',
            label: '同一个公司'
        }, {

            value: '3',
            label: '发起人上级'
        }, {

            value: '4',
            label: '发起人下级'
        }]
    },
    'post': () => {
        departmentCategory = [{
            value: '1',
            label: '同一个部门'
        }, {

            value: '2',
            label: '同一个公司'
        }]
    },
    'reciprocalRole': () => {
        departmentCategory = [{
            value: 'Department',
            label: '部门成员'
        }, {

            value: 'Department|UpperLevel',
            label: '上级部门部门成员'
        }]
        checkPointApi.getRelativeData({ enumName: 'EnumPost' }).then((res: any) => {
            if (res.code == 200) {
                res.data.map(item => {
                    departmentCategory.push({
                        value: item.Value,
                        label: item.Text
                    })
                    departmentCategory.push({
                        value: item.value + '|UpperLevel',
                        label: "上级部门" + item.Text
                    })
                })
            }
        }).catch(err => {
            ElMessage({
                type: 'error',
                message: proxy?.maslg('获取相对角色数据失败')
            })
        })
        // useSelectData = []
    }
}
//存储岗位、角色以及相对角色第三个下拉框的数据
let departmentCategory: checkerCategory = []
//存储节点执行人、表字段、相对角色第二个下拉框的数据
let useSelectData = ref<checkerCategory>([])
//判断是否为执行人、表字段、相对角色
const changeSelectData: Object = {
    'executor': () => {
        useSelectData.value = []
        nodeList.value.map(item => {
            if (item.type != "bpmn:EndEvent" && item.type != "bpmn:SequenceFlow") {
                useSelectData.value.push({
                    value: item.id,
                    label: item.name
                })
            }

        })
    },
    'field': () => {
        useSelectData.value = []
        setWriteSelect()
    },
    'reciprocalRole': () => {
        useSelectData.value = []
        useSelectData.value.push({
            value: 'NWFSend',
            label: '发起人'
        })
        props.connectionList.map(item => {
            if (item.type != "bpmn:EndEvent" && item.type != 'bpmn:IntermediateCatchEvent') {
                useSelectData.value.push({
                    value: item.id,
                    label: item.name
                })
            }
        })
    }
}
const selectFieldForm = (val) => {
    if (checkerData.value.pointFormData![0].formType == '2') {
        useSelectData.value = val.TableFieldList
    }
    else {
        conditionApi.getFieldList({ dbCode: 'lrsystemdb', tableName: val.name }).then((res: any) => {
            if (res.code == 200) {
                res.data.map(item => {
                    item['label'] = item.f_remark
                    item['value'] = item.f_column
                })
                useSelectData.value = res.data
            }

        }).catch(err => {
            ElMessage({
                type: 'error',
                message: proxy?.maslg('获取表字段失败')
            })
        })
    }

}
let organizationItem: checkerArr | {} = {}
let isChangeOrgan = ref(false)
//节点审核者变化事件
const chooseChecker = (value: checkerArr) => {
    value.inputItem = ''
    value.departmentItem = ''
    value.organizationData = []
    value.clickTree = {}
    organizationItem = value
    isChangeOrgan.value = true
    if (addLastSelect.hasOwnProperty(value.seletItem)) {
        addLastSelect[value.seletItem]()
    }
    // if (changeSelectData.hasOwnProperty(value.seletItem)) {
    //     changeSelectData[value.seletItem]()
    // }
}
const showOptions = (item: checkerArr) => {
    if (item.seletItem) {
        if (changeSelectData.hasOwnProperty(item.seletItem)) {
            changeSelectData[item.seletItem]()
        }
    }
}
let checkerField;
const choiceFieldForm = (item) => {
    checkerField = item
    if (useSelectData.value.length == 0) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请先选择表')
        })
    }
}
const selectAuditor = (val) => {
    if (val.InputType) {
        if (val.InputType.indexOf('company') != -1) {
            checkerField.fieldCategory = 'company'
        }
        else if (val.InputType.indexOf('department') != -1) {
            checkerField.fieldCategory = 'department'
        }
        else if (val.InputType.indexOf('user') != -1) {
            checkerField.fieldCategory = 'user'
        }
    }
}
const changeLastData = (item: checkerArr) => {
    if (item.seletItem) {
        if (addLastSelect.hasOwnProperty(item.seletItem)) {
            addLastSelect[item.seletItem]()
        }
    }
}
const companyBox = ref<InstanceType<typeof company>>()
const departmentBox = ref<InstanceType<typeof department>>()
const postBox = ref<InstanceType<typeof post>>()
const roleBox = ref<InstanceType<typeof role>>()
const userBox = ref<InstanceType<typeof user>>()
const isOrganization: isOrganization = {
    'company': async () => {
        // await nextTick()
        companyBox.value?.getFromData('')
        companyBox.value?.clearSelectData((organizationItem as checkerArr).organizationData!)
    },
    'department': () => {
        departmentBox.value?.getFromData('')
        departmentBox.value?.clearSelectData((organizationItem as checkerArr).organizationData!)

    },
    'post': () => {
        postBox.value?.getFromData('')
        postBox.value?.clearSelectData((organizationItem as checkerArr).organizationData!, organizationItem['clickTree'])
    },
    'role': () => {
        roleBox.value?.getFromData('')
        roleBox.value?.clearSelectData((organizationItem as checkerArr).organizationData!, organizationItem['clickTree'])
    },
    'user': () => {
        userBox.value?.getFromData('')
        userBox.value?.clearSelectData((organizationItem as checkerArr).organizationData!, organizationItem['clickTree'])
    }
}

const openOrganization = async (item: checkerArr) => {
    organizationItem = item
    if (item.seletItem && isOrganization.hasOwnProperty(item.seletItem)) {
        isOrganization[item.seletItem]()
    }
}
//返回公司、部门和岗位选择框数据
const comeBackCompany = (val, tree) => {
    organizationItem['inputItem'] = val[0].text ? val[0].text : val[0].F_Name
    organizationItem['organizationData'] = val
    organizationItem['clickTree'] = tree
}
//返回角色、人员选择框数据
const comeBackRoleandUser = (val, tree) => {
    organizationItem['inputItem'] = val[0].F_FullName ? val[0].F_FullName : val[0].F_RealName
    organizationItem['organizationData'] = val
    organizationItem['clickTree'] = tree
}


//节点表单配置项
//删除节点表单
const delPointForm = (cindex) => {
    checkerData.value.adConfig!.watchFormData.map((item, index) => {
        if (item == checkerData.value.pointFormData![cindex].rowsData?.value) {
            checkerData.value.adConfig!.watchFormData.splice(index, 1)
        }
    })
    checkerData.value.pointFormData!.splice(cindex, 1)
}
//增加节点表单
const addPointForm = () => {
    let canAdd = isParentForm.value(checkerData.value.pointFormData![0])
    if (checkerData.value.pointFormData!.length > 0 && !canAdd) {
        return ElMessage({
            type: 'warning',
            message: proxy?.maslg('一个节点只能添加一个表单')
        })
    }
    checkerData.value.pointFormData!.unshift({
        formType: '1',
        selectForm: '',
        pcFormAddress: '',
        mtFormAddress: '',
        pcView: '',
        mtView: '',
        relevanceField: '',//关联字段
        rowsData: {},//当前选择表单的数据
        tabsData: [],
        fieldData: [],
        customData: {},//自定义表单接口返回数据
        pcviewOptionData: [],//pc端视图数据
        mtViewData: [],//移动端视图数据
        cutomFieldData: []//关联字段下拉框数据
    })
}


//选择表单弹窗
//系统表单弹窗
const systemFormDialog = ref(false)
const chooseBox = ref<InstanceType<typeof chooseForm>>()
let openTableItem: pointFormData
//获取到当前表单的实例
const pointClick = (val: pointFormData) => {
    openTableItem = val
}
//打开表单选择器
const openChooseForm = (val: pointFormData) => {
    if (val.formType != '0') {
        chooseBox.value?.openDialog(val.formType, val.selectForm == '', val.rowsData as tableData, checkerData.value.pointFormData!)
    }
    else {
        systemFormDialog.value = true
    }
}
//返回表单选择的数据
const setDifferentFormData: isOrganization = {
    '2': () => {
        getViewData(openTableItem, 'PC')
    },
    '0': () => {

    },
    '1': async () => {
        await getCustomField(openTableItem)
    }
}
const getRowsData = (val: tableData) => {
    openTableItem.rowsData = val
    openTableItem.pcView = ''
    openTableItem.mtView = ''
    openTableItem.pcFormAddress = ''
    openTableItem.mtFormAddress = ''
    openTableItem.tabsData = []
    openTableItem.fieldData = []
    openTableItem.pcviewOptionData = []
    openTableItem.mtViewData = []
    openTableItem.cutomFieldData = []
    openTableItem.selectForm = openTableItem.formType == '2' ? (val.FormName as string) : openTableItem.formType == '1' ? (val.F_Name as string) : ''
    setDifferentFormData[openTableItem.formType]()

}
//切换表单类型
const changeType = (val) => {
    openTableItem.rowsData = {}
    openTableItem.pcView = ''
    openTableItem.mtView = ''
    openTableItem.selectForm = ''
    openTableItem.pcFormAddress = ''
    openTableItem.mtFormAddress = ''
    openTableItem.pcviewOptionData = []
    openTableItem.mtViewData = []
    openTableItem.tabsData = []
    openTableItem.fieldData = []
    openTableItem.cutomFieldData = []
    openTableItem.customData = {}
    if (treefilter.value) {
        treefilter.value!.resetSelected('clearExpand', '')
    }
}
//获取视图数据
const getViewData = async (val: pointFormData, plat: string) => {
    if (Object.keys((val.rowsData as tableData)).length > 0) {
        let params = {
            FormId: val.rowsData?.ID,
            platform: plat,
            isLoadDesign: false
        }
        checkPointApi.getSmartFormViewList(params).then((res: any) => {
            if (res.code == 200) {
                openTableItem.pcviewOptionData = res.data
            }

        }).catch(err => {
            ElMessage.error('获取视图列表数据失败')
        })
    }
}
//pc视图选择框
const pcSelected = (val: any) => {
    if (val) {
        openTableItem.mtView = val
        openTableItem.pcFormAddress = '/pages/smartform/render/index.html?' + `id=${val}&formId=${openTableItem.rowsData?.ID}`
        mbSelected(val)
    }
}
//mb视图选择框
const mbSelected = (val: any) => {
    if (val) {
        openTableItem.mtFormAddress = '/pages/smartform/render/index.html?' + `id=${val}&formId=${openTableItem.rowsData?.ID}`
    }
}
//打开视图预览
const openView = (val: pointFormData, plat: string) => {
    let id = plat == 'pc' ? val.pcView : val.mtView;
    if (!id) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请先选择视图')
        })
    }
    (window as any).layer.open({
        type: 2,
        title: proxy?.maslg('预览当前表单'),
        btn: null,
        area: ['900px', '600px'],
        maxmin: true,
        content: (window as any).iframApi + '/XA_Form/XANForm/Form?' + `id=${id}&formId=${val.rowsData?.ID}&independent=1`
    })
}
//获取自定义表单实例数据
const getCustomField = async (val: pointFormData) => {
    await checkPointApi.getFormFieldData({ keyValue: val.rowsData?.F_Id }).then((res: any) => {
        if (res.code == 200) {
            const scheme = JSON.parse(res.data.schemeEntity.F_Scheme)
            openTableItem.customData = res.data
            openTableItem.cutomFieldData = []
            scheme.data.map(item => {
                item.componts.map(citem => {
                    if (citem.title && citem.field) {
                        openTableItem.cutomFieldData.push(citem)
                    }
                })
            })
            openTableItem.pcFormAddress = `/FormModule/Custmerform/WorkflowInstanceForm?id=${val.rowsData?.F_Id}`
        }

    }).catch(err => {
        ElMessage({
            type: 'error',
            message: '获取自定义表单实例失败'
        })
    })
}

//系统表单获取选择的树节点数据
//存储系统表单所选树节点数据
const systemTreeData = ref()
const treefilter = ref()
const getPCode = val => {
    systemTreeData.value = val
}
//关闭系统表单弹窗
const systemDialogClose = () => {
    systemFormDialog.value = false
}
//保存系统表单所选数据
const systemDialogSubmit = () => {
    if (systemTreeData.value.hasChildren) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请选择正确的表单模块')
        })
    }
    let hasFind = checkerData.value.adConfig!.otherForm.find(item => {
        return item.rowsData!.value == systemTreeData.value.value
    })
    if (hasFind) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('表单已设置')
        })
    }
    openTableItem.selectForm = systemTreeData.value.text
    systemTreeData.value['formType'] = 'workForm'
    openTableItem.pcFormAddress = ''
    systemTreeData.value['label'] = systemTreeData.value.text
    openTableItem.rowsData = systemTreeData.value
    if (systemTreeData.value.exid1) {
        let url = systemTreeData.value.exid1.split('/Index')[0]
        if (url && url.length > 0) {
            openTableItem.pcFormAddress = url + '/Form'
        }
    }
    systemFormDialog.value = false
}

//表单字段权限设置弹窗
const authorityBox = ref<InstanceType<typeof authority>>()
//打开字段权限设置界面弹窗
const openAuthority = (val: pointFormData) => {
    if (!val.selectForm) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请先选择表单')
        })
    }
    if (!val.pcView && val.formType == '2') {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请先选择表单视图')
        })
    }
    authorityBox.value?.openDialog(val, val.pcView, isParentForm.value(val))
}
//保存字段权限设置界面的数据
const saveFieldData = (tabsData: any[], tableData: authorityTable[]) => {
    openTableItem.tabsData = tabsData
    openTableItem.fieldData = tableData
}
//节点表单高级配置
const dialogFromVisible = ref(false)
const watchCheckData = ref<any[]>([])
let configurationCheckbox = <string[]>[]
//高级设置弹窗
const configurationBtn = () => {
    watchCheckData.value = []
    const findData = <Shape[]>[]
    const findParent = (target: Shape) => {
        props.nodeList.map(item => {
            if (item.type == "bpmn:SequenceFlow" && item.target.id == target.id && (item.configData.lineStrategy == 'agree' || item.source.type == 'bpmn:IntermediateCatchEvent')) {
                findData.push(item.source)
                findParent(item.source)
            }
        })
    }
    findParent(props.clickElement)
    findData.map(item => {
        if (item.configData.pointFormData[0].selectForm) {
            if (item.configData.pointFormData[0].rowsData?.value != checkerData.value.pointFormData![0].rowsData?.value) {
                item.checkName = item.configData.pointFormData[0].selectForm + '-[' + item.name + ']'
                item.checkId = item.configData.pointFormData[0].rowsData?.value
                watchCheckData.value.push(item)
            }
        }
    })
    configurationCheckbox = checkerData.value.adConfig!.watchFormData
    dialogFromVisible.value = true
}
const watchCheckChange = (val) => {
    if (val.length > 0) {
        checkerData.value.adConfig!.otherForm = []
        watchCheckData.value.map(item => {
            val.map((citem, index) => {
                if (item.checkId == citem) {
                    checkerData.value.adConfig!.otherForm.push(item.configData.pointFormData[0])
                    // setWatchForm.set(item.configData.pointFormData.rowsData.ID, item)
                }
            })
        })
    }
}
const handleClose = () => {
    checkerData.value.adConfig!.watchFormData = configurationCheckbox
    dialogFromVisible.value = false
}
const submitForm = () => {
    // setWatchForm.set()
    configurationCheckbox = checkerData.value.adConfig!.watchFormData
    if (configurationCheckbox.length == 0) {
        checkerData.value.adConfig!.otherForm = []
    }
    if (checkerData.value.pointFormData!.length > 1) {
        checkerData.value.pointFormData!.splice(1, checkerData.value.pointFormData!.length - 1)
    }
    checkerData.value.adConfig!.otherForm.map(item => {
        checkerData.value.pointFormData!.push(item)
    })
    dialogFromVisible.value = false
}
const isParentForm = computed(() => {
    return (val: pointFormData) => {
        let hasFind = checkerData.value.adConfig!.otherForm.find(item => {
            return item.rowsData!.value == val.rowsData?.value
        })
        let hasget = false
        if (hasFind) {
            hasget = true
        } else {
            hasget = false
        }
        return hasget
    }
})
//审核超时设置配置项


//审核按钮设置配置项
//tab切换绑定数据
const btnTab = ref('agree')


//审核消息回写配置项
//删除消息回写表
const delWriteBack = (index: number) => {
    checkerData.value.writeBack!.splice(index, 1)
}
//新增一个消息回写表
const addWriteBack = () => {
    checkerData.value.writeBack!.push({
        backForm: hasFormData ? backFormData.value[0] : {},
        backField: '',
        addBack: true,
        splitString: '',
        backContent: 'hum'
    })
}
//点击消息回写表单
let backFormData = ref<tableData[]>([])
let hasFormData = ref(false)



//设置回写表单默认选中值
const setWriteSelect = async () => {
    if (poinData && Object.keys(poinData.rowsData!).length > 0) {
        hasFormData.value = true
        let selectData = backFormData.value[0]
        checkerData.value.writeBack?.map(witem => {
            witem.backForm = selectData
        })
    }
    else {
        hasFormData.value = false
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请先绑定节点表单')
        })
    }
}
const backFieldData = ref<any[]>([])
const checkerFieldFormData = ref<any[]>([])
//获取表单字段数据
const getDifferentData: differentData = {
    '2': async (val: pointFormData) => {
        checkPointApi.getSmartFieldList({ queryJson: JSON.stringify({ FormId: (val.rowsData as tableData).ID }), isDefaultField: true }).then((res: any) => {
            if (res.code == 200) {
                val.tabsData = res.data
                res.data.map(item => {
                    item['name'] = item.TableCode
                    item.TableFieldList.map(titem => {
                        titem['label'] = titem.FieldName
                        titem['value'] = titem.FieldCode
                    })
                })
                checkerFieldFormData.value = res.data
            }
        }).catch(err => {
            ElMessage({
                type: 'error',
                message: proxy?.maslg('获取表单数据失败')
            })
        })
        checkPointApi.getSmartFormOperaList({ FormId: (val.rowsData as tableData).ID, viewId: val.pcView, operType: 'A' }).then((res: any) => {
            if (res.code) {
                val.fieldData = []
                backFieldData.value = res.data
                backFieldData.value.map(item => {
                    item['label'] = item.FieldName
                    item['value'] = item.FieldCode
                    item['tableCode'] = item.TableCode
                    item['nFormId'] = item.FormId
                    item['fieldid'] = item.FieldCode
                    item['type'] = '2'
                    item['pageid'] = val.pcView
                    item['page'] = val.selectForm

                })
                res.data.map(item => {
                    let obj = {
                        fieldtype: 'sys',
                        id: item.FieldId,
                        isMain: item.IsMain,
                        tableCode: item.TableCode,
                        tableName: item.TableName,
                        fieldName: "[" + item.TableName + "]" + item.FieldName,
                        fieldCode: item.FieldCode,
                        fieldId: item.FieldCode,
                        isLook: item.IsRead == '1' ? true : item.IsEdit == '1' ? true : false,
                        isEdit: item.IsEdit == '1' ? true : false,
                        isNotNull: item.IsNotNull == '1' ? true : false,
                        IsHide: item.IsHide,
                        TableId: item.TableId
                    }
                    val.fieldData.push(obj)
                })

            }
        }).catch(err => {
            ElMessage({
                type: 'error',
                message: '获取表单字段信息失败'
            })
        })

    },
    '0': (val: pointFormData) => {
        backFieldData.value = []
        checkPointApi.getSystemList({ code: val.rowsData?.value }).then((res: any) => {
            if (res.code == 200) {
                backFieldData.value = res.data.fields
                backFieldData.value.map(item => {
                    item['label'] = item.F_FullName
                    item['value'] = item.F_ModuleFormId
                    item['tableCode'] = ''
                    item['nFormId'] = ''
                    item['fieldid'] = item.F_EnCode
                    item['type'] = '0'
                    item['pageid'] = val.rowsData?.value
                    item['page'] = val.selectForm
                    item['TableId'] = item.F_ModuleId
                })
                val.tabsData = []
                res.data.module['ID'] = res.data.module.F_ModuleId
                res.data.module['TableName'] = res.data.module.F_FullName
                val.tabsData.push(res.data.module)
                val.fieldData = []
                res.data.fields.map(item => {
                    let obj = {
                        fieldtype: 'sys',
                        id: item.F_ModuleFormId,
                        isMain: item.F_IsMain,
                        tableName: item.F_TableName,
                        fieldName: item.F_FullName,
                        fieldId: item.F_EnCode,
                        fieldCode: item.F_EnCode,
                        isLook: true,
                        isEdit: true,
                        isNotNull: false,
                        IsHide: '0',
                        TableId: item.F_ModuleId
                    }
                    val.fieldData.push(obj)
                })

            }
        }).catch(err => {
            ElMessage.error('获取表单字段信息失败')
        })
        conditionApi.getAllDatabaseList().then((res: any) => {
            if (res.code == 200) {
                res.data.map(item => {
                    item['TableName'] = item.tdescription
                    item['ID'] = item.name
                })
                checkerFieldFormData.value = res.data
            }
        }).catch(err => {
            ElMessage({
                type: 'error',
                message: proxy?.maslg('获取数据库表失败')
            })
        })
    },
    '1': (val: pointFormData) => {
        setTimeout(() => {
            if (val.customData.schemeEntity) {
                backFieldData.value = []
                const scheme = JSON.parse(val.customData.schemeEntity.F_Scheme)
                val.tabsData = scheme.dbTable
                val.tabsData.map(item => {
                    item['ID'] = item.name
                    if (item.relationField == '') {
                        item['TableName'] = item.name + '(' + proxy?.maslg('主表') + ')'
                    }
                    else {
                        item['TableName'] = item.name + '(' + proxy?.maslg('子表') + ')'
                    }
                })
                checkerFieldFormData.value = val.tabsData
                val.fieldData = []
                scheme.data.map(item => {
                    item.componts.map(citem => {
                        if (citem.title && citem.field && citem.type == 'text') {
                            citem['label'] = citem.title
                            citem['value'] = citem.id
                            citem['tableCode'] = ''
                            citem['nFormId'] = ''
                            citem['fieldid'] = citem.id
                            citem['type'] = '1'
                            citem['pageid'] = val.rowsData?.value
                            citem['page'] = val.selectForm
                            citem['TableId'] = citem.table ? citem.table : checkerData.value.pointFormData![0].tabsData[0].ID
                            backFieldData.value.push(citem)
                        }
                        if (citem.type == 'gridtable' || citem.type == 'girdtable') {
                            citem['type'] = 'grid'
                            setTableField(citem, false)
                            citem.fieldsData.map(fitem => {
                                setTableField(fitem, true, citem)
                            })
                        }
                        else if (citem.type != 'guid') {
                            setTableField(citem, false)
                        }
                    })
                })
            }
        }, 500)
        // console.log(val);
        // checkPointApi.getFormTableList({ queryJson: JSON.stringify({ FormId: val.rowsData?.F_Id }) }).then((res: any) => {
        //     console.log(res);

        // }).catch(err => {
        //     ElMessage({
        //         type: 'error',
        //         message: proxy?.maslg('获取表单失败')
        //     })
        // })
    }
}
const setTableField = (citem, ischild: boolean, fitem?) => {
    let obj = {
        formId: checkerData.value.pointFormData![0].customData!.schemeInfoEntity.F_Id,
        fieldName: ischild ? fitem.title + '-' + citem.name : citem.title,
        fieldCode: ischild ? fitem.id + '|' + citem.id : citem.id,
        fieldId: ischild ? fitem.id + '|' + citem.id : citem.id,
        id: ischild ? fitem.id + '|' + citem.id : citem.id,
        isLook: true,
        isEdit: true,
        isNotNull: false,
        IsHide: '0',
        TableId: ischild ? fitem.table : citem.table ? citem.table : checkerData.value.pointFormData![0].tabsData[0].ID
    }
    checkerData.value.pointFormData![0].fieldData.push(obj)
}

//开始节点的标题默认配置项
const titleOptionData = [
    { id: 'username', text: '当前登录人姓名' },
    { id: 'fixmsg', text: '固定值' },
    { id: 'yyyy-MM-dd hh:mm:ss', text: '日期时间(2021-06-07 15:57:30)' },
    { id: 'yyyyMMddhhmmss', text: '日期时间(20210607155730)' },
    { id: 'yyyy-MM-dd', text: '日期(2021-06-07)' },
    { id: 'yyyyMMdd', text: '日期(20210607)' },
    { id: 'hh:mm:ss', text: '时间(15:57:30)' },
    { id: 'hhmmss', text: '时间(155730)' }
]
const deleteTitleConfig = (index: number) => {
    checkerData.value.titleConfig?.splice(index, 1)
}
const addTitleConfig = () => {
    checkerData.value.titleConfig?.push({
        selectData: '',
        fixedValue: ''
    })
}

//开始节点标题回写配置
const writeBackOption = [
    { id: 'replace', text: '控件有值替换' },
    { id: 'accumulation', text: '控件有值累加' },
    { id: 'nooperation', text: '控件有值不操作' }
]

const deleteTitleWriteBack = (index: number) => {
    checkerData.value.titleWriteBack?.splice(index, 1)
}

const addTitleWriteBack = () => {
    checkerData.value.titleWriteBack?.push({
        fieldSelect: null,
        writeSelect: ''
    })
}
</script>

<style scoped></style>