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
        id: '',
        consignee: '',
        mobile: '',
        province_id: '',
        city_id: '',
        district_id: '',
        address: '',
        is_address_default: '',
        citynames: ''

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
        this.setData({
            province_id: event.detail.values[0].code,
            city_id: event.detail.values[1].code,
            district_id: event.detail.values[2].code,
            citynames: event.detail.values[0].name + '/' + event.detail.values[1].name + '/' + event.detail.values[2].name,
            areaModal: !this.data.areaModal,
        });
    },
    submit(e) {

        let sendData = e.detail.value

        sendData.province_id = this.data.province_id
        sendData.city_id = this.data.city_id
        sendData.district_id = this.data.district_id
        sendData.address_id = this.data.id

        util.wx.post('/api/user/address_add_or_edit', sendData)
            .then(res => {
                if (res.data.code == 200) {
                    Notify({
                        text: res.data.msg,
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
            source: options.source || false,
            id: options.id || ''
        })

        if (options.id) {
            this.isEdit = true
            this.getDetail()
            wx.setNavigationBarTitle({
                title: '编辑地址'
            })
        }
    },

    getDetail(id) {
        util.wx.get('/api/user/address_detail', { address_id: this.data.id })
            .then(res => {
                if (res.data.code == 200) {
                    let data = res.data.data
                    this.setData({
                        consignee: data.consignee,
                        mobile: data.mobile,
                        province_id: data.province_id,
                        city_id: data.city_id,
                        district_id: data.district_id,
                        citynames: data.user_address_prefix,
                        address: data.address,
                        is_address_default: data.user_address_is_address_default
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
        wx.getClipboardData({
            success(res) {
                console.log(res.data)
            }
        })
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