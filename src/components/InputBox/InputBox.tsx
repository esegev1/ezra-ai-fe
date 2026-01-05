import React, { useState } from 'react';
import './InputBox.css'

interface InputBoxProps {
    pullAnalysisData: (type: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ pullAnalysisData, pullTopCosts }) => {


  const handleClick = (event: React.FormEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const type = target.id;
    pullAnalysisData(type);

    pullTopCosts('topcosts')

  }

  return (
    <div className='input-container'>
        <button id="budget" className="action-button" onClick={handleClick}>Budget analysis</button>
    </div>
  );
};

export default InputBox;