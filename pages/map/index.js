const app = getApp()
const util = require('../../utils/util.js')

Page({
    data: {
        limitVal: 1,
        hidden: false,
        step: 1,
        newAddress: [],
        oldAddress: [],
        openLocation: true,
        delivery_method: 2,
        userLocation: {}

    },
    onLoad: function(e) {

        //获取用户已经填写的提货点
        var pages = getCurrentPages();

        var prevPage = pages[pages.length - 2]; //上一个页面

        if (prevPage && prevPage.data.sell_address.length) {

            this.setData({
                newAddress: prevPage.data.sell_address
            })

           return //已经有地点 肯定是授权过的不需要验证

        }



        //获取用户授权状态
        wx.getSetting({
            success: (res) => {
                console.log('用户授权状态', res.authSetting["scope.userLocation"])
                if (!res.authSetting["scope.userLocation"]) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: (res) => {
                          console.log('授权地理位置按钮结果',res)
                          this.chooseLocation()
                                  }
                    })

                   


                } else {

                    this.chooseLocation()

                }

            }
        })



        console.log('prevPage.data.sell_address', prevPage.data.sell_address)





    },
    limitChange(e) {
        this.setData({
            hidden: e.detail.value
        })
    },

    handleChange({ detail }) {
        if (detail.value == 1) {
            this.data.step = this.data.step == 1 ? 0.1 : 1;
        }
        this.setData({
            step: this.data.step,
            limitVal: detail.value
        })

    },
    inputAddressDes({ detail }) {
        let val = detail.value.replace(/^(\s*)|(\s*)$/g, "");
        this.data.newAddress[0].door_number = val;

    },
    addAddress() {
        wx.showLoading()

        wx.getSetting({
            success: (res) => {
                console.log('用户授权状态', res.authSetting["scope.userLocation"])
                if (!res.authSetting["scope.userLocation"]) {

                          wx.openSetting({
                          success: (res) => {
                              if (res.authSetting["scope.userLocation"]) {
                                  this.chooseLocation()
                              } else {
                                  wx.showToast({
                                      title: '请允许使用地理位置',
                                      icon: 'none'
                                  })
                              }
                          }
                      })




                }else{
                 this.chooseLocation()
                }
              }
      })



    },
    deleteAddress(e) {
        let data = e.currentTarget.dataset;

        if (data.type == 'old') {
            this.data.oldAddress.splice(this.getIndex(this.data.oldAddress, data.id), 1)
            wx.setStorage({
                key: 'historyAddress',
                data: this.data.newAddress.concat(this.data.oldAddress),
                success: (e) => {
                    wx.showToast({ title: "删除成功" })
                    this.setData({
                        oldAddress: this.data.oldAddress
                    })
                }
            })
        } else {
            this.data.newAddress.splice(this.getIndex(this.data.newAddress, data.id), 1)
            wx.setStorage({
                key: 'historyAddress',
                data: this.data.newAddress.concat(this.data.oldAddress),
                success: (e) => {
                    wx.showToast({ title: "删除成功" })
                    this.setData({
                        newAddress: this.data.newAddress
                    })
                }
            })
        }
    },

    selectAddress(e) {
        let data = e.currentTarget.dataset;
        let address = this.data.newAddress.splice(this.getIndex(this.data.newAddress, data.id), 1)[0];
        // console.log(this.data.newAddress)
        this.data.newAddress.unshift(address);
        wx.showToast({ title: "添加成功" })
        this.setData({
            newAddress: this.data.newAddress
        })

    },
    //完成保存
    done() {
        if (!this.data.newAddress[0]) {
            wx.showToast({ title: "请先添加地址", icon: "none" })
            return;
        }
        if (!this.data.newAddress[0].door_number) {
            wx.showToast({ title: "请填写门牌号", icon: "none" })
            return;
        }

        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面

        prevPage.data.sell_address = this.data.newAddress


        wx.navigateBack({
            delta: 1
        })

    },

    chooseLocation() {

        wx.chooseLocation({
            success: (e) => {
                console.log(e)
                if (!e.name || !e.address) return;
                wx.request({
                    url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=FKRBZ-RK4WU-5XMV4-B44DB-D4LOH-G3F73&get_poi=1',
                    data: {
                        location: e.latitude + ',' + e.longitude
                    },
                    method: 'get',
                    success: (res) => {
                        wx.hideLoading()

                        let map = res.data.result.address_component
                        this.data.oldAddress = this.data.newAddress.concat(this.data.oldAddress);

                        this.data.newAddress.push({
                            name: e.name,
                            address: e.address,
                            province_name: map.province,
                            district_name: map.district,
                            city_name: map.city,
                            latitude: e.latitude,
                            longitude: e.longitude,
                            door_number: ''
                        });

                        this.setData({
                            newAddress: this.data.newAddress
                        })

                        app.globalData.sell_address = this.data.newAddress

                        console.log('this.data.newAddress', this.data.newAddress)



                    },
                    fail: (err) => {
                        console.log(err)
                    }

                })
            }
        })


    },

    openLocation() {

        wx.openSetting({
            success: (res) => {
                if (res.authSetting["scope.userLocation"]) {

                    this.openLocation()
                } else {
                    wx.showToast({
                        title: '请允许使用地理位置',
                        icon: 'none'
                    })
                }
            }
        })

    },

    openSet(e) {
        console.log(e)
        if (e.detail.authSetting['scope.userLocation']) {
            this.openLocation(this);
            this.setData({
                openLocation: true
            })
        } else {
            wx.showToast({ icon: 'none', title: "允许授权后才能添加地址" })
            this.setData({
                openLocation: false
            })
        }
    },

    getIndex(arr, id) {
        let index = 0;
        arr.forEach((e, i) => {
            if (e.id == id) {
                index = i;
            }
        })
        return index;
    }









})