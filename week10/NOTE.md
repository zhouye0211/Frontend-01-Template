# 每周总结可以写在这里

##### 第10周

1. Range API
    * 一个问题：如何把一个元素所有的子元素逆序？
    * 常规解法：
    * ```javascript
        function reverseChildren(element) {
            let l = element.childNodes.length;

            while(l-- > 0) {
                element.appendChild(element.childNodes[l]);
            }

        }
      ```
    * Range API
        * 必要API
            * var range = new Range()
            * range.setStart(element, 9)
            * range.setEnd(element, 4)
            * var range = document.getSelection().getRangeAt(0)
        * 辅助API
            * range.setStartBefore
            * range.setEndBefore
            * range.setStartAfter
            * range.setEndAfter
            * range.selectNode
            * range.selectNodeContents
        * 摘取与插入
            * var fragment = range.extractContents()
            * range.insertNode(document.createTextNode("aaaa"))
    * 使用Range API解决子元素逆序问题：
    * ```javascript
        function reverseChildren(element) {
            let range = new Range();
            range.selectNodeContents(element);

            let fragment = range.extractContents();
            let l = fragment.childNodes.length;
            while(l-- > 0) {
                fragment.appendChild(fragment.childNodes[l])
            }
            element.appendChild(fragment);
        }
      ```
      * 优势：只有一次appendChild操作，减少了浏览器的重排操作，节点数多时，性能更优

2. CSSOM
    * doucment.styleSheets
    * Rules
        * document.styleSheets[0].cssRules
        * document.styleSheets[0].insertRule("p {color: pink;}", 0)
        * document.styleSheets[0].removeRule(0)
    * Rule
        * CSSStyleRule
            * selectorText String
            * style K-V结构
        * CSSCharsetRule
        * CSSImportRule
        * CSSMediaRule
        * CSSFontFaceRule
        * CSSPageRule
        * CSSNamespaceRule
        * CSSKeyframesRule
        * CSSKeyframeRule
        * CSSSupportsRule
        * ......
    * getComputedStyle
        * window.getComputedStyle(elt, pseudoElt)
        * elt 想要获取的元素
        * pseudoElt 可选，伪元素