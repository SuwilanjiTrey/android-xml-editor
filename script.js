document.addEventListener('DOMContentLoaded', () => {
    const componentList = document.getElementById('component-list');
    const componentContainer = document.getElementById('component-container');
    const xmlOutput = document.getElementById('xml-output');
    const saveBtn = document.getElementById('save-btn');
    const deviceSelect = document.getElementById('device-select');
    const devicePhone = document.getElementById('device-image');
    const attributeEditor = document.getElementById('attribute-editor');

    let selectedComponent = null;

    componentList.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.dataset.component);
    });

    componentContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    componentContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text');
        const component = createComponent(componentType, e.offsetX, e.offsetY);
        componentContainer.appendChild(component);
        updateXmlOutput();
    });

    saveBtn.addEventListener('click', saveXML);

    deviceSelect.addEventListener('change', (e) => {
        devicePhone.src = `${e.target.value}.png`;
    });

    function createComponent(type, x, y) {
        const component = document.createElement('div');
        component.className = 'component';
        component.style.position = 'absolute';
        component.style.left = `${x}px`;
        component.style.top = `${y}px`;
        component.textContent = type;
        component.attributesData = getDefaultAttributes(type);

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

    function getDefaultAttributes(type) {
        switch(type) {
            case 'TextView':
                return { text: 'New TextView', textSize: '14sp' };
            case 'Button':
                return { text: 'New Button' };
            case 'RecyclerView':
                return { orientation: 'vertical' };
            default:
                return {};
        }
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
                const attributeName = e.target.getAttribute('data-attribute');
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
            xmlString += `    <${component.textContent}\n`;
            for (const [key, value] of Object.entries(component.attributesData)) {
                xmlString += `        android:${key}="${value}"\n`;
            }
            xmlString += `        android:layout_x="${component.style.left}"\n`;
            xmlString += `        android:layout_y="${component.style.top}" />\n\n`;
        });

        xmlString += '</LinearLayout>';
        xmlOutput.value = xmlString;
    }

    function saveXML() {
        // Here you would typically send this to a server
        console.log('Saving XML:', xmlOutput.value);
        alert('XML saved! (Check the console)');
    }

    // Clear selection when clicking outside components
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