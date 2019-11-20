const app = getApp()
const util = require('../../utils/util')
Page({
    data: {

        radio: '1'
    },
    onChange(event) {
        this.setData({
            radio: event.detail
        });
    },
    onLoad: function(options) {

    }
})