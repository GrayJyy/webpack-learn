import count from './js/count'
import { add } from './js/math'
// 完整引入
// import 'core-js'
// 按需引入针对某一个兼容性问题
// import 'core-js/es/promise'
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
import './sass/index.scss'
import './styl/index.styl'

// 因为 webpack 默认开启 tree shaking，不引入的自动删除，所以这里只有 add 函数被引入了
console.log(add(1, 0))
console.log(count(1, 2, 3, 4))
document.getElementById('btn').onclick = function () {
  // webpack 魔法命名
  import(/* webpackChunkName: "math" */ './js/sum')
    .then(res => console.log(res.default(1, 2), '动态加载成功'))
    .catch(e => console.error(e))
}

new Promise(resolve => {
  setTimeout(() => {
    resolve()
  }, 1000)
})

console.log([1, 2].includes(1))

// 注册生成serviceWorker 有兼容性判断
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
