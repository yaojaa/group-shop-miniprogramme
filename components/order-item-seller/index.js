// components/order-panel/index.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
            value: ''
        },
        total: {
            type: Boolean,
            value: true
        }
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的初始数据
     */
    data: {
        store_id:app.globalData.userInfo ? app.globalData.userInfo.store_id : ''

    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})