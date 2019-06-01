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
        painterData: {},
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
        console.log(e)
        var index = e.currentTarget.dataset.index || ''
        if (index !== '') {
            this.data.current_spec_index = index
        } else {
            index = this.data.current_spec_index
        }


        if (this.data.spec[index].spec_pic.length) {
            return this.setData({
                visible_spec: true
            })
        }

        console.log("index", index)

        console.log("spec", this.data.spec)

        this.addSpecPicCore(index)

      


    },

    addSpecPicContinue() {
        this.addSpecPicCore(this.data.current_spec_index)
    },

    addSpecPicCore(index) {

        util.uploadPicture({
            success: (result) => {

                const key = 'spec[' + index + '].spec_pic'

                const newVal = this.data.spec[index].spec_pic.concat([result])
                console.log('newVal', newVal)
                this.setData({
                    [key]: newVal,
                    current_spec_imgs: newVal,
                    specProgress:false
                })

            },
            progressState: (s) => {
                console.log('上传状态',s,this)
                if(this.data.visible_spec){

                 this.setData({
                    specProgress: s
                })

                }else{

                 this.setData({
                    specProgress: s,
                    visible_spec:true
                })

                }
              

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

                    console.log('视频上传成功',this)
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


        // util.uploadPicture({
        //     type: 'video',
        //     successData: (result) => {

        //         this.setData({
        //             goods_video: result
        //         })

        //     },
        //     progressState: (s) => {
        //         this.setData({
        //             uploadProgress: s,
        //             visible_video: true
        //         })

        //     }
        // })
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




        // if(app.globalData.sell_address){

        //   this.setData({
        //     sell_address:app.globalData.sell_address
        //   })

        //   wx.setStorage({
        //     key: 'nowCheckAddress',
        //     data: this.data.sell_address,
        //     success(e) { }
        //   })


        // }

        // console.log(this.data.sell_address)

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
            count: 9, //最多可以选择的图片总数  
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
                var tempFilePaths = res.tempFilePaths;

                //启动上传等待中...  
                this.setData({
                    photoProgress: true
                })

                console.log(app.globalData)

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
                            uploadImgCount++;
                            console.log('上传成功结果', JSON.parse(res.data))
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
                        fail: function(res) {

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
            url: '../publish-success/publish-success?goods_id=' + this.data.goods_id + '&goods_name=' + this.data.goods_name
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

        //默认重置价格为0
        this.data.spec.forEach((value, index) => {

            if (value.spec_price == '') {
                this.data.spec[index].spec_price = 0
            }

        })

        console.log(this.data.sell_address)



        let data = Object.assign({ token: app.globalData.token }, { goods_id: this.data.goods_id },
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
                if (res.data.code == 200) {
                    this.setData({
                        goods_id: res.data.data.goods_id,
                        goods_name: e.detail.value.goods_name

                    })
                    this.jump()

                } else {
                    wx.showModal({
                        title: res.data.msg,
                        showCancel: false
                    })
                }
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
        let tempConfig = {
            delivery_method : 2,
            self_address: [
                {
                    address: "北京市东城区东长安街",
                    addtime: 1559403854,
                    city_name: "北京市",
                    district_name: "东城区",
                    door_number: "",
                    goods_id: 103,
                    goods_selfaddress_id: 19,
                    id: 0,
                    is_address_default: 0,
                    is_del: 1,
                    latitude: "39.9088230",
                    longitude: "116.3974700",
                    name: "天安门",
                    province_name: "北京市",
                    self_address_id: 31,
                    store_id: 4,
                    updatetime: 1559403890
                }
            ]
        };
        // 是否是模板   1包邮模板   2自提模板
        if(temp == 1){
            this.setData({
                delivery_method: 1
            })
            return;
        }else if(temp == 2){
            this.setData({
                sell_address: tempConfig.self_address,
                delivery_method: 2
            })

            app.globalData.sell_address = this.data.sell_address;
            return;
        }




        wx.showLoading()

        util.wx.get('/api/seller/get_goods_detail', {
            goods_id: goods_id

        }).then((res) => {

            wx.hideLoading()


            let d = res.data
            let gs = res.data.data.goods

            let starFormatTime = isCopy ? default_start_time : util.formatTime(new Date(gs.start_time * 1000))
            let endFormatTime = isCopy ? default_end_time : util.formatTime(new Date(gs.end_time * 1000))



            if (d.code == 200) {

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

                app.globalData.sell_address = this.data.sell_address

            } else {
                wx.showModal({
                    title: res.data.msg,
                    showCancel: false
                })
            }
        })


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


        getApp().setWatcher(this.data, this.watch, this); // 设置监听器




        //编辑的时候
        if (option.goods_id) {

            this.setData({
                goods_id: option.goods_id
            })

            this.getPublishedData(option.goods_id, option.copy ? true : false)

        }else if(option.temp){ // 是否是模板
            this.getPublishedData('', '', option.temp);
        }


        this.initValidate()


    },


    inputDuplex: util.inputDuplex
})