import fetch from 'axios'
const baseUrl = 'https://yun.lingzhixin.com'

// 获取中国地图 geojson
export function getChainGeoJson() {
  return fetch({
    url: `${baseUrl}/map-json/china.json`,
    method: 'GET'
  })
}

// 获取省级 geojson
export function getProvinceGeoJson(code) {
  return fetch({
    url: `${baseUrl}/map-json/province/${code}.json`,
    method: 'GET'
  })
}

// 获取市级 geojson
export function getCityGeoJson(code) {
  return fetch({
    url: `${baseUrl}/map-json/city/${code}.json`,
    method: 'GET'
  })
}

// 获取县级 geojson
export function getCountyGeoJson(code) {
  return fetch({
    url: `${baseUrl}/map-json/county/${code}.json`,
    method: 'GET'
  })
}