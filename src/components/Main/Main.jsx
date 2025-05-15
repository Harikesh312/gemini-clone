import React, { useContext } from 'react'
import './Main.css'
import {assets} from '../../assets/assets'
import { GoPlus } from "react-icons/go";
import { Context } from '../../context/Context'


const Main = () => {

  const {onSent,recentPrompt,showResult,loading,resultData,setInput,input} = useContext(Context)

  return (
    <div className='main'>
        <div className="nav">
            <p>Chatbot</p>
            <img src={assets.user_icon} alt="" />
        </div>
        <div className="main-container">
          {!showResult
          ?<>
            <div className="greet">
              <p>Hello, there</p>
            </div>
          </>
          :<div className='result'>
              <div className="result-title">
                <p>{recentPrompt}</p>
              </div>
              <div className="result-data">
                <img src={assets.gemini_icon} alt="" />
                {loading
                ? <div className='loader'>
                   <hr />
                   <hr />
                   <hr />
                  </div>
                :<p dangerouslySetInnerHTML={{__html:resultData}}></p>
                }
              </div>
          </div>
          }
            <div className="main-bottom">
              <div className="search-box">
                <div className='img-box'>
                  <GoPlus/>
                </div>
                <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Ask Chatbot'/>
                <div>
                  {input?<img onClick={()=>onSent()} src={assets.send_icon} alt="" />:<img src={assets.mic_icon} alt="" />}
                </div>
              </div>
              <p className="bottom-info">
                Chatbot can make mistakes, so double-check it
              </p>
            </div>
        </div>
    </div>
  )
}

export default Main
