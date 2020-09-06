# 每周总结可以写在这里

##### 第八周



### 伪元素

- \<::before/\>、\<:after/\>

- \<::first-letter\>\<:first-letter/\>

- \<::first-line\>\<:first-line/\>

- first-line可用属性

  - font系列
  - color系列
  - background
  - word-spacing
  - Letter-spacing
  - Text-decoration
  - text-transform
  - Line-height

- First-letter可用属性

  - ont系列
  - color系列
  - background
  - word-spacing
  - Letter-spacing
  - Text-decoration
  - text-transform
  - Line-height
  - float
  - vertical-align
  - 盒模型属性：margin、padding、border

### 盒模型

- Box-sizing: content-box
  - width = contenWIdth
- Box-sizing: border-box
  - width = contentWidth + padding + border
- 思考：为什么没有margin-box


### 正常流

- 正常流排版
  - 收集盒进行
  - 计算盒在行中的排布
  - 计算行的排布
- 正常流的行模型

### BFC（块级格式上下文）

- 什么情况会产生BFC
  - 能容纳正常流的元素都会产生BFC，除overflow：visible外；
- Block-level boxes：flex、table、grid、block
  - 表示可以被放入bfc
- block containers: block、inline-block
  - 表示可以容纳bfc
- block boxes：block
  - block-level && block-container
  - block box 如果 overflow 是 visible， 那么就跟父bfc合并

## margin折叠

- 边距折叠只会发生在一个BFC内的上下方向;
- BFC与BFC之间不会产生边距折叠。