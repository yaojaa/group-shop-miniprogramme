import { $wuxGallery } from '../../wux/index'
const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';

console.log('dialog',Dialog)

Component({
    externalClasses: ['custom-class'],
    properties: {
        item: {
            type: Object,
            //wait、process、finish、error
            value: ''
        }
    },
    options: {},
    relations: {

    },
    data: {
        urls: [
           
        ]
    },
    methods: {
       upDownGoods(e){

        const status = e.currentTarget.dataset.status
        const goods_id = e.currentTarget.dataset.id


          console.log('e.currentTarget.dataset.status',e.currentTarget.dataset.status)

        const status_txt = status==1?'下架' :'上架'

        const tips_txt = status==1?'下架后将停止活动' :'上架后将出现在你的个人主页和可能被推荐到首页'

        Dialog.confirm({
          title: '确定要'+status_txt+'吗？',
          message: tips_txt,
          asyncClose: true,
          context:this
        })
          .then(() => {
            const _status = status==1 ? 2 : 1
            this.changeOnSale(goods_id, _status)
          })
          .catch(() => {
            Dialog.close();
          });

        },
      //调转到编辑页
      editPage(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: '../publish/publish?goods_id=' + url,
        })
    },

    changeOnSale(goods_id,status){

        util.wx.post("/api/seller/goods_change_on_sale",{
            goods_id,
            is_on_sale:status  
        }).then(res=>{
            if(res.data.code==200){
                Dialog.close()
            }else{
                 Dialog.close()
                wx.showToast({
                    title:res.data.msg,
                    icon:'none'
                })
            }
        })
    },


    

    managePage(e){
        let id = e.currentTarget.dataset.id

        wx.navigateTo({
            url: '../ordermanage/list?id=' + id,
        })

    },
    //删除商品
    delGoods(e){
        //api/seller/goods_del
        const id = e.currentTarget.dataset.id 

        wx.showModal({
            title:'确定要删除该商品吗？',
            content:'删除后不可恢复',
            success:(res)=>{
                if(res.confirm){
                    util.wx.post('/api/seller/goods_del',{
                        goods_id:id
                    }).then(res=>{
                        if(res.data.code == 200){
                            wx.showToast({
                                title:'删除成功',
                                icon:'none' 
                            })

                            this.triggerEvent('remove',id)


                        }else{
                             wx.showToast({
                                title:res.data.msg,
                                icon:'none' 
                            })
                        }
                    })
                }

            }
        })

    }
    },
    ready() {
        console.log(this.data.item)
    }
})