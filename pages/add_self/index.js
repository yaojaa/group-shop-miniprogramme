const app = getApp()
const util = require('../../utils/util.js')
let current = [];
Page({
    data: {
        addressData: {
            name: '',
            address: '',
            door_number: '',
            contact_name: '',
            contact_tel: ''
        },
        newAddress: [],
        locationFlag: true

    },
    onLoad: function(opt) {
        let data = app.globalData.sell_address;
        app.globalData.sell_address = null;
        this.data.newAddress = data;
        current = [];
        if(data && data.length > 0 && opt.self_address_id){
            data.forEach((e,i) => {
                if(opt.self_address_id == e.self_address_id){
                    current = [e, i];
                }
            })
            this.setData({
                addressData: current[0]
            })
        }

        console.log(this.data.addressData)

    },
    //完成保存
    save(){
        wx.showLoading()

        if(!this.data.addressData.name){
            wx.showToast({ icon: 'none', title: "请填写自提点名称" })
            return;
        }
        if(!this.data.addressData.address){
            wx.showToast({ icon: 'none', title: "请填写自提点位置" })
            return;
        }
        if(!this.data.addressData.door_number){
            wx.showToast({ icon: 'none', title: "请填写详细地址" })
            return;
        }

        util.wx.post('/api/seller/self_address_add_or_edit',this.data.addressData)
        .then((res)=>{
            wx.hideLoading();

            if(res.data.code != 200) {
               return wx.showModal({
                    title: res.data.msg || '错误',
                    showCancel: false,
                })
            };


            if(this.data.addressData.self_address_id){
                this.data.newAddress[current[1]] = res.data.data.address;    
            }else{
                this.data.newAddress.push(res.data.data.address)
            }
            util.setParentData({
              newAddress: this.data.newAddress
            })
        },(res)=>{
            console.log('提交失败',res)
        })

    },
    addAddress(res) {
        if(!this.data.locationFlag){
            if (res.detail.authSetting['scope.userLocation']) {
                this.setData({
                        locationFlag: true
                })
                this.chooseLocation();
            }
            return;
        }

        this.chooseLocation();

    },
    chooseLocation(){
        wx.showLoading();
        wx.chooseLocation({
            success: (e) => {
                this.getAddress(e);
            },
            fail: (err) => {
                wx.hideLoading()

                if(err.errMsg == 'chooseLocation:fail auth deny'){
                    wx.showToast({ icon: 'none', title: "允许授权后才能添加地址" })
                    this.setData({
                        locationFlag: false
                    })
                }
            }
        })
    },
    getAddress(e){
        wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=FKRBZ-RK4WU-5XMV4-B44DB-D4LOH-G3F73&get_poi=1',
            data: {
                location: e.latitude + ',' + e.longitude
            },
            method: 'get',
            success: (res) => {
                wx.hideLoading()

                let map = res.data.result.address_component

                console.log(map, e,this.data.addressData,e.name)

                if(e.name){
                    this.data.addressData.name = e.name
                }
                if(e.address){
                    this.data.addressData.address = e.address
                    this.data.addressData.province_name = map.province
                    this.data.addressData.district_name = map.district
                    this.data.addressData.city_name = map.city
                    this.data.addressData.latitude = e.latitude
                    this.data.addressData.longitude = e.longitude
                }

                this.setData({
                    addressData: this.data.addressData
                })

            },
            fail: (err) => {
                wx.hideLoading()
                console.log(err)
            }

        })
    },
    phoneInput(e){
        this.data.addressData.contact_tel = e.detail;
    },
    contInput(e){
        this.data.addressData.contact_name = e.detail;
    },
    numberInput(e){
        this.data.addressData.door_number = e.detail;
    },
    addressInput(e){
        this.data.addressData.address = e.detail;
    },
    nameInput(e){
        this.data.addressData.name = e.detail;
    },
})