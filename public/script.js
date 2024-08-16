document.addEventListener('DOMContentLoaded', () => {

    
    const componentsBar = document.getElementById('components-bar');
    const componentContainer = document.getElementById('component-container');
    const xmlOutput = document.getElementById('xml-output');
    const saveBtn = document.getElementById('save-btn');
    const attributeEditor = document.getElementById('attribute-editor');
    const deviceSelect = document.getElementById('device-select');
    const devicePhone = document.getElementById('device-image');

    let selectedComponent = null;

    const componentVisuals = {
        Button: '[ Button ]',
        TextView: '[ Text ]',
        ImageView: 'assets/image.png',
        PlainText: '[ _____ ]',
        Password: '[ ***** ]',
        Email: '[ user@example.com ]',
        ProgressBar: 'assets/progress_bar.png',
        SeekBar: '[---------O]',
        RatingBar: 'assets/rating_bar.png',
        Switch: 'assets/switch_off.png',
        CheckBox: 'assets/checkbox_off.png',
        RadioButton: '( • )',
        // Add more components as needed
    };
    // Define default attributes for each component type
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

    //change here 
    deviceSelect.addEventListener('change', (e) => {
        devicePhone.src = `${e.target.value}.png`;
        
        const componentContainer = document.getElementById('component-container');
        
        if (e.target.value === 'phone') {
            componentContainer.style.position = 'absolute';
            componentContainer.style.top = '16.5%';
            componentContainer.style.left = '28.88%';
            componentContainer.style.width = '41.86%';
            componentContainer.style.height = '66.5%';
            componentContainer.style.border = '1px solid #ccc';
        } else if (e.target.value === 'tablet') {
            // Reset to default styles if needed when not a tablet
            componentContainer.style.position = 'absolute';
            componentContainer.style.top = '25.25%';
            componentContainer.style.left = '27.64%';
            componentContainer.style.width = '44.5%';
            componentContainer.style.height = '49.25%';
            componentContainer.style.border = '1px solid #ccc';
            componentContainer.style.borderRadius = '10px';
        } else {
            // Reset to default styles if needed when not a tablet
            componentContainer.style.position = 'absolute';
            componentContainer.style.top = '0px';
            componentContainer.style.left = '0px';
            componentContainer.style.width = '0px';
            componentContainer.style.height = 'opx';
            componentContainer.style.border = '1px solid #ccc';
        }
    });
    

    componentContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text');
        if (componentType) {
            const rect = componentContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const component = createComponent(componentType, x, y);
            componentContainer.appendChild(component);
            updateXmlOutput();
        }
    });

function createComponent(type, x, y) {
    const component = document.createElement('div');
    component.className = 'component';
    component.style.position = 'absolute';
    component.style.left = `${x}px`;
    component.style.top = `${y}px`;
    component.style.minWidth = '100px';
    component.style.minHeight = '50px';
    component.style.backgroundColor = 'rgb(240 240 240 / 0%)';
    component.style.border = '1px solid #ccc';
    component.style.display = 'flex';
    component.style.alignItems = 'center';
    component.style.justifyContent = 'center';
    component.style.padding = '5px';
    component.dataset.componentType = type;
    component.attributesData = { ...defaultAttributes[type] };


    const visualContainer = document.createElement('img');
    visualContainer.className = 'component-visual';
    visualContainer.src = componentVisuals[type] || '/images/default.png';
    visualContainer.style.maxWidth = '100%';
    visualContainer.style.maxHeight = '100%';
    visualContainer.style.objectFit = 'contain';
    component.appendChild(visualContainer);

    // Add resize handles
    const resizeHandles = ['nw', 'ne', 'sw', 'se'];
    resizeHandles.forEach(handle => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle ${handle}`;
        component.appendChild(resizeHandle);
    });

    component.addEventListener('click', (e) => {
        e.stopPropagation();
        if (selectedComponent) {
            selectedComponent.classList.remove('selected');
        }
        selectedComponent = component;
        component.classList.add('selected');
        updateAttributeEditor(component.attributesData);
    });

    makeResizableAndDraggable(component);

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
                updateComponentVisual(selectedComponent);
                updateXmlOutput();
            }
        });
    });
}

function updateComponentVisual(component) {
    const type = component.dataset.componentType;
    const visualContainer = component.querySelector('.component-visual');
    if (type === 'TextView' || type === 'Button') {
        visualContainer.textContent = component.attributesData.text || componentVisuals[type];
    }
    // Add more specific updates for other component types as needed
}

 function makeResizableAndDraggable(component) {
        const containerRect = componentContainer.getBoundingClientRect();

        interact(component)
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move(event) {
                        let { x, y, width, height } = event.target.dataset;

                        x = (parseFloat(x) || 0) + event.deltaRect.left;
                        y = (parseFloat(y) || 0) + event.deltaRect.top;

                        // Constrain within container
                        x = Math.max(0, Math.min(x, containerRect.width - event.rect.width));
                        y = Math.max(0, Math.min(y, containerRect.height - event.rect.height));

                        Object.assign(event.target.style, {
                            width: `${event.rect.width}px`,
                            height: `${event.rect.height}px`,
                            left: `${x}px`,
                            top: `${y}px`
                        });

                        Object.assign(event.target.dataset, { x, y, width, height });

                        // Update attributesData
                        event.target.attributesData.layout_width = `${event.rect.width}px`;
                        event.target.attributesData.layout_height = `${event.rect.height}px`;

                        updateXmlOutput();
                    }
                }
            })
            .draggable({
                listeners: {
                    move(event) {
                        const target = event.target;
                        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        // Constrain within container
                        x = Math.max(0, Math.min(x, containerRect.width - target.offsetWidth));
                        y = Math.max(0, Math.min(y, containerRect.height - target.offsetHeight));

                        target.style.left = `${x}px`;
                        target.style.top = `${y}px`;

                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);

                        updateXmlOutput();
                    }
                }
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
            xmlString += `        android:layout_y="${component.style.top}"\n`;
            xmlString += `        android:layout_width="${component.style.width || component.attributesData.layout_width}"\n`;
            xmlString += `        android:layout_height="${component.style.height || component.attributesData.layout_height}" />\n\n`;
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
