import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parseXml } from "@/lib/steps";
import { Step } from "@/types";
const BASE_URL = "http://localhost:8080";
const BuilderPage = () => {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [steps, setSteps] = useState<Step[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await axios.post(`${BASE_URL}/template`, {
        prompt: prompt,
      });
      // in reponse i got two things first better prompt, initial set of files
      const parsed = parseXml(data.uiPrompts[0]);
      setSteps(parsed);
    })();
  }, [prompt]);
  console.log({ steps });

  return <div>BuilderPage</div>;
};

export default BuilderPage;
