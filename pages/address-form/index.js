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
        is_address_default: '',
        city: '',

    },
    addressDefault(event) {

        this.setData({
            is_address_default: event.detail ? 1 : 0
        });

    },
    handleAreaModal() {
        this.setData({
            areaModal: !this.data.areaModal
        });

    },
    handleArea(event) {
        let area = event.detail.values.map(function(index, elem) {
            return index.code;
        })
        console.log(area)
        this.setData({
            path: area,
            city: event.detail.values[0].name + '/' + event.detail.values[1].name + '/' + event.detail.values[2].name,
            areaModal: !this.data.areaModal,

        });
    },
    submit(e) {
        const apiURL = this.isEdit ? '/api/user/address_add_or_edit' : '/api/user/address_add_or_edit'
        const msg = this.isEdit ? '编辑成功' : '添加成功';
        let sendData = e.detail.value

        sendData.province_id = this.data.path[0]
        sendData.city_id = this.data.path[1]
        sendData.district_id = this.data.path[2]
        if (this.isEdit) {
            Object.assign(data, { id: this.id })
        };
        console.log(sendData)
        util.wx.post(apiURL, sendData)
            .then(res => {
                if (res.data.code == 200) {
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
        util.wx.get('/api/user/address_add_or_edit', { id })
            .then(res => {
                if (res.data.code == 200) {
                    this.setData({
                        consignee: res.data.data.consignee,
                        mobile: res.data.data.mobile,
                        province_id: res.data.data.province_id,
                        city_id: res.data.data.city_id,
                        district_id: res.data.data.district_id,
                        address:res.data.data.address,
                        is_address_default: res.data.data.user_address_is_address_default
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

    }
})