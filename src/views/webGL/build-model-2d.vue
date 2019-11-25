<template>
  <div>
    <div class="parent" ref="parent">
      <div class="qita door">门</div>
      <div class="qita door">门</div>
      <div class="qita door">门</div>
      <div class="qita column">柱子</div>
      <div class="qita column">柱子</div>
      <div class="qita column">柱子</div>
      <div class="qita column">柱子</div>
      <div class="qita column">柱子</div>
      <div class="qita column">柱子</div>
      <div class="qita column">柱子</div>
      <div class="qita casement">窗户</div>
      <div class="qita casement">窗户</div>
      <div class="qita casement">窗户</div>
      <div
        class="box"
        v-for="(item, index) in foremostData"
        :key="index"
        :class="'box' + item.index"
        @mousemove="changefield"
        @mouseleave="changefield2"
        @click="clickDiv"
        @dblclick="dblclickDiv"
        :data-name="item.name"
        :data-location="item.location"
        :data-occuRate="item.occuRate"
        :data-setId="item.setId"
        :style="{
          bottom: item.position[0] / 24 + 80 + 'px',
          left: item.position[1] / 24 + 60 + 'px'
        }"
      >
        <div
          class="box-child"
          v-if="item.parentId"
          v-show="item.parentId == parentId"
        >
          子
        </div>
      </div>
    </div>
    <!-- 列头柜鼠标悬停html  -->
    <div class="menu menu2" v-show="showMenu2" ref="menu2">
      <ul>
        <li v-for="(item, index) in dataMeth" :key="index">
          <span class="raius"></span>
          <span class="dowon"></span>
          {{ item }}
        </li>
      </ul>
      <div class="close-btn" @click="hineMenu2" v-show="freezeShowMenu2">X</div>
    </div>
    <!-- 机柜悬停html -->
    <div class="menu menu3" v-show="showMenu3" ref="menu3">
      <ul>
        <li><label for="">名称：</label> {{ methName || "-" }}</li>
        <li><label for="">位置：</label> {{ location || "-" }}</li>
        <li><label for="">已用/未用：</label> {{ occuRate || "-" }}</li>
      </ul>
    </div>
    <!-- <div class="lable-title">{{ floorName }}</div> -->
  </div>
</template>

<script>
import { _debounce } from "@/utils/public.js";
export default {
  name: "importFeed",
  props: {
    //     第一个数组选项值
    foremostData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      methName: "", // 鼠标悬停字段1
      location: "", // 鼠标悬停字段2
      occuRate: "", // 鼠标悬停字段2
      currentId: 1,
      showMenu3: false,
      showMenu2: false,
      parentId: null,
      freezeShowMenu2: false,
      dataMeth: [
        "输出屏01",
        "整流器01",
        "低压系统开关01",
        "变压器1#",
        "变电站-天河F4"
      ],
      methName: ""
    };
  },
  methods: {
    //切换栏目
    changeSel(id) {
      console.log(id);
    },
    // 改变场数
    changefield: _debounce(function(e) {
      // 模糊匹配，通过接口获取数据
      this.enter(e);
    }),
    changefield2: _debounce(function() {
      // 模糊匹配，通过接口获取数据
      this.leave();
    }),
    enter(event) {
      const rect = event.target.getBoundingClientRect();
      const scrollTopY = this.$parent.$refs.isCollapse2d.scrollTop;
      const type = event.target.getAttribute("data-type");
      const parentId = event.target.getAttribute("data-setId");
      this.methName = event.target.getAttribute("data-name");
      this.location = event.target.getAttribute("data-location");
      this.occuRate = event.target.getAttribute("data-occuRate");
      if (parentId) {
        this.parentId = parentId;
        this.showMenu2 = true;
        this.$refs.menu2.style.left = rect.left - 60 + "px";
        this.$refs.menu2.style.top = rect.top + scrollTopY - 170 + "px";
      } else {
        if (!this.freezeShowMenu2) {
          this.showMenu2 = false;
        }
        this.$refs.menu3.style.left = rect.left - 70 + "px";
        this.$refs.menu3.style.top = rect.top + scrollTopY - 130 + "px";
        this.showMenu3 = true;
      }
    },
    leave() {
      this.showMenu3 = false;
      this.parentId = null;
      this.showMenu2 = false;
    },
    hineMenu2() {
      this.showMenu2 = false;
      this.freezeShowMenu2 = false;
      if (!this.freezeShowMenu2) {
        this.showMenu2 = false;
      }
    },
    clickDiv() {
      this.freezeShowMenu2 = true;
    },
    dblclickDiv() {
      // console.log("propsFlagFn");
      this.$emit("propsFlag", true);
    }
  },
  created() {
    const self = this;
  }
};
</script>

<style scoped lang="scss">
.parent {
  position: relative;
  width: 700px;
  height: 700px;
  .qita {
    color: #4760ba;
    position: absolute;
  }
  .qita:nth-child(1) {
    left: 30px;
    top: 45%;
  }
  .qita:nth-child(2) {
    left: 48px;
    bottom: 30px;
  }
  .qita:nth-child(3) {
    right: 30px;
    top: 45%;
  }
  .qita:nth-child(4) {
    top: 26px;
    left: 105px;
  }
  .qita:nth-child(5) {
    top: 352px;
    left: 105px;
  }
  .qita:nth-child(6) {
    bottom: 26px;
    left: 105px;
  }
  .qita:nth-child(7) {
    top: 26px;
    left: 352px;
  }
  .qita:nth-child(8) {
    top: 352px;
    left: 355px;
  }
  .qita:nth-child(9) {
    bottom: 26px;
    left: 352px;
  }
  .qita:nth-child(10) {
    top: 55%;
    right: 35px;
  }
  .qita:nth-child(11) {
    top: 70px;
    left: 16px;
  }
  .qita:nth-child(12) {
    left: 58%;
    bottom: 16px;
  }
  .qita:nth-child(13) {
    left: 74%;
    bottom: 16px;
  }
  .box {
    background-size: 100% !important;
    position: absolute;
    .box-child {
      margin-top: 2px;
      margin-left: 2px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      color: #fff;
      background-color: #5b78e7;
      text-align: center;
      border-radius: 10px;
    }
  }
  .box:hover {
    border: 1px dashed #5b78e7;
  }
  .box8 {
    width: 25.5px;
    height: 25.5px;
    background: url("../../assets/common/image/weimojian/peixian.png") no-repeat
      center;
  }
  .box7 {
    width: 13px;
    height: 35.4px;
    background: url("../../assets/common/image/weimojian/ODF.png") no-repeat
      center;
  }
  .box6 {
    width: 27.5px;
    height: 27.5px;
    background: url("../../assets/common/image/weimojian/lietou.png") no-repeat
      center;
  }
  .box5 {
    width: 18.83px;
    height: 20.83px;
    background: url("../../assets/common/image/weimojian/kongtiao.png")
      no-repeat center;
  }
  .box4 {
    width: 10px;
    height: 12.5px;
    background: url("../../assets/common/image/weimojian/DDF.png") no-repeat
      center;
  }
  .box3,
  .box2,
  .box1 {
    width: 25.5px;
    height: 25.5px;
    background: url("../../assets/common/image/weimojian/biaozhun.png")
      no-repeat center;
  }
}
.menu {
  width: 80px;
  background: #00bcd4;
  position: absolute;
  color: #000;
  padding: 10px 0;
  border-radius: 5px;
}
.menu li {
  padding: 4px 10px;
}
.menu2 li {
  cursor: inline;
  text-indent: 5px;
}
.menu2 li {
  cursor: inline;
  text-indent: 5px;
}
.menu li:hover {
  background: #7187f0;
  cursor: pointer;
}
.menu2 li:hover {
  background: transparent;
  cursor: inherit;
}
.menu2 li:nth-child(2):hover {
  background: #7187f0;
  background-clip: content-box;
  cursor: pointer;
}
.menu2 {
  width: 150px;
  background: rgba(22, 36, 74, 0.7);
  border-radius: 4px;
}
.menu2 .raius {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 1);
  border: 3px solid rgba(113, 135, 240, 1);
  border-radius: 50%;
  position: absolute;
  top: 8px;
  left: 10px;
}
.menu2 li {
  color: #fff;
  position: relative;
  padding-left: 30px;
  font-size: 14px;
}
.menu2 li .dowon {
  width: 8px;
  height: 9px;
  background: url(../../assets/common/image/arrow.png) no-repeat center;
  background-size: 100%;
  position: absolute;
  bottom: -4px;
  left: 12px;
}
.menu2 ul li:last-child .dowon {
  display: none;
}
.menu2::after {
  content: "";
  display: block;
  position: absolute;
  left: 50%;
  margin-left: -5px;
  bottom: -20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: rgba(22, 36, 74, 0.6);
}
.menu3 {
  width: 154px;
  background: rgba(22, 36, 74, 0.6);
  color: #fff;
}
.menu3 li label {
  color: rgba(255, 255, 255, 0.4);
}
.menu3::after {
  content: "";
  display: block;
  position: absolute;
  left: 50%;
  margin-left: -5px;
  bottom: -20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: rgba(22, 36, 74, 0.6);
}
</style>
