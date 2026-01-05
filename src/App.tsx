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


function App() {
  //Controls whether the config window is open 
  const [isVisible, setIsVisible] = useState(false)
  const [acctId, setAcctId] = useState('1')
  const [analysisData, setAnalysisdata] =  useState<DataObj | null>(null)
  const [tableData, setTableData] =  useState<TableDataObj | null>(null)
  const [analysisLang, setAnalysisLang] = useState
  
  const toggleSettings = () => {
    setIsVisible(!isVisible)
  }

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

  const pullAnalysisLang = async (type: string) => {
    const data = await api.get(`/analysis/${type}/${acctId}`)
    console.log(data)
    setTableData(data.data)
  }

  return (
    <>
      {isVisible && <UserConfig acctId={acctId} />}
      <SideBar toggleSettings={toggleSettings} banner="testing" />
      {!isVisible && <DataViz analysisData={analysisData} tableData={tableData} />}
      {!isVisible && <Analysis analysisLang={pullAnalysisLang}/>}
      {!isVisible && <InputBox pullAnalysisData={pullAnalysisData} pullTopCosts={pullTopCosts}/>}
    </>
  )
}

export default App;
