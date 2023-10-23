import count from './js/count'
import sum from './js/sum'
import { add } from './js/math'
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
import './sass/index.scss'
import './styl/index.styl'

// 因为 webpack 默认开启 tree shaking，不引入的自动删除，所以这里只有 add 函数被引入了
console.log(add(1, 0))
console.log(count(1, 2, 3, 4))
console.log(sum(1, 2))
