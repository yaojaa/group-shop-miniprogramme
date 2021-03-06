const app = getApp()
const util = require('../../../utils/util')
import areaData from '../../../utils/area'


var areaList = []
for(var key in areaData.province_list){

    areaList.push({
        name:areaData.province_list[key],
        price:0
    })


}


Page({
    data: {
        type: 0, // 0 是添加 1是修改
        freight_tpl_name: '',
        freight_tpl_id: '',
        freight_tpl_info: [],
        list: areaList,
        hasSelect:'',
        freight_tpl_formula_mode:"1"
    },

    onformulaChange(event){

    this.setData({
      freight_tpl_formula_mode: event.detail
    })
    },

    onChange(e) {
        console.log(e)
        const index = e.currentTarget.dataset.index
        const key = 'list[' + index + '].price'
        this.setData({
            [key]: e.detail,
        })

        if(e.detail == -1){
            wx.showToast({
                title:'-1 表示当前地区不发货',
                icon:'none'
            })
        }
    },

    /** 初始化原始数据 */
    onLoad(options) {
        //如果是编辑
        if(options.id){

            this.data.freight_tpl_id = options.id


            this.getTplInfo(options.id)

        }


        if(options.hasSelect){
            this.setData({
                hasSelect:options.hasSelect
              })
        }


        // const that = this;
        // console.log(options)
        // if (+options.type === 1) {
        //     wx.getStorage({
        //         key: 'tpl_data',
        //         success: function(res) {
        //             console.log(res.data);
        //             const {freight_tpl_name, freight_tpl_id, freight_tpl_info_list} = res.data;
        //             that.setData({
        //                 type: options.type,
        //                 freight_tpl_name,
        //                 freight_tpl_id,
        //                 freight_tpl_info: freight_tpl_info_list
        //             });
        //         },
        //         fail: function(res){
        //             console.log('获取本地数据失败，值为：', res);
        //         }
        //     });
        // } else {
        //     that.setData({
        //         type: options.type
        //     });
        // }
    },

    getTplInfo(id){

        util.wx.get('/api/user/get_freight_tpl_detail',{
            freight_tpl_id:id
        })
        .then(res=>{

            this.setData({
                list: res.data.data.freight_tpl_info,
                freight_tpl_name:res.data.data.freight_tpl_name,
                freight_tpl_formula_mode:res.data.data.freight_tpl_formula_mode+'',
            })



        })



    },

    /** 展示弹窗 */
    showDialog(e) {
        this.setData({
            newAreaData: { name: [], price: ' ', isNew: true },
            DialogShowStatus: true
        })
    },

    /** 更新选择的地址 */
    changeArea(e) {

        this.setData({
            newAreaData: { name: e.detail, price: '', isNew: true }
        });
    },

    /** 弹框确认 */
    addAreaInfo() {
        if (this.data.newAreaData.name.length) {
            let newArray = this.data.freight_tpl_info;
            newArray.push(this.data.newAreaData)
            this.setData({
                freight_tpl_info: newArray
            })
        }
    },

    /** 添加地址 */
    addInfo() {


        //
        this.data.freight_tpl_info = []
        var price0length = 0
        this.data.list.forEach(item => {


            if(item.price==0){
                price0length+=1
            }


           this.data.freight_tpl_info.push(item)

        })

        if(this.data.list.length ==price0length){

            return  wx.showToast({
                    title: '请设置运费金额',
                    icon: 'none'
                })

        }




        const { freight_tpl_info, freight_tpl_name, freight_tpl_id } = this.data;
        if (!freight_tpl_name || !freight_tpl_info.length) {
            if (this.data.type === 0) { // 添加
                wx.showToast({
                    title: '请填写规格名字或设置运费金额',
                    icon: 'none'
                })
                return
            } else if (!freight_tpl_id) {
                wx.showToast({
                    title: '缺少参数',
                    icon: 'none'
                })
                return
            }
        }


        const param = {
            freight_tpl_id, // 修改时填
            freight_tpl_name, // 模版名称
            freight_tpl_info: this.data.freight_tpl_info, // 地区运费详情
            freight_tpl_formula_mode:this.data.freight_tpl_formula_mode
        }

        util.wx.post('/api/user/set_freight_tpl', param)
            .then(res => {

                if(res.data.code ==200){
                wx.showToast({
                    title: '设置运费模板成功',
                    icon: 'none'
                });

                    if(this.data.hasSelect){

                        this.data.hasSelect = res.data.data

                    }
              
                    wx.redirectTo({
                        url:'../postageSetting/index?hasSelect='+this.data.hasSelect
                    })
                }else{

             wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                });


                }

                    
            })
    },

    /** 修改当前模版list */
    changeView(e) {
        const idx = e.currentTarget.dataset.index;
        const freight_tpl_info = this.data.freight_tpl_info.map((item, index) => {
            if (index === idx) {
                item.isNew = true
            }
            return item
        });
        this.setData({
            freight_tpl_info
        })
    },

    /** 删除当前模版list */
    deleteItem(e) {
        const idx = e.currentTarget.dataset.index;
        const freight_tpl_info = this.data.freight_tpl_info.filter((item, index) => index !== idx);
        this.setData({
            freight_tpl_info
        })
    },

    /** 更新模版item名称的内容 */
    onChangePanName(event) {
        this.setData({
            freight_tpl_name: event.detail
        })
    },

    /** 更新当前模版list金额 */
    onChangePrice(e) {
        const idx = e.currentTarget.dataset.index;
        const freight_tpl_info = this.data.freight_tpl_info.map((item, index) => {
            if (index === idx) {
                item.price = e.detail
            }
            return item
        });
        this.setData({
            freight_tpl_info
        })
    }
})