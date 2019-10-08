const app = getApp()
const util = require('../../../utils/util')
let index = 0

Page({
    data: {
        type: '', // 0 是添加 1是修改
        freight_tpl_name: '模版名称',
        freight_tpl_id: '',
        freight_tpl_info: [],
        newAreaData: {},
        DialogShowStatus: false,
        list: ['北京', '天津', '吉林省', '黑龙江省', '上海', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区']
    },

    /** 展示弹窗 */
    showDialog(e) {
        this.setData({
            newAreaData: { name: [], price: '', isNew: true },
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

    /** 初始化原始数据 */
    onLoad(options) {
        console.log(options)
        this.setData({
            type: options.type
        })
    },

    /** 添加地址 */
    addInfo() {
        const { freight_tpl_info, freight_tpl_name, freight_tpl_id } = this.data;
        if (!freight_tpl_name || !freight_tpl_info.length) {
            if (type === 0) { // 添加
                wx.showToast({
                    title: '缺少参数',
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

        const freight_tpl_info_null = freight_tpl_info.filter(item => {
            if (!item.name || !item.name.length || !item.price) {
                return true
            }
        })

        if (freight_tpl_info_null.length > 0) {
            wx.showToast({
                title: '缺少参数',
                icon: 'none'
            })
            return
        }

        const param = {
            freight_tpl_id, // 修改时填
            freight_tpl_name, // 模版名称
            freight_tpl_info: this.data.freight_tpl_info // 地区运费详情
        }

        util.wx.post('/api/supplier/set_freight_tpl', param).then(res => {
            if (res.data.code == 200) {
                Toast.success('添加修改运费模板成功');
                if (add.address_id == address.address_id) {
                    wx.removeStorageSync('userAddress')
                }
                this.getAddress()
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
        })
        wx.navigateBack();
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