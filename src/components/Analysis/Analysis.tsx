import React, { useState } from 'react';
import './Analysis.css'

export interface AnalysisLangObj {
  [key: string]: string | number;
}

interface AnalysisProps {
  analysisLang: AnalysisLangObj;
}

const Analysis = ( { analysisLang }: AnalysisProps) => {

  console.log("analysisLang: ", analysisLang)


  return (
    <div className='analysis-container'>
        <h3>Housing</h3>
        <p>{analysisLang.housing}</p>
        <h3>Fixed Costs</h3>
        <p>{analysisLang.fixedCosts}</p>
        <h3>More Reading</h3>
        <p>{analysisLang.more}</p>
    </div>
  );
};

export default Analysis;