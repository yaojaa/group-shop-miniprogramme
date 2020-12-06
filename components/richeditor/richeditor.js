// plugin/components/richeditor/richeditor.js

import { uploadFile } from '../../utils/util'

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        initData: {
            type: Array
        },
        // 绘画单位
        drawUnit: {
            type: String,
            value: 'px'
        },
        // 是否使用scrollview
        isScrollView: {
            type: Boolean,
            value: false
        },
        // scrollTop
        currentScrollTop: {
            type: Number,
            value: 0,
            observer: function (newVal, oldVal) {
                this.data.scrollTop = newVal;
            },
        },
        // 容器宽度
        containWidth: {
            type: Number
        },
        // 容器高度
        containHeight: {
            type: Number
        },
        // 支持类型（图片，文本，视频）
        supportType: {
            type: Object,
            value: {
                image: {
                    name: '图片',
                    type: 'image',
                    isSupport: true,
                    supportSource: ['album', 'camera'],
                    sizeType: ['original', 'compressed'],
                    frontMethod: function() {
                        // 对应方法需返回true or false
                        console.log(`插入图片前的前置事件`)
                    },
                    backMethod: function(res) {
                        // 对应方法需返回true or false
                        console.log(`插入图片前的后置事件，所插入的图片路径为${ JSON.stringify(res) }`)
                    }
                },
                text: {
                    name: '文本',
                    type: 'text',
                    isSupport: true,
                    maxNum: 120,
                    frontMethod: function() {
                        // 对应方法需返回true or false
                        console.log(`插入文本前的前置事件`)
                    },
                    backMethod: function(res) {
                        // 对应方法需返回true or false
                        console.log(`插入文本前的后置事件，所插入的文本内容为${JSON.stringify(res)}`)
                    }
                },
                video: {
                    name: '视频',
                    type: 'video',
                    isSupport: true,
                    supportSource: ['album', 'camera'],
                    isCompress: true,
                    maxDuration: 60,
                    camera: 'back',
                    frontMethod: function() {
                        // 对应方法需返回true or false
                        console.log(`插入视频前的前置事件`)
                    },
                    backMethod: function(res) {
                        // 对应方法需返回true or false
                        console.log(`插入视频前的后置事件，所插入的视频路径为${JSON.stringify(res)}`)
                    }
                },
                // 暂不实现
                // audio: {
                //   name: '音频',
                //   type: 'audio',
                //   frontMethod: function () {
                //     // 对应方法需返回true or false
                //     console.log(`插入音频前的前置事件`)
                //   },
                //   backMethod: function (res) {
                //     // 对应方法需返回true or false
                //     console.log(`插入音频前的后置事件，所插入的音频路径为${JSON.stringify(res)}`)
                //   }
                // }
            }
        },
        getObject: {
            type: Function,
            value: function(res) {
                console.log(res)
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        innerInitData: [],
        curIndex: -1,
        newCurIndex: -1,
        scrollTop: 0,
        contentSize: [],
        pr: ''
    },
    observers: {
        'initData': function(data) { //  'params'是要监听的字段，（data）是已更新变化后的数据
            data = data.filter(e=>{
                return e.type
            })
            this.setData({
                innerInitData: data
            })
        }
    },

    attached: function() {
        console.log('组件初始化', this.properties.initData)
        let data = this.properties.initData.filter(e=>{
            return e.type;
        })
        this.setData({
            innerInitData: data
        })
    },
    ready(){
        this.createSelectorQuery().selectAll('.content-size').boundingClientRect().exec(res => {
            console.log(res[0])
            this.data.contentSize.push(res[0][0].width);
            console.log(this.data.contentSize)
        })
        let sys = wx.getSystemInfoSync()
        this.data.pr = sys ? sys.pixelRatio : 1;
    },

    /**
     * 组件的方法列表
     */
    methods: {
        insertEvent: function(e) {
            console.log(e)
            let self = this
            let index = e.currentTarget.dataset.index;
            let insertType = e.currentTarget.dataset.type
            switch (insertType) {
                case "image":
                    // 上传图片
                    wx.chooseImage({
                        count: 9,
                        supportSource: self.properties.supportType.image.supportSource,
                        sizeType: self.properties.supportType.image.sizeType,
                        success: (res) => {

                            wx.showLoading({
                                title: '上传中...'
                            })

                            let i = 0
                            res.tempFilePaths.forEach(item => {

                                uploadFile({ filePath: item }).then(resp => {

                                    i++
                                    const imageObj = {
                                        "type": "image",
                                        "src": resp.data.file_url,
                                        "mode": ""
                                    }

                                    if (index !== undefined) {
                                        self.data.innerInitData.splice(index + 1, 0, imageObj)
                                        let data = self.data.innerInitData.filter(e=>{
                                            return e.type;
                                        })
                                         self.setData({
                                            innerInitData: data
                                        }, ()=>{
                                            wx.pageScrollTo({
                                              scrollTop: self.data.scrollTop,
                                                duration: 0
                                            })
                                        })
                                        // this.setData({
                                        //     ['innerInitData['+ index +']']: imageObj
                                        // })
                                    } else {
                                        // self.data.innerInitData.push(imageObj)
                                        this.setData({
                                            ['innerInitData['+ self.data.innerInitData.length +']']: imageObj
                                        })
                                    }

                                    

                                    // this.setData({
                                    //     innerInitData: this.data.innerInitData
                                    // }, ()=>{
                                    //     wx.pageScrollTo({
                                    //       scrollTop: this.data.scrollTop,
                                    //         duration: 0
                                    //     })
                                    // })

                                    if (i == res.tempFilePaths.length) {

                                        wx.hideLoading()

                                        this.saveBlock()
                                    }




                                })


                            })


                        }
                    })
                    break
                case "text":

                    let len = self.data.innerInitData.length
                    console.log(self.data.innerInitData)
                    //如果最后一个文本框内容是空的 不让插入
                    if (self.data.innerInitData[len - 1].type == 'text' && self.data.innerInitData[len - 1].desc == '') {
                        return wx.showToast({
                            title: '请输入文字',
                            icon: 'none'
                        })
                    }

                    let txtObj = {
                            // 模块类型
                            "type": "text",
                            // 文本内容
                            "desc": "",
                        }


                    if (index !== undefined) {
                        self.data.innerInitData.splice(index + 1, 0, txtObj)
                        let data = self.data.innerInitData.filter(e=>{return e.type})
                        self.setData({
                            innerInitData: data
                        }, ()=>{
                            wx.pageScrollTo({
                              scrollTop: self.data.scrollTop,
                                duration: 0
                            })
                        })
                    } else {
                        // self.data.innerInitData.push({
                        //     // 模块类型
                        //     "type": "text",
                        //     // 文本内容
                        //     "desc": ""
                        // })
                        self.setData({
                            ['innerInitData['+ self.data.innerInitData.length +']']: txtObj
                        })
                    }


                    // self.setData({
                    //     innerInitData: self.data.innerInitData
                    // }, ()=>{
                    //                     wx.pageScrollTo({
                    //                       scrollTop: this.data.scrollTop,
                    //                         duration: 0
                    //                     })
                    //                 })

                    break

                    //如果是新增视频
                case "video":

                    wx.chooseVideo({
                        supportSource: self.properties.supportType.video.supportSource,
                        isCompress: self.properties.supportType.video.isCompress,
                        maxDuration: self.properties.supportType.video.maxDuration,
                        camera: self.properties.supportType.video.camera,
                        success:(res)=> {
                            console.log(res)
                            let vInfo=res;
                            wx.showLoading({
                                title: '上传中'
                            })
                            uploadFile({ filePath: res.tempFilePath }).then(res => {
                                let videoObj = {
                                        isEditing: true,
                                        // 模块类型
                                        "type": "video",
                                        // 视频地址
                                        "src": res.data.file_url,
                                        "vSize": {
                                            w: vInfo.width,
                                            h: vInfo.height
                                        },
                                        'cH': this.data.contentSize[0] ? vInfo.height*this.data.contentSize[0]*this.data.pr/vInfo.width : 0
                                    }

                                // if (index !== undefined) {
                                //     this.data.innerInitData.splice(index + 1, 0, videoObj)
                                // } else {
                                //     this.data.innerInitData.push(videoObj)
                                // }
                                if (index !== undefined) {
                                    self.data.innerInitData.splice(index + 1, 0, videoObj)
                                    let data = self.data.innerInitData.filter(e=>{return e.type})
                                     this.setData({
                                        innerInitData: data
                                    }, ()=>{
                                        wx.pageScrollTo({
                                          scrollTop: this.data.scrollTop,
                                            duration: 0
                                        })
                                    })
                                    // this.setData({
                                    //     ['innerInitData['+ index +']']: videoObj
                                    // })
                                } else {
                                    // self.data.innerInitData.push(videoObj)
                                    this.setData({
                                        ['innerInitData['+ self.data.innerInitData.length +']']: videoObj
                                    })
                                }


                                // this.setData({
                                //     innerInitData: this.data.innerInitData
                                // }, ()=>{
                                //     wx.pageScrollTo({
                                //       scrollTop: this.data.scrollTop,
                                //         duration: 0
                                //     })
                                // })

                                this.saveBlock()

                                wx.hideLoading()


                            }).catch(e => {
                                console.log(e)
                                wx.showToast({
                                    title: e,
                                    icon: 'none'
                                })

                                wx.hideLoading()
                            })

                        }
                    })



                    break
            }
          
        },
        deleteBlock: function(e) {
            let index = e.currentTarget.dataset.index
            if (this.data.innerInitData.length == 1) {
                return wx.showToast({
                    title: '内容不能为空',
                    icon: 'none'
                })
            }
            // this.data.innerInitData.splice(index, 1)
            this.data.innerInitData[index] = {}
            this.setData({
                ['innerInitData['+ index +']']: this.data.innerInitData[index],
                curIndex: -1,
                newCurIndex: -1
            })
            this.saveBlock()
        },
        //保存数据
        saveBlock: function() {

            console.log('触发saveblock')

            let data = this.data.innerInitData.filter( e => {
                return e.type
            })

            this.triggerEvent('updateData', data)

        },
        tapEvent: function(e) {
            let index = e.currentTarget.dataset.index
            let type = e.currentTarget.dataset.type
            let self = this
            switch (type) {
                case "image":
                    // 上传图片
                    wx.chooseImage({
                        count: 9,
                        supportSource: self.properties.supportType.image.supportSource,
                        sizeType: self.properties.supportType.image.sizeType,
                        success: function(res) {

                            let i = 0;
                            res.tempFilePaths.forEach(item => {

                                uploadFile({ filePath: item }).then(res => {

                                    i++


                                    self.data.innerInitData[index].src = res.data.file_url


                                    self.setData({
                                        ['innerInitData['+ index +']']: self.data.innerInitData[index]
                                    })

                                    // self.setData({
                                    //     innerInitData: self.data.innerInitData
                                    // }, ()=>{
                                    // wx.pageScrollTo({
                                    //   scrollTop: this.data.scrollTop,
                                    //     duration: 0
                                    // })
                                    // })

                                    if (i == res.tempFilePaths.length) {
                                        self.saveBlock()
                                    }

                                })



                            })



                            return

                        }
                    })
                    break
                case "video":
                    wx.chooseVideo({
                        supportSource: self.properties.supportType.video.supportSource,
                        isCompress: self.properties.supportType.video.isCompress,
                        maxDuration: self.properties.supportType.video.maxDuration,
                        camera: self.properties.supportType.video.camera,
                        success: function(res) {

                            let vInfo=res;
                            wx.showLoading({
                                title: '上传中'
                            })
                            uploadFile({ filePath: res.tempFilePath }).then(res => {
                                let videoObj = {
                                    isEditing: true,
                                    // 模块类型
                                    "type": "video",
                                    // 视频地址
                                    "src": res.data.file_url,
                                    "vSize": {
                                        w: vInfo.width,
                                        h: vInfo.height
                                    },
                                    'cH': this.data.contentSize[0] ? vInfo.height*this.data.contentSize[0]*this.data.pr/vInfo.width : 0
                                }


                                this.setData({
                                    ['innerInitData['+ index +']']: videoObj
                                })

                                this.saveBlock()

                                wx.hideLoading()


                            }).catch(e => {
                                console.log(e)
                                wx.showToast({
                                    title: e,
                                    icon: 'none'
                                })

                                wx.hideLoading()
                            })

                            // self.data.innerInitData[index].src = res.tempFilePath
                            // console.log(self.data.innerInitData)

                            // self.setData({
                            //     ['innerInitData['+ index +']']: self.data.innerInitData[index]
                            // })


                            // self.setData({
                            //     innerInitData: self.data.innerInitData
                            // }, ()=>{
                            //         wx.pageScrollTo({
                            //           scrollTop: this.data.scrollTop,
                            //             duration: 0
                            //         })
                            //     })
                            // self.saveBlock()
                        }
                    })
            }

        },
        changeInput: function(e) {
            let index = e.currentTarget.dataset.index
            let self = this
            self.data.innerInitData[index].desc = e.detail.value
            // self.setData({
            //     innerInitData: self.data.innerInitData
            // })
            self.setData({
                ['innerInitData['+ index +']']: self.data.innerInitData[index]
            })
            this.saveBlock()

        },
        moveUp: function(e) {
            let index = e.currentTarget.dataset.index
            console.log(index)
            if (index == 0) {
                return
            }
            let self = this
            let thisData = self.data.innerInitData[index]
            let prevData = self.data.innerInitData[index - 1]
            self.data.innerInitData[index] = prevData
            self.data.innerInitData[index - 1] = thisData

            self.setData({
                ['innerInitData['+ index +']']: self.data.innerInitData[index],
                ['innerInitData['+ (index-1) +']']: self.data.innerInitData[index-1],
                newCurIndex: -1
            })

            // self.setData({
            //     innerInitData: self.data.innerInitData,
            //     newCurIndex: -1
            // })

            this.triggerEvent('moveItem', +index - 1)



            this.saveBlock()
            return false
        },
        moveDown: function(e) {
            let index = e.currentTarget.dataset.index
            console.log(index)
            if (index == this.data.innerInitData.length - 1) {
                return
            }

            let thisData = this.data.innerInitData[index]
            let nextData = this.data.innerInitData[index + 1]
            this.data.innerInitData[index] = nextData
            this.data.innerInitData[index + 1] = thisData
            this.setData({
                ['innerInitData['+ index +']']: this.data.innerInitData[index],
                ['innerInitData['+ (index+1) +']']: this.data.innerInitData[index+1],
                newCurIndex: -1
            })
            // this.setData({
            //     innerInitData: this.data.innerInitData,
            //     newCurIndex: -1
            // })

            this.triggerEvent('moveItem', +index + 1)

            this.saveBlock()
            return false
        },
        newItem: function(e) {
            let index = e.currentTarget.dataset.index
            if (this.data.newCurIndex === index) {
                this.setData({
                    newCurIndex: -1
                })
            } else {
                this.setData({
                    newCurIndex: index
                })
            }
        },
        pageScrollToPosition(selector) {
            wx.pageScrollTo({
                scrollTop: this.currentScrollTop,
                duration: 10,
                selector: selector
            })
        }
    },

    externalClasses: [
        'ctl-style',
        'op-style'
    ]
})