export function createElement(Cls, attributes, ...children) {
    let o;

    if (typeof Cls === 'string') {
        o = new Wrapper(Cls);
    } else {
        o = new Cls({timer: {}});
    }

    for (let name in attributes) {
        //o[name] = attributes[name]; // property = attribute
        o.setAttribute(name, attributes[name]);
    }

    let visit  = children => {
        for (let child of children) {
            if (typeof child === 'object' && child instanceof Array) {
                visit(child);
                continue;
            }
            if (typeof child === 'string') {
                child = new Text(child);
            }
            o.appendChild(child);
        }
    }
    visit(children);

    return o;
}

export class Text {
    constructor(text) {
        this.children = [],
        this.root = document.createTextNode(text);
    }

    mounted(parent) {
        parent.appendChild(this.root);
    }
}


export class Wrapper {
    constructor(type) {
        this.children = [],
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    addEventListener() {
        this.root.addEventListener(...arguments);
    }

    get style() {
        return this.root.style;
    }

    mounted(parent) {
        parent.appendChild(this.root);
        for (let child of this.children) {
            child.mounted(this.root);
        }
    }
}

