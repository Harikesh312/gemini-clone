import { createContext, useState } from "react";
import runChat from "../config/gemini";
import { formatResponse } from "../utils/formatResponse";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")

    const delayPara = (index, nextword) => {
        setTimeout(function(){
            setResultData((prev) => prev + nextword);
        }, 10 * index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        if (prompt !== undefined) {
            if (prompt.toLowerCase().includes("who build you") || 
                prompt.toLowerCase().includes("who trained you") || 
                prompt.toLowerCase().includes("who built you")) {
                response = "I'm a large language model trained by **Harikesh Kumar**. I'm designed to help you with various tasks and answer your questions.";
            } else {
                response = await runChat(prompt);
            }
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts((prev) => [...prev, input]);
            setRecentPrompt(input);
            if (input.toLowerCase().includes("who built you") || 
                input.toLowerCase().includes("who trained you") || 
                input.toLowerCase().includes("who build you")) {
                response = "I'm a large language model trained by **Harikesh Kumar**. I'm designed to help you with various tasks and answer your questions.";
            } else {
                response = await runChat(input);
            }
        }

        // Format the response with markdown
        let formattedResponse = formatResponse(response);
        
        // Animate response word by word
        let words = formattedResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
            delayPara(i, words[i] + " ");
        }
        
        setLoading(false);
        setInput("");
    }

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
        newChat
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;