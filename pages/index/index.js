var app=getApp()
var contactAndGet = require("../../utils/require.js")
const { $Message } = require('../../component/base/index');



const MENU_WIDTH_SCALE = 0.82;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    
    url:'https://www.xzikeji.com/dikanong/getthree.php',
    spinShow:true,
    activity: [{src:'/static/images/4.jpg'}],
    indicator_dots:true,
    circular:true,
    //活动框图
    userInfo:{},//用户的头像，网名
    hasUserInfo:false,//是否得到了userinfo
    
    kscreenH:0,
    autoplay:false,
    curIndex:0,
    
    loading:true,
    postsShowSwiperList: [],//swiper信息
    listHas:false,
    dead:[],
    error_content: '',
  },

  

  stopDrag(){
return false;
},
  
  imageLoad:function(res){
    
    this.setData({
      spinShow: false
    })
  },
  handleError() {
    var that = this
    $Message({
      content: that.data.error_content,
      type: 'error',
      duration: 3
    });
  },
  
  zhongjian(){
    console.log('传递tap事件')
  },

  
  /*点击swiper图片跳转至活动详情页面*/
  tapActivities:function(events){
    
    wx.navigateTo({
      url: '../detail/detail?id=' + events.currentTarget.dataset.id +'&people=' + events.currentTarget.dataset.join_count,
    })
  },
  tap_to_clubs:function(events){
    wx.navigateTo({
      url: '../all_clubs/all_clubs',
    })
  },
  tap_to_mine:function(events){
    wx.navigateTo({
      url: '../mine-login/mine-login',
    })
  },





  login: function () {
    var that = this

    // 登录
    wx.login({//将userinfo放入globaldata中，还没放入data中
      success: res => {
        // 发送 res.code 到后台rang hou tai 换取 openId, sessionKey, unionId
        if (res.code) {
          var codd = res.code;
          wx.request({
            url: 'https://www.xzikeji.com/dikanong/index.php',
            data: {
              'code': codd
            },

            header: { 'Content-Type': 'application/json' },
            success: function (res) {
              console.log('第一次内容')
              console.log(typeof (codd))
              console.log(codd)
              console.log(res.data)
              wx.setStorageSync('se', res.data.se)
              setTimeout(function () {
                
                wx.setStorageSync('se', 0)

              }, 330000)
              wx.setStorageSync('id', res.data.id)
              wx.setStorageSync('openid', res.data.openid)

            },
            fail: function () {
              console.log(1)
              that.setData({
                error_content: '请确保网络状态良好',
              })
              that.handleError()
              
            }

          })


        }
      },
      fail: function (res) {
        console.log(2)
        that.setData({
          error_content: '请确保网络状态良好',
        })
        that.handleError()
        
      }
    })
  },

  getThree: function () {
    var that = this

    var information = {
      url: that.data.url,
      dataForm: ''
    }
    contactAndGet.contactAndGet(information,function(res){
      console.log(res.data)
      var list = []
      var dead = []
      var a = res.data
      a.forEach(function (i) {
        if (i.name != null) {
          list.push(i)
          that.setData({
            listHas: true
          })
        }
      })
      that.setData({
        postsShowSwiperList: list,

      })
      for (let i = 0; i < that.data.postsShowSwiperList.length; i++) {
        var t1 = new Date(that.data.postsShowSwiperList[i].time-0)
        console.log(that.data.postsShowSwiperList[i].time)
        console.log(t1)
        that.timepan(t1,i)
      }
      
      console.log(that.data.dead)
      console.log(that.data.postsShowSwiperList)
    })
  },

  timepan: function (t1,i) {
    var that = this
    


    //时间判断
    
    var t2 = new Date()
    console.log(t1)

    //开始比较
    var year1 = t1.getFullYear()
    var month1 = t1.getMonth() + 1
    var date1 = t1.getDate()
    var hour1 = t1.getHours()
    var minute1 = t1.getMinutes()

    

    var year2 = t2.getFullYear()
    var month2 = t2.getMonth() + 1
    var date2 = t2.getDate()
    var hour2 = t2.getHours()
    var minute2 = t2.getMinutes()

    if (year1 - year2 > 0) {
      let dead = that.data.dead
      dead[i] = false
      that.setData({
        dead: dead
      })
      return
    } else if (year1 - year2 < 0) {
      let dead = that.data.dead
      dead[i] = true
      that.setData({
        dead: dead
      })
      return
    } else if (month1 - month2 > 0) {
      let dead = that.data.dead
      dead[i] = false
      that.setData({
        dead: dead
      })
      return
    } else if (month1 - month2 < 0) {
      let dead = that.data.dead
      dead[i] = true
      that.setData({
        dead: dead
      })
      return
    } else if (date1 - date2 > 0) {
      let dead = that.data.dead
      dead[i] = false
      that.setData({
        dead: dead
      })
      return
    } else if (date1 - date2 < 0) {
      let dead = that.data.dead
      dead[i] = true
      that.setData({
        dead: dead
      })
      return
    } else if (hour1 - hour2 > 0) {
      let dead = that.data.dead
      dead[i] = false
      that.setData({
        dead: dead
      })
      return
    } else if (hour1 - hour2 < 0) {
      let dead = that.data.dead
      dead[i] = true
      that.setData({
        dead: dead
      })
      return
    } else if (minute1 - minute2 > 0) {
      let dead = that.data.dead
      dead[i] = false
      that.setData({
        dead: dead
      })
      return
    } else if (minute1 - minute2 < 0) {
      let dead = that.data.dead
      dead[i] = true
      that.setData({
        dead: dead
      })
      return
    } else {
      let dead = that.data.dead
      dead[i] = false
      that.setData({
        dead: dead
      })
      return
    }
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    

    var kscreenH = app.globalData.kscreenH
    this.setData({
      kscreenH: kscreenH
    })
    console.log(kscreenH)
    console.log(kscreenH*0.332)
    var that = this

    this.login()
    this.getThree()
    
    this.setData({
      made:true
    })
    console.log(0.5*this.data.kscreenH )
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    setTimeout(function(){
      that.setData({
        spinShow:false
      })
    },4000)

    console.log('用到了onready')
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
   
    console.log('用到了onshow')
    this.setData({
      autoplay:true
    })
    
    if (!this.data.made) {
    wx.showNavigationBarLoading()   
      this.getThree()
      
    wx.hideNavigationBarLoading()
    }
    this.setData({
      made: false
    })  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
    this.setData({
      autoplay:false
    })
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})