import React, { useState } from 'react';
import './InputBox.css'

interface InputBoxProps {
    pullAnalysisData: (type: string) => void;
    pullTopCosts: (type: string) => void;
    pullAnalysisLang: (type: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ pullAnalysisData, pullTopCosts, pullAnalysisLang }) => {

  const [isMain, setIsMain] = useState(true)

  const handleClick = (event: React.FormEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const type = target.id;
    pullAnalysisData(type);
    pullTopCosts('topcosts')
    pullAnalysisLang('budgetlang')
    // pullAnalysisLang('topcosts')

    setIsMain(false)
  }

  return (
    <div className={isMain? 'input-container initial-view' : 'input-container response-view'}>
        <button id="budget" className="action-button" onClick={handleClick}>Budget analysis</button>
    </div>
  );
};

export default InputBox;