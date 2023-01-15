export default class Customizator {
    constructor() {
        this.btnBlock = document.createElement('div');
        this.colorPicker = document.createElement('input');
        this.clear = document.createElement('div');
        this.scale = localStorage.getItem('scale') || 1;
        this.color = localStorage.getItem('color') || '#ffffff';

        this.btnBlock.addEventListener('click', (event) => this.onScaleChange(event));
        this.colorPicker.addEventListener('input', (event) => this.onColorChange(event));
        this.clear.addEventListener('click', () => this.reset());
    }

    onScaleChange(event) {
        const body = document.querySelector('body');

        if (event && event.target.tagName !== 'DIV') {
            this.scale = +event.target.value.replace(/x/g, '');
        }

        const recursion = (element) => {
            element.childNodes.forEach(node => {
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0 && node.textContent !== '×') {

                    if (!node.parentNode.getAttribute('data-fz')) {
                        let value = window.getComputedStyle(node.parentNode, null ).fontSize;
                        node.parentNode.setAttribute('data-fz', +value.replace(/px/g, ''));
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px';
                    }
                    else {
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px';
                    }
                }
                else {
                    recursion(node);
                }
            });
        }

        recursion(body);
        localStorage.setItem('scale', this.scale);
    }

    onColorChange(event) {
        const body = document.querySelector('body');
        body.style.backgroundColor = event.target.value;
        localStorage.setItem('color', event.target.value);
    }

    setBgColor() {
        const body = document.querySelector('body');
        body.style.backgroundColor = this.color;
        this.colorPicker.value = this.color;
    }

    injectStyle() {
        const style = document.createElement('style'); // мы можем закинуть из js'a элемент с тегом script, который будет содержать стили и они применятся, когда DOM структура зарендерится
        style.innerHTML = `
            .panel {
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: fixed;
                top: 20px;
                right: 20px;
                border: 1px solid rgba(0,0,0, .2);
                box-shadow: 0 0 10px rgb(0 0 0 / 20%);
                width: 40px;
                height: 40px;
                background-color: #ffffff;
                border-radius: 100px;
                overflow: hidden;
                transition: 0.5s all;
            }
            
            .panel:hover {
                justify-content: space-around;
                width: 170px;
                border-radius: 20px;
            }
        
            .scale {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 90px;
                height: 40px;
            }
            
            .scale_btn {
                display: block;
                width: 35px;
                height: 35px;
                border: 1px solid;
                border-color: #ffffff;
                border-radius: 8px;
                font-size: 12px;
                color: black;
                cursor: pointer;
                transition: 0.3s all;
                background-color: #fcfbfc;
            }
            
            .scale_btn:hover {
                background-color: #e2e2e2;
            }
        
            .color {
                width: 30px;
                height: 32px;
                border: none;
                border-radius: 10%;
                cursor: pointer;
                transition: 0.3s all;
            }
            
            .clear {
                font-size: 20px;
                cursor: pointer;
                margin-right: 5px;
                align-items: center;
            }
        `;
        document.querySelector('head').appendChild(style);
    }

    reset() {
        localStorage.clear();
        this.scale = 1;
        this.color = '#ffffff';
        this.setBgColor();
        this.onScaleChange();
    }

    render() {
        this.injectStyle();
        this.setBgColor();
        this.onScaleChange();

        let scaleInputSmall = document.createElement('input');
        let scaleInputMedium = document.createElement('input');
        let panel = document.createElement('div');

        panel.append(this.btnBlock, this.colorPicker, this.clear);
        this.clear.innerHTML = `&times`;
        this.clear.classList.add('clear');

        [scaleInputSmall, scaleInputMedium].forEach((elem, i) => {
            if (i === 0) elem.setAttribute('value', '1x');
            else elem.setAttribute('value', '1.5x');

            elem.setAttribute('type', 'button');
            elem.classList.add('scale_btn')
        });

        [this.colorPicker].forEach(elem => {
            elem.setAttribute('type', 'color');
            elem.setAttribute('value', '#ffffff');
            elem.classList.add('color');
        });

        this.btnBlock.classList.add('scale');
        this.btnBlock.append(scaleInputSmall, scaleInputMedium);

        panel.classList.add('panel');
        document.body.append(panel);
    }
}