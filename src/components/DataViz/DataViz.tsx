import type { DataObj } from './VizTypes/Graph'
import type { TableDataItem } from './VizTypes/Table'
import Graph from './VizTypes/Graph'
import Table from './VizTypes/Table'

import './DataViz.css'

interface DataVizProps {
  analysisData: DataObj;
  tableData: TableDataItem;
}

const DataViz = ({ analysisData, tableData }: DataVizProps ) => {
  return (
    <div className='data-viz-container'>
      {analysisData? 
        (
          <>
            <h3 className="left-heading">Monthly Budget Analysis</h3>
            <Graph analysisData={analysisData}/>
          </>
          
        )
        : (
          ""
        )
      }

      {tableData? (
        <>
          <h3 className="right-heading">Top Monthly Costs</h3>
          <Table tableData={tableData} />
        </>
        
        ) : (
          ""
        )
      }

      {!analysisData && !tableData ? (
          <div className="data-viz-placeholder">
            <span>"Without data, you're just another person with an opinion."</span>
            <span>- W. Edwards Deming (statistician)</span>
          </div>
        ) : (
          ""
        )
      }
    </div>
  );
};

export default DataViz;