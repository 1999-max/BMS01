<template>
  <div class="tags">
    <el-tag 
      v-for="(item, index) in tags" 
      :key="item.path" 
      :closable="item.name !== 'home' ? true : false"
      :effect="$route.name === item.name ? 'dark' : 'plain' "
      @click="changeMenu(item)"
      @close="delMenu(item,index)"
      class="el-tag"
      size="small"
      >
      <!-- 当 item.name 不等于 'home' 时，标签将会是可关闭的 -->
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      tags: state => state.tab.tabsList
    }) //转为数组
  },
  methods:{
    ...mapMutations(['closeTag']),
    // 点击跳转
    changeMenu(item){
      this.$router.push({ name: item.name });
    },
    delMenu(item,index){
      this.closeTag(item); //调用方法
      const length = this.tags.length;
      // 未高亮点击删除直接删除 item.name删除项 this.$route.name已激活项
      if( item.name !== this.$route.name ){
        return
      }else{
        // 若就是最后一个删除，跳转到左边一个； length是删除前的长度 ；index是当前项
        if(index === length){ //表示删除的是最后一项
          this.$router.push({
            name: this.tags[index-1].name,
          })
        }else{
          // 高亮点击删除跳转到首页
          this.$router.push({
            name: this.tags[0].name,
          })
        }// else
      }//else - one     
    }
  }
}
</script>

<style lang="less" scoped > 
.tags{
  padding: 10px 20px;
  .el-tag{
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>

