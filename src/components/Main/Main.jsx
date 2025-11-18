import React, { useContext, useEffect, useRef, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { GoPlus } from "react-icons/go";
import { Context } from '../../context/Context';
import { LiaGlobeSolid } from "react-icons/lia";
import { BiImages } from "react-icons/bi";
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";

const Main = ({ isSidebarExpanded }) => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
  const textareaRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = newHeight + 'px';
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSent();
      }
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className={`main ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
      <div className="nav">
        <p>Cognito</p>
        <img src={assets.user_icon} alt="User" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>Hello, there</p>
            </div>
          </>
        ) : (
          <div className='result'>
            <div className="result-title">
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img className='gemini-avatar' src={assets.gemini_icon} alt="AI" />
              <div className='response-wrapper'>
                {loading ? (
                  <div className='loader'>
                    <div className="loader-bar"></div>
                    <div className="loader-bar"></div>
                    <div className="loader-bar"></div>
                  </div>
                ) : (
                  <>
                    <div
                      className="response-content"
                      dangerouslySetInnerHTML={{ __html: resultData }}
                    ></div>

                    <div className="feedback-buttons">
                      <button
                        className={`feedback-btn ${liked ? 'active-like' : ''}`}
                        onClick={handleLike}
                        title="Good response"
                      >
                        {liked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
                      </button>
                      <button
                        className={`feedback-btn ${disliked ? 'active-dislike' : ''}`}
                        onClick={handleDislike}
                        title="Bad response"
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

        <div className="main-bottom">
          <div className="search-box">
            <textarea
              ref={textareaRef}
              className="search-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a prompt here"
            />

            <div className='search-icon'>
              <div className='left-icons'>
                <GoPlus className='img-box' />
                <p className='deep-search'>
                  <LiaGlobeSolid className='globe' />
                  <span>Deep Search</span>
                </p>
                <p className='canvas'>
                  <BiImages className='globe' />
                  <span>Canvas</span>
                </p>
              </div>

              <div className='send-button'>
                {input.trim() ? (
                  <button onClick={() => onSent()} className='send-btn'>
                    <img src={assets.send_icon} alt="Send" />
                  </button>
                ) : (
                  <img className='mic-icon' src={assets.mic_icon} alt="Voice" />
                )}
              </div>
            </div>
          </div>

          <p className="bottom-info">
            Cognito can make mistakes, so double-check it
          </p>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  
  return (
    <div className={`sidebar ${extended ? 'expanded' : 'collapsed'}`}>
      {/* ... rest of your existing JSX ... */}
    </div>
  );
};

export default Main;
