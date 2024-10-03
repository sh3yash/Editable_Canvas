import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { FaBold, FaItalic, FaUnderline, FaRedo, FaUndo, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';
import './Canvas.css';

const Canvas = () => {
  const [text, setText] = useState('');
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const canvasRef = useRef();

  // Function to add text
  const addElement = () => {
    const middleY = canvasRef.current.clientHeight - 100;   // Lower Y position

    const newElement = {
      id: elements.length,
      type: 'text',
      text,
      fontSize,
      fontFamily,
      isBold,
      isItalic,
      isUnderlined,
      alignment,
      position: { x: 0, y: middleY }, // Start from the left
    };

    setElements([...elements, newElement]);
    setHistory([...history, [...elements, newElement]]);
    setText('');
  };

  // Draggable handling for moving elements
  const handleDrag = (e, data, index) => {
    const updatedElements = [...elements];
    updatedElements[index].position = { x: data.x, y: data.y };
    setElements(updatedElements);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addElement();
      event.preventDefault(); // Prevents the default newline in input
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setElements(prevState.slice(0, -1));
      setRedoHistory([...redoHistory, elements]);
      setHistory(history.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1];
      setElements(nextState);
      setHistory([...history, nextState]);
      setRedoHistory(redoHistory.slice(0, -1));
    }
  };

  return (
    <div className="canvas-container">
      <div className="toolbar">
        <button onClick={() => setIsBold(!isBold)} className={isBold ? 'active' : ''}>
          <FaBold size={16} />
        </button>
        <button onClick={() => setIsItalic(!isItalic)} className={isItalic ? 'active' : ''}>
          <FaItalic size={16} />
        </button>
        <button onClick={() => setIsUnderlined(!isUnderlined)} className={isUnderlined ? 'active' : ''}>
          <FaUnderline size={16} />
        </button>
        <button onClick={() => setAlignment('left')} className={alignment === 'left' ? 'active' : ''}>
          <FaAlignLeft size={16} />
        </button>
        <button onClick={() => setAlignment('center')} className={alignment === 'center' ? 'active' : ''}>
          <FaAlignCenter size={16} />
        </button>
        <button onClick={() => setAlignment('right')} className={alignment === 'right' ? 'active' : ''}>
          <FaAlignRight size={16} />
        </button>

        {/* Font Size Selection */}
        <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
          {[8, 10, 12, 14, 16, 18, 20, 24, 30, 36].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        {/* Font Family Selection */}
        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
          {['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'].map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>

        {/* Undo/Redo buttons */}
        <button onClick={undo}>
          <FaUndo size={16} /> Undo
        </button>
        <button onClick={redo}>
          <FaRedo size={16} /> Redo
        </button>
      </div>

      {/* Input and Add Text button */}
      <div className="text-input">
        <textarea
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1} // Keep this dynamic
          style={{ resize: 'none', width: '300px' }} // Fixed width
        />
        <button onClick={() => {
          if (text.trim()) {
            addElement();
          }
        }}>Add Text</button>
      </div>

      {/* Canvas area for adding draggable elements */}
      <div className="canvas" ref={canvasRef} style={{ position: 'relative', width: '100%', height: '300px', border: '1px solid black' }}>
        {elements.map((element, index) => (
          <Draggable key={element.id} position={element.position} onStop={(e, data) => handleDrag(e, data, index)}>
            <div
              style={{
                fontSize: `${element.fontSize}px`,
                fontFamily: element.fontFamily,
                fontWeight: element.isBold ? 'bold' : 'normal',
                fontStyle: element.isItalic ? 'italic' : 'normal',
                textDecoration: element.isUnderlined ? 'underline' : 'none',
                textAlign: element.alignment,
                cursor: 'move',
                padding: '5px',
                display: 'inline-block',
                whiteSpace: 'pre-wrap', // Allows for multiline text
                wordWrap: 'break-word',  // Break long words
                maxWidth: 'none',        // Allow overflow
              }}
            >
              {element.text || 'New Text'}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
