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
   bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  onChange(e) {
        console.log('onChange', e)
        const { file } = e.detail
        // if (file.status === 'uploading') {
        //     this.setData({
        //         progress: 0,
        //     })
        //     wx.showLoading()
        // } else if (file.status === 'done') {
        //     this.setData({
        //         imageUrl: file.url,
        //     })
        // }
    },
    onSuccess(e,l) {
        console.log('onSuccess图片上传成功',e,l)

        this.data.store_slide.push(e.detail.url)


    },
    onFail(e) {
        console.log('onFail', e)
    },
    onComplete(e) {
        wx.hideLoading()
    },
    onProgress(e) {
        console.log('onProgress', e)
        this.setData({
            progress: e.detail.file.progress,
        })
    },
    onPreview(e) {
        console.log('onPreview', e)
        const { file, fileList } = e.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },
    onRemove(e) {
        const { file, fileList } = e.detail
        wx.showModal({
            content: '确定删除？',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        fileList: fileList.filter((n) => n.uid !== file.uid),
                    })
                }
            },
        })
    },
    add(){

      wx.navigateTo({
        url:'../wxgroup_add/index'
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showDetail(){

    this.setData({
      visible1:true
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