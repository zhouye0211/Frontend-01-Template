

## 写在前面

- 在计算它之前，所有ECMAScript代码必须与一个域相关联。从概念上讲，领域由一组内部对象、一个ECMAScript全局环境、在全局环境范围内加载的所有ECMAScript代码以及其他相关状态和资源组成。

- 从逻辑上讲，堆栈中的每个上下文总是与其 realm 相关联
  - 让我们看看单独的realm的例子，使用this模块：

    ```javascript
    const this = require('vm');
    
    // First realm, and its global:
    const realm1 = this.createContext({x: 10, console});
    
    // Second realm, and its global:
    const realm2 = this.createContext({x: 20, console});
    
    // Code to execute:
    const code = `console.log(x);`;
    
    this.runInContext(code, realm1); // 10
    this.runInContext(code, realm2); // 20
    ```


## 记录

- JavaScript 中所有的固有对象

  ```javascript
  
  
    let objectes = [
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "Array",
      "Date",
      "RegExp",
      "Promise",
      "Proxy",
      "Map",
      "WeakMap",
      "Set",
      "WeakSet",
      "Function",
      "Boolean",
      "String",
      "Number",
      "Symbol",
      "Object",
      "Error",
      "EvalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError",
      "ArrayBuffer",
      "SharedArrayBuffer",
      "DataView",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Uint8Array",
      "Uint16Array",
      "Uint32Array",
      "Uint8ClampedArray",
      "Atomics",
      "JSON",
      "Math",
      "Reflect"
    ];
  
    const set = new Set();
  
    const globalObject = []
  
    for (let i of objectes) {
      globalObject.push({
        object: this[i],
        path: [i]
      })
    }
  
    while (globalObject.length) {
      const current = globalObject.shift()
      console.log(current.path.join('.'))
      if (set.has(current.object))
        continue;
      set.add(current.object)
  ```



      let proto = Object.getPrototypeOf(current.object)
      if (proto) {
        globalObject.push({
          path: current.path.concat(["__proto__"]),
          object: proto
        })
      }
    
      for (let p of Object.getOwnPropertyNames(current.object)) {
        let d = Object.getOwnPropertyDescriptor(current.object, p)
        if (d.hasOwnProperty("value") && ((d.value !== null && typeof d.value === "object") || (typeof d.value === "function")) && d.value instanceof Object) {
          globalObject.push({
            path: current.path.concat([p]),
            object: d.value
          })
        }
        if (d.hasOwnProperty("get") && typeof d.get === "function") {
          globalObject.push({
            path: current.path.concat([p]),
            object: d.get
          })
        }
        if (d.hasOwnProperty("set") && typeof d.set === "function") {
          globalObject.push({
            path: current.path.concat([p]),
            object: d.set
          })
        }
      }
    }
    ```

- 根据上述代码，进行数据结构方面的格式化

  ```javascript
  
    const objectes = [
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "Array",
      "Date",
      "RegExp",
      "Promise",
      "Proxy",
      "Map",
      "WeakMap",
      "Set",
      "WeakSet",
      "Function",
      "Boolean",
      "String",
      "Number",
      "Symbol",
      "Object",
      "Error",
      "EvalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError",
      "ArrayBuffer",
      "SharedArrayBuffer",
      "DataView",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Uint8Array",
      "Uint16Array",
      "Uint32Array",
      "Uint8ClampedArray",
      "Atomics",
      "JSON",
      "Math",
      "Reflect"
    ];
  
    const set = new Set();
  
    const globalObject = {
      id: "Global Object",
      children: [
  
      ]
    }
  
    for (let i of objectes) {
      globalObject.children.push({
        children: [],
        id: i
      })
    }
  ```


    for (let i = 0; i < objectes.length; i++) {
      const current = objectes[i]
      if (set.has(objectes[i]))
        continue;
      set.add(objectes[i])
      for (let p of Object.getOwnPropertyNames(window[objectes[i]])) {
        let d = Object.getOwnPropertyDescriptor(window[objectes[i]], p)
        if (d.hasOwnProperty("value") && ((d.value !== null && typeof d.value === "object") || (typeof d.value === "function")) && d.value instanceof Object) {
          let childrenThird = []
          for (let k of Object.getOwnPropertyNames(d.value)) {
            if (k !== 'name' && k !== 'length') {
              childrenThird.push({ id: k })
            }
          }
          globalObject["children"][i].children.push({
            children: childrenThird,
            id: p
          })
        }
        if (d.hasOwnProperty("get") && typeof d.get === "function") {
          let childrenThird = []
          for (let k of Object.getOwnPropertyNames(d.get)) {
            if (k !== 'name' && k !== 'length') {
              childrenThird.push({ id: k })
            }
          }
          globalObject["children"][i].children.push({
            children: childrenThird,
            id: p
          })
        }
        if (d.hasOwnProperty("set") && typeof d.set === "function") {
          let childrenThird = []
          for (let k of Object.getOwnPropertyNames(d.set)) {
            if (k !== 'name' && k !== 'length') {
              childrenThird.push({ id: k })
            }
          }
          globalObject["children"][i].children.push({
            children: childrenThird,
            id: p
          })
        }
      }
    }
    ```



- 在 HTML 中创建一个用于绘制的图的容器，通常为 div  标签。G6 在绘制时会在该容器下追加 canvas 标签，然后将图绘制在其中。
	
	```javascript
	<div id="container" />
	```
- 引入 G6 的数据源为 JSON 格式的对象。即上面我们处理过的 globalObject
- 创建关系图（实例化）时，至少需要为图设置容器、宽和高。
	
	```javascript
	
    const width = window.devicePixelRatio * window.screen.width * 0.5; // 高清显示
    const height = window.devicePixelRatio * window.screen.height;
    const graph = new G6.TreeGraph({
      container: 'container',
      width,
      height,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange: function onChange(item, collapsed) {
              const data = item.get('model').data;
              data.collapsed = collapsed;
              return true;
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      defaultNode: {
        size: 26,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
        style: {
          fill: '#C6E5FF',
          stroke: '#5B8FF9',
        },
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          stroke: '#A3B1BF',
        },
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 16;
        },
        getVGap: function getVGap() {
          return 10;
        },
        getHGap: function getHGap() {
          return 100;
        },
      },
    });
	```
	
- 配置数据源，渲染
	
	```javascript
	graph.data(data);
    graph.render();
    graph.fitView();
	```

