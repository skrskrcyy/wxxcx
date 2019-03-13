//app.js
App({
  


  onLaunch: function () {
    var that = this
    wx.getSetting({
      success(res){
        console.log(res)
      }
    })
    
    

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        var kScreenW=res.windowWidth
        var kScreenH=res.windowHeight
        that.globalData.kscreenH = kScreenH
        that.globalData.kscreenW = kScreenW
        that.globalData.ppx = 750/kScreenW
        console.log(that.globalData.ppx)
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)        
      },
    })

    


  },
  globalData: {
    kscreenH: 0,
    kscreenW:0,
    ppx:0
  },
  
  
})

