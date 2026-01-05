import React, { useState, useEffect } from 'react';

export interface TableDataObj {
    [key: string]: string | number;
}

interface TableProps {
    tableData: TableDataItem[];
}

interface TableDataItem {
    name: string;
    amount: number;
    [key: string]: string | number;
}


const Table = ({ tableData }: TableProps) => {
    const fieldsArr = ['Name', 'Amount'];

    const [tableRowData, setTableRowData] = useState<TableDataItem[]>([])

    useEffect(() => {
        if (!tableData) return;

        console.log('Table Data: ', tableData);
        console.log('Keys:', Object.keys(tableData));

        const formatData = () => {
            const formattedTableData = []
            for (const row of tableData) {
                console.log('Row: ', row)
                formattedTableData.push({
                    'name': row.name,
                    'amount': Number(row.amount),
                })
            }

            setTableRowData(formattedTableData)
            console.log("formattedTableData: ", formattedTableData)
        }

        formatData();
    }, [tableData]);

    console.log("tableRowData: ", tableRowData)
    return (
        <div className="data-table-container">
            {/* style={ {gridTemplateColumns: `repeat(${fieldsArr.length}, auto)`}} */}
            <table className="data-table" >
                <thead>
                    <tr>
                        {fieldsArr.map((field, index) => (
                            <th key={index}>{field}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableRowData && tableRowData.length > 0 ? (
                        // 1. Loop through the data rows (item is an Object)
                        tableRowData.map((item, index) => (
                            <tr key={index}>
                                {/* 2. Loop through the field names array (fieldsArr) */}
                                {fieldsArr.map((field, fieldIndex) => (
                                    // 3. Access the value from the item OBJECT using the field name as the key
                                    <td key={fieldIndex}>
                                        {item[field.toLowerCase()].toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={fieldsArr.length}>No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    );
};

export default Table;