import { $wuxGallery } from '../../wux/index'
const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';


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
      is_recommend:'',
        urls: [
           
        ]
    },
    lifetimes: {
      attached: function() {
        // 在组件实例进入页面节点树时执行
        this.setData({
          is_recommend:this.properties.item.is_recommend
        })
      },
      detached: function() {
        // 在组件实例被从页面节点树移除时执行
      }
   },
    methods: {
     moreAction(e){

      console.log(this.data)

      this.goods_id = e.currentTarget.dataset.id

        wx.showActionSheet({
          itemList: ['在主页隐藏', '在主页显示'],
          success :(res)=>{

            if(res.tapIndex == 0){

              this.switchInSite(0)

            }else if(res.tapIndex ==1){
              this.switchInSite(1)
            }

          },
          fail (res) {
            console.log(res.errMsg)
          }
        })
    },
    //切换个人主页显示
    switchInSite(status){
      wx.showLoading()
        util.wx.post("/api/seller/goods_change_recommend",{
            goods_id:this.goods_id,
            is_recommend:status  
        }).then(res=>{

         wx.hideLoading()


          if(res.data.code == 200){


             const tips = status==0?'主页已隐藏':'主页已显示'
                
                wx.showToast({
                    title:tips,
                    icon:'none'
                })

                this.setData({
                  is_recommend:status
                })

                //父组件接收
                // this.triggerEvent('recommend',{goods_id:this.goods_id,status})

          }else{
              

          }

           },res=>{
            wx.hideLoading()

            wx.showToast({
                    title:'设置失败请稍后重试',
                    icon:'none'
                })
           })
    },
       upDownGoods(e){

        const status = e.currentTarget.dataset.status
        const goods_id = e.currentTarget.dataset.id



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


    gofans(e){

          let id = e.currentTarget.dataset.id
          let name = e.currentTarget.dataset.name

        wx.navigateTo({
            url: '../fans/index?id=' + id+'&name='+name
        })


    },

    managePage(e){
  let id = e.currentTarget.dataset.id
  let delivery_method = e.currentTarget.dataset.delivery_method
  let goods_name = e.currentTarget.dataset.name

        wx.navigateTo({
            url: '../ordermanage/list?id=' + id+'&goods_name='+goods_name+'&delivery_method='+delivery_method,
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
    }
})