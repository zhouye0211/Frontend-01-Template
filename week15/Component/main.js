import { create, Wrapper, Text } from "./create";
import { Timeline, Animation, ColorAnimation } from "./animation.js";
import { cubicBezier } from "./cubicBezier.js";
let linear = t => t;
let ease = cubicBezier(.25,.1,.25,1);

class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    let children = this.data.map((url) => {
      let element = <img src={url} />;
      element.addEventListener("dragstart", (event) => event.preventDefault());
      return element;
    });
    let root = <div class="carousel">{children}</div>;

    let position = 0;

    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];
      let tl = new Timeline;

      tl.add(new Animation(current.style, "transform", `${-500 * position}`, `${-500 -500 * position}`, 500, 0, linear, v => `translateX(${v}px)`))
      tl.add(new Animation(next.style, "transform", `${500 - 500 * nextPosition}`, `${ -500 * nextPosition}`, 500, 0, linear, v => `translateX(${v}px)`))
      position = nextPosition;
      tl.start();

      setTimeout(nextPic, 3000);
    };
    setTimeout(nextPic, 3000);
 


    return root;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}


let component = (
  <Carousel
    data={[
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    ]}
  ></Carousel>
);

component.mountTo(document.body);
// console.log(component);
