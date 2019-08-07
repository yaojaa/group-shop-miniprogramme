import areaData from '../../utils/area'
import Toast from '../../vant/toast/toast';
const util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        source: '',
        default: false,
        areaModal: false,
        areaList: areaData,
        id: '',
        consignee: '',
        mobile: '',
        province: '',
        city: '',
        district: '',
        address: '',
        is_address_default: '',
        address_str:''
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
        let value = event.detail.values
        this.setData({
            province: value[0].name,
            city: value[1].name,
            district: value[2].name,
            areaModal: !this.data.areaModal,
        });
    },
    submit(e) {

        let sendData = e.detail.value

        sendData.province = this.data.province
        sendData.city = this.data.city
        sendData.district = this.data.district
        sendData.address_id = this.data.id

        util.wx.post('/api/user/address_add_or_edit', sendData)
            .then(res => {
                if (res.data.code == 200) {
                    Toast.success(res.data.msg);
                    if (this.data.source == 'cart') {
                        util.setParentData({
                            address_id: res.data.data.address.address_id,
                            address: res.data.data.address
                        })
                    } else {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                } else {
                    Toast(res.data.msg);
                }
            },res =>{
                Toast(res.data.msg);
            })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.setData({
            source: options.source || false,
            id: options.id || ''
        })

        if (options.id) {
            this.getDetail()
            wx.setNavigationBarTitle({
                title: '编辑地址'
            })
        }
    },

    bindTextAreaBlur(e){

        const text= e.detail.value

        if(text==''){
            return
        }


        util.wx.post('/api/index/kuaibao_cloud_address_resolve',{
            text:e.detail.value
        }).then(res=>{
            console.log(res)
            this.setData({
                consignee:res.data.data[0].name,
                mobile:res.data.data[0].mobile,
                province: res.data.data[0].province_name,
                city: res.data.data[0].city_name,
                district: res.data.data[0].county_name,
                address:res.data.data[0].detail
            })
        })


    },

    getDetail() {
        util.wx.get('/api/user/address_detail', { address_id: this.data.id })
            .then(res => {
                if (res.data.code == 200) {
                    let data = res.data.data
                    this.setData({
                        consignee: data.consignee,
                        mobile: data.mobile,
                        province: data.province,
                        city: data.city,
                        district: data.district,
                        address: data.address,
                        is_address_default: data.is_address_default
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
        // wx.getClipboardData({
        //     success(res) {
        //         console.log(res.data)
        //     }
        // })
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