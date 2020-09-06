import {createElement, Text, Wrapper} from './createElement.js';
/*
class Parent {
    // config
    constructor(config) {
        this.children = [],
        this.root = document.createElement('div');
    }

    // property
    // set class(v) {
    //     console.log('property:class', v);
    // }

    // attribute
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    // child
    appendChild(child) {
        child.mounted(this.root);
    }

    mounted(parent) {
        parent.appendChild(this.root);
    }
}*/

/*
class MyComponent {
    constructor(config) {
        this.children = [],
        this.attributes = new Map();
        this.properties = new Map();
    }

    setAttribute(name, value) {
        this.attributes.set(name, value);
    }

    appendChild(child) {
        // child.mounted(this.root);
        this.children.push(child);
    }

    set title(value) {
        this.properties.set('title', value);
    }

    render() {
        return <article>
            <h2>{this.properties.get('title')}
            <header>header</header>
            {this.slot}
            <footer>footer</footer>
        </article>
    }

    mounted(parent) {
        //parent.appendChild(this.root);
        this.slot = <div></div>
        for (let child of this.children) {
            this.slot.appendChild(child);
        }
        this.render().mounted(parent);
    }
}
*/

class Carousel {
    constructor(config) {
        this.children = [],
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
        let children = this.data.map(url => {
            let element = <img src={url}/>;
            element.addEventListener('dragstart', event => event.preventDefault());
            return element;
        });

        let position = 0;

        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length;

            let current = children[position];
            let next = children[nextPosition];

            current.style.transition = 'ease 0s';
            next.style.transition = 'ease 0s';

            current.style.transform = `translateX(${- 100 * position}%)`;
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

            setTimeout(() => {
                current.style.transition = ''; // = '' means use css rule
                next.style.transition = '';

                current.style.transform = `translateX(${- 100 - 100 * position}%)`;
                next.style.transform = `translateX(${- 100 * nextPosition}%)`;

                position = nextPosition;

            }, 16);

            setTimeout(nextPic, 3000);
        }

        addEventListener('mousedown', event => {
            let startX = event.clientX;
            let startY = event.clientY;

            let lastPosition = (position - 1 + this.data.length) % this.data.length;
            let nextPosition = (position + 1) % this.data.length;


            let current = children[position];
            let last = children[lastPosition];
            let next = children[nextPosition];


            current.style.transition = 'ease 0s';
            last.style.transition = 'ease 0s';
            next.style.transition = 'ease 0s';

            current.style.transform = `translateX(${-500 * position}px)`;
            last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
            next.style.transform = `translateX(${500 -500 * nextPosition}px)`;

            let move = event => {
                current.style.transform = `translateX(${event.clientX - startX -500 * position}px)`;
                last.style.transform =
                    `translateX(${event.clientX - startX -500 - 500 * lastPosition}px)`;
                next.style.transform =
                    `translateX(${event.clientX - startX +500 -500 * nextPosition}px)`;
            };

            let up = event => {
                let offset = 0;

                if (event.clientX - startX > 250) {
                    offset = 1;
                } else if (event.clientX - startX < -250) {
                    offset = -1
                }

                current.style.transition = '';
                last.style.transition = '';
                next.style.transition = '';

                current.style.transform = `translateX(${ offset * 500 - 500 * position}px)`;
                last.style.transform = `translateX(${ offset * 500 - 500 - 500 * lastPosition}px)`;
                next.style.transform = `translateX(${ offset * 500 + 500 -500 * nextPosition}px)`;

                position = (position - offset + this.data.length) % this.data.length;

                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)
            };

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        setTimeout(nextPic, 3000);

        return <div class='carousel'>
            {children}
        </div>;
    }

    mounted(parent) {
        this.render().mounted(parent);
    }
}


// let component = <div id="a" class="b" style="width: 100px; height: 100px; background-color: red">
//     <div></div>
//     <p></p>
//     <div></div>
//     <div></div>
// </div>;

// let component = <div>text</div>

// let component = <MyComponent>{new Wrapper('span')}</MyComponent>

let component = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]}>
</Carousel>

// component.id = 'c';
// component.setAttribute("id", "a");

component.mounted(document.body);
console.log(component);