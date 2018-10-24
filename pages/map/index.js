const app = getApp()

Page({
  data: {
    limitVal: 1,
    hidden: false,
    step: 1,
    newAddress: [],
    oldAddress: [],
    openLocation: true,
    buyType:2,

  },
  onLoad: function (e) {
    let _this = this;
    // this.openLocation(this);
    this.data.buyType = e.delivery_method;

    wx.getStorage({
      key: 'historyAddress',
      success: function(res) {

        if(res.data.length > 0){
        _this.setData({
          oldAddress: res.data
        })
       }else{
        _this.openLocation(_this);
       }

      },
    })

    console.log('app.globalData.sell_address',app.globalData.sell_address)
  
    //拿app.globalData的地址
    _this.setData({
      newAddress: app.globalData.sell_address || []
    })


  },
  limitChange(e) {
    this.setData({
      hidden: e.detail.value
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
  moveAddress(e){
    let data = e.currentTarget.dataset;
    let _this = this;
    if(this.data.newAddress[0]){
      this.data.oldAddress.unshift(this.data.newAddress[0]);
    }

    this.data.newAddress = this.data.oldAddress.splice(this.getIndex(this.data.oldAddress, data.id), 1);

    _this.setData({
      oldAddress: _this.data.oldAddress,
      newAddress: _this.data.newAddress
    })

    console.log(this.data)

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
    if (!this.data.newAddress[0].door_number && this.data.buyType == 2) {
      wx.showToast({ title: "请填写取货点", icon: "none" })
      return;
    }

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    prevPage.setData({
      sell_address:this.data.newAddress
    })

    wx.navigateBack({
      delta: 1
    })

    wx.setStorage({
              key: "historyAddress",
              data: this.data.newAddress.concat(this.data.oldAddress),
              success() {}
     })



    // console.log(this.data.newAddress,this.data.limitVal)
  },

  openLocation(_this){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          latitude,
          longitude,
          scale: 28,
          success(e){
            if(!e.name || !e.address) return;

            _this.data.oldAddress = _this.data.newAddress.concat(_this.data.oldAddress);

        
            _this.data.newAddress = [{
              id: new Date().getTime(),
              name: e.name,
              address: e.address,
              latitude: e.latitude,
              longitude: e.longitude,
              door_number:''
            }];

            _this.setData({
              newAddress: _this.data.newAddress
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
