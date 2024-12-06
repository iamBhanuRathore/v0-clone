import { FileItem, Step } from "@/types";
import { ScrollArea } from "./ui/scroll-area";
import { StepsList } from "./StepList";
import { FileExplorer } from "./FileExplorer";
import { useState } from "react";
import { useWebContainer } from "@/hooks/useWebContainer";
import { TabView } from "./ui/Tabview";
import { CodeEditor } from "./CodeEditor";
import { PreviewFrame } from "./PreviewFrame";

const MainContent = ({
  steps,
  files,
  setSelectedFile,
  selectedFile,
}: {
  steps: Step[];
  files: FileItem[];
  setSelectedFile: React.Dispatch<React.SetStateAction<FileItem | null>>;
  selectedFile: FileItem | null;
}) => {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const webcontainer = useWebContainer();
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex p-6">
        <div className="space-y-6 overflow-auto">
          <ScrollArea className="h-[70vh] w-[320px] rounded-md border no-scrollbar">
            <StepsList steps={steps} />
          </ScrollArea>
          {/* Text area to add more steps */}
        </div>
        <div className="bg-gray-900 flex-1 rounded-lg shadow-lg h-[calc(100vh-8rem)]">
          <TabView activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="h-[calc(100%-4rem)]">
            {activeTab === "code" ? (
              <div className="grid grid-cols-4 gap-1">
                <div className="col-span-1 overflow-y-auto">
                  <FileExplorer files={files} onFileSelect={setSelectedFile} />
                </div>
                <div className="col-span-3">
                  <CodeEditor file={selectedFile} />
                </div>
              </div>
            ) : (
              webcontainer && (
                <PreviewFrame
                  webContainer={webcontainer}
                  // files={files}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
