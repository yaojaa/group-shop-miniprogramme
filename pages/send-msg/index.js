const app = getApp()
const util = require('../../utils/util')
Page({
    data: {

        radio: 'new_goods',
        note:'',
        goods_id:'',
        disabled:false,
        text:'立即发送'
    },
    onChange(event) {
        console.log(event)
        this.setData({
            radio: event.detail
        });
    },
    onLoad: function(options) {

        if(options.id){
                   this.setData({
                        goods_id:options.id,
                        goods_name:options.name
                    }) 
               }else{
                wx.showToast({
                    title:'缺少参数goods_id或goods_name',
                    icon:'none'
                })
               }


    },
    bindTextAreaInput(e){
        this.data.note = e.detail.value
    },
    send(){
        wx.showLoading()
        util.wx.post('/api/seller/send_goods_tmp_msg',{
            type:this.data.radio,
            note:this.data.note,
            goods_id:this.data.goods_id
        }).then(res=>{

            wx.hideLoading()

            this.setData({
                disabled:true,
                text:'已发送'
            })

            wx.showToast({
                title:'发送成功',
                icon:'none'
            })

        }).catch(e=>{
            wx.hideLoading()

            wx.showToast({
                title:e.data.msg,
                icon:'none'
            })
        })
    }
})