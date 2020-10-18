<template>
  <div class="box">
    <div class="list-view" ref="listView">
      <ul>
        <li v-for="(group,index) in singers" class="list-group" :key="group.id" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li v-for="(item,index) in group.items" class="list-group-item" :key="item.id">
              <img v-lazy="item.avatar" class="avatar">
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="list-shortcut">
        <ul>
          <li v-for="(item,index) in shortcutList" class="item" :data-index="index" :key="item.id" @touchstart="onShortcutStart"
            @touchmove.stop.prevent="onShortcutMove" :class="{'current': currentIndex === index}">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import singers from '../../../static/ScrollList.js'
  export default {
    name: 'ListView',
    data() {
      return {
        singers,
        scrollY: 0,
        currentIndex: 0
      }
    },
    mounted() {
      this._initScroll();
      this._calculateHeight();
    },
    created() {
      this.touch = {};
      // 初始化 better-scroll 必须等dom加载完毕
      /* setTimeout(() => {
         this._initScroll();
         this._calculateHeight();
       }, 20)*/
    },
    methods: {
      _initScroll() {
        this.scroll = new BScroll(this.$refs.listView, {
          probeType: 3,
          click: true
        })
        this.scroll.on('scroll', (pos) => {
          this.scrollY = pos.y
        })
      },
      onShortcutStart(e) {
        let index = e.target.getAttribute('data-index');
        this.scrollToElement(index)

        let firstTouch = e.touches[0].pageY
        this.touch.y1 = firstTouch
        this.touch.anchorIndex = index
      },
      onShortcutMove(e) {
        let touchMove = e.touches[0].pageY
        this.touch.y2 = touchMove
        // 这里的16.7是索引元素的高度
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / 16.7)

        let index = this.touch.anchorIndex * 1 + delta
        this.scrollToElement(index)
      },
      scrollToElement(index) {
        if (index < 0) {
          return
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }

        this.scrollY = -this.listHeight[index]
        this.scroll.scrollToElement(this.$refs.listGroup[index])
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        list.forEach((item, index) => {
          height += item.clientHeight
          this.listHeight.push(height)
        })
      }
    },
    watch: {
      scrollY(newVal) {
        // 向下滑动的时候 newVal 是一个负数，所以当 newVal > 0 时，currentIndex 直接为 0
        if (newVal > 0) {
          this.currentIndex = 0
          return
        }

        // 计算 currentIndex 的值
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]

          if (-newVal >= height1 && -newVal < height2) {
            this.currentIndex = i
            return
          }
        }

        // 当超 -newVal > 最后一个高度的时候
        // 因为 this.listHeight 有头尾，所以需要 - 2
        this.currentIndex = this.listHeight.length - 2
      }
    },
    computed: {
      shortcutList() {
        return this.singers.map((group) => {
          return group.title.substr(0, 1)
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  .box {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .list-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgb(233, 233, 233);

    .list-group {
      padding-bottom: 30px;

      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 12px;
        color: #FFF;
        background-color: #c20c0c;
      }

      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 5%;
        }

        .name {
          margin-left: 20px;
          color: black;
          font-size: 14px;
        }
      }
    }

    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: rgba(167, 167, 167, 0.5);
      font-family: Helvetica-Light;

      .item {
        padding: 3px;
        line-height: 1;
        color: black;
        font-size: 11px;

        &.current {
          color: #c20c0c;
        }
      }
    }
  }
</style>