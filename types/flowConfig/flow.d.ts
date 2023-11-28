declare interface RuleForm {
    name: string,
    code: string,
    category: string,
    platform: any[],
    validateForm: boolean,
    canagent: boolean,
    remark?: string
}
declare interface OpearteForm {
    opearteCate: string,
    dataBase: string,
    agreeSQL: string,
    disagreeSQL: string,
    agreePort: string,
    disagreePort: string
}