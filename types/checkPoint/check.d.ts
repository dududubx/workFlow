declare interface parentCheckData {
    checkData?: checkData,
    checkerArr?: checkerArr[],
    pointFormData?: pointFormData[],
    checkTime?: checkTime,
    agreeBtn?: agreeBtn,
    disagreeBtn?: disagreeBtn,
    writeBack?: writeBack[],
    adConfig?: adConfig,
    titleConfig?: titleConfig[],
    titleWriteBack?: titleWriteBack[],
    advanceData?: advancedForm,
    childFlow?: string
}

declare interface checkData {
    name?: string,
    inform?: string,
    agreerules?: string[],
    advice?: boolean,
    mutipleCheck?: boolean,
    manualChecker?: boolean,
    countersign?: boolean,
    conductor?: string,
    throughStrategy?: string,
    executiveStrategy?: string,
    proportionData?: number,
    manualTitle?: boolean,
    appointChecker?: boolean,
    auditorAgainType?: string,
    auditorType?: string,
    isSaveDraftValid?: boolean,
    childType?: string,
    childFlow?: any,
    childFlowName?: string
}
declare interface checkerArr {
    seletItem: string,
    inputItem: string,
    departmentItem?: string,
    organizationData?: any[],
    clickTree?: object,
    fieldForm: string,
    fieldCategory: string,
    relativeField: string
}
declare type checkerCategory = {
    value: string | number,
    label: string
}[]
declare interface pointFormData {
    formType: string,
    selectForm: string,
    pcView: string,
    mtView: string,
    pcFormAddress: string,
    mtFormAddress: string,
    relevanceField: string,
    pcviewOptionData: any[],
    mtViewData: any[],
    cutomFieldData: any[],
    rowsData?: tableData,
    tabsData: Array<any>,
    fieldData: authorityTable[],
    customData: any,
}
declare interface checkTime {
    exceedSendNotice: number,
    intervalSendNotice: number,
    intervalApprove: number,
    notificationStrategy: string
}
declare interface agreeBtn {
    name: string,
    hiddenBtn: boolean,
    signature: boolean,
    nextChecker: string,
}
declare interface disagreeBtn {
    name: string,
    hiddenBtn: boolean,
    signature: boolean,
    nextChecker: string,
    saveFormData: boolean,
    rejectWay: string
}
declare interface writeBack {
    backForm: tableData,
    backField: string,
    addBack: boolean,
    splitString: string,
    backContent: string
}
declare interface isOrganization {
    [key: string]: () => void
}

declare interface informData {
    F_CreateDate?: string | null
    F_CreateUserId?: string | null
    F_CreateUserName?: string | null
    F_Description?: string | null
    F_Id: string
    F_MessageType?: string | null
    F_ModifyDate?: string | null
    F_ModifyUserId?: string | null
    F_ModifyUserName?: string | null
    F_SendRole?: string | null
    F_StrategyCode?: string | null
    F_StrategyName?: string | null
    SMSConfigCode?: string | null
    SMSConfigId?: string | null
    SMSConfigId_Text?: string | null
    SendUserCode?: string | null
    SendUserCode_Text?: string | null
}

declare interface adConfig {
    watchFormData: string[],
    otherForm: pointFormData[]
}

declare interface tableData {
    FormName?: string,
    F_Name?: string,
    FormNo?: string,
    F_No?: string,
    ID?: string,
    F_Id?: string,
    formType?: string,
    label?: string,
    value?: string,
    id?: string
}

declare interface authorityTable {
    fieldName: string,
    fieldCode?: string,
    operate?: string[],
    isLook: boolean,
    isNotNull: boolean,
    isRead?: boolean,
    IsHide: string,
    TableId: string,
}
declare type differentData = {
    [key: string]: (val: pointFormData, id?: string) => void
}
declare interface titleConfig {
    selectData: string,
    fixedValue?: string
}
declare interface titleWriteBack {
    fieldSelect: null,
    writeSelect: string
}