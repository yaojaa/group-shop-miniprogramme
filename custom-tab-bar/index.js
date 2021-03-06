Component({
  data: {
    active: 0,
    list: [
      {
        icon: 'home-o',
        text: '首页',
        url: '/pages/home/index'
      },
      {
        icon: 'description',
        text: '订单',
        url: '/pages/new-order-list/index'
      },
      {
        icon: 'friends-o',
        text: '团队',
        url: '/pages/supplier-list/index'
      },  
      {
        icon: 'user-circle-o',
        text: '我的',
        url: '/pages/my/index'
      }
    ]
  },

  methods: {
    onChange(event) {
      console.log(event)
      this.setData({ active: event.detail });
      wx.switchTab({
        url: this.data.list[event.detail].url,
        success:()=>{

        let page = getCurrentPages().pop();

        console.log(page)
        //我的 页面刷新 切换客服后不更新不行
        if (page.route == "pages/my/index" || page.route == 'pages/supplier-list/index') {
                      page.onLoad();

        }
 
 

        }
      })
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
});
