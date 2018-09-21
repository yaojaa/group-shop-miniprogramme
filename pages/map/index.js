const app = getApp()

Page({
  data: {
    limitVal: 1,
    hidden: false,
    step: 1,
    location: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTM2ODk2NDM1MjY0IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4OTYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMiAxMjhhMjU2IDI1NiAwIDAgMC0yNTYgMjU2YzAgMTIzLjUyIDk3LjkyIDI3NS44NCAyMDggNDgzLjg0YTU1LjA0IDU1LjA0IDAgMCAwIDk2IDBDNjcwLjA4IDY1OS44NCA3NjggNTA3LjUyIDc2OCAzODRhMjU2IDI1NiAwIDAgMC0yNTYtMjU2eiBtMCAzODRhMTI4IDEyOCAwIDEgMSAxMjgtMTI4IDEyOCAxMjggMCAwIDEtMTI4IDEyOHoiIGZpbGw9IiMwMDYxYjIiIHAtaWQ9IjE4OTciPjwvcGF0aD48L3N2Zz4=",
    newAddress: [],
    oldAddress: [],
    openLocation: true,

  },
  onLoad: function () {
    let _this = this;
    // this.openLocation(this);
    // 
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
    this.data.newAddress.unshift(this.data.oldAddress.splice(this.getIndex(this.data.oldAddress, data.id), 1)[0]); //删除历史纪录展示并加入新地址
    wx.showToast({ title: "添加成功" })
    _this.setData({
      oldAddress: _this.data.oldAddress,
      newAddress: _this.data.newAddress
    })

  },

  submit(){
    wx.navigateBack({
      delta: 1
    })

    app.globalData.sell_address = this.data.newAddress

    // console.log(this.data.newAddress,this.data.limitVal)
  },

  openLocation(_this){
    console.log('aaaa')
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

            _this.data.newAddress.unshift({
              id: new Date().getTime(),
              name: e.name,
              address: e.address,
              latitude: e.latitude,
              longitude: e.longitude
            })
            _this.setData({
              newAddress: _this.data.newAddress
            })

            wx.setStorage({
              key: "historyAddress",
              data: _this.data.newAddress.concat(_this.data.oldAddress),
              success() {}
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
      this.openLocation();
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
