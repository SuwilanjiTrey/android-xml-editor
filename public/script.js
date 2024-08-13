document.addEventListener('DOMContentLoaded', () => {
    const componentList = document.getElementById('component-list');
    const componentContainer = document.getElementById('component-container');
    const xmlOutput = document.getElementById('xml-output');
    const saveBtn = document.getElementById('save-btn');
    const deviceSelect = document.getElementById('device-select');
    const devicePhone = document.getElementById('device-phone');
    
    
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
        devicePhone.src = `%PUBLIC_URL%/${e.target.value}.png`;
        
    });

    function createComponent(type, x, y) {
        const component = document.createElement('div');
        component.className = 'component';
        component.style.position = 'absolute';
        component.style.left = `${x}px`;
        component.style.top = `${y}px`;
        component.textContent = type;
        return component;
    }

    function updateXmlOutput() {
        let xmlString = '<LinearLayout\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical">\n\n';
        
        componentContainer.childNodes.forEach((component) => {
            xmlString += `    <${component.textContent}\n        android:layout_width="wrap_content"\n        android:layout_height="wrap_content"\n        android:layout_x="${component.style.left}"\n        android:layout_y="${component.style.top}" />\n\n`;
        });

        xmlString += '</LinearLayout>';
        xmlOutput.value = xmlString;
    }

    function saveXML() {
        // Here you would typically send this to a server
        console.log('Saving XML:', xmlOutput.value);
        alert('XML saved! (Check the console)');
    }
});
