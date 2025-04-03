
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Save, Undo, Eraser, Pen, Highlighter } from "lucide-react";
import { DrawingTool } from "@/types";

type DrawingCanvasProps = {
  onClose: () => void;
  onSave: (imageData: string) => void;
};

export const DrawingCanvas = ({ onClose, onSave }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>({
    type: "pen",
    size: 2,
    color: "#000000"
  });
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const colorOptions = [
    "#000000", // Black
    "#4c6fff", // Primary blue
    "#10b981", // Green
    "#f43f5e", // Red
    "#6366f1", // Purple
    "#fbbf24", // Yellow
    "#f97316", // Orange
  ];

  const penSizes = [1, 2, 4, 6, 8];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas to full width of container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set up drawing style
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = currentTool.size;
    ctx.strokeStyle = currentTool.color;
    
    setContext(ctx);
    
    // Save initial canvas state
    saveToHistory(canvas);
    
    // Handle resize
    const handleResize = () => {
      const imageData = canvas.toDataURL();
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Restore the image after resize
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageData;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update context when tool changes
  useEffect(() => {
    if (!context) return;
    
    context.lineWidth = currentTool.size;
    context.strokeStyle = currentTool.color;
    
    if (currentTool.type === "highlighter") {
      context.globalAlpha = 0.3;
    } else {
      context.globalAlpha = 1.0;
    }
    
  }, [currentTool, context]);
  
  const saveToHistory = (canvas: HTMLCanvasElement) => {
    const imageData = canvas.toDataURL();
    
    // If we're not at the end of the history array, remove everything after current index
    if (historyIndex < history.length - 1) {
      setHistory(prev => prev.slice(0, historyIndex + 1));
    }
    
    setHistory(prev => [...prev, imageData]);
    setHistoryIndex(prev => prev + 1);
  };
  
  const undo = () => {
    if (historyIndex <= 0 || !context || !canvasRef.current) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      context.drawImage(img, 0, 0);
    };
    img.src = history[newIndex];
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    setIsDrawing(true);
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setLastX(x);
    setLastY(y);
    
    context.beginPath();
    context.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
      
      // If mouse button is not pressed, stop drawing
      if (e.buttons !== 1) {
        setIsDrawing(false);
        return;
      }
    }
    
    e.preventDefault();
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.lineWidth = currentTool.type === "eraser" ? 20 : currentTool.size;
    context.strokeStyle = currentTool.type === "eraser" ? "#FFFFFF" : currentTool.color;
    
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
    
    setLastX(x);
    setLastY(y);
  };
  
  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) return;
    
    setIsDrawing(false);
    
    // Save the current state to history
    saveToHistory(canvasRef.current);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    const imageData = canvasRef.current.toDataURL();
    onSave(imageData);
  };
  
  return (
    <Card className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex gap-2 flex-wrap">
          {/* Tool selection */}
          <Button
            variant={currentTool.type === "pen" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentTool(prev => ({ ...prev, type: "pen" }))}
          >
            <Pen size={16} className="mr-1" /> Pen
          </Button>
          <Button
            variant={currentTool.type === "highlighter" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentTool(prev => ({ ...prev, type: "highlighter" }))}
          >
            <Highlighter size={16} className="mr-1" /> Highlight
          </Button>
          <Button
            variant={currentTool.type === "eraser" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentTool(prev => ({ ...prev, type: "eraser" }))}
          >
            <Eraser size={16} className="mr-1" /> Eraser
          </Button>
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
            <Undo size={16} className="mr-1" /> Undo
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X size={16} className="mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save size={16} className="mr-1" /> Save
          </Button>
        </div>
      </div>
      
      {/* Color and size selection */}
      <div className="border-b p-3 flex items-center gap-4">
        <div className="flex gap-1">
          {colorOptions.map(color => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                backgroundColor: color,
                borderColor: currentTool.color === color ? color : '#ddd',
                boxShadow: currentTool.color === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : 'none'
              }}
              onClick={() => setCurrentTool(prev => ({ ...prev, color }))}
              disabled={currentTool.type === "eraser"}
            />
          ))}
        </div>
        
        <div className="border-l pl-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Size:</span>
          <div className="flex gap-1">
            {penSizes.map(size => (
              <button
                key={size}
                className="flex items-center justify-center w-7 h-7 rounded hover:bg-gray-100 transition-colors focus:outline-none"
                style={{ 
                  backgroundColor: currentTool.size === size ? '#f1f1f1' : 'transparent',
                  border: currentTool.size === size ? '1px solid #ddd' : '1px solid transparent'
                }}
                onClick={() => setCurrentTool(prev => ({ ...prev, size }))}
              >
                <div 
                  className="rounded-full bg-black"
                  style={{ 
                    width: size * 1.5, 
                    height: size * 1.5,
                    backgroundColor: currentTool.type === "eraser" ? "#000" : currentTool.color
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full bg-white touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </Card>
  );
};
