import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./Analysis.css";

export interface AnalysisLangObj {
  [key: string]: string | number;
}

export interface OpenAIObj {
  accountId: string;
  answer: string;
}

interface AnalysisProps {
  analysisLang?: AnalysisLangObj;
  aiResponse?: OpenAIObj;
  streamStatus?: string;
  latestAnalysis: string;
}

// type DisplayMode = "status" | "markdown" | "text";

const Analysis = ({ analysisLang, aiResponse, streamStatus, latestAnalysis }: AnalysisProps) => {
  // const [mode, setMode] = useState<DisplayMode>("status");
  // const [markdownText, setMarkdownText] = useState("");

  console.log("analysisLang,", analysisLang);
  console.log("aiResponse, ", aiResponse);
  console.log("streamStatus, ", streamStatus);
  console.log("latestAnalysis: ", latestAnalysis);

  const statusParts = useMemo(() => {
    const chars = Array.from(streamStatus || "");
    if (chars.length === 0) return { first: "", rest: "" };
    return { first: chars[0], rest: chars.slice(1).join("") };
  }, [streamStatus]);

  return (
    <div className="analysis-container">
      {latestAnalysis === "status" ? (
        <div className="stream-status" aria-live="polite">
          <span className="emoji-icon">{statusParts.first}</span>
          <span className="shimmer-text">{statusParts.rest}</span>
        </div>
      ) : latestAnalysis === "text" ? (
        <>
          <h3>Housing</h3>
          <p>{analysisLang?.housing}</p>
          <h3>Fixed Costs</h3>
          <p>{analysisLang?.fixedCosts}</p>
          <h3>More</h3>
          <p>{analysisLang?.more}</p>
        </>
      ) : (
        <ReactMarkdown>{aiResponse?.answer}</ReactMarkdown>
      )}
    </div>
  );
};

export default Analysis;


// import { useState, useEffect } from 'react';
// import ReactMarkdown from "react-markdown";

// import './Analysis.css'

// export interface AnalysisLangObj {
//   [key: string]: string | number;
// }

// export interface OpenAIObj {
//   accountId: string;
//   answer: string;

// }

// interface AnalysisProps {
//   analysisLang: AnalysisLangObj | null;
//   aiResponse: OpenAIObj | null;
//   streamStatus: string;
// }

// const Analysis = ({ analysisLang, aiResponse, streamStatus }: AnalysisProps) => {

//   // console.log("analysisLang: ", analysisLang)
//   // console.log("aiResponse: ", aiResponse)

//   const [displayText, setDisplayText] = useState('')

//   useEffect(() => {
//     const prepareResponse = () => {
//       if (analysisLang) {
//         setDisplayText(analysisLang)
//       } else if (aiResponse.answer.length > 1) {
//         setDisplayText(aiResponse.answer)
//       } else {
//         const chars = Array.from(streamStatus);

//         const formattedStatus = `
//           ${chars[0]}
//           <span class="shimmer-text">${chars.slice(1).join("")}</span>
//         `;

//         setDisplayText(formattedStatus)
//       }
//     };

//     prepareResponse();
//   }, [analysisLang, aiResponse, streamStatus])


//   return (
//     <div className='analysis-container'>
//       <ReactMarkdown>
//         {displayText}
//       </ReactMarkdown>
//     </div>
//   );
// };

// export default Analysis;