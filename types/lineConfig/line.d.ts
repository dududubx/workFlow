declare interface lineForm{
    name:string,
    color: string,
    lineStrategy:string,
    advanceData: advancedForm
}

declare interface advancedForm{
    category:string,
    database:string,
    agreeSQL:string,
    disagreeSQL?:string,
    agreePort:string,
    disagreePort?:string
}