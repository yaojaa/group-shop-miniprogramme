let isIPhoneX = null;
function getIsIPhoneX() {
    return new Promise((resolve, reject) => {
        if (isIPhoneX !== null) {
            resolve(isIPhoneX);
        }
        else {

            const {model,screenHeight} = getApp().globalData.systemInfo

                    console.log('getApp().globalData.systemInfo',model,screenHeight)

            wx.getSystemInfo({
                success: ({ model, screenHeight }) => {
                    console.log('wx.getSystemInfo')
                    const iphoneX = /iphone x/i.test(model);
                    const iphoneNew = /iPhone11/i.test(model) && screenHeight === 812;
                    isIPhoneX = iphoneX || iphoneNew;
                    resolve(isIPhoneX);
                },
                fail: reject
            });
        }
    });
}
export const iphonex = Behavior({
    properties: {
        safeAreaInsetBottom: {
            type: Boolean,
            value: true
        }
    },
    created() {
        getIsIPhoneX().then(isIPhoneX => {
            this.set({ isIPhoneX });
        });
    }
});
