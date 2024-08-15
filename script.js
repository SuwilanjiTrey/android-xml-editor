document.addEventListener('DOMContentLoaded', () => {
    const componentsBar = document.getElementById('components-bar');
    const componentContainer = document.getElementById('component-container');
    const xmlOutput = document.getElementById('xml-output');
    const saveBtn = document.getElementById('save-btn');
    const attributeEditor = document.getElementById('attribute-editor');
    const deviceSelect = document.getElementById('device-select');
    const devicePhone = document.getElementById('device-image');

    let selectedComponent = null;

    const defaultAttributes = {
        Button: { text: 'Button', textSize: '14sp', layout_width: 'wrap_content', layout_height: 'wrap_content' },
        TextView: { text: 'TextView', textSize: '14sp', layout_width: 'wrap_content', layout_height: 'wrap_content' },
        ImageView: { src: '', layout_width: 'wrap_content', layout_height: 'wrap_content' },
        PlainText: { hint: 'Enter text', layout_width: 'match_parent', layout_height: 'wrap_content' },
        Password: { hint: 'Enter password', inputType: 'textPassword', layout_width: 'match_parent', layout_height: 'wrap_content' },
        Email: { hint: 'Enter email', inputType: 'textEmailAddress', layout_width: 'match_parent', layout_height: 'wrap_content' },
        ProgressBar: { style: 'android:style/Widget.ProgressBar.Horizontal', layout_width: 'match_parent', layout_height: 'wrap_content' },
        SeekBar: { layout_width: 'match_parent', layout_height: 'wrap_content' },
        RatingBar: { numStars: '5', layout_width: 'wrap_content', layout_height: 'wrap_content' },
        LinearLayout: { orientation: 'vertical', layout_width: 'match_parent', layout_height: 'wrap_content' },
        FrameLayout: { layout_width: 'match_parent', layout_height: 'wrap_content' },
        ConstraintLayout: { layout_width: 'match_parent', layout_height: 'match_parent' }
    };

    componentsBar.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('component')) {
            e.dataTransfer.setData('text/plain', e.target.dataset.componentType);
        }
    });

    componentContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    deviceSelect.addEventListener('change', (e) => {
        devicePhone.src = `${e.target.value}.png`;

        const componentContainer = document.getElementById('component-container');

        if (e.target.value === 'phone') {
            componentContainer.style.position = 'absolute';
            componentContainer.style.top = '16.5%';
            componentContainer.style.left = '31.58%';
            componentContainer.style.width = '35.56%';
            componentContainer.style.height = '66.5%';
            componentContainer.style.border = '1px solid #ccc';
        } else if (e.target.value === 'tablet') {
            componentContainer.style.position = 'absolute';
            componentContainer.style.top = '21.5%';
            componentContainer.style.left = '27.64%';
            componentContainer.style.width = '44.5%';
            componentContainer.style.height = '57.5%';
            componentContainer.style.border = '1px solid #ccc';
        } else {
            componentContainer.style.position = 'absolute';
            componentContainer.style.top = '0px';
            componentContainer.style.left = '0px';
            componentContainer.style.width = '0px';
            componentContainer.style.height = '0px';
            componentContainer.style.border = '1px solid #ccc';
        }
    });

    componentContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text');
        const component = createComponent(componentType, e.offsetX, e.offsetY);
        componentContainer.appendChild(component);
        updateXmlOutput();
    });

    function createComponent(type, x, y) {
        let component;

        switch(type) {
            case 'Button':
                component = document.createElement('button');
                component.textContent = 'Button';
                break;
            case 'TextView':
                component = document.createElement('span');
                component.textContent = 'TextView';
                break;
            case 'ImageView':
                component = document.createElement('img');
                component.src = 'image_placeholder.png';
                component.alt = 'ImageView';
                break;
            case 'PlainText':
                component = document.createElement('input');
                component.type = 'text';
                component.placeholder = 'Enter text';
                break;
            case 'Password':
                component = document.createElement('input');
                component.type = 'password';
                component.placeholder = 'Enter password';
                break;
            case 'Email':
                component = document.createElement('input');
                component.type = 'email';
                component.placeholder = 'Enter email';
                break;
            case 'ProgressBar':
                component = document.createElement('progress');
                break;
            case 'SeekBar':
                component = document.createElement('input');
                component.type = 'range';
                break;
            case 'RatingBar':
                component = document.createElement('input');
                component.type = 'number';
                component.max = 5;
                break;
            default:
                component = document.createElement('div');
                component.textContent = type;
        }

        component.className = 'component';
        component.style.position = 'absolute';
        component.style.left = `${x}px`;
        component.style.top = `${y}px`;
        component.dataset.componentType = type;

        // Set default attributes
        component.attributesData = { ...defaultAttributes[type], layout_width: '100px', layout_height: '50px' };

        // Make the component resizable using Interact.js
        interact(component).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    let { x, y } = event.target.dataset;

                    x = (parseFloat(x) || 0) + event.deltaRect.left;
                    y = (parseFloat(y) || 0) + event.deltaRect.top;

                    event.target.style.width = `${event.rect.width}px`;
                    event.target.style.height = `${event.rect.height}px`;

                    event.target.dataset.x = x;
                    event.target.dataset.y = y;

                    component.attributesData.layout_width = `${event.rect.width}px`;
                    component.attributesData.layout_height = `${event.rect.height}px`;

                    updateXmlOutput();
                }
            }
        });

        component.addEventListener('click', () => {
            if (selectedComponent) {
                selectedComponent.classList.remove('selected');
            }
            selectedComponent = component;
            component.classList.add('selected');
            updateAttributeEditor(component.attributesData);
        });

        return component;
    }

    function updateAttributeEditor(attributes) {
        attributeEditor.innerHTML = '';
        for (const [key, value] of Object.entries(attributes)) {
            const attributeDiv = document.createElement('div');
            attributeDiv.innerHTML = `
                <label>${key}</label>
                <input type="text" value="${value}" data-attribute="${key}">
            `;
            attributeEditor.appendChild(attributeDiv);
        }

        attributeEditor.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const attributeName = e.target.dataset.attribute;
                const attributeValue = e.target.value;
                if (selectedComponent) {
                    selectedComponent.attributesData[attributeName] = attributeValue;
                    updateXmlOutput();
                }
            });
        });
    }

    function updateXmlOutput() {
        let xmlString = '<LinearLayout\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical">\n\n';

        componentContainer.childNodes.forEach((component) => {
            xmlString += `    <${component.dataset.componentType}\n`;
            for (const [key, value] of Object.entries(component.attributesData)) {
                xmlString += `        android:${key}="${value}"\n`;
            }
            xmlString += `        android:layout_x="${component.style.left}"\n`;
            xmlString += `        android:layout_y="${component.style.top}" />\n\n`;
        });

        xmlString += '</LinearLayout>';
        xmlOutput.value = xmlString;
    }

    saveBtn.addEventListener('click', () => {
        console.log('Saving XML:', xmlOutput.value);
        alert('XML saved! (Check the console)');
    });

    componentContainer.addEventListener('click', (e) => {
        if (e.target === componentContainer) {
            if (selectedComponent) {
                selectedComponent.classList.remove('selected');
            }
            selectedComponent = null;
            attributeEditor.innerHTML = '';
        }
    });
});
