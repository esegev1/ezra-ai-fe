import React, { useEffect, useState } from 'react';
import './InputBox.css'

interface InputBoxProps {
    pullAnalysisData: (type: string) => void;
    pullTopCosts: (type: string) => void;
    pullAnalysisLang: (type: string) => void;
    askOpenAI: (type: string) => void;
    latestAnalysis: string;
}

const InputBox: React.FC<InputBoxProps> = ({ pullAnalysisData, pullTopCosts, pullAnalysisLang, askOpenAI, latestAnalysis }) => {

  const [isMain, setIsMain] = useState(true)
  const [question, setQuestion] = useState('')

  // console.log('latestAnalysis: ', latestAnalysis)
  // if (latestAnalysis !== '') {
  //   setIsMain(false)
  // }

  useEffect(() => {
  if (latestAnalysis !== '') {
    setIsMain(false);
  }
}, [latestAnalysis]); // Only run when latestAnalysis changes

  const handleClick = (event: React.FormEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const type = target.id;
    pullAnalysisData(type);
    pullTopCosts('topcosts')
    pullAnalysisLang('budgetlang')
    // pullAnalysisLang('topcosts')

    setIsMain(false)
  }

  // 2. Handle the Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents the cursor from moving to a new line
      askOpenAI(question);
      setIsMain(false);
      setQuestion('');
    }
  };

  return (
    <div className={isMain? 'input-container initial-view' : 'input-container response-view'}>
        <button id="budget" className="action-button" onClick={handleClick}>Budget analysis</button>
        <textarea 
          className="user-input" 
          value={question} // Binds the text to state
          onChange={(e) => setQuestion(e.target.value)} // Updates state on every keystroke
          onKeyDown={handleKeyDown}
          placeholder="Let's talk...">

        </textarea>
    </div>
  ); 
};

export default InputBox;