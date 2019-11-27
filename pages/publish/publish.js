//index.js
//
//
//
//获取应用实例
var WxValidate = require("../../utils/wxValidate.js");


const app = getApp()

const util = require('../../utils/util.js')

const date = new Date()

const default_start_time = util.formatTime(date)
date.setDate(date.getDate() + 7);
const default_end_time = util.formatTime(date)


Page({
    data: {
        height: '300', //文本框的高度
        link_url: "",
        goods_id: "",
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
        uploadProgress: false,//介绍图loading
        start_time: default_start_time,
        end_time: default_end_time,
        goods_video: '',
        goods_video_cover: '',
        picker: {
            start_date: default_start_time.split(' ')[0],
            end_date: default_end_time.split(' ')[0],
            start_time: '00:00:00',
            end_time: '24:00:00',
        },
        spec: [{
            spec_name: '',
            spec_price: '',
            spec_stock: '',
            spec_pic: [],
            spec_desc: ''
        }],
        collection_methods: 1, //(1:平台代收,2:商户微信收款码)
        visible1: false,
        visible2: false,
        type: 'photo', //上传图片或视频
        actions1: [

            {
                name: '先收款 微信即时支付'
            },
            {
                name: '先统计报名 线下收款',
            },
        ],
        actions2: [{
                name: '快递邮寄',
            },
            {
                name: '用户自提'
            }
        ],

        content_imgs_length: '',
        visible_pictures: false, //上传图片弹层是否显示
        visible_video: false,
        visible_spec: false, //规格图
        current_spec_index: 0,
        current_spec_imgs:[],
        displayTextArea: 'block',
        video_progress:false
    },

    showTimePicker: function() {

        this.setData({
            isShowTimePicker: true
        })

    },

    //上传规格图
    addSpecPic(e) {
        var index = e.currentTarget.dataset.index;
        if (index >= 0) {
            this.data.current_spec_index = index
        } else {
            index = this.data.current_spec_index
        }



        if (this.data.spec[index].spec_pic.length) {

            console.log(index,this.data.spec[index].spec_pic)

            //先显示隐藏层 再setdata 否则报错
            //
            this.setData({
                visible_spec: true
                
            },()=>{

                  this.setData({
                current_spec_imgs: this.data.spec[index].spec_pic
                
            })


            })

            // current_spec_imgs:this.data.spec[index].spec_pic

       }else{

          this.addSpecPicCore(index)


       }


    },

    addSpecPicContinue() {
        this.addSpecPicCore(this.data.current_spec_index)
    },

    addSpecPicCore(index) {

        util.uploadPicture({
            success: (result) => {

                const key = 'spec['+index+'].spec_pic' 

                this.data.spec[index].spec_pic = this.data.spec[index].spec_pic.concat([result])

                this.setData({
                    [key]: this.data.spec[index].spec_pic,
                    current_spec_imgs: this.data.spec[index].spec_pic,
                    specProgress:false
                })

            },
            progressState: (s) => {
               
                 this.setData({
                    visible_spec:true
                },()=>{

                    this.setData({
                      specProgress: s
                    })

                })

                
              

                console.log('this.data.visible_spec',this.data.visible_spec)

            }
        })
    },
    addspecPictureDone() {
        this.setData({
            visible_spec: false
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
            current_spec_imgs: newData
        })

        if(newData.length == 0){
            this.setData({
                visible_spec:false
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

        this.setData({
            visible_pictures: false
        })

    },
    addVideoDone() {

        this.setData({
            visible_video: false
        })

    },

    addVideo() {

        if (this.data.goods_video) {
            this.setData({
                visible_video: true
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
                    video_progress: true
                })

                var videoFile = res.tempFilePath || ''
                var videothumb = res.thumbTempFilePath || ''

                console.log('videoFile',res)


                let p1 = util.uploadFile({ filePath: videoFile })
                
               

               p1.then((result) => {

                    this.setData({
                        goods_video: result.data.file_url,
                        goods_video_cover:result.data.file_url+'?vframe/jpg/offset/2',
                        video_progress: false
                    })
                    this.setData({
                            visible_video: true
                        })


                },(err)=>{

                    wx.showToast({
                        title:'上传失败'+err,
                        icon:'none'
                    })

                    this.setData({
                        video_progress: false
                    })

                })


            }
        })
    },

    removeVideo() {
        this.setData({
            visible_video: false,
            goods_video: ''
        })
    },

    add() {
        if (this.data.content_imgs.length) {
            return this.setData({
                visible_pictures: true
            })
        } else {
            this.addPicture()
        }
    },

    //添加介绍图片
    addPicture() {

        this.setData({
                    uploadProgress: true
                })

        util.uploadPicture({
            success: (result) => {

                console.log('result', result)

                this.data.content_imgs = this.data.content_imgs.concat([result])
                console.log('this.data.content_imgs', this.data.content_imgs)
                this.setData({
                    content_imgs: this.data.content_imgs,
                    uploadProgress:false
                })

            },
            progressState: (s) => {
                this.setData({
                    uploadProgress: s,
                    visible_pictures: true
                })

            }
        })
    },
    swapArray(index1, index2) {
        var arr = this.data.content_imgs
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];

        this.setData({
            content_imgs: arr
        })


    },
    toUp(e) {
        let index = e.currentTarget.dataset.index
        if (index != 0) {
            this.swapArray(index, index - 1);
        }

    },

    toDown(e) {
        let index = e.currentTarget.dataset.index
        if (index != this.data.content_imgs.length - 1) {
            this.swapArray(index, index + 1);
        } else {

        }

    },

    //添加商品
    addGoods: function() {

        const dataTpl = {
            spec_name: '',
            spec_price: '',
            spec_stock: '',
            spec_pic: [],
            spec_desc: ''
        }

        this.data.spec = this.data.spec.concat([dataTpl])

        this.setData({
            spec: this.data.spec
        })

    },
    //删除商品
    removeGoods: function(e) {

        if (this.data.spec.length <= 1) {
            wx.showToast({
                title: '请至少保留一个商品',
                icon: 'none' //标题
            })

            return
        }

        let index = e.currentTarget.dataset.index
        this.data.spec.splice(index, 1)
        this.setData({
            spec: this.data.spec
        })
    },



    onShow: function(option) {


    },
    getInput(e) {

        this.setData({
            currentInput: e.detail.value
        })

    },
    switch2Change: function(e) {
        this.setData({ hasType: e.detail.value })
    },
    deliverChange: function(e) {
        this.setData({ deliver: e.detail.value })
    },
    //上传相册
    chooseImage: function(e) {

        wx.chooseImage({
            count: 5, //最多可以选择的图片总数  
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
                var tempFilePaths = res.tempFilePaths;

                //启动上传等待中...  
                this.setData({
                    photoProgress: true
                })

                console.log('选择图片数量',tempFilePaths.length)

                var uploadImgCount = 0;
                for (var i = 0, h = tempFilePaths.length; i < h; i++) {
                    wx.uploadFile({
                        url: util.config.apiUrl + '/api/seller/upload',
                        filePath: tempFilePaths[i],
                        name: 'file',
                        formData: {
                            'imgIndex': i
                        },
                        header: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": app.globalData.token
                        },
                        success: (res) => {
                            var data = JSON.parse(res.data);

                             if(data.code !==200){

                                wx.showToast({
                                    title:'请先登录',
                                    icon:'none'
                                })

                                 this.setData({
                                    photoProgress: false
                                })

                                return
                            }


                            uploadImgCount++;
                            console.log('上传成功', uploadImgCount, JSON.parse(res.data))

                           

                            console.log(data.data.file_url)
                            this.data.goods_images.push({
                                img_url: data.data.file_url,
                                is_cover: this.data.goods_images.length > 0 ? 0 : 1
                            })

                            console.log(this.data.goods_images)

                            
                            this.setData({
                                goods_images: this.data.goods_images
                            })

                            //如果是最后一张,则隐藏等待中  
                            if (uploadImgCount == tempFilePaths.length) {
                                this.setData({
                                    photoProgress: false
                                })
                            }
                        },
                        fail: (res) =>{

                            this.setData({
                                photoProgress: false
                            })

                            wx.showModal({
                                title: '错误提示',
                                content: '上传图片失败',
                                showCancel: false,
                                success: function(res) {}
                            })
                        }
                    })

                }


            }
        })

    },
    //删除一张照片
    removePhoto: function(e) {
        let index = e.currentTarget.dataset.index
        this.data.goods_images.splice(index, 1)
        if(this.data.goods_images.length){
           this.data.goods_images[0].is_cover = 1
        }

        this.setData({
            'goods_images': this.data.goods_images
        })
    },

     //删除一张照片
    removePicture: function(e) {
        let index = e.currentTarget.dataset.index


        this.data.content_imgs.splice(index, 1)
        this.setData({
            'content_imgs': this.data.content_imgs
        })
        wx.showToast({
            title:'删除成功',
            icon:'none'
        })
    },
    handleAnimalChange: function(event) {

        const detail = event.detail;
        this.setData({
            'morePic': detail.value
        })
    },
    navigateToAddress: function() {
        wx.navigateTo({
            url: '../../address/list/list'
        });
    },
    chooseMap: function(e) {
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                wx.chooseLocation({
                    success: function(res) {
                        console.log(res)
                    }
                })
            }
        })

    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    initValidate: function() {
        // 验证字段的规则
        const rules = {
            goods_name: {
                required: true
            },
            goods_content: {
                required: true
            }
        }

        // 验证字段的提示信息，若不传则调用默认的信息
        const messages = {
            goods_name: {
                required: '请输入标题'
            },
            goods_content: {
                required: '请输入描述'
            }
        }
        this.WxValidate = new WxValidate(rules, messages)


    },
    jump() {
        wx.redirectTo({
            url: '../goods/goods?goods_id=' + this.data.goods_id 
        })
    },
    //提交表单
    submitForm(e) {

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
        let hasKeyName = true;

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

        if (this.data.delivery_method == 2 && this.data.sell_address.length ==0) {
            wx.showModal({ title: '请填写自提点', showCancel: false })
            return false
        }


        

        //默认重置价格为0
        this.data.spec.forEach((value, index) => {

            if (value.spec_price == '') {
                this.data.spec[index].spec_price = 0
            }

        })

        var goods_id = this.copy? {}: { goods_id: this.data.goods_id }

        let data = Object.assign(
            goods_id,
            e.detail.value, //表单的数据
            { spec: this.data.spec }, //商品数组数据
            { goods_images: this.data.goods_images }, {
                self_address_id: this.data.sell_address.map(item=>{
                    return item.self_address_id
                }),
                delivery_method: this.data.delivery_method,
                // collection_methods: this.data.collection_methods,
                start_time: this.data.start_time,
                end_time: this.data.end_time,
                content_imgs: this.data.content_imgs,
                goods_video:this.data.goods_video,
                goods_video_cover:this.data.goods_video_cover,
                cat_id: 8
            },

        )


        wx.showLoading()

        



        //提交
        //
        util.wx.post('/api/seller/goods_add_or_edit', data).then(
            res => {
                wx.hideLoading()
                this.data.goods_id = res.data.data.goods_id
              
                this.jump()
             
            },(res)=>{
                wx.hideLoading()

                wx.showModal({
                        title: res.data.msg,
                        showCancel: false
                })
            })



    },
    deliveryChange: function(e) {
        this.setData({
            delivery_method: e.detail.value ? 1 : 2
        })
    },
    start_time: function(e) {
        let t = e.detail //"2018", "10", "20", "16", "00"
        this.setData({
            start_time: t[0] + '-' + t[1] + '-' + t[2] + ' ' + t[3] + ':' + t[4]
        })

    },
    end_time: function(e) {
        let t = e.detail //"2018", "10", "20", "16", "00"

        this.setData({
            end_time: t[0] + '-' + t[1] + '-' + t[2] + ' ' + t[3] + ':' + t[4]
        })

    },
    handleOpen1() {
        this.setData({
            visible1: true
        });
    },
    handleOpen2() {
        this.setData({
            visible2: true
        });
    },
    handleCancel1() {
        this.setData({
            visible1: false
        });
    },
    handleCancel2() {
        this.setData({
            visible2: false
        })
    },

    /**收款方式**/
    handleClickItem1({ detail }) {
        const index = detail.index + 1;

        this.setData({
            collection_methods: index,
            visible1: false
        });
    },

    handleClickItem2({ detail }) {
        const index = detail.index + 1;

        console.log(index)



        this.setData({
            delivery_method: index,
            visible2: false
        });
        if (index == 2) {
            wx.navigateTo({
                url: '../map/index'
            })
        }
    },
    /**回显数据**/
    getPublishedData(goods_id, isCopy, temp) {
        // 是否是模板   1包邮模板   2自提模板
        if(temp == 1){
            this.initData({"goods_name":"这里是标题：\u5c71\u4e1c\u70df\u53f0\u798f\u5c71\u5927\u6a31\u6843","goods_cover":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032214405156.jpg","goods_video_cover":"","goods_video":"","goods_content":"\u798f\u5c71\u662f\u70df\u53f0\u5927\u6a31\u6843\u7684\u751f\u4ea7\u5730\uff0c\u4e5f\u662f\u70df\u53f0\u6700\u597d\u5403\u7684\u5927\u6a31\u6843\u4ea7\u5730\uff0c\u88ab\u56fd\u5bb6\u547d\u540d\u4e3a\u201c\u4e2d\u56fd\u5927\u6a31\u6843\u4e4b\u4e61\u201c\u3002\n\u6a31\u6843\u6811\u4ece\u571f\u58e4\u6539\u826f\u5f00\u59cb\uff0c\u65bd\u7528\u519c\u5bb6\u80a5\uff0c\u53ea\u7528\u4e94\u5e74\u4ee5\u4e0a\u6811\u9f84\u7684\u679c\u6811\u6302\u679c\uff0c\u6bcf\u5e743\u67084\u65e5\uff0c\u6a31\u6843\u6811\u5f00\u82b1\uff0c\u871c\u8702\u6388\u7c89\uff0c\u4eba\u5de5\u758f\u82b1\u758f\u679c\u62a4\u7406\uff0c\u5c71\u6cc9\u6c34\u704c\u6e89\uff0c\u4eba\u5de5\u91c7\u6458\u6311\u9009\uff0c\u73b0\u6458\u73b0\u53d1\uff0c\u54c1\u8d28\u4fdd\u969c\u3002\n1\uff0c\u8272\u6cfd\u8273\u4e3d\uff0c\u6676\u83b9\u5254\u900f\uff0c\u5916\u5f62\u9971\u6ee1\uff0c\u5a07\u8273\u6b32\u6ef4\u3002\n2\uff0c\u4e2a\u5934\u5927\uff0c\u9897\u9897\u9971\u6ee1\uff0c\u76ae\u8584\u8089\u539a\uff0c\u65b0\u9c9c\u91c7\u6458\u3002\n3\uff0c\u76ae\u8584\u6838\u5c0f\uff0c\u8089\u539a\u8106\u751c\uff0c\u53e3\u611f\u4f73\uff0c\u597d\u5403\u505c\u4e0d\u4e0b\u3002\n4\uff0c\u9178\u751c\u53ef\u53e3\uff0c\u8106\u723d\u591a\u6c41\uff0c\u4e00\u53e3\u7206\u6d46\uff0c\u53e3\u5473\u60a0\u957f\u3002\n5\uff0c\u65b0\u9c9c\u91c7\u6458\uff0c\u73b0\u6458\u73b0\u53d1\uff0c\u679c\u67c4\u78a7\u7eff\u5904\u5904\u6563\u53d1\u65b0\u9c9c\u3002\n6\uff0c\u6e05\u6668\u91c7\u6458\uff0c\u7cbe\u6311\u7ec6\u9009\uff0c\u9897\u9897\u6311\u9009\u4e00\u7ea7\u597d\u679c\u3002","pageview_count":0,"collect_count":0,"comment_count":0,"store_sort":null,"is_on_sale":1,"is_del":1,"addtime":1559572333,"updatetime":1559573434,"delivery_method":1,"start_time":1559569987,"end_time":1592835682,"content_imgs":["https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032229506866.jpg","https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032230027360.jpg","https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032230219849.jpg","https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032230334715.jpg"],"goods_spec":[{"goods_spec_id":8,"goods_id":4,"spec_id":0,"spec_name":"\u5927\u6a31\u68432\u65a4","spec_price":"98.00","spec_stock":null,"spec_pic":["https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf320190603223155441.jpg"],"is_limited_stock":1,"addtime":1559573434,"spec_desc":""}],"goods_images":[{"img_id":15,"goods_id":4,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032214405156.jpg","img_sort":0,"is_cover":1},{"img_id":16,"goods_id":4,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032214517830.jpg","img_sort":1,"is_cover":0},{"img_id":17,"goods_id":4,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032214553804.jpg","img_sort":2,"is_cover":0},{"img_id":18,"goods_id":4,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032215151274.jpg","img_sort":3,"is_cover":0}],"self_address":[],"_expires":1,"total_qty":0,"buyuser_count":0}, isCopy);
            return;
        }else if(temp == 2){
            this.initData({
"goods_name":"这里是标题：\u7ea2\u989c\u5976\u6cb9\u8349\u8393","goods_cover":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032235396620.jpg",
"goods_video_cover":"",
"goods_video":"",
"goods_content":"\u679c\u5f62\u5706\u9525\u5f62\uff0c\u7ea2\u8273\u6b32\u6ef4\uff0c\u679c\u8089\u8f6f\uff0c\u5ae9\u5473\u751c\uff1b\u9897\u7c92\u9971\u6ee1\uff0c\u8272\u6cfd\u8273\u4e3d\uff0c\u54ac\u4e00\u53e3\uff0c\u679c\u8089\u5b9e\u5fc3\u4e30\u76c8\uff0c\u679c\u6c41\u8fdb\u6e85\uff0c\u9f7f\u988a\u5c3d\u7559\u9999\u751c\u3002\n\u7ea2\u989c\u5976\u6cb9\u8349\u8393\uff0c\u201d\u8393\u201c\u597d\u751f\u6d3b\uff0c\u7406\u5f53\u7ea2\u989c\u76f8\u4f34\u3002\n\u5b9e\u5fc3\u7f8e\u5473\uff0c\u6c34\u5ae9\u5976\u9999\uff0c\u5168\u5bb6\u5171\u4eab\u3002","pageview_count":0,"collect_count":0,"comment_count":0,"store_sort":null,"is_on_sale":1,"is_del":1,"addtime":1559573208,"updatetime":1559573660,"delivery_method":2,"start_time":1559569987,"end_time":1592835682,
"content_imgs":["https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032243261303.jpg","https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032243378431.jpg","https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032243431872.jpg"],"goods_spec":[{"goods_spec_id":9,"goods_id":5,"spec_id":0,"spec_name":"500g\/20-24\u9897","spec_price":"42.90","spec_stock":null,"spec_pic":["https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf320190603224615303.jpg"],"is_limited_stock":1,"addtime":1559573660,"spec_desc":"\u5976\u9999\u8349\u8393\uff0c\u65b0\u9c9c\u91c7\u6458"},{"goods_spec_id":10,"goods_id":5,"spec_id":0,"spec_name":"3斤装","spec_price":"78.90","spec_stock":null,"spec_pic":["https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032243378431.jpg","https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032235396620.jpg"],"is_limited_stock":1,"addtime":1559573660,"spec_desc":""}],"goods_images":[{"img_id":19,"goods_id":5,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032235396620.jpg","img_sort":0,"is_cover":1},{"img_id":20,"goods_id":5,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032236146589.jpg","img_sort":1,"is_cover":0},{"img_id":21,"goods_id":5,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032236212470.jpg","img_sort":2,"is_cover":0},{"img_id":22,"goods_id":5,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032236267545.jpg","img_sort":3,"is_cover":0},{"img_id":23,"goods_id":5,"img_url":"https:\/\/static.kaixinmatuan.cn\/eccbc87e4b5ce2fe28308fd9f2a7baf3201906032253004423.jpg","img_sort":4,"is_cover":0}],
"self_address":[],"_expires":1,"total_qty":0,"buyuser_count":0}, isCopy);

            return;
        }


        wx.showLoading()

        util.wx.get('/api/goods/get_goods_detail', {
            goods_id: goods_id

        }).then((res) => {
            wx.hideLoading()
            let d = res.data
            let gs = d.data.goods

            if (d.code == 200) {
                // 初始数据
                this.initData(gs, isCopy);

            } else {
                wx.showModal({
                    title: res.data.msg,
                    showCancel: false
                })
            }
        })


    },
    // 编辑模板初始数据加载
    initData(gs, isCopy){
        let starFormatTime = isCopy ? default_start_time : util.formatTime(new Date(gs.start_time * 1000))
        let endFormatTime = isCopy ? default_end_time : util.formatTime(new Date(gs.end_time * 1000))
        
        console.log('endFormatTime',endFormatTime)

        this.setData({
            goods_images: gs.goods_images,
            goods_name: gs.goods_name,
            goods_content: gs.goods_content,
            sell_address: gs.self_address,
            delivery_method: gs.delivery_method,
            // collection_methods: gs.collection_methods,
            content_imgs: gs.content_imgs || [],
            goods_video:gs.goods_video,
            goods_video_cover:gs.goods_video_cover,
            start_time: starFormatTime,
            end_time: endFormatTime,
            picker: {
                start_date: starFormatTime.split(' ')[0],
                start_time: starFormatTime.split(' ')[1],
                end_date: endFormatTime.split(' ')[0],
                end_time: endFormatTime.split(' ')[1],
            },
            spec: gs.goods_spec,
            isShowTimePicker: true
        })
        console.log('picker',this.data.picker)

    },

    watch: {
        visible_pictures: (newValue, val, context) => {

            context.setData({
                displayTextArea: newValue ? 'none' : 'block'
            })

        },
        visible_video: (newValue, val, context) => {
            context.setData({
                displayTextArea: newValue ? 'none' : 'block'
            })
        },
        visible_spec: (newValue, val, context) => {
            context.setData({
                displayTextArea: newValue ? 'none' : 'block'
            })
        },

    },


    onLoad: function(option) {

           //未登录 弹出授权弹窗
        if (!app.globalData.userInfo) {
            setTimeout(() => {
                this.setData({
                    showAuth: true
                })
            }, 2000)
        }



        if(option.copy){
            this.copy = true
        }


        getApp().setWatcher(this.data, this.watch, this); // 设置监听器


        //编辑的时候
        if (option.goods_id) {

            this.setData({
                goods_id: option.goods_id
            })

            this.getPublishedData(option.goods_id)

        }else if(option.temp){ // 是否是模板
            this.getPublishedData('', '', option.temp);
        }


        this.initValidate()


    },
    inputDuplex: util.inputDuplex
})