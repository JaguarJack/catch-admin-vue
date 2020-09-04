<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div v-for="item of elementIcons" :key="item" style="width: 15px" @click="selectElementIcon(item)">
            <div class="icon-item">
              <i :class="'el-icon-' + item" />
              <span style="font-size: 10px;">el-icon-{{ item }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import elementIcons from './element-icons'

export default {
  name: 'Icons',
  data() {
    return {
      elementIcons
    }
  },
  methods: {
    selectElementIcon(item) {
      this.$emit('selectIcon', 'el-icon-' + item)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
