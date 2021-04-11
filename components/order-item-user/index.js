// components/order-panel/index.js
const util = require('../../utils/util')

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
        },
        user: {
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

    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})