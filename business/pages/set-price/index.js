const app = getApp()
const util = require('../../../utils/util')
let index = 0

Page({
    data: {
        type: 0, // 0 是添加 1是修改
        freight_tpl_name: '请填写规则名称',
        freight_tpl_id: '',
        freight_tpl_info: [],
        list: [
            { name: "北京", price: 0 },
            { name: "天津", price: 0 },
            { name: "吉林省", price: 0 },
            { name: "黑龙江省", price: 0 },
            { name: "上海", price: 0 },
            { name: "江苏省", price: 0 },
            { name: "浙江省", price: 0 },
            { name: "安徽省", price: 0 },
            { name: "福建省", price: 0 },
            { name: "江西省", price: 0 },
            { name: "山东省", price: 0 },
            { name: "河南省", price: 0 },
            { name: "湖北省", price: 0 },
            { name: "湖南省", price: 0 },
            { name: "广东省", price: 0 },
            { name: "广西壮族自治区", price: 0 },
            { name: "海南省", price: 0 },
            { name: "重庆", price: 0 },
            { name: "四川省", price: 0 },
            { name: "贵州省", price: 0 },
            { name: "云南省", price: 0 },
            { name: "西藏自治区", price: 0 },
            { name: "陕西省", price: 0 },
            { name: "甘肃省", price: 0 },
            { name: "青海省", price: 0 },
            { name: "宁夏回族自治区", price: 0 },
            { name: "新疆维吾尔自治区", price: 0 }
        ]
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
            freight_tpl_info: this.data.freight_tpl_info // 地区运费详情
        }

        util.wx.post('/api/supplier/set_freight_tpl', param)
            .then(res => {
                wx.showToast({
                    title: '设置运费模板成功',
                    icon: 'none'
                });
              
                    wx.redirectTo({
                        url:'../postageSetting/index?hasSelect='+0
                    })
                    
            }, res => {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
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