const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId:'',
    customParams:''
  },
  async getLivePageList(){
    let res = await util.wx
    .get('/api/seller/get_rooms')
    console.warn(res.data.data)
  },
  async creatLivePlayer(){
    const params = {
      name: "测试直播房间1",  // 房间名字
      coverImg: "",   // 通过 uploadfile 上传，填写 mediaID
      startTime: 1588237130,   // 开始时间
      endTime: 1588237130 , // 结束时间
      anchorName: "zefzhang1",  // 主播昵称
      anchorWechat: "WxgQiao_04",  // 主播微信号
      subAnchorWechat: "WxgQiao_03",  // 主播副号微信号
      createrWechat: 'test_creater', // 创建者微信号
      shareImg: "hw7zsntcr0rE-RBfBAaF553DqBk-J02UtWsP8VqrUh3tKu3jO_JwEO8n1cWTJ5TN" ,  //通过 uploadfile 上传，填写 mediaID
      feedsImg: "hw7zsntcr0rE-RBfBAaF553DqBk-J02UtWsP8VqrUh3tKu3jO_JwEO8n1cWTJ5TN",   //通过 uploadfile 上传，填写 mediaID
      isFeedsPublic: 1, // 是否开启官方收录，1 开启，0 关闭
      type: 1 , // 直播类型，1 推流 0 手机直播
      closeLike: 0 , // 是否关闭点赞 1：关闭
      closeGoods: 0, // 是否关闭商品货架，1：关闭
      closeComment: 0 
    }
    let res = await util.wx
    .post('/api/seller/room_add',params)
  },
  async uploadImg(){
    wx.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${app.globalData.token}&type=TYPE'`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success (res){
            const data = res.data
            //do something
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLivePageList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})