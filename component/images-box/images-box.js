// components/images-box/images-box.js
Component({
  externalClasses: ['imgs-box'],
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    imgs: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal, changedPath) {
        console.log(newVal, oldVal, changedPath)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})