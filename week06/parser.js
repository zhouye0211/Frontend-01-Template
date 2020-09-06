const css = require('css')
const EOF = Symbol('EOF') // EOF: End of File
let currentToken = null
let currentAttribute = null
let currentTextNode  = null

let stack = [{type: 'document', children: []}]

let rules = []
function addCSSRules (content) {
  var ast = css.parse(content)
  // ast = JSON
  rules.push(...ast.stylesheet.rules)
}

function match(element, selector) {
  // TODO：处理复合选择器
  if (!selector) {
    return false
  }
  if (selector.startsWith('#')) {
    return !!element.attributes.find(attr => attr.name === 'id' && attr.value === selector.slice(1))
  } else if (selector.startsWith('.')) {
    // 处理带空格的class
    console.log('带空格class', JSON.stringify(element.attributes.filter(attr => attr.name === 'class')))
    return !!element.attributes.find(attr => attr.name === 'class' && attr.value.split(' ').includes(selector.slice(1))) // 处理class带空格
  } else {
    return element.tagName === selector
  }
}

function specificity(selector) {
  var p = [0, 0, 0, 0]
  // var selectorParts = selector.split(' ')
  // Todo: 处理复合选择器
  for (let part of selector) {
    // 处理
    console.log('part', part)
    if (part.startsWith('#')) {
      p[1] += 1
    } else if (part.startsWith('.')) {
      p[2] += 1
    } else {
      p[3] += 1
    }
  }
  return p
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}

function computeCSS (element) {
  console.log(rules)
  if (element.tagName === 'style') {
    return
  }
  const parents = stack.slice().reverse()
  if (!element.computedStyle) {
    element.computedStyle = {}
  }
  for (let rule of rules) {
    rule.selectors.forEach(selectorStr => {
      // 处理逗号并集的情况
      let matched = false
      // const regExp = /([\w\.#=\[\]]+\s*[>]*)\s*/g
      let selectorParts = selectorStr.split(' ').reverse()
      // 写不出什么好的正则，暂时先这样处理
      selectorParts.forEach((f, i) => {
        if (f === '>') {
          selectorParts[i-1] += '>'
          selectorParts[i] = ''
        } else if (f.startsWith('>')) {
          selectorParts[i-1] += '>'
          selectorParts[i] = f.slice(1)
        }
      })
      selectorParts = selectorParts.filter(f => f)
      console.log('selectorStr:', selectorStr)
      // const selectorParts = selectorStr.match(regExp).reverse()
      console.log('selectorPartsss:', JSON.stringify(selectorParts))
      if (!match(element, selectorParts[0])) {
        console.log(match(element, selectorParts[0]))
        return
      }
      let j = 1
      for (let i = 0;i < parents.length; ++i) {
        if (match(parents[i], selectorParts[j])) {
          j++
        }
      }
      if (j >= selectorParts.length) {
        // 表示匹配成功
        matched = true
      }
      console.log('isMatched:', matched)
      if (matched) {
        console.log('slectorParts', selectorParts)
        let spValue = specificity(selectorParts)
        console.log('spValue', spValue)
        let computedStyle = element.computedStyle
        for (let declaration of rule.declarations) {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {}
          }
          if (!computedStyle[declaration.property].specificity) {
            // 如果没有优先级
            computedStyle[declaration.property].value = declaration.value
            computedStyle[declaration.property].specificity = spValue
          } else if (compare(computedStyle[declaration.property].specificity, spValue) < 0) {
            computedStyle[declaration.property].value = declaration.value
            computedStyle[declaration.property].specificity = spValue
          }
        }
        console.log('computedStyleee:',JSON.stringify(computedStyle, null, '   '))
      }
    })
  }
}

function emit(token) {
  let top = stack[stack.length  - 1]
  // console.log(token)
  if (token.type === 'startTag') {
    let element = {
      type: "element",
      children: [],
      attributes: []
    }
    element.tagName = token.tagName
    for (let p in token) {
      if (p !== 'type' && p !== 'tagName' && p !== 'isSelfClosing') { // 这里应该是且
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }
    console.log('compute element', element)
    computeCSS(element)
    top.children.push(element)
    element.parent = top
    if (!token.isSelfClosing) {
      stack.push(element)
    }
    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      // 不匹配,报错
    } else {
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content)
      }
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
  // console.log(token)
}

function data (c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen (c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    return
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') {
    // 抛错, 此时缺少结束标签
    return data
  } else if (c === EOF) {
  } else {
    // 抛错,结束标签第一个字符不正确
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 碰到了字母
    currentToken.tagName += c
    return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === 'EOF') {
  } else {
    // error报错
    return data
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    // return beforeAttributeName
    // This is an unexpected-equals-sign-before-attribute-name parse error.
    // return attributeName
  } else {
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c.match(/^[A-Z]$/)) {
    currentAttribute.name += c.toLowerCase()
    return attributeName
  } else if (c === '\u0000') {

  } else if (c === '"' || c === "'" || c == '<') {
    // 抛错
  } else {
    currentAttribute.name += c.toLowerCase()
    return attributeName
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if (c ===  '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === EOF) {
    // 抛错
    emit({
      type: 'EOF'
    })
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    return attributeName(c)
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if (c === '"') {
    return doubleQuotedAttributeValue
  } else if (c === "'") {
    return singleQuotedAttributeValue
  } else if (c === '>')  {
    // 抛错This is a missing-attribute-value parse error.
    emit(currentToken)
    return data
  } else {
    return UnquotedAttributeValue(c)
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentValue
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentValue
    emit(currentToken)
    return data
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<' || c === "=" || c === '`') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return quotedAfterAttributeValue
  } else if (c === '\u0000') {
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return quotedAfterAttributeValue
  } else if (c === '\u0000') {
  } else if (c === 'EOF') {
    emit({
      type: 'EOF'
    })
  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function quotedAfterAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    // 抛错
  } else {
    // 属性之间缺少空格
    return beforeAttributeName(c)
  }
}


function parserHtml (html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)
}
exports.parserHtml = parserHtml

var html = `<html maaa=a >
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
body div .test1{
  width: 40px;
}
</style>
</head>
<body>
    <div>
        <img class="test1 test2" id="myid"/>
        <img />
    </div>
</body>
</html>`

parserHtml(html)