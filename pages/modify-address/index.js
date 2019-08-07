const util = require('../../utils/util.js')
import data from '../../utils/city_data'
import { $wuxToptips } from '../../wux/index'




Page({

  /**
   * 页面的初始数据
   */
   data: {
        consignee:'',
        mobile:'',
        address:'',

    },

  onChange(e) {
      wx.showLoading()

    },
    
    createSubmit(){


      wx.showLoading()
      util.wx.post('/api/seller/seller_edit_order',{

        order_id:this.data.order_id,
        store_intro:this.data.store_intro,
        province :this.data.province,
        city:this.data.city,
        district:this.data.district,
        address:this.data.address,
        consignee:this.data.consignee,
        mobile:this.data.mobile

      }).then(res=>{

      wx.hideLoading()

        if(res.data.code == 200){
           wx.showToast({
          title:'保存成功',
          icon:'none'
        })
         wx.navigateBack()
          
        }

      }).catch(res=>{

          wx.showToast({
          title:res.data.msg,
          icon:'none'
        })

      })

    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.order_id = options.order_id

    this.orderInfo()

  },
  orderInfo:function(){


    util.wx.get('/api/seller/get_order_detail',{
      order_id:this.data.order_id
    }).then(res=>{
      if(res.data.code == 200){
        this.setData({
          consignee:res.data.data[0].consignee,
          mobile:res.data.data[0].mobile,
          province:res.data.data[0].province,
          city:res.data.data[0].city,
          district:res.data.data[0].district,
          address:res.data.data[0].address
        })
      }



    })
  },
       //上传相册
  chooseImage:function(e){

    console.log(e.currentTarget.dataset.type)

    const key = e.currentTarget.dataset.type

      util.uploadPicture({
        successData:(result)=>{

          this.setData({
            [key]:result 
          })

        },
        progressState:(s)=>{
          this.setData({
          photoProgress:s
        })

        }
      })
  },

    //预览图片
  imgPreview: function(event) {
        console.log(event.currentTarget.dataset)
        var src = event.currentTarget.dataset.src; //获取data-src
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    },
    removePhoto(){

        this.setData({
            wx_collection_code:''
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

        //是否显示街道
        this.setData({
          district_id:e.detail.value[2]
        })

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