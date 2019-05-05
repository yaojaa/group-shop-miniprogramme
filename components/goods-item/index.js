import { $wuxGallery } from '../../wux/index'
const util = require('../../utils/util.js')

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
      //调转到编辑页
      editPage(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: '../publish/publish?goods_id=' + url,
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