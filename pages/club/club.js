var app = getApp();
var contactAndGet = require("../../utils/require.js");
const { $Message } = require('../../component/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow:true,
    act_list:[],
    
    kscreenH:0,
    
    all_acts:[],//俱乐部中所有活动
    haveAct:true,
    club_name:'',
    dead:[],//是否过期
    ingtime:[],//标准的时间格式
    url:'https://www.xzikeji.com/dikanong/dkpartyshow.php',//访问php文件的地址，每次访问不同的php文件时都得先给这个赋上相应的值
    dataForm:{},//用于包含住网络访问的data数据包
    res:{},//用来保存php文件返回的信息
    font_name:'',
    src: '/static/images/3.jpeg',
    kscreenH: 0,
    title:'活动项目',
    error_content:''
  },
  


 
  tap_to_detail:function(event){
    wx.navigateTo({
      url: '../detail/detail?id=' + event.currentTarget.dataset.actId + '&people=' + event.currentTarget.dataset.people,
    })
  },
 

  GetClubAct:function(){
    var that = this
    var a = '1'
    console.log(a)

    var information = {
      url: that.data.url,
      dataForm: that.data.dataForm,
    }

    contactAndGet.contactAndGet(information, function (e) {
      if (e.data.club_name) {
        var dead = []
        var ingtime = []
        console.log(e.data)
        that.setData({
          all_acts: e.data.club_name,
          haveAct: true
        })
        for (let i = 0; i < that.data.all_acts.length; i++) {
          var t1 = new Date(that.data.all_acts[i].act_time - 0)
          var t2 = new Date()
          console.log(t1)

          //开始比较
          var year1 = t1.getFullYear()
          var month1 = t1.getMonth() + 1
          var date1 = t1.getDate()
          var hour1 = t1.getHours()
          var minute1 = t1.getMinutes()

          if (0 <= month1 && month1 <= 8) {
            var y = '0' + month1
          }
          else {
            var y = month1
          }
          if (1 <= date1 && date1 <= 9) {
            var d = '0' + date1
          }
          else {
            var d = date1
          }
          if (0 <= hour1 && hour1 <= 9) {
            var h = '0' + hour1
          }
          else {
            var h = hour1
          }
          if (0 <= minute1 && minute1 <= 9) {
            var m = '0' + minute1
          }
          else {
            var m = minute1
          }

          ingtime.push(year1 + '-' + y + '-' + d + ' ' + h + ':' + m + ':00')

          var year2 = t2.getFullYear()
          var month2 = t2.getMonth() + 1
          var date2 = t2.getDate()
          var hour2 = t2.getHours()
          var minute2 = t2.getMinutes()
          console.log(year1 - year2)
          console.log(month1 - month2)
          console.log(date1 - date2)
          console.log(hour1 - hour2)
          console.log(minute1 - minute2)

          if (year1 - year2 > 0) {
            dead.push(false)
            continue
          }
          else if (year1 - year2 < 0) {
            dead.push(true)
            continue
          }
          else if (month1 - month2 > 0) {
            dead.push(false)
            continue
          }
          else if (month1 - month2 < 0) {
            dead.push(true)
            continue
          }
          else if (date1 - date2 > 0) {
            dead.push(false)
            continue
          }
          else if (date1 - date2 < 0) {
            dead.push(true)
            continue
          }
          else if (hour1 - hour2 > 0) {
            dead.push(false)
            continue
          }
          else if (hour1 - hour2 < 0) {
            dead.push(true)
            continue
          }
          else if (minute1 - minute2 > 0) {
            dead.push(false)
            continue
          }
          else if (minute1 - minute2 < 0) {
            dead.push(true)
            continue
          }
          else {
            dead.push(false)
          }
        }
        that.setData({
          dead: dead,
          ingtime: ingtime
        })
      }
      else {
        that.setData({
          haveAct: false,
          spinShow:false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      font_name:options.club_name+'-活动'
    })
    var kscreenH = app.globalData.kscreenH
    this.setData({
      kscreenH: kscreenH
    })

    
    
    
    var that = this

    console.log(options.club_name) 
    this.setData({
      club_name:options.club_name
    })
    this.setData({
      dataForm: {'club_name':options.club_name}
    })
    console.log(this.data.dataForm)
    this.GetClubAct()
    console.log('用到了onload')
    this.setData({
      made: true
    })

    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    setTimeout(function () {
      that.setData({
        spinShow: false
      })
    }, 3000)
    
  },  

  loadSpin(res) {
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
  error_show() {
    var that = this
    that.setData({
      error_content: '请确保网络状态良好',
    })
    that.handleError()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.made){
    wx.showNavigationBarLoading()
    this.GetClubAct()
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