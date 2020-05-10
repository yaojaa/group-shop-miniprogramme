const util = require('../../utils/util')

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    name: '',
    user_count: 0,
    total: 0,
    type: 'goods_detail',
    pullDownOpt: {
      loading: false,
      pagesize: 15,
      cpage: 1,
      total: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.id = options.id
    this.setData({
      name: options.name,
      type: options.source || this.data.type
    })
    this.getDataList()
  },

  getDataList() {
    let data = {
      obj_id: this.id,
      type: this.data.type,
      cpage: this.data.pullDownOpt.cpage,
      pagesize: this.data.pullDownOpt.pagesize
    }

    wx.showLoading()
    util.wx.get('/api/index/get_access_record', data).then((res) => {
          wx.hideLoading()

      if (res.data.code == 200) {

        res.data.data.access_list.forEach((e) => {
          e.user_staytime = this.fTime(e.user_staytime)
        })

        if (this.data.list[0]) {
          let i = this.data.list.length
          this.data.list.push(res.data.data.access_list)


          this.setData({
            ['list[' + i + ']']: this.data.list[i]
          })
        } else {
          this.data.list[0] = res.data.data.access_list

          this.setData({
            list: this.data.list,
            access_count: res.data.data.access_count,
            user_count: res.data.data.user_count
          })
          wx.setNavigationBarTitle({
            title:
              '访问记录 有' +
              this.data.user_count +
              '人' +
              this.data.access_count +
              '次访问'
          })
        }
      }
    })
  },

  fTime(t) {
    let h = 0,
      m = 0,
      mm = 0
    if (t && t > 0) {
      t = Math.ceil(t / 1000)
      h = parseInt(t / 60 / 60)
      m = parseInt((t % 3600) / 60)
      mm = parseInt(t % 60)
    }
    if (h > 0) {
      return h + '小时' + m + '分' + mm + '秒'
    } else if (m > 0) {
      return m + '分' + mm + '秒'
    } else {
      return mm > 0 ? mm + '秒' : '1秒'
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading()
    this.getDataList()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading()
    // 停止下拉动作
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDataList(++this.data.pullDownOpt.cpage)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
