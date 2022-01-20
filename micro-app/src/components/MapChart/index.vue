<template>
  <div v-if="isEmptyRender" class="empty-map">
    暂无地图
  </div> 
  <base-chart v-else ref="chartRef" :options="genOptions" :autoRender="false" />
</template>

<script>
import { registerMap } from 'echarts'
import { useStore } from 'vuex'
import BaseChart from '@/components/BaseChart'
import { computed, ref, reactive, onMounted, toRefs } from 'vue'
import { provinces, cityMap, county, special } from './map-data'
import {
  getChainGeoJson,
  getProvinceGeoJson,
  getCityGeoJson,
  getCountyGeoJson,
} from '@/api'

export default {
  name: 'MapChart',
  components: { BaseChart },
  props: {
    // map tooltip 提示框类型：1->师资对比，2->师范学校，3->家长活动
    type: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit, expose }) {
    const store = useStore()
    const chartRef = ref()
    const dataMap = reactive({
      // 初始化根数据
      rootInfo: {
        data: [],
        geoJson: {}
      },
      mapData: [],
      mapName: 'Chain',
    })

    onMounted(() => {
      drawMap()
      chartRef.value.getInstance().on('click', params => handleChartClick(params))
    })

    const setRenderMapData = (mapData) => {
      dataMap.mapData = mapData
    }

    const isEmptyRender = ref(false)
    const drawMap = () => {
      loadChainMap()
    }
    const loadChainMap = () => {
      getChainGeoJson().then(({ data: res }) => {
        const d = res.features.map(({ properties }) => ({
          name: properties.name,
          value: properties.adcode || properties.id + '0000'
        }))
        dataMap.rootInfo.data = d
        dataMap.rootInfo.geoJson = res
        //注册地图
        registerMap(dataMap.mapName, res);
        //绘制地图
        setRenderMapData(d)
      })
    }
    const loadProvinceMap = (name, isFirstRender) => {
      getProvinceGeoJson(provinces[name]).then(({ data: res }) => {
        registerMap(dataMap.mapName, res)
        // 删除cp这个属性，echarts会自动计算标签居中
        const d = res.features.map(item => {
          return {
            name: item.properties.name,
            value: item.id
          }
        })
        if (isFirstRender) {
          dataMap.rootInfo.data = d
          dataMap.rootInfo.geoJson = res
        }
        setRenderMapData(d)
      })
    }
    const loadCityMap = (name, isFirstRender) => {
      getCityGeoJson(cityMap[name]).then(({ data: res }) => {
        registerMap(dataMap.mapName, res)
        const d = res.features.map(({ properties }) => ({
          name: properties.name,
          value: county[properties.name]
        }))
        if (isFirstRender) {
          dataMap.rootInfo.data = d
          dataMap.rootInfo.geoJson = res
        }
        setRenderMapData(d)
      })
    }
    const loadCountyMap = async (name, isFirstRender) => {
      getCountyGeoJson(county[name]).then(({ data: res }) => {
        registerMap(dataMap.mapName, res)
        const d = res.features.map(({ properties }) => {
          const data = {
            name: properties.name,
          }
          return data
        })
        if (isFirstRender) {
          dataMap.rootInfo.data = d
          dataMap.rootInfo.geoJson = res
        }
        setRenderMapData(d)
      })
    }
    const handleChartClick = async params => {
      if (params.value in provinces) {
        //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
        loadProvinceMap(params.value, false)
      } else if (params.name in cityMap) {
        // 直辖市和特别行政区-只有二级地图，没有三级地图
        if (special.includes(params.name)) {
          registerMap(dataMap.mapName, dataMap.rootInfo.geoJson)
          setRenderMapData(dataMap.rootInfo.data)
        } else {
          //显示县级地图
          loadCityMap(params.name, false)
        }
      } else if (params.name in county) {
        //显示镇级地图
        loadCountyMap(params.name, false)
      } else {
        registerMap(dataMap.mapName, dataMap.rootInfo.geoJson)
        setRenderMapData(dataMap.rootInfo.data)
      }
    }

    const genOptions = computed(() => {
      const options = {
        tooltip: {
          trigger: 'item',
          position: (point, params, dom, rect, size) => {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            // 提示框位置
            let x = 0 // x坐标位置
            let y = 0 // y坐标位置 // 当前鼠标位置

            const pointX = point[0]
            const pointY = point[1] // 外层div大小 // var viewWidth = size.viewSize[0]; // var viewHeight = size.viewSize[1]; // 提示框大小

            const boxWidth = size.contentSize[0]
            const boxHeight = size.contentSize[1] // boxWidth > pointX 说明鼠标左边放不下提示框

            if (boxWidth > pointX) {
              x = pointX + 10
            } else {
              // 左边放的下
              x = pointX - boxWidth - 10
            } // boxHeight > pointY 说明鼠标上边放不下提示框

            if (boxHeight > pointY) {
              y = 5
            } else {
              // 上边放得下
              y = pointY - boxHeight
            }

            return [x, y]
          },
          formatter: params => {
            return params.name
          }
        },
        geo: [
          // 外边框高亮
          {
            map: dataMap.mapName,
            zlevel: -1,
            zoom: 1,
            silent: true,
            layoutCenter: ['50%', '50%'],
            layoutSize: '98%',
            roam: false,
            itemStyle: {
              borderColor: 'rgba(192,245,249,.8)',
              borderWidth: 3,
              shadowColor: '#F2A447',
              shadowOffsetY: 0,
              shadowBlur: 10,
            }
          },
          // 中层图
          {
            type: 'map',
            map: dataMap.mapName,
            zlevel: -2,
            zoom: 1,
            layoutCenter: ['50%', '51.4%'],
            layoutSize: '98%',
            roam: false,
            silent: true,
            itemStyle: {
              borderColor: 'rgba(6, 20, 64, .5)',
              shadowColor: 'rgba(6, 20, 64, .8)',
              shadowOffsetY: 5,
              shadowBlur: 15,
              areaColor: '#257AB2',
            }
          },
          // 底图
          {
            type: 'map',
            map: dataMap.mapName,
            zlevel: -3,
            zoom: 1,
            layoutCenter: ['50%', '52.4%'],
            layoutSize: '98%',
            roam: false,
            silent: true,
            itemStyle: {
              borderColor: 'rgba(6, 20, 64, .5)',
              shadowColor: 'rgba(6, 20, 64, .8)',
              shadowOffsetY: 15,
              shadowBlur: 8,
              areaColor: '#0A2763'
            }
          }
        ],
        series: [
          {
            type: 'map',
            map: dataMap.mapName,
            roam: false, //地图设置可拖拽，固定的
            zoom: 1, //当前视角的缩放比例
            layoutSize: '98%',
            layoutCenter: ['50%', '50%'],
            label: {
              show: true,
              color: '#fff',
            },
            emphasis: {
              label: {
                color: '#fff',
              },
              itemStyle: {
                areaColor: '#2AB8FF',
                borderWidth: 0,
              }
            },
            itemStyle: {
              borderColor: '#F2A447',
              borderWidth: 2,
              areaColor: {
                type: 'linear-gradient',
                x: 0,
                y: 0,
                x2: 450,
                y2: 500,
                colorStops: [{
                    offset: 0.3,
                    color: '#00A3F8' // 0% 处的颜色
                }, {
                    offset: 1,
                    color: '#012167' // 50% 处的颜色
                }],
                global: true // 缺省为 false
              },
            },
            data: dataMap.mapData
          }
        ]
      }

      return options
    })

    expose({
      mapClick: handleChartClick
    })

    return {
      genOptions,
      chartRef,
      ...toRefs(dataMap),
      isEmptyRender
    }
  }
}
</script>

<style lang="scss" scoped>

</style>