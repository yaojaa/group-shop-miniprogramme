const app = getApp()
const util = require('../../../utils/util')
let index = 0

Page({
    data: {
        DialogShowStatus: false,
        list: ['北京', '天津', '吉林省', '黑龙江省', '上海', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'],
        result: ['北京', '天津'],
        resourceData: [{ name: '北京，天津，吉林省', price: 5 }]
    },

    /** 展示弹窗 */
    showDialog(e) {
        this.setData({
            DialogShowStatus: true
        })
    },

    /** 初始化原始数据 */
    getData() {
        // 0 是添加 1是修改
        try {
            const value = wx.getStorageSync('postage');
            if (value) {
                this.setData({
                    resourceData: value
                })
            }
        } catch (e) {
            console.log('暂时为获取到数据')
        }

    },

    /** 添加地址 @TODO往后端接口填数据 */
    addInfo() {
        console.log('添加地区');
        // wx.showModal({
        //     title: '',
        //     content: '请填写完整后再添加',
        //     showCancel: false
        // })
        // this.setData({
        //     express: this.data.express
        // })
        wx.navigateBack();
    },

    /** 更新选择的地址 */
    changeArea(e) {
        this.setData({
            result: e.detail
        });
    }
})