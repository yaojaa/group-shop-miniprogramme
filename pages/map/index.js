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
    delivery_method:2,
    userLocation:{}

  },
  onLoad: function (e) {
    let _this = this;
    // this.openLocation(this);
    this.setData({
      delivery_method:e.delivery_method
    })


        //拿app.globalData的地址
        //
    if(e.delivery_method ==2){


    if(app.globalData.sell_address && app.globalData.sell_address.length){
      _this.setData({
        newAddress: app.globalData.sell_address
      })
    }

    }



//获取用户授权状态
    wx.getSetting({
      success:(res)=> {
      if(!res.authSetting["scope.userLocation"]){

        wx.authorize({
        scope: 'scope.userLocation',
        success: (res)=> {
            util.getUserloaction().then((res)=>{
              this.setData({
                userLocation:res
              })
            })
        }
        })
      }else{
            util.getUserloaction().then((res)=>{

              this.setData({
                userLocation:res
              })
              
            })
      }

      }
    })



  },
  limitChange(e) {
    this.setData({
      hidden: e.detail.value
    })
  },
  //选择快递方式
  noAddress(){
    

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面


    prevPage.setData({
      sell_address:[{
        name:'快递邮寄',
        door_number:'送货上门',
        address:this.data.userLocation.street_number,
        city_name:this.data.userLocation.city,
        province_name:this.data.userLocation.province,
        district_name:this.data.userLocation.district,
        latitude:this.data.userLocation.latitude,
        longitude:this.data.userLocation.longitude

      }],
      delivery_method:1
    })

    wx.navigateBack({
      delta: 1
    })


  },
  handleChange({ detail }) {
    if(detail.value == 1){
      this.data.step = this.data.step == 1 ? 0.1 : 1;
    }
    this.setData({
      step: this.data.step,
      limitVal: detail.value
    })
    
  },
  inputAddressDes({ detail }){
    let val = detail.value.replace(/^(\s*)|(\s*)$/g, "");
    this.data.newAddress[0].door_number = val;

  },
  addAddress(){
    this.openLocation(this);
        console.log(this.openLocation)

  },
  deleteAddress(e){
    let data = e.currentTarget.dataset;
    let _this = this;

    if(data.type == 'old'){
      this.data.oldAddress.splice(this.getIndex(this.data.oldAddress, data.id), 1)
      wx.setStorage({
        key: 'historyAddress',
        data: _this.data.newAddress.concat(_this.data.oldAddress),
        success(e) {
          wx.showToast({ title: "删除成功" })
          _this.setData({
            oldAddress: _this.data.oldAddress
          })
        }
      })
    } else {
      this.data.newAddress.splice(this.getIndex(this.data.newAddress, data.id), 1)
      wx.setStorage({
        key: 'historyAddress',
        data: _this.data.newAddress.concat(_this.data.oldAddress),
        success(e) {
          wx.showToast({ title: "删除成功" })
          _this.setData({
            newAddress: _this.data.newAddress
          })
        }
      })
    }
  },

  selectAddress(e){
    let data = e.currentTarget.dataset;
    let _this = this;
    let address = this.data.newAddress.splice(this.getIndex(this.data.newAddress, data.id), 1)[0];
    // console.log(this.data.newAddress)
    this.data.newAddress.unshift(address);
    wx.showToast({ title: "添加成功" })
    _this.setData({
      newAddress: _this.data.newAddress
    })

  },

  submit() {
    if (!this.data.newAddress[0]) {
      wx.showToast({ title: "请先添加地址", icon: "none" })
      return;
    }
    if (!this.data.newAddress[0].door_number ) {
      wx.showToast({ title: "请填写门牌号", icon: "none" })
      return;
    }

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    prevPage.setData({
      sell_address:this.data.newAddress,
      delivery_method:2
    })

    wx.navigateBack({
      delta: 1
    })

  },

  openLocation(_this){
    console.log('openLocation')
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          latitude,
          longitude,
          scale: 28,
          success(e){
            console.log(e)
            if(!e.name || !e.address) return;


             wx.request({
            url:'https://apis.map.qq.com/ws/geocoder/v1/?key=FKRBZ-RK4WU-5XMV4-B44DB-D4LOH-G3F73&get_poi=1',
            data:{
              location:e.latitude+','+e.longitude
            },
            method:'get',
            success:(res)=>{
              console.log(res)
              let map =res.data.result.address_component
            _this.data.oldAddress = _this.data.newAddress.concat(_this.data.oldAddress);

            _this.data.newAddress = [{
              name: e.name,
              address: e.address,
              province_name: map.province,
              district_name:map.district,
              city_name:map.city,
              latitude: e.latitude,
              longitude: e.longitude,
              door_number:''
            }];

            _this.setData({
              newAddress: _this.data.newAddress
            })

            app.globalData.sell_address = _this.data.newAddress

            console.log('_this.data.newAddress',_this.data.newAddress)



            },
            fail:(err)=>{
             console.log(err)
            }

          })






          }
        })
      },
      fail(e){
        wx.showToast({ icon:'none', title: "允许授权后才能添加地址" })
        _this.setData({
          openLocation: false
        })
      }
    })
  },

  openSet(e){
    console.log(e)
    if(e.detail.authSetting['scope.userLocation']){
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

  getIndex(arr, id){
    let index = 0;
    arr.forEach((e, i) => {
      if(e.id == id){
        index = i;
      }
    })
    return index;
  }









})
