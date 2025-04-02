
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Save, Undo, Eraser, Pen } from "lucide-react";

type DrawingCanvasProps = {
  onClose: () => void;
  onSave: (imageData: string) => void;
};

export const DrawingCanvas = ({ onClose, onSave }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
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
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    
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
    
    context.lineWidth = tool === 'eraser' ? 20 : 2;
    context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : '#000000';
    
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
        <div className="flex gap-2">
          <Button
            variant={tool === "pen" ? "default" : "outline"}
            size="sm"
            onClick={() => setTool("pen")}
          >
            <Pen size={16} className="mr-1" /> Pen
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            size="sm"
            onClick={() => setTool("eraser")}
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
