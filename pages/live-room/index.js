const util = require('../../utils/util.js')
import data from '../../utils/city_data'
import { $wuxToptips } from '../../wux/index'




Page({

  /**
   * 页面的初始数据
   */
   data: {
        groups:[
        {
          title:'金鱼团团群',
          des:'金域东郡业主团购群,加群需要认证业主',
          master:'yaojaa'
        },
                {
          title:'运河湾美食群',
          des:'经常分享好美食聚划算，加群需要认证业主',
          master:'yaojaa'
        }

        ]
    },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getRoomList()

  },
  toRoom(e){


    const roomId = e.currentTarget.dataset.id

    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    })

  },
  getRoomList(){

    util.wx.get('/api/live/room_list').then(res=>{

      if(res.data.code == 200){
        this.setData({
          roomList:res.data.data
        })
      }


    })

  },
  handleClose2(){

    this.setData({
      visible1:false
    })
  },

    handleClose1(){

    this.setData({
      visible1:false
    })

  wx.setClipboardData({
  data: 'data',
  success(res) {
    wx.getClipboardData({
      success(res) {
        console.log(res.data) // data
      }
    })
    wx.showToast({
      title:'复制成功'
    })
  }
})


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

  },
  onOpen1() {
        this.setData({ visible1: true })
    },
    onClose1() {
        this.setData({ visible1: false })
    },
    //地区切换
    onChange1(e) {
        this.setData({ title1: e.detail.options.map((n) => n.label).join('/') })
        console.log('onChange1', e.detail, e.detail.options.map((n) => n.label).join('/'))

        if(e.detail.done){

        this.data.province_id = e.detail.value[0],
        this.data.city_id  = e.detail.value[1],
        this.data.district_id = e.detail.value[2]

        console.log(this.data.province_id,this.data.city_id,this.data.district_id)

        }

    },
    onOpen2() {
        this.setData({ visible2: true })
    },
    onClose2() {
        this.setData({ visible2: false })
    },
    onChange2(e) {
        console.log('onChange2', e.detail)
        this.setData({ value2: e.detail.value, title2: e.detail.done && e.detail.options.map((n) => n.label).join('/') })
    },
    onLoadOptions(e) {
        console.log('onLoadOptions', e.detail)
        const { value } = e.detail
        const options2 = [...this.data.options2]

        wx.showLoading({ mask: true })

        setTimeout(() => {
            if (value[value.length - 1] === 'beijing') {
                options2.forEach((n) => {
                    if (n.value === 'beijing') {
                        n.children = [
                            {
                                value: 'baidu',
                                label: '百度'
                            },
                            {
                                value: 'sina',
                                label: '新浪'
                            },
                        ]
                    }
                })
            } else if (value[value.length - 1] === 'hangzhou') {
                options2.forEach((n) => {
                    if (n.value === 'hangzhou') {
                        n.children = [
                            {
                                value: 'ali',
                                label: '阿里巴巴'
                            },
                            {
                                value: '163',
                                label: '网易'
                            },
                        ]
                    }
                })
            }

            wx.hideLoading()

            this.setData({ value2: value, options2 })
        }, 1000)
    },
    inputDuplex:util.inputDuplex
})