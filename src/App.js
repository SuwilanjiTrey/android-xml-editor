import React, { useState, useEffect } from 'react';
import './App.css';
import phoneImage from './phone.png';
import tabletImage from './tablet.png';

function App() {
  const [components, setComponents] = useState([]);
  const [xmlOutput, setXmlOutput] = useState('');
  const [deviceType, setDeviceType] = useState('phone');
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    updateXmlOutput();
  }, [components]);

  const handleDragStart = (e, componentType) => {
    e.dataTransfer.setData('text/plain', componentType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('text');
    const newComponent = {
      type: componentType,
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      attributes: getDefaultAttributes(componentType)
    };
    setComponents([...components, newComponent]);
  };

  const getDefaultAttributes = (componentType) => {
    switch(componentType) {
      case 'TextView':
        return { text: 'New TextView', textSize: '14sp' };
      case 'Button':
        return { text: 'New Button' };
      case 'RecyclerView':
        return { orientation: 'vertical' };
      default:
        return {};
    }
  };

  const updateXmlOutput = () => {
    let xmlString = '<LinearLayout\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical">\n\n';
    
    components.forEach((component) => {
      xmlString += `    <${component.type}\n`;
      Object.entries(component.attributes).forEach(([key, value]) => {
        xmlString += `        android:${key}="${value}"\n`;
      });
      xmlString += `        android:layout_x="${component.x}"\n`;
      xmlString += `        android:layout_y="${component.y}" />\n\n`;
    });

    xmlString += '</LinearLayout>';
    setXmlOutput(xmlString);
  };

  const saveXML = () => {
    console.log('Saving XML:', xmlOutput);
    alert('XML saved! (Check the console)');
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const handleAttributeChange = (attribute, value) => {
    if (selectedComponent) {
      const updatedComponents = components.map(comp => 
        comp === selectedComponent 
          ? { ...comp, attributes: { ...comp.attributes, [attribute]: value } }
          : comp
      );
      setComponents(updatedComponents);
      setSelectedComponent({ ...selectedComponent, attributes: { ...selectedComponent.attributes, [attribute]: value } });
    }
  };

  return (
    <div className="App">
      <nav id="top-nav">
        <select 
  value={deviceType} 
  onChange={(e) => {
    setDeviceType(e.target.value);
    console.log(e.target.value);  // Log the selected device type
  }}
>
          <option value="phone">Phone</option>
          <option value="tablet">Tablet</option>
        </select>
        <button onClick={saveXML}>Save XML</button>
      </nav>
      <div id="main-content">
        <aside id="left-sidebar">
          <h2>Components</h2>
          <ul id="component-list">
            <li draggable onDragStart={(e) => handleDragStart(e, 'TextView')}>TextView</li>
            <li draggable onDragStart={(e) => handleDragStart(e, 'Button')}>Button</li>
            <li draggable onDragStart={(e) => handleDragStart(e, 'RecyclerView')}>RecyclerView</li>
          </ul>
        </aside>
        <main id="device-preview">
         <img 
  id="device-image" 
  src={deviceType === 'phone' ? phoneImage : tabletImage} 
  alt="Device Preview"
/>
{console.log(deviceType === 'phone' ? phoneImage : tabletImage)}  // Log the image path

          <div 
            id="component-container"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {components.map((component, index) => (
              <div 
                key={index}
                className="component"
                style={{
                  position: 'absolute',
                  left: `${component.x}px`,
                  top: `${component.y}px`,
                }}
                onClick={() => handleComponentClick(component)}
              >
                {component.type}
              </div>
            ))}
          </div>
        </main>
        <aside id="right-sidebar">
          <h2>Attributes</h2>
          <div id="attribute-editor">
            {selectedComponent && (
              <>
                <h3>{selectedComponent.type} Attributes</h3>
                {Object.entries(selectedComponent.attributes).map(([key, value]) => (
                  <div key={key}>
                    <label>{key}: </label>
                    <input 
                      type="text" 
                      value={value} 
                      onChange={(e) => handleAttributeChange(key, e.target.value)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </aside>
      </div>
      <footer>
        <textarea 
          id="xml-output" 
          value={xmlOutput} 
          readOnly 
        />
      </footer>
    </div>
  );
}

export default App;
