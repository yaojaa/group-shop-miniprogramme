import { $wuxGallery } from '../../wux/index';
const util = require('../../utils/util.js');
import Dialog from '../../vant/dialog/dialog';
const app = getApp();

Component({
  externalClasses: ['custom-class'],
  properties: {
    goodsItem: {
      type: Object,
      value: {store_cat:[]},
      observer: function (newVal, oldVal) {
        this.setClass();
      },
    }
  },
  options: {},
  relations: {},
  data: {
    classShow: false,
    classGoodsId: '',
    classList: [],
    checked: false
  },
  lifetimes: {
    attached: function () {
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  observers: {},
  methods: {
    // 设置分类
    onCloseClass() {
      this.setData({ classShow: false });
    },
    onSaveClass() {
        let store_cat = [];
        let goods_cat = [];
        this.data.classList.forEach(e=>{
            if(e.checked){
                store_cat.push(e.cat_id);
                goods_cat.push(e);
            }
        })


        this.setData({ classShow: false });

        if(!this.data.classGoodsId){
          this.triggerEvent('changeClass', {goods_cat: goods_cat});

          return;
        }

        wx.showLoading();
        util.wx.post('/api/seller/set_goods_cat',{
            "goods_id": this.data.classGoodsId,
            "store_cat": store_cat
        }).then((res) => {
          if(res.data.code == 200){
            wx.hideLoading();

            this.triggerEvent('changeClass', {classGoodsId: this.data.classGoodsId, goods_cat: goods_cat});

          }
        })
        .catch((e) => {

        })
    },
    onChange(e) {
        let index = e.currentTarget.dataset.index;
        console.log(index)
        this.setData({
            ['classList[' + index + '].checked']: !this.data.classList[index].checked
        });
    },
    toAddClass() {
      wx.navigateTo({
          url: '../class_edit/index'
      });
      this.onCloseClass();
    },
    setClass(){
        console.log('add-class',this.properties.goodsItem)
        if (this.properties.goodsItem) {
            this.data.classGoodsId = this.properties.goodsItem.goods_id

            this.getClassList(this.properties.goodsItem)
        }
    },
    getClassList(goods){
        wx.showLoading();
        util.wx.get('/api/seller/get_cat_list')
        .then((res) => {
          if(res.data.code == 200){
            wx.hideLoading();
            this.data.classList = res.data.data.cats.filter(e => {return e.enable == 1})

            this.data.classList.forEach(e=>{
                let checked = goods.store_cat.filter(c=>{
                    return c.cat_id == e.cat_id
                })
                e.checked = checked.length > 0;

            })

            this.setData({
              classList: this.data.classList,
              classShow: true
            })
          }
        })
        .catch((e) => {

        })
      },




  },
  ready() {

      this.setClass();
  }
});
