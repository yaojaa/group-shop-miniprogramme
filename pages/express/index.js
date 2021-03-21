const app = getApp()
const util = require('../../utils/util.js')
let index = 0
let oldExpress=[]

Page({
    data: {
        express:[],
        user: '',
        goods: '',
        columns: [],
        comps: [],
        express_company: '',
        express_code: '',
        action_remark: '',
        get_user_name: '',
        get_user_avatar: '',
        traces: [],
        showTraces: false,
        checked: true,
        emsPopup: false,
        btnText:'返 回',
        send_msg:true,
        express_data:[
        {"name":"自动识别"}
        ]
        },
    handleEmsPopup(e) {
        this.setData({
          emsPopup: !this.data.emsPopup
        })

        index = e.currentTarget.dataset.index;
        this.saveOldExpress();
    },
    saveOldExpress() {
        oldExpress = [];

        this.data.express.forEach(e=>{
            let data = {
                express_company: e.express_company,
                express_code: e.express_code
            }
            if(e.express_id) data.express_id = e.express_id;

            
            oldExpress.push(data)
        })

        console.log('oldExpress',oldExpress)
    },
    onSend_msgChange({detail}){

        console.log(detail)

            this.setData({ send_msg: detail })

    },
    /**发送物流提醒通知**/
    send_msg_tips(){

        util.wx.post('/api/seller/send_delivery_notice',{
            order_id:this.data.order_id
        }).then(res=>{

            console.log(res)

            


        })

    },
    express_code_change(e){
        const code = e.detail.value
        const index = e.target.dataset.index
        console.log(e)
        if(code && code.length > 7){
            this.getCompenyByCode(code,index)
        }

    },

    getCompenyByCode(code,index){

        if(code.length < 5){ return}

        util.wx.post('/api/order/get_express_com',{
            express_code:code
        }).then(res=>{

            if(res.data.code == 200){
                 this.setData({
                    ['express[' + index + '].express_company']: res.data.data[0].expName,
                    columns: res.data.data.map(item => {
                        return item.expName
                    }),
                    btnText:'确认添加'
                })

              this.editExpress(index);

            }
            

        })

    },

    changeEms(e){
       const { value } = e.detail;

       this.setData({
            ['express[' + index + '].express_company']: value,
            emsPopup: !this.data.emsPopup
        })

       app.globalData.last_express = value



        this.setBtnStatus();
        this.editExpress(index);
    },
    onLoad: function(opt) {

        this.apiPrix = app.globalData.apiPrix


        this.data.order_sn = opt.sn
        this.data.order_id = opt.order_id

        wx.showLoading()

    

        util.wx.get('/api/user/get_express_byordersn',{
            order_sn:opt.sn
        })
        .then(res=>{

        wx.hideLoading()

        if(res.data.code == 200){

            const d = res.data.data

            this.setData({
                express:d.express,
                user:d.orderinfo.consignee,
                goods:d.detail[0].goods_name
            })

            wx.setNavigationBarTitle({
              title: this.data.user+'的快递单号' +this.data.goods
            })

        }else{


        //读取剪切板快递单号
        
        wx.getClipboardData({
              success :(res)=>{
                console.log('res',res)
               var patt = /[A-Za-z0-9]{12,35}/


               if(!patt.test(res.data)){
                return
               }

               if(res.data.match(patt).length>0){

                    var code = res.data.match(patt)[0]

                    const key = 'express['+(this.data.express.length-1)+'].express_code'
                 
                    wx.showModal({
                      title: "是否自动粘贴",
                      content:'检测到你可能复制了快递单号：' +code,
                      showCancel: true,
                      cancelText: "取消",
                      confirmText: "使用",
                      success:  (r)=>{
                            if (r.confirm) {
                            this.setData({
                            [key]:code
                              }
                            )

                            this.getCompenyByCode(code, this.data.express.length-1)

                             wx.setClipboardData({
                                   data: '',
                                   success() {
                                      wx.hideToast()
                                }
                            })

                            this.setData({
                                btnText:'确认添加'
                            })


                            }
                      }
                    })




                    

                  }
                
              }
            })

        }



        },res=>{
            wx.hideLoading()
        })





        let num = 0;

        for(let i in opt){
            if(i.indexOf('code') > -1){
                this.data.express.push({
                    express_code: opt['code' + num],
                    express_company: decodeURIComponent(opt['com'+ num]),
                    express_id: opt['id'+ num]
                })

                num ++;
            }
        }


        if(this.data.express.length == 0){
            this.data.express.push({
              express_company: app.globalData.last_express,
                express_code:''
            })
        }

        this.setData({
            order_id: opt.order_id,
            express: this.data.express
        })

        this.data.pindex = opt.pi
        this.data.cindex = opt.ci

        this.getData()
    },
    onSwitch(e) {
        this.setData({ checked: e.detail });
    },
    onChange(event) {
        const { value } = event.detail;
        this.data.express_company = value
    },
    close() {
        this.setData({
            showTraces: false
        })
    },
    // 删除
    delexpress(e) {
        let i = e.currentTarget.dataset.index;
        let currentExpress = this.data.express[i];

        wx.showModal({
          content: '确认要删除此快递单号吗？',
          success: (res)=> {
            if (res.confirm) {

                if(currentExpress.express_id){

                    wx.showLoading()

                    util.wx.post('/api/'+this.apiPrix+'/del_order_express', {
                        express_id: currentExpress.express_id
                    }).then(res => {

                            wx.showToast({
                                title: '删除一行成功'
                            })
                            
                            this.data.express.splice(i,1);
                            this.setData({
                                express: this.data.express
                            })
                        },res=>{

                            wx.showToast({
                                title: res.data.msg
                            })

                    })
                    .catch(res=>{

                     console.log(res)

                    })


                }else{
                    this.data.express.splice(i,1)
                    this.setData({
                        express: this.data.express
                    })
                }


                this.setBtnStatus();

                
            }
          }
        })

    },
    send() {
        const key = 'dataList['+this.data.pindex+']['+this.data.cindex+']'

         const keyExpress = 'dataList['+this.data.pindex+']['+this.data.cindex+'].express'

        let express = this.data.express.filter(e => {
            return e.express_company && e.express_code && !e.express_id
        })

        if(express.length == 0){
            wx.navigateBack()
            return;
        }

    
               wx.showLoading()
               util.wx.post('/api/'+this.apiPrix+'/add_order_express', {
                    order_id: this.data.order_id,
                    express: express
                }).then(res => {

                     wx.hideLoading()


                    if(res.data.code == 200){

                         wx.showToast({
                            title: '添加成功'
                        })

                         if(this.data.send_msg){
                            this.send_msg_tips()
                         }




                         if(this.data.pindex){
                             util.setParentData({
                             [keyExpress]: ['ok']
                             })
                         }else{
                             wx.navigateBack()
                         }

                       



                    }else{

                          wx.showToast({
                            title: res.data.msg
                        })


                    }
                        
                    })
                .catch(res=>{

                    console.log(res)

                })

   
    },

    setBtnStatus(){
        let express = this.data.express.filter(e => {
            return e.express_company && e.express_code && !e.express_id
        })

        console.log(express)

        this.setData({
            btnText: express.length == 0 ? '返 回' : '确 认 添 加'
        })

    },

    getData() {
        // util.wx.get('/api/index/get_express_code').then(res => {
        //     if (res.data.code == 200) {
                this.setData({
                    columns: this.data.express_data.map(item => {
                        return item.name
                    })
                })
        //     }
        // })
    },

    // 添加订单
    addExpress(){
        let flag = this.data.express.filter(e => {
            return !e.express_code || !e.express_company
        })
        if(flag.length > 0){
            wx.showModal({
              title: '',
              content: '请填写完整后再添加',
              showCancel:false
            })
            return;
        }
        this.data.express.push({
            express_company: this.data.express.length?this.data.express[this.data.express.length-1].express_company : '',
            express_code:""
        })
        this.setData({
            express: this.data.express
        })
    },


    inputDuplex(e){
        index = e.currentTarget.dataset.index;

        this.setData({
            ['express[' + index + '].express_code']: e.detail.value
        })

        this.setBtnStatus()

    },
    blurInput(e){
        let index = e.currentTarget.dataset.index;
        let code = e.detail.value



         this.setData({
            ['express[' + index + '].express_code']: code
        })

         this.getCompenyByCode(code,index)



    },
    saomaInput(e) {
        let index = e.currentTarget.dataset.index;
        let _this = this;
        wx.scanCode({
          success (res) {
            wx.showToast({
                title:'已识别单号',
                icon:'none'
            })
            _this.setData({
                ['express[' + index + '].express_code']: res.result
            })

            this.getCompenyByCode(res.result,index)



          },
          fail(res) {
            wx.showModal({
              title: '',
              content: '添加失败，请手动输入',
              showCancel:false
            })
          }
        })

    },
    checkexpress(e) {
        let data = '';
        let _i = 0;
        let _index = 0;
        index = e.currentTarget.dataset.index;

        this.data.express.forEach((e,i) => {
            if (e.express_code) {
                data += 'code'+ _i +'='+ e.express_code + '&com'+ _i +'='+ e.express_company + '&'
                _i++;
            }else if(i < index){
                _index ++;
            }
        })

        data += 'index='+ (index - _index) +'&order_id='+ this.data.order_id
            +'&user='+ this.data.user
            +'&order_sn='+ this.data.order_sn
            +'&goods='+ this.data.goods

        wx.navigateTo({
          url: '/pages/ems-detail/index?' + data
        })

    },
    editExpress(i) {

        let currentExpress = this.data.express[i];
        let old = oldExpress[i];

        console.log('编辑成功')

        if(currentExpress.express_id && (old.express_company != currentExpress.express_company || old.express_code != currentExpress.express_code)){

            wx.showLoading()

            util.wx.post('/api/'+this.apiPrix+'/edit_order_express', {
                express_id: currentExpress.express_id,
                express_code: currentExpress.express_code,
                express_company: currentExpress.express_company
            }).then(res => {

                    wx.showToast({
                        title: '编辑成功'
                    })

                    this.saveOldExpress();
                    
                },res=>{

                    wx.showToast({
                        title: res.data.msg
                    })

            })
            .catch(res=>{

             console.log(res)

            })


        }



    }

})