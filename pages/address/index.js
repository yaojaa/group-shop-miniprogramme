const util = require('../../utils/util')
import Toast from '../../vant/toast/toast'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    disabled: false,
    checked: false,
    source: '',
    address: [],
    selected: '', //选中的
    cpage: 1,
    totalpage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      source: options.source || false,
      selected: options.id || '',
    })
    if (this.data.source == 'cart') {
      this.setData({
        disabled: true,
      })
    }
  },

  setSelected(e) {
    console.log(e)
    if (!this.data.source) {
      return
    }
    const { id, item } = e.currentTarget.dataset
    this.setData({
      selected: id,
    })
    util.setParentData({
      address_id: id,
      address: item,
    })
  },

  remove(e) {
    const address = wx.getStorageSync('userAddress') || {}
    let { id, add } = e.currentTarget.dataset
    wx.showModal({
      title: '删除地址',
      content: '确定要删除该收货地址？',
      showCancel: true, //是否显示取消按钮
      cancelText: '取消', //默认是“取消”
      confirmText: '确定', //默认是“确定”
      success: (res) => {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          util.wx
            .post('/api/user/address_del', { address_id: id })
            .then((res) => {
              if (res.data.code == 200) {
                Toast.success('删除成功')
                if (add.address_id == address.address_id) {
                  wx.removeStorageSync('userAddress')
                }
                this.getAddress()
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                })
              }
            })
        }
      },
    })
  },

  getAddress() {
    this.setData({
      loading: true,
    })
    util.wx.get('/api/user/address_list').then(
      (res) => {
        var data = res.data
        if (data.code == 200) {
          this.setData({
            address: data.data.address_list,
            totalpage: data.data.page.totalpage,
            cpage: 1,
            loading: false,
          })
        }
      },
      (res) => {
        this.setData({
          loading: false,
        })
      }
    )
  },
  addAddress(data) {
    let that = this
    util.wx.post('/api/user/address_add_or_edit', data).then((res) => {
      if (res.data.code == 200) {
        if (that.data.source == 'cart') {
          util.setParentData({
            address_id: res.data.data.address.address_id,
            address: res.data.data.address,
          })
        } else {
          that.getAddress()
        }
      } else {
        Toast.fail(res.data.msg)
      }
    })
  },
  openAddress() {
    let that = this
    wx.chooseAddress({
      success(res) {
        let sendData = {
          consignee: res.userName,
          mobile: res.telNumber,
          province: res.provinceName,
          city: res.cityName,
          district: res.countyName,
          address: res.detailInfo,
        }
        that.addAddress(sendData)
      },
      fail() {
        wx.showToast({
          title: '获取失败',
          icon: 'none',
        })
      },
    })
  },
  newAddress() {
    if (this.data.source == 'cart') {
      wx.redirectTo({
        url: '../address-form/index?source=cart',
      })
    } else {
      wx.navigateTo({
        url: '../address-form/index',
      })
    }
  },
  editAddress(e) {
    let { id } = e.currentTarget.dataset
    if (this.data.source == 'cart') {
      wx.redirectTo({
        url: '../address-form/index?source=cart&id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '../address-form/index?id=' + id,
      })
    }
  },
  getConcatData() {
    this.setData({
      loading: true,
    })
    return util.wx
      .get('/api/user/address_list', {
        cpage: this.data.cpage,
      })
      .then((res) => {
        var data = res.data
        if (data.code == 200) {
          this.setData({
            address: this.data.address.concat(data.data.address_list),
            loading: false,
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddress()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('bottom')
    if (this.data.cpage && !this.data.loading) {
      this.setData({
        cpage: ++this.data.cpage,
      })
      if (this.data.cpage > this.data.totalpage) {
        return
      }
      this.getConcatData().then(() => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
    }
  },
})
