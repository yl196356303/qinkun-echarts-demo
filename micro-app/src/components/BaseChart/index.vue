<template>
  <div class="chart" ref="chartRef"></div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { init as echartsInit } from 'echarts'

const unwarp = (obj) => {
  return obj && (obj.__v_raw || obj.valueOf() || obj)
}

export default {
  name: 'BaseChart',
  props: {
    options: {
      type: Object,
      required: true
    },
    autoRender: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { expose }) {
    onMounted(() => {
      init()
      if (props.autoRender) {
        render()
      }
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resize)
    })
    
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const init = () => {
      chartInstance.value = echartsInit(chartRef.value)
      window.addEventListener('resize', resize)
    }

    const render = () => {
      unwarp(chartInstance.value).setOption(props.options, !props.autoRender)
    }

    const resize = () => {
      chartInstance.value.resize() 
    }

    const getInstance = () => {
      return chartInstance.value
    }

    watch(() => props.options, () => {
      render()
    })
    
    expose({
      render,
      resize,
      getInstance
    })

    return {
      chartRef
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100% !important;
}
</style>