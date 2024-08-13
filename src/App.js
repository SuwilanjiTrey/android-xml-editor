import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [components, setComponents] = useState([]);
  const [xmlOutput, setXmlOutput] = useState('');
  const [deviceType, setDeviceType] = useState('phone');

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
    };
    setComponents([...components, newComponent]);
  };

  const updateXmlOutput = () => {
    let xmlString = '<LinearLayout\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical">\n\n';
    
    components.forEach((component) => {
      xmlString += `    <${component.type}\n        android:layout_width="wrap_content"\n        android:layout_height="wrap_content"\n        android:layout_x="${component.x}"\n        android:layout_y="${component.y}" />\n\n`;
    });

    xmlString += '</LinearLayout>';
    setXmlOutput(xmlString);
  };

  const saveXML = () => {
    console.log('Saving XML:', xmlOutput);
    alert('XML saved! (Check the console)');
  };

  return (
    <div className="App">
      <nav id="top-nav">
        <select 
          value={deviceType} 
          onChange={(e) => setDeviceType(e.target.value)}
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
            src={`/${deviceType}.png`} 
            alt="Device Preview"
          />
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
              >
                {component.type}
              </div>
            ))}
          </div>
        </main>
        <aside id="right-sidebar">
          <h2>Attributes</h2>
          <div id="attribute-editor">
            {/* Attribute editor will be implemented here */}
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
