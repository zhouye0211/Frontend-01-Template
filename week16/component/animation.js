/**
 * 对多个动画进行编排，同时控制
 */
export class TimeLine {
  constructor() {
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestId = null;
    this.state = "inited";
    this.tick = () => {
      // console.log("tick...........");
      let t = Date.now() - this.startTime;

      for (let animation of this.animations) {
        let {
          object,
          property,
          template,
          start,
          end,
          duration,
          delay,

          timingFunc,
        } = animation;
        let addTime = this.addTimes.get(animation);
        if (t < delay + addTime) {
          continue;
        }
        let progression = timingFunc((t - delay - addTime) / duration);
        if (t >= duration + delay + addTime) {
          progression = 1;
          this.animations.delete(animation);
          this.finishedAnimations.add(animation);
        }
        let value = animation.valueFromProgression(progression); //修改为函数不同实现修改不同的属性
        //console.log("value is =" + JSON.stringify(value));
        object[property] = template(value);
      }
      if (this.animations.size) {
        this.requestId = requestAnimationFrame(this.tick);
      } else {
        this.requestId = null;
      }
    };
  }
  /**
   * 每一步调用的事件
   */

  /**
   * 开始
   */
  start() {
    if (this.state !== "inited") {
      return;
    }
    this.state = "playing";
    this.startTime = Date.now();
    this.tick();
  }
  /**
   * 暂停
   */
  pause() {
    if (this.state !== "playing") {
      return;
    }
    this.state = "paused";
    this.pauseTime = Date.now(); //记录上暂停时间
    if (this.requestId != null) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }
  /**
   * 还原
   */
  resume() {
    if (this.state !== "paused") {
      return;
    }
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }
  reset() {
    if (this.state == "playing") {
      this.pause();
    }
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestId = null;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.state = "inited";
  }
  restart() {
    if (this.state == "playing") {
      this.pause();
    }
    for (let animation of this.finishedAnimations) {
      this.animations.add(animation);
    }

    this.finishedAnimations = new Set();
    
    this.requestId = null;
    this.state = "playing";
    this.startTime = Date.now();
    this.pauseTime = null;

    this.tick();
  }
  add(animation, addTime) {
    this.animations.add(animation);
    if (this.state == "playing" && this.requestId === null) {
      this.tick();
    }
    if (this.state == "playing") {
      this.addTimes.set(
        animation,
        addTime != void 0 ? addTime : Date.now() - this.startTime
      );
    } else {
      this.addTimes.set(animation, addTime != void 0 ? addTime : 0);
    }
  }
}

export class Animation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunc
  ) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.template = template;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFunc =
      timingFunc ||
      ((start, end) => {
        return (t) => start + (t / duration) * (end - start);
      });
  }

  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}

export class ColorAnimation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunc
  ) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.template = template;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFunc =
      timingFunc ||
      ((start, end) => {
        return (t) => start + (t / duration) * (end - start);
      });
  }

  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    };
  }
}
