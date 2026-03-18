import React, { useContext, useEffect, useRef, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { GoPlus } from "react-icons/go";
import { Context } from "../../context/Context";
import { LiaGlobeSolid } from "react-icons/lia";
import { BiImages } from "react-icons/bi";
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { HiOutlineArrowDown } from "react-icons/hi";
import { FaFilePdf, FaImage, FaTimes } from "react-icons/fa";

const Main = () => {
  const {
    onSent, recentPrompt, showResult, loading,
    resultData, setInput, input, fileData, setFileData,
  } = useContext(Context);

  const textareaRef = useRef(null);
  const resultContainerRef = useRef(null);
  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [input]);

  useEffect(() => {
    const el = resultContainerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100 && scrollHeight > clientHeight);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() || fileData) handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim() || fileData) {
      const currentInput = input;
      setInput("");
      onSent(currentInput);
    }
  };

  const scrollToBottom = () => {
    resultContainerRef.current?.scrollTo({
      top: resultContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Convert file to base64
  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setShowUploadMenu(false);

    try {
      const base64 = await readFileAsBase64(file);
      setFileData({ base64, mimeType: file.type, name: file.name });
    } catch {
      alert("Failed to read file. Please try again.");
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Cognito</p>
        <img src={assets.user_icon} alt="User" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <div className="greet">
            <p>Hello, there</p>
          </div>
        ) : (
          <div className="result" ref={resultContainerRef}>
            <div className="result-title">
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img className="gemini-avatar" src={assets.gemini_icon} alt="AI" />
              <div className="response-wrapper">
                {loading ? (
                  <div className="loader">
                    <div className="loader-bar"></div>
                    <div className="loader-bar"></div>
                    <div className="loader-bar"></div>
                  </div>
                ) : (
                  <>
                    <div
                      className="response-content"
                      dangerouslySetInnerHTML={{ __html: resultData }}
                    />
                    <div className="feedback-buttons">
                      <button
                        className={`feedback-btn ${liked ? "active-like" : ""}`}
                        onClick={() => { setLiked(!liked); if (disliked) setDisliked(false); }}
                      >
                        {liked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
                      </button>
                      <button
                        className={`feedback-btn ${disliked ? "active-dislike" : ""}`}
                        onClick={() => { setDisliked(!disliked); if (liked) setLiked(false); }}
                      >
                        {disliked ? <AiFillDislike size={20} /> : <AiOutlineDislike size={20} />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showResult && showScrollButton && !loading && (
          <button className="floating-scroll-btn" onClick={scrollToBottom}>
            <HiOutlineArrowDown size={20} />
          </button>
        )}

        <div className="main-bottom">
          {/* File preview chip */}
          {fileData && (
            <div className="file-preview-chip">
              {fileData.mimeType === "application/pdf" ? (
                <FaFilePdf size={14} color="#e53e3e" />
              ) : (
                <FaImage size={14} color="#3182ce" />
              )}
              <span>{fileData.name.length > 30 ? fileData.name.slice(0, 30) + "…" : fileData.name}</span>
              <button onClick={() => setFileData(null)} className="chip-remove">
                <FaTimes size={11} />
              </button>
            </div>
          )}

          <div className="search-box">
            <textarea
              ref={textareaRef}
              className="search-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={fileData ? "Ask about the file..." : "Enter a prompt here"}
            />

            <div className="search-icon">
              <div className="left-icons">
                {/* Upload Menu */}
                <div className="upload-wrapper">
                  <GoPlus
                    className="img-box"
                    onClick={() => setShowUploadMenu((prev) => !prev)}
                    title="Upload file"
                  />
                  {showUploadMenu && (
                    <div className="upload-menu">
                      <button
                        className="upload-menu-item"
                        onClick={() => pdfInputRef.current.click()}
                      >
                        <FaFilePdf size={15} color="#e53e3e" />
                        <span>Upload PDF</span>
                      </button>
                      <button
                        className="upload-menu-item"
                        onClick={() => imageInputRef.current.click()}
                      >
                        <FaImage size={15} color="#3182ce" />
                        <span>Upload Image</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e, "pdf")}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e, "image")}
                />

                <p className="deep-search">
                  <LiaGlobeSolid className="globe" />
                  <span>Deep Search</span>
                </p>
                <p className="canvas">
                  <BiImages className="globe" />
                  <span>Canvas</span>
                </p>
              </div>

              <div className="send-button">
                {input.trim() || fileData ? (
                  <button onClick={handleSend} className="send-btn">
                    <img src={assets.send_icon} alt="Send" />
                  </button>
                ) : (
                  <img className="mic-icon" src={assets.mic_icon} alt="Voice" />
                )}
              </div>
            </div>
          </div>

          <p className="bottom-info">Cognito can make mistakes, so double-check it</p>
        </div>
      </div>
    </div>
  );
};

export default Main;