function match(selector, element){
  let selectorList = selector.split(' ');
  let targetSelector = selectorList.pop();
  let tagRegex = /^[a-z]+/;
  let idRegex = /\#[a-z]+/;
  let classRegex = /\.[a-z]+/;
  let attrRegex = /\[[a-z]+=(([a-z]+)|(\'[a-z]+\')|(\"[a-zA-Z]+\"))\]/;
  let selectorType= ['tag', 'id', 'class', 'attr']; // 
  let isMatch = false;

  selectorType.forEach((item) => {
      if(item === 'tag'){
          if(!targetSelector.match(tagRegex) || targetSelector.match(tagRegex) && targetSelector.match(tagRegex)[0] === element.tagName.toLowerCase()){
              isMatch = true;
          }else if(targetSelector.match(tagRegex)[0] !== element.tagName.toLowerCase()){
              isMatch = false;
          }
      }
      if(item === 'id'){
          if((!targetSelector.match(idRegex) || targetSelector.match(idRegex) && targetSelector.match(idRegex)[0].slice(1) === element.getAttribute('id'))){
              isMatch = isMatch && true;
          }else if(targetSelector.match(idRegex) && targetSelector.match(idRegex)[0].slice(1) !== element.getAttribute('id')){
              isMatch = false;
          }
      }
      if(item === 'class'){
          if((!targetSelector.match(classRegex) || targetSelector.match(classRegex) && targetSelector.match(classRegex)[0].slice(1) === element.getAttribute('class'))){
              isMatch = isMatch && true;
          }else if(targetSelector.match(classRegex) && targetSelector.match(classRegex)[0].slice(1) !== element.getAttribute('class')){
              isMatch = false;
          }
      }
      if(item === 'attr'){
          if(targetSelector.match(attrRegex)){
              let attr = targetSelector.match(attrRegex)[0].split('[')[1].split(']')[0];
              let attrKey = attr.split('=')[0];
              let attrValue = attr.split('=')[1];
              if(element.getAttribute(attrKey) == attrValue || `'${element.getAttribute(attrKey)}'` == attrValue || `"${element.getAttribute(attrKey)}"` == attrValue){                 
                  isMatch = isMatch && true;
              }else if(element.getAttribute(attrKey) !== attrValue && element.getAttribute(attrKey) != `'${attrValue}'` && element.getAttribute(attrKey) != `"${attrValue}"`){
                  isMatch = false;
              }
          }
      }
  });
  return isMatch;
}