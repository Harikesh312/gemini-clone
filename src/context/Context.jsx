import { createContext, useState } from "react";
import runChat from "../config/gemini";
import { formatResponse } from "../utils/formatResponse";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [fileData, setFileData] = useState(null); // { base64, mimeType, name }

  const delayPara = (index, nextword) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextword);
    }, 10 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setFileData(null);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let promptToSend;
    if (prompt !== undefined) {
      promptToSend = prompt;
      setRecentPrompt(prompt);
      setPrevPrompts((prev) => [...prev, prompt]);
    } else {
      promptToSend = input;
      setRecentPrompt(input);
      setPrevPrompts((prev) => [...prev, input]);
      setInput("");
    }

    let response;
    if (
      promptToSend.toLowerCase().includes("who built you") ||
      promptToSend.toLowerCase().includes("who trained you") ||
      promptToSend.toLowerCase().includes("who build you")
    ) {
      response = "I'm a large language model trained by **Harikesh Kumar**.";
    } else {
      response = await runChat(promptToSend, fileData);
    }

    // Clear file after sending
    setFileData(null);

    const formattedResponse = formatResponse(response);
    const words = formattedResponse.split(" ");
    for (let i = 0; i < words.length; i++) {
      delayPara(i, words[i] + " ");
    }

    setLoading(false);
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    fileData,
    setFileData,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;