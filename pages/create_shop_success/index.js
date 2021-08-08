Page({
    data: {
        buttons: [{
                type: 'balanced',
                block: true,
                text: '立即查看',
            },
            {
                type: 'light',
                block: true,
                text: '返回',
            },
        ],
    },
    onClick(e) {
        console.log(e)
        const { index } = e.detail

        index === 0 && wx.redirectTo({
            url:'../userhome/index'
          })

        index === 1 && wx.navigateBack()
    },
})