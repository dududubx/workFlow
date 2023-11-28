declare interface conditionData {
    name: string,
    conditionFormData: conditionFormData[],
    formType: string,
    tableCode: string,
    formCode: string
}

declare interface conditionFormData {
    pattern: boolean,
    databaseTable: string,
    primaryKeyField: string,
    compareField: string,
    compareType: string,
    dataValue: string,
    rowsData: {
        name?: string,
        tdescription?: string
    },
    compareFieldData: { label: string, value: string }[],

}