
<template>
    <el-container>
      <el-header style="height: 70px;">
          <el-tabs tab-position="top" @tab-click="handleClick ">
            <el-tab-pane label="Api" name="/api">
              <el-space wrap>
                <RouterLink to="/api/global">全局api</RouterLink>
                <RouterLink to="/api/setup">setup</RouterLink>
                <RouterLink to="/api/reactivity-core">reactivity-core</RouterLink>
                <RouterLink to="/api/reactivity-utilities">reactivity-utilities</RouterLink>
                <RouterLink to="/api/reactivity-advanced">reactivity-advanced</RouterLink>
                <RouterLink to="/api/lifecycle">lifecycle</RouterLink>
                <RouterLink to="/api/injection">injection</RouterLink>
                <RouterLink to="/api/helpers">helpers</RouterLink>
                <RouterLink to="/api/builtInDirective">builtInDirective</RouterLink>
                <RouterLink to="/api/builtInComp">builtInComp</RouterLink>
                <RouterLink to="/api/sfc">sfc</RouterLink>
                
                
              </el-space>
            </el-tab-pane>
            <el-tab-pane label="Guide" name="/guide">
              <el-space wrap>
                <RouterLink to="/guide/about">About</RouterLink>
                <RouterLink to="/guide/computed">computed</RouterLink>
                <RouterLink to="/guide/lifecycle">lifecycle</RouterLink>
                <RouterLink to="/guide/watch">watch</RouterLink>
                <RouterLink to="/guide/templateRefs">templateRefs</RouterLink>
                <RouterLink to="/guide/component">component</RouterLink>
                <RouterLink to="/guide/pinia">pinia</RouterLink>
                <RouterLink to="/guide/attr">attr</RouterLink>
                <RouterLink to="/guide/slot">slot</RouterLink>
                <RouterLink to="/guide/async">async</RouterLink>
                <RouterLink to="/guide/innerComponent">innerComponent</RouterLink>
                <RouterLink to="/guide/keepalive">keepalive</RouterLink>
                <RouterLink to="/guide/teleport">teleport</RouterLink>
                <RouterLink to="/guide/composables">composables</RouterLink>
                <RouterLink to="/guide/directive">directive</RouterLink>
                <RouterLink to="/guide/plugin">plugin</RouterLink>
              </el-space>
            </el-tab-pane>
          </el-tabs>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>

</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  router.push(tab.paneName as string)
}
</script>
<style scoped>
</style>
