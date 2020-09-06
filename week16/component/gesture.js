/**
 * 启用手势
 */
export function enableGesture(element) {
  let contexts = Object.create(null);
  let MOUSE_SYMBOL = Symbol("mouse");
  if (document.ontouchstart !== null) {
    element.addEventListener("mousedown", (event) => {
      contexts[MOUSE_SYMBOL] = Object.create(null);
      start(event, contexts[MOUSE_SYMBOL]);
      let mousemove = (event) => {
        move(event, contexts[MOUSE_SYMBOL]);
      };
      let mouseend = (event) => {
        end(event, contexts[MOUSE_SYMBOL]);
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseend);
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseend);
    });
  }

  element.addEventListener("touchstart", (event) => {
    for (let touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener("touchmove", (event) => {
    for (let touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener("touchend", (event) => {
    for (let touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  element.addEventListener("touchcacel", (event) => {
    for (let touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  //tap
  //pan - panstart panmove panend
  //flick
  //Press presstart pressend
  let start = (point, context) => {
    let e = new CustomEvent("start");
    Object.assign(e, {
      startX: point.clientX,
      startY: point.clientX,
      clientX: point.clientX,
      clientY: point.clientY,
    });
    element.dispatchEvent(e);
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.moves = [];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.timeOutHandler = setTimeout(() => {
      if (context.isPan) {
        return;
      }
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      element.dispatchEvent(new CustomEvent("presstart"), {});
    }, 500);
   // console.log("press start ");
  };

  let move = (point, context) => {
   // console.log("move....");
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;

    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {

      if(context.isPress) {
        element.dispatchEvent(new CustomEvent("press", {}));
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      // console.log("panstart");
      let e = new CustomEvent("panstart");
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
      });
      element.dispatchEvent(e);
    }
    if (context.isPan) {
      context.moves.push({dx:dx,dy:dy, ts: Date.now() });
      context.moves = context.moves.filter(
        (record) => Date.now() - record.ts < 300
      );
      console.log("pan");
      let e = new CustomEvent("pan");

      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
      });
      element.dispatchEvent(e);
    }
    //console.log("dx=" + dx + " dy=" + dy);
  };

  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX;
      let dy = point.clientY - context.startY;
      let record = context.moves[0];
      let speed =
        Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
        (Date.now() - record.ts);
      console.log("speed=" + speed);
      let isFick = speed > 2.5;
      if (isFick) {
        //console.log("flick");
        let e = new CustomEvent("flick");
        Object.assign(e, {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed: speed,
        });
        element.dispatchEvent(e);
      }
     // console.log("panend");
      let e = new CustomEvent("panend");
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed: speed,
        isFick: isFick,
      });
      element.dispatchEvent(e);
    }
    if (context.isTap) {
      //console.log("tapend");
      element.dispatchEvent(new CustomEvent("tapend", {}));
    }
    if (context.isPress) {
      //console.log("pressend");
      element.dispatchEvent(new CustomEvent("pressend", {}));
    }
    clearTimeout(context.timeOutHandler);
  };

  let cancel = (point, context) => {
    //console.log("canceled....");
    element.dispatchEvent(new CustomEvent("canceled", {}));
    clearTimeout(context.timeOutHandler);
    // console.log(point.clientX, point.clientY);
  };
}
