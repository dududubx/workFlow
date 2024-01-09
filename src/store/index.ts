import { defineStore } from "pinia";



export const piniaStore = defineStore('piniaStore', {
    state: () => ({
        informData: <informData[]>[],
        flowCategoryData: <{ label: string, value: string }[]>[]
    }),
    actions: {
        getInfromData(data: informData[]) {
            this.informData = data
        },
        getflowCategory(data: { label: string, value: string }[]) {
            this.flowCategoryData = data
        }
    }
})