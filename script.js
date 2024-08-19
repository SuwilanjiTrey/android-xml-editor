

document.addEventListener('DOMContentLoaded', () => {
    class ConstraintNode {
        constructor(element) {
            this.element = element;
            this.constraints = {
                top: null,
                bottom: null,
                left: null,
                right: null
            };
        }
    
        addConstraint(direction, targetNode, targetDirection) {
            this.constraints[direction] = {
                node: targetNode,
                direction: targetDirection
            };
        }
    
        removeConstraint(direction) {
            this.constraints[direction] = null;
        }
    
        getConstraints() {
            return this.constraints;
        }
    
        updatePosition() {
            // Logic to update position based on constraints
            // This will be implemented later
        }
    }


    
    const componentsBar = document.getElementById('components-bar');
    const componentContainer = document.getElementById('component-container');
    const xmlOutput = document.getElementById('xml-output');
    const saveBtn = document.getElementById('save-btn');
    const savename = document.getElementById('savename');
    const attributeEditor = document.getElementById('attribute-editor');
    const deviceSelect = document.getElementById('device-select');
    const devicePhone = document.getElementById('device-image');
    const deleteZone = createDeleteZone();


    let activeConnection = null;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    componentContainer.appendChild(svg);


    let selectedComponent = null;

    const componentVisuals = {
        Button: 'assets/button.png',
        TextView: 'assets/text_view.png',
        ImageView: 'assets/image.png',
        PlainText: 'assets/text_view.png',
        Password: 'assets/password.png',
        Email: 'assets/email.png',
        ProgressBar: 'assets/progress_bar.png',
        SeekBar: 'assets/seek_bar.png',
        RatingBar: 'assets/rating_bar.png',
        Switch: 'assets/switch_off.png',
        CheckBox: 'assets/checkbox_off.png',
        RadioButton: 'assets/radio.png',
        RecyclerView: 'assets/recycler_view.png'
        // Add more components as needed
    };
    // Define default attributes for each component type
    const defaultAttributes = {
        Button: { id: '',text: 'Button', textSize: '14sp', layout_width: 'wrap_content', layout_height: 'wrap_content' },
        RecyclerView: { id: '', textSize: '14sp', layout_width: 'wrap_content', layout_height: 'wrap_content' },
        TextView: {id: '', text: 'TextView', textSize: '14sp', layout_width: 'wrap_content', layout_height: 'wrap_content' },
        ImageView: { id: '',src: '', layout_width: '100dp', layout_height: '100dp' },
        PlainText: { id: '',hint: 'Enter text', layout_width: 'match_parent', layout_height: 'wrap_content' },
        Password: { id: '',hint: 'Enter password', inputType: 'textPassword', layout_width: 'match_parent', layout_height: 'wrap_content' },
        Email: { id: '',hint: 'Enter email', inputType: 'textEmailAddress', layout_width: 'match_parent', layout_height: 'wrap_content' },
        ProgressBar: { id: '',style: '?android:attr/progressBarStyleHorizontal', layout_width: 'match_parent', layout_height: 'wrap_content', progress: "50" },
        SeekBar: { id: '',layout_width: 'match_parent', layout_height: 'wrap_content', max: "100", progress: "50"},
        RatingBar: { id: '',numStars: '5', layout_width: 'wrap_content', layout_height: 'wrap_content' },
        LinearLayout: { id: '',orientation: 'vertical', layout_width: 'match_parent', layout_height: 'wrap_content', rating: "3.5" },
        FrameLayout: { id: '',layout_width: 'match_parent', layout_height: 'wrap_content' },
        CheckBox: { id: '',layout_width: 'wrap_content', layout_height: 'wrap_content',text: "Check this box" },
        Switch: { id: '',layout_width: 'wrap_content', layout_height: 'wrap_content',text: "Toggle Switch" },
        RadioButton: { id: '',layout_width: 'wrap_content', layout_height: 'wrap_content',text: "Option 1", orientation: "vertical" },
        ConstraintLayout: { id: '',layout_width: 'match_parent', layout_height: 'match_parent' }
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
            componentContainer.style.top = '16.9%';
            componentContainer.style.left = '28.32%';
            componentContainer.style.width = '42.86%';
            componentContainer.style.height = '70.8%';
            componentContainer.style.border = '1px solid #ccc';
            componentContainer.style.borderRadius = '10px'
        } else if (e.target.value === 'tablet') {
            // Reset to default styles if needed when not a tablet
            componentContainer.style.position = 'absolute';
            componentContainer.style.top = '26.25%';
            componentContainer.style.left = '27.74%';
            componentContainer.style.width = '44.35%';
            componentContainer.style.height = '53.85%';
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
    

    function createDeleteZone() {
        const deleteZone = document.createElement('div');
        deleteZone.id = 'delete-zone';
        deleteZone.innerHTML = '<i class="fas fa-trash"></i>';
        deleteZone.style.position = 'absolute';
        deleteZone.style.bottom = '10px';
        deleteZone.style.right = '10px';
        deleteZone.style.width = '80px';
        deleteZone.style.height = '50px';
        deleteZone.style.backgroundColor = '#ff0000';
        deleteZone.style.color = 'white';
        deleteZone.style.display = 'flex';
        deleteZone.style.alignItems = 'center';
        deleteZone.style.justifyContent = 'center';
        deleteZone.style.borderRadius = '5px';
        deleteZone.style.fontSize = '14px';
        deleteZone.style.fontWeight = 'bold';
        deleteZone.style.cursor = 'default';
        deleteZone.style.zIndex = '1000';
        
        componentContainer.appendChild(deleteZone);
        
        return deleteZone;
    }


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
    
        // Generate a unique ID for the component
        component.id = `component-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
        // Create and attach the ConstraintNode
        component.constraintNode = new ConstraintNode(component);
    
        // Add connection points
        ['top', 'bottom', 'left', 'right'].forEach(direction => {
            const connectionPoint = document.createElement('div');
            connectionPoint.className = `connection-point ${direction}`;
            connectionPoint.style.position = 'absolute';
            connectionPoint.style.width = '10px';
            connectionPoint.style.height = '10px';
            connectionPoint.style.backgroundColor = '#007bff';
            connectionPoint.style.borderRadius = '50%';
            
            switch(direction) {
                case 'top': 
                    connectionPoint.style.top = '-5px';
                    connectionPoint.style.left = 'calc(50% - 5px)';
                    break;
                case 'bottom':
                    connectionPoint.style.bottom = '-5px';
                    connectionPoint.style.left = 'calc(50% - 5px)';
                    break;
                case 'left':
                    connectionPoint.style.left = '-5px';
                    connectionPoint.style.top = 'calc(50% - 5px)';
                    break;
                case 'right':
                    connectionPoint.style.right = '-5px';
                    connectionPoint.style.top = 'calc(50% - 5px)';
                    break;
            }
            
            component.appendChild(connectionPoint);
        });


    

    

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
    updateComponentVisual(component);
    updateXmlOutput();

    return component;
}


function updateComponentVisual(component) {
    const type = component.dataset.componentType;
    const visualContainer = component.querySelector('.component-visual');
    if (type === 'TextView' || type === 'Button') {
        visualContainer.textContent = component.attributesData.text || type;
    } else if (type === 'ImageView') {
        visualContainer.src = component.attributesData.src ? 
            `assets/${component.attributesData.src}.png` : componentVisuals[type];
    }
    // Add more specific updates for other component types as needed
}

function updateAttributeEditor(attributes) {
    attributeEditor.innerHTML = '';
    for (const [key, value] of Object.entries(attributes)) {
        const attributeDiv = document.createElement('div');
        attributeDiv.innerHTML = `
        <br>
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



componentContainer.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('connection-point')) {
        activeConnection = {
            sourceNode: e.target.closest('.component').constraintNode,
            sourceDirection: Array.from(e.target.classList).find(cls => ['top', 'bottom', 'left', 'right'].includes(cls)),
            sourceDot: e.target
        };
    }
});

componentContainer.addEventListener('mousemove', (e) => {
    if (activeConnection) {
        drawTempLine(activeConnection.sourceDot, e.clientX, e.clientY);
    }
});

componentContainer.addEventListener('mouseup', (e) => {
    if (activeConnection && e.target.classList.contains('connection-point')) {
        const targetComponent = e.target.closest('.component');
        const targetDirection = Array.from(e.target.classList).find(cls => ['top', 'bottom', 'left', 'right'].includes(cls));

        activeConnection.sourceNode.addConstraint(
            activeConnection.sourceDirection,
            targetComponent.constraintNode,
            targetDirection
        );

        updateConstraintLines(activeConnection.sourceNode.element);
        updateXmlOutput(); // Add this line to update XML after adding a constraint
    }
    activeConnection = null;
    clearTempLine();
});

function drawTempLine(sourceDot, targetX, targetY) {
    clearTempLine();
    const rect = componentContainer.getBoundingClientRect();
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const sourceRect = sourceDot.getBoundingClientRect();
    line.setAttribute("x1", sourceRect.left + sourceRect.width / 2 - rect.left);
    line.setAttribute("y1", sourceRect.top + sourceRect.height / 2 - rect.top);
    line.setAttribute("x2", targetX - rect.left);
    line.setAttribute("y2", targetY - rect.top);
    line.setAttribute("stroke", "#007bff");
    line.setAttribute("stroke-width", "2");
    line.id = "temp-line";
    svg.appendChild(line);
}

function clearTempLine() {
    const tempLine = document.getElementById("temp-line");
    if (tempLine) {
        tempLine.remove();
    }
}

function updateConstraintLines(component) {
    // Remove existing lines for this component
    svg.querySelectorAll(`line[data-source="${component.id}"]`).forEach(line => line.remove());

    const constraints = component.constraintNode.getConstraints();
    const rect = componentContainer.getBoundingClientRect();

    for (const [direction, constraint] of Object.entries(constraints)) {
        if (constraint) {
            const sourceDot = component.querySelector(`.connection-point.${direction}`);
            const targetDot = constraint.node.element.querySelector(`.connection-point.${constraint.direction}`);
            
            const sourceRect = sourceDot.getBoundingClientRect();
            const targetRect = targetDot.getBoundingClientRect();

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", sourceRect.left + sourceRect.width / 2 - rect.left);
            line.setAttribute("y1", sourceRect.top + sourceRect.height / 2 - rect.top);
            line.setAttribute("x2", targetRect.left + targetRect.width / 2 - rect.left);
            line.setAttribute("y2", targetRect.top + targetRect.height / 2 - rect.top);
            line.setAttribute("stroke", "#007bff");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("data-source", component.id);
            svg.appendChild(line);
        }
    }
}

 function makeResizableAndDraggable(component) {
    const containerRect = componentContainer.getBoundingClientRect();
    const deleteZone = document.getElementById('delete-zone');

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
                        

                        event.target.attributesData.layout_width = `${Math.round(event.rect.width / 2) * 2}dp`;
                        event.target.attributesData.layout_height = `${Math.round(event.rect.height / 2)* 4}dp`;
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
    
                        updateConstraintLines(component);
                        updateXmlOutput();
    
                        // Check if the component is over the delete zone
                        const deleteZoneRect = deleteZone.getBoundingClientRect();
                        const componentRect = target.getBoundingClientRect();
    
                        if (
                            componentRect.right > deleteZoneRect.left &&
                            componentRect.left < deleteZoneRect.right &&
                            componentRect.bottom > deleteZoneRect.top &&
                            componentRect.top < deleteZoneRect.bottom
                        ) {
                            deleteZone.style.backgroundColor = '#ff4757';
                            deleteZone.style.transform = 'scale(1.1)';
                        } else {
                            deleteZone.style.backgroundColor = '#ff6b6b';
                            deleteZone.style.transform = 'scale(1)';
                        }
                    },
                    end(event) {
                        const target = event.target;
                        const deleteZoneRect = deleteZone.getBoundingClientRect();
                        const componentRect = target.getBoundingClientRect();
    
                        if (
                            componentRect.right > deleteZoneRect.left &&
                            componentRect.left < deleteZoneRect.right &&
                            componentRect.bottom > deleteZoneRect.top &&
                            componentRect.top < deleteZoneRect.bottom
                        ) {
                            deleteComponent(target);
                        }
    
                        deleteZone.style.backgroundColor = '#ff6b6b';
                        deleteZone.style.transform = 'scale(1)';
                    }
                }
            });
    }
    function deleteComponent(component) {
        // Remove constraint lines connected to this component
        svg.querySelectorAll(`line[data-source="${component.id}"]`).forEach(line => line.remove());
    
        // Remove constraints in other components that reference this component
        componentContainer.querySelectorAll('.component').forEach(otherComponent => {
            if (otherComponent !== component) {
                const constraints = otherComponent.constraintNode.getConstraints();
                for (const [direction, constraint] of Object.entries(constraints)) {
                    if (constraint && constraint.node.element === component) {
                        otherComponent.constraintNode.removeConstraint(direction);
                    }
                }
            }
        });
    
        // Remove the component from the container
        component.remove();
    
        // Update XML output
        updateXmlOutput();
    
        // Clear attribute editor if the deleted component was selected
        if (selectedComponent === component) {
            selectedComponent = null;
            attributeEditor.innerHTML = '';
        }
    }    


// Add this function to update XML when constraints are added
function updateXmlOutput() {
    let xmlString = '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"\n' +
    'xmlns:app="http://schemas.android.com/apk/res-auto"\n' +
    'xmlns:tools="http://schemas.android.com/tools"\n' + 
    '    android:layout_width="match_parent"\n' +
    '    android:layout_height="match_parent"\n' +
    '    tools:context=".MainActivity">\n\n';

    componentContainer.childNodes.forEach((component) => {
        if (component.nodeType === Node.ELEMENT_NODE && component.classList.contains('component')) {
            if (component.dataset.componentType === "RecyclerView") {
                xmlString += `    <androidx.recyclerview.widget.RecyclerView\n`;
            } else {
                xmlString += `    <${component.dataset.componentType}\n`;
            }
            
            for (const [key, value] of Object.entries(component.attributesData || {})) {
                if (key === "id") {
                    xmlString += `        android:${key}="@+id/${value}"\n`;
                } else if (key === "src") {
                    xmlString += `        android:${key}="@drawable/${value}"\n`;
                } else {
                    xmlString += `        android:${key}="${value}"\n`;
                }
            }

            if (component.constraintNode) {
                const constraints = component.constraintNode.getConstraints();
                for (const [direction, constraint] of Object.entries(constraints)) {
                    if (constraint && constraint.node && constraint.node.element) {
                        const targetId = constraint.node.element.attributesData?.id;
                        if (targetId) {
                            xmlString += `        app:layout_constraint${capitalize(direction)}To="@id/${targetId}"\n`;
                            xmlString += `        app:layout_constraint${capitalize(direction)}_to${capitalize(constraint.direction)}Of="@id/${targetId}"\n`;
                        }
                    }
                }
            }

            xmlString += '        />\n\n';
        }
    });

    xmlString += '</androidx.constraintlayout.widget.ConstraintLayout>';
    xmlOutput.value = xmlString;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

    saveBtn.addEventListener('click', () => {
        const filename = savename.value.trim() || 'layout';
        downloadXmlFile(filename);
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
    function downloadXmlFile(filename) {
        const xmlContent = xmlOutput.value;
        const blob = new Blob([xmlContent], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
    
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `${filename}.xml`;
    
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    
        URL.revokeObjectURL(url);
    }

    

});
