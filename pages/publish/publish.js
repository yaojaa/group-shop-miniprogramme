//index.js
//
//
//
//获取应用实例
var WxValidate = require('../../utils/wxValidate.js')

const app = getApp()

const util = require('../../utils/util.js')

const date = new Date()
date.setHours(0)
date.setMinutes(0)
date.setSeconds(0)

const default_start_time = util.formatTime(date)
date.setDate(date.getDate() + 30)
const default_end_time = util.formatTime(date)

Page({
  data: {
    height: '300', //文本框的高度
    // previewImgs: {
    //     current: "",
    //     urls: [],
    // },
    // previewImgHidden: true,
    link_url: '',
    goods_id: '',
    isShowTimePicker: false,
    goods_images: [],
    content_imgs: [],
    delivery_method: 0, //配送方式配送方式 1:送货 2:自提',
    sell_address: [],
    isGave: 0,
    address: 0,
    deliver: true,
    morePic: false,
    photoProgress: false,
    uploadProgress: false, //介绍图loading
    start_time: default_start_time,
    end_time: default_end_time,
    goods_video: '',
    goods_video_cover: '',
    picker: {
      start_date: default_start_time.split(' ')[0],
      end_date: default_end_time.split(' ')[0],
      start_time: '00:00:00',
      end_time: '00:00:00',
    },
    spec: [
      {
        spec_name: '',
        spec_price: '',
        sub_agent_price:0.00,
        spec_stock: '',
        spec_pic: [],
        spec_desc: '',
      },
    ],
    payment_method: 0, //0:线上微信支付,1:线下支付'
    visible1: false,
    visible2: false,
    type: 'photo', //上传图片或视频
    actions1: [
      {
        name: '微信支付即时收款',
      },
      {
        name: '线下收款 只统计报名 ',
      },
    ],
    actions2: [
      {
        name: '快递邮寄',
      },
      {
        name: '用户自提',
      },
    ],

    content_imgs_length: '',
    visible_pictures: false, //上传图片弹层是否显示
    visible_video: false,
    visible_spec: false, //规格图
    current_spec_index: 0,
    current_spec_imgs: [],
    displayTextArea: 'block',
    video_progress: false,
    // darg
    size: 5,
    freight_tpl_id: 0, //运费模版ID 默认0
    freight_tpl_name: '默认方案全国包邮', //运费模版ID 默认0
    editorContent: null,
    isEmptyEditor: true,
    specItem: '',
    agent_opt :0,//'是否可以代理:0否;1是',
    show_buyerlist:0,
    is_timelimit: 0,
  },
  // darg start5
  // 改变监听
  change(e) {
    this.data.goods_images = e.detail.listData

    this.data.goods_images.forEach((e, i) => {
      e.img_sort = i
      e.is_cover = i == 0 ? 1 : 0
    })

    // console.log(this.data.goods_images)
  },
  // 点击图片
  itemClick(e) {
    let urls = []

    this.data.goods_images.forEach((e) => {
      urls.push(e.img_url)
    })

    // this.setData({
    //     previewImgs: {
    //         current: e.detail.newKey,
    //         urls: urls
    //     },
    //     previewImgHidden: false
    // })

    wx.previewImage({
      current: urls[e.detail.newKey], // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    })
  },
  goEditor() {
    let _this = this
    if(this.data.isEmptyEditor && (this.data.content_imgs.length > 0 || this.data.currentInput)){
      wx.showModal({
        title: '温馨提示',
        content: '图文编辑模式将替换原有内容描述，两者不能同时使用',
        success (res) {
          if (res.confirm) {
            _this.jumpEditor();
          }
        }
      })
    }else{
      wx.setStorage({
        key: 'editorContent',
        data: _this.data.editorContent,
        success() {
          _this.jumpEditor();
        },
      })
    }
  },
  jumpEditor(){
    wx.navigateTo({
      url: '../editor/editor',
    })
  },
  toPostageSetting() {
    wx.navigateTo({
      url:
        '/business/pages/postageSetting/index?hasSelect=' +
        this.data.freight_tpl_id,
    })
  },
  toHelpSetting() {

    if(this.data.goods_name == '' || this.data.goods_images.length ==0 || this.data.spec[0].spec_name=='' || this.data.spec[0].spec_price==''){

      return wx.showToast({
        title:'请先填写完整',
        icon:'none'
      })

    }

    app.globalData.helpSaleData ={
      goods_name:this.data.goods_name,
      goods_cover:this.data.goods_images[0].img_url,
      goods_spec:this.data.spec
    }


    wx.navigateTo({
      url:'../help-sale-setting/index',
    })
  },
  // 删除图片
  deleteClick(e) {
    this.removePhoto(e)
  },
  //删除一张照片
  removePhoto: function (e) {
    let index = e.currentTarget.dataset.index || e.detail.newKey
    this.data.goods_images.splice(index, 1)
    if (this.data.goods_images.length) {
      this.data.goods_images[0].is_cover = 1
    }

    this.setData({
      goods_images: this.data.goods_images,
    })
  },
  // dart end

  showTimePicker: function () {
    this.setData({
      isShowTimePicker: true,
      is_timelimit: 1,
    })
  },
  hideTimePicker: function (e) {
    this.setData({
      isShowTimePicker: false,
      is_timelimit: 0
    })
  },

  //上传规格图
  addSpecPic(e) {
    var index = e.currentTarget.dataset.index
    if (index >= 0) {
      this.data.current_spec_index = index
    } else {
      index = this.data.current_spec_index
    }

    if (this.data.spec[index].spec_pic.length) {
      console.log(index, this.data.spec[index].spec_pic)

      //先显示隐藏层 再setdata 否则报错
      //
      this.setData(
        {
          visible_spec: true,
        },
        () => {
          this.setData({
            current_spec_imgs: this.data.spec[index].spec_pic,
          })
        }
      )

      // current_spec_imgs:this.data.spec[index].spec_pic
    } else {
      this.addSpecPicCore(index)
    }
  },

  addSpecPicContinue() {
    this.addSpecPicCore(this.data.current_spec_index)
  },

  addSpecPicCore(index) {
    util.uploadPicture({
      success: (result) => {
        const key = 'spec[' + index + '].spec_pic'

        this.data.spec[index].spec_pic = this.data.spec[index].spec_pic.concat([
          result,
        ])

        this.setData({
          [key]: this.data.spec[index].spec_pic,
          current_spec_imgs: this.data.spec[index].spec_pic,
          specProgress: false,
        })
      },
      progressState: (s) => {
        this.setData(
          {
            visible_spec: true,
          },
          () => {
            this.setData({
              specProgress: s,
            })
          }
        )

        console.log('this.data.visible_spec', this.data.visible_spec)
      },
    })
  },
  addspecPictureDone() {
    this.setData({
      visible_spec: false,
    })
  },
  removeSpecPhoto(e) {
    const imgIndex = e.currentTarget.dataset.index
    console.log(this.data.current_spec_index, imgIndex)

    this.data.spec[this.data.current_spec_index].spec_pic.splice(imgIndex, 1)
    const newData = this.data.spec[this.data.current_spec_index].spec_pic
    const key = 'spec[' + this.data.current_spec_index + '].spec_pic'

    this.setData({
      [key]: newData,
      current_spec_imgs: newData,
    })

    if (newData.length == 0) {
      this.setData({
        visible_spec: false,
      })
    }
  },
  // addPicture(e){
  //   const type = e.currentTarget.dataset.type
  //   wx.navigateTo({
  //     url:'../upload_pics/upload_pics?type='+type
  //   })
  // },
  //
  addPictureDone() {
    console.log('close!!!!')

    this.setData({
      visible_pictures: false,
    })
  },
  addVideoDone() {
    this.setData({
      visible_video: false,
    })
  },

  addVideo() {
    if (this.data.goods_video) {
      this.setData({
        visible_video: true,
      })
    } else {
      this.addVideoCore()
    }
  },

  addVideoCore() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 180,
      camera: 'back',
      success: (res) => {
        this.setData({
          video_progress: true,
        })

        var videoFile = res.tempFilePath || ''
        var videothumb = res.thumbTempFilePath || ''

        console.log('videoFile', res)

        let p1 = util.uploadFile({ filePath: videoFile })

        p1.then(
          (result) => {
            this.setData({
              goods_video: result.data.file_url,
              goods_video_cover: result.data.file_url + '?vframe/jpg/offset/2',
              video_progress: false,
            })
            this.setData({
              visible_video: true,
            })
          },
          (err) => {
            wx.showToast({
              title: '上传失败' + err,
              icon: 'none',
            })

            this.setData({
              video_progress: false,
            })
          }
        )
      },
    })
  },

  removeVideo() {
    this.setData({
      visible_video: false,
      goods_video: '',
    })
  },

  add() {
    if (this.data.content_imgs.length) {
      return this.setData({
        visible_pictures: true,
      })
    } else {
      this.addPicture()
    }
  },

  //添加介绍图片
  addPicture() {
    this.setData({
      uploadProgress: true,
    })

    util.uploadPicture({
      success: (result) => {
        this.data.content_imgs = this.data.content_imgs.concat([result])
        console.log('this.data.content_imgs', this.data.content_imgs)
        this.setData({
          content_imgs: this.data.content_imgs,
          uploadProgress: false,
        })
      },
      progressState: (s) => {
        this.setData({
          uploadProgress: s,
          visible_pictures: true,
        })
      },
    })
  },
  swapArray(index1, index2) {
    var arr = this.data.content_imgs
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]

    this.setData({
      content_imgs: arr,
    })
  },
  toUp(e) {
    let index = e.currentTarget.dataset.index
    if (index != 0) {
      this.swapArray(index, index - 1)
    }
  },

  toDown(e) {
    let index = e.currentTarget.dataset.index
    if (index != this.data.content_imgs.length - 1) {
      this.swapArray(index, index + 1)
    } else {
    }
  },

  //添加商品
  addGoods: function () {
    const dataTpl = {
      spec_name: '',
      spec_price: '',
      spec_stock: '',
      spec_pic: [],
      spec_desc: '',
      sub_agent_price:'0'
    }

    this.data.spec = this.data.spec.concat([dataTpl])

    this.setData({
      spec: this.data.spec,
    })
  },
  //删除商品
  removeGoods: function (e) {
    if (this.data.spec.length <= 1) {
      wx.showToast({
        title: '请至少保留一个商品',
        icon: 'none', //标题
      })

      return
    }

    let index = e.currentTarget.dataset.index
    this.data.spec.splice(index, 1)
    this.setData({
      spec: this.data.spec,
    })
  },

  //上移商品
  upGoods: function (e) {
    let index = e.currentTarget.dataset.index
    let good = this.data.spec.splice(index, 1)
    // console.log(good)

    this.data.spec.splice(index - 1, 0, good[0])
    // console.log(this.data.spec)
    this.setData({
      spec: this.data.spec,
    })
  },

  //置顶商品
  topGoods: function (e) {
    let index = e.currentTarget.dataset.index
    let good = this.data.spec.splice(index, 1)
    // console.log(good)

    this.data.spec.splice(0, 0, good[0])
    // console.log(this.data.spec)
    this.setData({
      spec: this.data.spec,
    })
  },

  //下移商品
  downGoods: function (e) {
    let index = e.currentTarget.dataset.index
    let good = this.data.spec.splice(index, 1)
    // console.log(good)

    this.data.spec.splice(index + 1, 0, good[0])
    // console.log(this.data.spec)
    this.setData({
      spec: this.data.spec,
    })
  },

  onShow: function (option) {
    if (app.globalData.userInfo) {
      this.getTplList()
    }
  },
  getInput(e) {
    this.setData({
      currentInput: e.detail.value,
    })
  },
  switch2Change: function (e) {
    this.setData({ hasType: e.detail.value })
  },
  deliverChange: function (e) {
    this.setData({ deliver: e.detail.value })
  },
  //上传相册
  chooseImage: function (e) {
    wx.chooseImage({
      count: 9, //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        //启动上传等待中...
        this.setData({
          photoProgress: true,
        })

        console.log('选择图片数量', tempFilePaths.length)

        var uploadImgCount = 0
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: util.config.apiUrl + '/api/seller/upload',
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              imgIndex: i,
            },
            header: {
              'Content-Type': 'multipart/form-data',
              Authorization: app.globalData.token,
            },
            success: (res) => {

              console.log(res)

              if(res.statusCode == 413){

                this.setData({
                  photoProgress: false,
                })

                 wx.showToast({
                  title: '图片太大啦',
                  icon: 'none',
                })

                return 
              }



              var data = JSON.parse(res.data)

              if (data.code !== 200) {
                wx.showToast({
                  title: '请先登录',
                  icon: 'none',
                })

                this.setData({
                  photoProgress: false,
                })

                return
              }

              uploadImgCount++
              console.log('上传成功', uploadImgCount, JSON.parse(res.data))

              console.log(data.data.file_url)
              this.data.goods_images.push({
                img_url: data.data.file_url,
                is_cover: this.data.goods_images.length > 0 ? 0 : 1,
              })

              console.log(this.data.goods_images)

              this.setData({
                goods_images: this.data.goods_images,
              })

              //如果是最后一张,则隐藏等待中
              if (uploadImgCount == tempFilePaths.length) {
                this.setData({
                  photoProgress: false,
                })
              }
            },
            fail: (res) => {
              this.setData({
                photoProgress: false,
              })

              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) {},
              })
            },
          })
        }
      },
    })
  },
  //删除一张照片
  removePicture: function (e) {
    let index = e.currentTarget.dataset.index

    this.data.content_imgs.splice(index, 1)
    this.setData({
      content_imgs: this.data.content_imgs,
    })
    wx.showToast({
      title: '删除成功',
      icon: 'none',
    })
  },
  handleAnimalChange: function (event) {
    const detail = event.detail
    this.setData({
      morePic: detail.value,
    })
  },
  navigateToAddress: function () {
    wx.navigateTo({
      url: '../../address/list/list',
    })
  },
  chooseMap: function (e) {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.chooseLocation({
          success: function (res) {
            console.log(res)
          },
        })
      },
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  initValidate: function () {
    // 验证字段的规则
    const rules = {
      goods_name: {
        required: true,
      },
      // goods_content: {
      //     required: true
      // }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      goods_name: {
        required: '请输入标题',
      },
      // goods_content: {
      //     required: '请输入描述'
      // }
    }

    if (this.data.isEmptyEditor) {
      rules.goods_content = {
        required: true,
      }
      messages.goods_content = {
        required: '请输入描述',
      }
    }

    this.WxValidate = new WxValidate(rules, messages)
  },
  jump() {
    wx.redirectTo({
      url: '../goods/goods?goods_id=' + this.data.goods_id,
    })
  },
  //提交表单
  submitForm(e) {
    this.initValidate()

    if (this.data.goods_images.length <= 0) {
      wx.showModal({ title: '请上传商品相册', showCancel: false })
      return util.playSound('../../img/error.mp3')
    }

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({ title: error.msg, showCancel: false })
      return util.playSound('../../img/error.mp3')
    }

    //校验规则名
    let hasKeyName = true

    this.data.spec.every((value, index) => {
      if (value.spec_name.trim() == '' || value.spec_price.trim() == '') {
        hasKeyName = false

        return false
      } else {
        return true
      }
    })

    if (!hasKeyName) {
      wx.showModal({ title: '请填写规则名称和价格', showCancel: false })
      return
    }

    if (this.data.delivery_method == 0) {
      wx.showModal({ title: '请选择配送方式', showCancel: false })
      return false
    }

    if (this.data.delivery_method == 2 && this.data.sell_address.length == 0) {
      wx.showModal({ title: '请填写自提点', showCancel: false })
      return false
    }

    //默认重置价格为0
    this.data.spec.forEach((value, index) => {
      if (value.spec_price == '') {
        this.data.spec[index].spec_price = 0
      }
    })

    var goods_id = this.copy ? {} : { goods_id: this.data.goods_id }

    let data = Object.assign(
      goods_id,
      { content: JSON.stringify(this.data.editorContent) },
      e.detail.value, //表单的数据
      { spec: this.data.spec }, //商品数组数据
      { goods_images: this.data.goods_images },
      {
        self_address_id: this.data.sell_address.map((item) => {
          return item.self_address_id
        }),
        delivery_method: this.data.delivery_method,
        payment_method: this.data.payment_method,
        start_time: this.data.start_time,
        end_time: this.data.end_time,
        content_imgs: this.data.content_imgs,
        goods_video: this.data.goods_video,
        goods_video_cover: this.data.goods_video_cover,
        freight_tpl_id: this.data.freight_tpl_id,
        show_buyerlist:this.data.show_buyerlist,
        agent_opt:this.data.agent_opt,
        cat_id: 8,
        is_timelimit: this.data.is_timelimit,
      }
    )

    wx.showLoading()

    //提交
    //
    util.wx.post('/api/seller/goods_add_or_edit', data).then((res) => {
      wx.hideLoading()

      if (res.data.data) {
        this.data.goods_id = res.data.data.goods_id

        this.jump()
      } else {
        wx.showModal({
          title: res.data.msg || '错误',
          showCancel: false,
        })
      }
    })
  },
  deliveryChange: function (e) {
    this.setData({
      delivery_method: e.detail.value ? 1 : 2,
    })
  },
  start_time: function (e) {
    let t = e.detail //"2018", "10", "20", "16", "00"
    this.setData({
      start_time: t[0] + '-' + t[1] + '-' + t[2] + ' ' + t[3] + ':' + t[4],
    })
  },
  end_time: function (e) {
    let t = e.detail //"2018", "10", "20", "16", "00"

    this.setData({
      end_time: t[0] + '-' + t[1] + '-' + t[2] + ' ' + t[3] + ':' + t[4],
    })
  },
  handleOpen1() {
    this.setData({
      visible1: true,
    })
  },
  handleOpen2() {
    this.setData({
      visible2: true,
    })
  },
  handleCancel1() {
    this.setData({
      visible1: false,
    })
  },
  handleCancel2() {
    this.setData({
      visible2: false,
    })
  },
  fromSpec(e) {
    let { index } = e.currentTarget.dataset
    let { spec_name, spec_pic, spec_content } = this.data.spec[index]
    wx.setStorage({
      key: 'specItem',
      data: {
        index,
        spec_name,
        spec_pic,
        spec_content,
      },
      success() {
        wx.navigateTo({
          url: '../spec-detail/index',
        })
      },
    })
  },
  /**收款方式**/
  handleClickItem1({ detail }) {
    this.setData({
      payment_method: detail.index,
      visible1: false,
    })
  },

  handleClickItem2({ detail }) {
    const index = detail.index + 1

    this.setData({
      delivery_method: index,
      visible2: false,
    })
    if (index == 2) {
      wx.navigateTo({
        url: '../map/index',
      })
    }
  },

  /**回显数据**/
  getPublishedData(goods_id, isCopy) {
    // 是否是模板   1包邮模板   2自提模板

    wx.showLoading()

    util.wx
      .get('/api/goods/get_goods_detail', {
        goods_id: goods_id,
      })
      .then((res) => {
        wx.hideLoading()
        let d = res.data
        let gs = d.data.goods

        if (d.code == 200) {
          // 初始数据
          this.initData(gs, isCopy)
        } else {
          wx.showModal({
            title: res.data.msg,
            showCancel: false,
          })
        }
      })
  },

  // 编辑模板初始数据加载
  initData(gs, isCopy) {
    let starFormatTime = isCopy
      ? default_start_time
      : util.formatTime(new Date(gs.start_time * 1000))
    let endFormatTime = isCopy
      ? default_end_time
      : util.formatTime(new Date(gs.end_time * 1000))

    var freight_tpl_name = ''

    //获取地址列表 和获取详情异步f vfv
    //
    if (gs.freight_tpl_id) {
      this.getTplList()
    }

    let editorContent = JSON.parse(gs.content)
    editorContent = editorContent ? editorContent : { html: '', text: '' }
    let isEmptyEditor =
      editorContent.text.replace(/\n/g, '').length == 0 &&
      !/img/g.test(editorContent.html)

    this.setData({
      goods_images: gs.goods_images,
      goods_name: gs.goods_name,
      agent_opt:gs.agent_opt,
      goods_content: gs.goods_content,
      show_buyerlist: gs.show_buyerlist,
      isEmptyEditor: isEmptyEditor,
      editorContent: editorContent,
      is_timelimit: gs.is_timelimit,
      sell_address: gs.self_address,
      delivery_method: gs.delivery_method,
      payment_method: gs.payment_method,
      content_imgs: gs.content_imgs || [],
      goods_video: gs.goods_video,
      goods_video_cover: gs.goods_video_cover,
      start_time: starFormatTime,
      end_time: endFormatTime,
      picker: {
        start_date: starFormatTime.split(' ')[0],
        start_time: starFormatTime.split(' ')[1],
        end_date: endFormatTime.split(' ')[0],
        end_time: endFormatTime.split(' ')[1],
      },
      spec: gs.goods_spec,
      isShowTimePicker: gs.is_timelimit == 1,
      freight_tpl_id: gs.freight_tpl_id || 0,
    })
    console.log('picker', this.data.picker)
  },

  watch: {
    visible_pictures: (newValue, val, context) => {
      context.setData({
        displayTextArea: newValue ? 'none' : 'block',
      })
    },
    visible_video: (newValue, val, context) => {
      context.setData({
        displayTextArea: newValue ? 'none' : 'block',
      })
    },
    visible_spec: (newValue, val, context) => {
      context.setData({
        displayTextArea: newValue ? 'none' : 'block',
      })
    },
  },

  //回显运费模版名称

  getTplList() {
    util.wx.get('/api/user/get_freight_tpl_list').then((res) => {
      const lists = res.data.data.lists
      lists.forEach((item) => {
        console.log(item.freight_tpl_id, this.data.freight_tpl_id)
        if (item.freight_tpl_id == this.data.freight_tpl_id) {
          this.setData({
            freight_tpl_name: item.freight_tpl_name,
          })
        }
      })

      this.freight_tpl_list = lists
    })
  },
  toMore(){
    wx.navigateTo({
      url:'../publish-setting/index?show_buyerlist='+this.data.show_buyerlist
    })
  },

  onLoad: function (option) {

    var user
    if (app.globalData.userInfo) {
      user = app.globalData.userInfo.nickname
    } else {
      user = ''
    }

    wx.setNavigationBarTitle({
      title: user + '您正在发布活动',
    })

    if (option.copy) {
      this.copy = true
    }

    getApp().setWatcher(this.data, this.watch, this) // 设置监听器

    //编辑的时候
    if (option.goods_id) {
      this.setData({
        goods_id: option.goods_id,
      })

      this.getPublishedData(option.goods_id)
    }
  },
  inputDuplex: util.inputDuplex,
})
