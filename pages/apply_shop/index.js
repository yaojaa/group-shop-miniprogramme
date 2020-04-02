const util = require('../../utils/util.js')
import { $wuxToptips } from '../../wux/index'

    const app = getApp()



Page({

  /**
   * 页面的初始数据
   */
   data: {
        store_name:'',
        store_intro:'',
        address:'',
        // options1: data,
        title1:'点击选择',
        value2: [],
        store_slide:'https://static.kaixinmatuan.cn/c4ca4238a0b923820dcc509a6f75849b20190702115152593.jpg?imageView2/1/w/600/h/400/interlace/1',
        district_id:'',
        btn_txt:'保存',
    },
   bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  onChange(e) {
      wx.showLoading()

    },
    onSuccess(e,l) {
        const data = JSON.parse(e.detail)
        this.setData({
          store_slide:data.data.file_url
        })
    },
    onFail(e) {
        console.log('onFail', e)
    },
    onComplete(e) {
        wx.hideLoading()
    },
    onProgress(e) {
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


    createSubmit(){




      if(this.data.store_name == ''){

         $wuxToptips().error({
            hidden: false,
            text: '请填写主页名称',
            duration: 3000,
            success() {
              
            },
        })
        return


      }

      wx.showLoading()
      util.wx.post('/api//user/store_apply',{

        store_name:this.data.store_name,
        store_intro:this.data.store_intro,
        realname:this.data.realname,
        mobile:this.data.mobile,
        wechatnumber:this.data.wechatnumber,
        // province_id :this.data.province_id,
        // city_id:this.data.city_id,
        // district_id:this.data.district_id,
        store_slide:[this.data.store_slide]
        // address:this.data.address

      }).then(res=>{


        // {"code":200,"status":true,"msg":"\u7533\u8bf7\u5e97\u94fa\u6210\u529f!","data":{"user":{"user_id":6208,"mobile":"13718134512","password":"","sex":0,"birthday":0,"last_login":1585815409,"last_ip":"1.203.64.234","openid":"ozsQE5sToqqYU2Zg5UVB6Tt7dLR0","headimg":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Z4or6q15Wic6mOUuhOszvVib9KCibSfm6zx8D2prCPj4SYaXF7qpCud64NAZP8I0CDIJOEaVlCU5Tf3t1icVaZLruA\/132","realname":"\u8981\u52a0","idcard":null,"nickname":"\u516d\u8def\u98ce\u7269\ud83c\uddeb\u00a0\ud83c\udde8\u00a0\ud83c\uddfd","enable":1,"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNjIwOCIsImZvcm0iOiJrYWl4aW5tYXR1YW4uY24ifQ.KnfW-YDUTa_uRyvZ4voGMEHTf3KunyHkWzgv-acmO0A","addtime":1585815409,"updatetime":1585815409,"wechatnumber":"yaojaa3434","from_user_id":0,"wx_paycode":null},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNjIwOCIsImZvcm0iOiJrYWl4aW5tYXR1YW4uY24ifQ.KnfW-YDUTa_uRyvZ4voGMEHTf3KunyHkWzgv-acmO0A","store":{"store_id":6858,"store_name":"\u516d\u8def\u98ce\u7269\u7684\u4e3b\u9875","user_id":6208,"store_status":2,"store_self":2,"province_id":0,"city_id":0,"district_id":0,"address":"","longitude":"0.0000000","latitude":"0.0000000","store_logo":null,"store_slide":"[\"https:\\\/\\\/static.kaixinmatuan.cn\\\/c4ca4238a0b923820dcc509a6f75849b20190702115152593.jpg?imageView2\\\/1\\\/w\\\/600\\\/h\\\/400\\\/interlace\\\/1\"]","store_intro":"","store_zy":null,"store_desccredit":"0.00","store_servicecredit":"0.00","store_deliverycredit":"0.00","store_collect":0,"store_money":"0.00","pending_money":"0.00","withdraw_fee":"0.00","addtime":1585815450,"updatetime":1585815450,"store_audit_desc":null,"audit_time":0},"supplier":null}}
  console.log(res,res.data.code)
      wx.hideLoading()
        const d = res.data.data

        if(res.data.code == 200){
           wx.showToast({
          title:'创建成功',
          icon:'none'
        })


        this.setStorage(d)


           



          
        }else{

            
           wx.showToast({
            title:res.data.msg,
            icon:"none"
          })

           this.setStorage(d)


        }

      }).catch(res=>{


      })

    },

  setStorage(d){

     app.globalData.userInfo = d
         
            wx.setStorage({ //存储到本地
                key: "userInfo",
                data: d,
                success:function(){
                  wx.redirectTo({
                    url:'../home/index'
                  })
                }
            })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      store_name:app.globalData.userInfo.nickname+'的主页'
    })

  },
  getInfo:function(){


    util.wx.get('/api/seller/get_store_info').then(res=>{
      if(res.data.code !== 200){
        this.setData({
          info:res.data.data,
          store_name:res.data.data.store_name,
          store_intro:res.data.data.store_intro,
          store_slide:res.data.data.store_slide,
          postURl:'/api/seller/store_set'
        })
      }else{

         this.setData({
            btn_txt:'立即创建',
            postURl:'/api/user/store_apply'
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