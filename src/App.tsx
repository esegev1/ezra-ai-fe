import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import api from './api/axios.ts'
import './App.css'

import SideBar from './components/SideBar/SideBar.tsx'
import DataViz from './components/DataViz/DataViz.tsx'
import Analysis from './components/Analysis/Analysis.tsx'
import InputBox from './components/InputBox/InputBox.tsx'
import UserConfig from './components/UserConfig/UserConfig.tsx'

import type { DataObj } from './components/DataViz/VizTypes/Graph.tsx'
import type { TableDataObj } from './components/DataViz/VizTypes/Table.tsx'
import type { AnalysisLangObj, OpenAIObj } from './components/Analysis/Analysis.tsx'

function App() {
  //Controls whether the config window is open 
  const [isVisible, setIsVisible] = useState(false)
  const [acctId, setAcctId] = useState('2')

  const [analysisData, setAnalysisdata] = useState<DataObj | undefined>(undefined)
  const [tableData, setTableData] = useState<TableDataObj | undefined>(undefined)

  const [analysisLang, setAnalysisLang] = useState<AnalysisLangObj | undefined>(undefined)
  const [aiResponse, setAIResponse] = useState<OpenAIObj | undefined>(undefined)

  //keep track of the openAI steam response
  const [streamStatus, setStreamStatus] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  //keep track of latest data sources to disoplay
  const [latestAnalysis, setLatestAnalysis] = useState<string>('')

  const toggleSettings = () => {
    setIsVisible(!isVisible)
  }


  //Pull data for budget analysis graph and table
  const pullAnalysisData = async (type: string) => {
    const data = await api.get(`/analysis/${type}/${acctId}`)
    console.log(data)
    setAnalysisdata(data.data[0])
    
  }

  const pullTopCosts = async (type: string) => {
    const data = await api.get(`/analysis/${type}/${acctId}`)
    console.log(data)
    setTableData(data.data)
  }

  //Pull budget analysis language
  const pullAnalysisLang = async (type: string) => {
    const data = await api.get(`/analysis/${type}/${acctId}`)
    console.log("lang: ", data)
    setAnalysisLang(data.data)
    setLatestAnalysis('text')
  }

  //Pull AI analysis language
  const askOpenAI = async (question: string) => {
    setIsStreaming(true);
    setAIResponse({ accountId: acctId, answer: '' }); // Reset/Initialize answer

    try {
      const response = await fetch('http://localhost:3000/openai', { // Use your full backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, accountId: acctId }),
      });

      if (!response.body) return;
      setLatestAnalysis('status');

      const reader = response.body.getReader();
      console.log("body: ", response.body);
      console.log("reader: ", reader);
      const decoder = new TextDecoder();
      let accumulatedAnswer = "";
      console.log("accumulatedAnswer: ", accumulatedAnswer);

      // This loop runs as long as the server is sending data
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // SSE data comes in as "data: {...}\n\n"
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        // console.log(`chunk: ${chunk}, lines: ${lines}`)

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            // console.log(`line: ${line}`)
            const rawData = line.replace('data: ', '').trim();
            console.log(`rawData: ${rawData}`)

            if (rawData === '[DONE]') {
              setIsStreaming(false);
              continue;
            }

            try {
              const parsed = JSON.parse(rawData);
              // console.log("parsed: ", parsed);
              console.log(`parsed: ${JSON.stringify(parsed)}`)

              // Handle different event types from your backend
              //parsed.type === 'agent_start' || parsed.type === 
              //CHANGE THIS TO CHECK IF THE STATUS OR DELTA KEYS EXIST, TO UNDERSTAND WHY JUST RUN THE CONSOLE AND LOOK AT THE PARSED OBJECT THAT THE LOGIC BELOW IS RUNNING ON. 
              if ('status' in parsed) {
                setStreamStatus(parsed.status); // e.g., "🔍 Financial Expert analyzing..."
              }
              // console.log("streamStatus: ", streamStatus)

              if ('delta' in parsed) {
                accumulatedAnswer += parsed.delta;
                setAIResponse({
                  accountId: acctId,
                  answer: accumulatedAnswer
                });
                setLatestAnalysis('markdown')
              }
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setIsStreaming(false);
    }
  };

  return (
    <>
      {isVisible && <UserConfig acctId={acctId} />}
      
      <SideBar toggleSettings={toggleSettings} banner="testing" />
      
      {!isVisible && analysisData && <DataViz analysisData={analysisData} tableData={tableData} />}
      
      {/* {!isVisible && (analysisLang || aiResponse || streamStatus) && */}
      {!isVisible && latestAnalysis &&
        <Analysis 
          analysisLang={analysisLang} 
          aiResponse={aiResponse} 
          streamStatus={streamStatus}
          latestAnalysis={latestAnalysis}
        />
      }

      {!isVisible && <InputBox pullAnalysisData={pullAnalysisData} pullTopCosts={pullTopCosts} pullAnalysisLang={pullAnalysisLang} askOpenAI={askOpenAI} latestAnalysis={latestAnalysis} />}
    </>
  )
}

export default App;
