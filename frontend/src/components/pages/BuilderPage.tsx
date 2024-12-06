import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parseXml } from "@/lib/steps";

import { FileItem, Step } from "../../types";
import { processSteps } from "@/lib/processSteps";
import Header from "../Header";
import MainContent from "../MainComponent";

export const BASE_URL = "http://localhost:8080";

const BuilderPage = () => {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    const fetchInitialSteps = async () => {
      try {
        const { data } = await axios.post<{ uiPrompts: string[] }>(
          `${BASE_URL}/template`,
          { prompt }
        );

        const parsedSteps = parseXml(data.uiPrompts[0]);
        setSteps(parsedSteps);
        // console.log(parsedSteps);
      } catch (error) {
        console.error("Error fetching initial steps:", error);
      }
    };

    fetchInitialSteps();
  }, [prompt]);

  useEffect(() => {
    const updatedFiles = processSteps(steps, files);
    if (updatedFiles !== files) {
      setFiles(updatedFiles);
      setSteps((prevSteps) =>
        prevSteps.map((step) => ({
          ...step,
          status: step.status === "pending" ? "completed" : step.status,
        }))
      );
    }
  }, [steps, files]);
  console.log({ selectedFile, files, steps });
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header prompt={prompt} />
      <MainContent
        steps={steps}
        files={files}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
};
export default BuilderPage;
