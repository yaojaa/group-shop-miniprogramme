import areaData from '../../utils/area'
import Notify from '../../vant/notify/notify'
const util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        source: '',
        default: false,
        areaModal: false,
        areaList: [],
        areaValue: '',
        consignee: '',
        mobile: '',
        path: '',
        address: '',
        is_default: '',
        province: '',
        city: '',
        district: ''

    },
    addressDefault(event) {

        this.setData({
            is_default: event.detail ? 1 : 0
        });

    },
    handleAreaModal() {
        this.setData({
            areaModal: !this.data.areaModal
        });

    },
    handleArea(event) {
        let area = event.detail.values[2].code
        console.log(event.detail)
        console.log(area)
        this.setData({
            path: area,
            city: event.detail.values[0].name + '/' + event.detail.values[1].name + '/' + event.detail.values[2].name,
            areaModal: !this.data.areaModal,

        });
    },
    submit() {
        // /api/front/address/create 
        const apiURL = this.isEdit ? '/api/user/edit_address' : '/api/user/edit_address'
        const msg = this.isEdit ? '编辑成功' : '添加成功'

        var data = {
            consignee: this.data.consignee,
            mobile: this.data.mobile,
            province: '',
            city: '',
            district: '',
            address: this.data.address,
            is_default: this.data.is_default,

        }

        if (this.isEdit) {
            Object.assign(data, { id: this.id })
        }
        util.wx.post(apiURL, data)
            .then(res => {
                if (res.data.code == 0) {
                    Notify({
                        text: msg,
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#39b54a'
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    Notify({
                        text: res.data.msg,
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#f00'
                    })

                }
            })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.setData({
            areaList: areaData,
            source: options.source || false
        })

        if (options.id) {
            this.id = options.id
            this.isEdit = true
            this.getDetail(options.id)
            wx.setNavigationBarTitle({
                title: '编辑地址'
            })
        }
    },

    getDetail(id) {
        util.wx.get('/api/front/address/info', { id })
            .then(res => {
                if (res.data.code == 0) {
                    this.setData({
                        consignee: res.data.data.user_address_consignee,
                        mobile: res.data.data.user_address_mobile,
                        path: res.data.data.user_address_path,
                        address: res.data.data.user_address_area,
                        city: res.data.data.user_address_prefix,
                        is_default: res.data.data.user_address_is_default
                    })
                }
            })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    inputDuplex: util.inputDuplex
})