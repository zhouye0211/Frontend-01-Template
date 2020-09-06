import { createElement, Text, Wrapper } from "./createElement";
import { TimeLine, Animation, ColorAnimation } from "./animation";
import { ease } from "./cubicBezier";
import { enableGesture } from "./gesture";
export class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) {
    //attribute
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    //生成image标签
    let timeLine = new TimeLine();
    timeLine.start();
    let position = 0;
    let nextPicStopHandler = null;

    let offset = 0;
    let children = this.data.map((url, currentPosition) => {
      let nextPosition = (currentPosition + 1) % this.data.length;
      let lastPosition =
        (currentPosition - 1 + this.data.length) % this.data.length;
      let onStart = () => {
        timeLine.pause();
        clearTimeout(nextPicStopHandler);
         let current = children[currentPosition];
        //console.log(current.style.transform);
        let currentTransformValue = Number(
          current.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]
        );
       // console.log("currentTransformValue"+ currentTransformValue);
        offset = currentTransformValue + 500 * currentPosition;
      };
      let onPan = (event) => {
        //正则取出 translate的值
        let current = children[currentPosition];
        let next = children[nextPosition];
        let last = children[lastPosition];
        let dx = (event.clientX - event.startX);
        if(dx > 500) {
           dx =500;
        }
        if(dx < -500) {
          dx = -500;
        }
        let lastTransformValue = -500 - 500 * lastPosition + offset+ dx;
        let currentTransformValue = -500 * currentPosition + offset+ dx;
        let nextTransformValue = 500 - 500 * nextPosition + offset+ dx;
        //console.log("=============="+currentTransformValue + dx);
        last.style.transform = `translateX(${lastTransformValue}px)`;
        current.style.transform = `translateX(${currentTransformValue}px)`;
        next.style.transform = `translateX(${nextTransformValue}px)`;
      };

      let onPanend = (event) => {
        let direction =  0;
        let dx = (event.clientX - event.startX);
        if(dx + offset > 250) {
          direction =  1;
        } else if(dx+offset < -250){
          direction = -1;
        }
        timeLine.reset();
        timeLine.start();
        let current = children[currentPosition];
        let next = children[nextPosition];
        let last = children[lastPosition];
        let lastP1 = -500 - 500 * lastPosition + offset+ dx;
        let lastP2 = -500 - 500 * lastPosition + direction*500;
        let currentP1 = -500 * currentPosition + offset+ dx;
        let currentP2 = -500 * currentPosition + direction*500;
        let nextP1 = 500 - 500 * nextPosition + offset+ dx;
        let nextP2 = 500 - 500 * nextPosition +  direction*500;
        let lastAnimation = new Animation(last.style,"transform",(v) => `translateX(${v}px)`,lastP1,lastP2,500,0,ease);
        let currentAnimation = new Animation(current.style,"transform",(v) => `translateX(${v}px)`,currentP1,currentP2,500,0,ease);
        let nextAnimation = new Animation(next.style,"transform",(v) => `translateX(${v}px)`,nextP1,nextP2,500,0,ease);
        timeLine.add(lastAnimation);
        timeLine.add(currentAnimation);
        timeLine.add(nextAnimation);
        position = (position - direction + this.data.length) % this.data.length;
        nextPicStopHandler = setTimeout(nextPic, 3000);

      };

      let element = (
        <img src={url} onStart={onStart} onPan={onPan} onPanend ={onPanend} enableGesture={true} />
      );
      //禁用图片默认拖动事件
      //   element.addEventListener("dragstart",)
      element.style.transform = `translateX(0px)`;
      element.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
      return element;
    });

    let nextPic = () => {
      // timeLine.restart();
      let nextPosition = (position + 1) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];
      let currentP1 = -100 * position;
      let currentP2 = -100 - 100 * position;
      let nextP1 = 100 - 100 * nextPosition;
      let nextP2 = -100 * nextPosition;
      let currentAnimation = new Animation(
        current.style,
        "transform",
        (v) => `translateX(${5 * v}px)`,
        currentP1,
        currentP2,
        500,
        0,
        ease
      );
      let nextAnimation = new Animation(
        next.style,
        "transform",
        (v) => `translateX(${5 * v}px)`,
        nextP1,
        nextP2,
        500,
        0,
        ease
      );
      timeLine.add(currentAnimation);
      timeLine.add(nextAnimation);
      position = nextPosition;

      nextPicStopHandler = setTimeout(nextPic, 3000);
    };
    //定时切换
    nextPicStopHandler = setTimeout(nextPic, 3000);

    let divElement = <div class="carousel">{children}</div>;

    return divElement;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
