
import { useState } from "react";
import { Tool } from "@/types";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type ToolDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  tools: Tool[];
  onToolSelected: (tool: Tool) => void;
};

export const ToolDrawer = ({ isOpen, onClose, tools, onToolSelected }: ToolDrawerProps) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const toolCategories = Array.from(new Set(tools.map(tool => tool.category)));

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleUseInSession = () => {
    if (selectedTool) {
      onToolSelected(selectedTool);
      onClose();
    }
  };

  const handleShareLink = () => {
    // Generate a dummy share link
    const dummyShareLink = `https://mindway.app/shared/${selectedTool?.id}/${Math.random().toString(36).substring(2, 10)}`;
    setShareLink(dummyShareLink);
    setIsShareDialogOpen(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setLinkCopied(true);
      toast.success("Link copied to clipboard!");
      
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Therapy Tools</SheetTitle>
          <SheetDescription>
            Select a tool to use in your session
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue={toolCategories[0]} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4">
            <TabsList className="w-full justify-start overflow-x-auto">
              {toolCategories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {toolCategories.map(category => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  {tools
                    .filter(tool => tool.category === category)
                    .map(tool => (
                      <div
                        key={tool.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTool?.id === tool.id
                            ? "border-mindway-primary bg-mindway-primary/5"
                            : "hover:border-gray-300"
                        }`}
                        onClick={() => handleToolClick(tool)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-mindway-primary/10 rounded-md text-mindway-primary">
                            {/* Replace with actual icon component when available */}
                            <span className="block w-5 h-5">{tool.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{tool.name}</h3>
                            <p className="text-sm text-gray-600">{tool.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
        
        {selectedTool && (
          <div className="p-6 border-t">
            <div className="flex flex-col gap-3">
              <Button onClick={handleUseInSession}>
                Use in Session
              </Button>
              <Button variant="outline" onClick={handleShareLink}>
                Share Link with Client
              </Button>
            </div>
          </div>
        )}

        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share {selectedTool?.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-4 text-sm text-gray-600">
                Your client can access this tool using the link below. No app installation required.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 p-3 bg-gray-50 border rounded-lg overflow-hidden truncate">
                  {shareLink}
                </div>
                <Button 
                  size="icon" 
                  variant="outline"
                  onClick={copyShareLink}
                >
                  {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                </Button>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                  Close
                </Button>
                <Button asChild>
                  <a href={shareLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} className="mr-2" />
                    Open Link
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
};
