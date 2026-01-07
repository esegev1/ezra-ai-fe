import React, { useState, useEffect, useRef } from 'react';
import './UserConfig.css';
import api from '../../api/axios';
import Papa from 'papaparse';

// --- Interfaces ---
interface RowData {
    instanceId: number;
    dbId?: string | number;
    data?: any;
}

interface Field {
    type: 'text' | 'select' | 'checkbox' | "button" | "file";
    placeholder?: string;
    label?: string;
    options?: string[];
    child?: string;
    id: string;
    accept?: string; // Added to prevent TS errors in renderField
}

interface Section {
    title: string;
    rows: RowData[];
    fields: Field[];
}

interface Sections {
    [key: string]: Section;
}

interface UserConfigProps {
    acctId: string;
}

const UserConfig = ({ acctId }: UserConfigProps) => {
    console.log(`acctId: ${acctId}`)
    const goalsList = [
        "Financial Freedom", "Early Retirement", "Debt Free", "Home Ownership", "Career Growth", "Work Life Balance",
        "Wealth Building", "Passive Income", "Emergency Fund", "Investment Growth", "Travel Lifestyle",
        "Family Security", "Health and Wellness", "Education Funding", "Entrepreneurship",
        "Time Freedom", "Minimalism", "Legacy Planning", "Income Stability", "Personal Fulfillment"
    ];

    const initialSections: Sections = {
        demographics: {
            title: "Household Member Demographics",
            rows: [{ instanceId: 1 }],
            fields: [
                { id: "first_name", type: "text", placeholder: "First Name" },
                { id: "last_name", type: "text", placeholder: "Last Name" },
                { id: "gender", type: "select", placeholder: "Gender...", options: ['Male', 'Female', 'Other'] },
                { id: "industry", type: "select", placeholder: "Industry...", options: ['agriculture', 'manufacturing', 'construction', 'energy', 'transportation', 'technology', 'finance', 'healthcare', 'public', 'services', 'other'] }
            ]
        },
        incomes: {
            title: "Income",
            rows: [{ instanceId: 1 }],
            fields: [
                { id: "source", type: "text", placeholder: "Source" },
                { id: "frequency", type: "select", placeholder: "Frequency...", options: ['every week', 'Every 2 Weeks', '15th And 30th', 'Monthly'] },
                { id: "amount", type: "text", placeholder: "Paycheck Amount" },
            ]
        },
        assets: {
            title: "Assets",
            rows: [{ instanceId: 1 }],
            fields: [
                { id: "name", type: "text", placeholder: "Name" },
                { id: "category", type: "select", placeholder: "Category...", options: ['Home', 'Second Home', 'Rental Property', '401k', '529(c)', 'Car', 'Stocks', 'Other'] },
                { id: "value", type: "text", placeholder: "Value" },
            ]
        },
        liabilities: {
            title: "Liabilities",
            rows: [{ instanceId: 1 }],
            fields: [
                { id: "name", type: "text", placeholder: "Name" },
                { id: "category", type: "select", placeholder: "Category...", options: ['Mortgage', 'Rental Property', 'Student Loan', 'Car Loan', 'Credit Card', 'Personal Loan', 'Other'] },
                { id: "value", type: "text", placeholder: "Value" },
            ]
        },
        fixedCosts: {
            title: "Fixed Costs",
            rows: [{ instanceId: 1 }],
            fields: [
                { id: "name", type: "text", placeholder: "Expense Name" },
                { id: "category", type: "select", placeholder: "Category", options: ['Mortgage', 'Rental Property', 'Groceries', 'Child Care', 'Car Payments', 'HOA Fees', '529(c) Contribution', 'Utilities', 'Other'] },
                { id: "amount", type: "text", placeholder: "Amount" }
            ]
        },
        goals: {
            title: "Financial Goals",
            rows: [{ instanceId: 1 }],
            //NEED TO FIX ID HERE SO THAT EACH BUTTON HAS ITS OWN ID
            fields: goalsList.map(goal => ({ id: "goal", type: "button", child: goal }))
        },
        upload: {
            title: "Upload Financial Data",
            rows: [{ instanceId: 1 }],
            fields: [
                { id: "category", type: "select", placeholder: "Category", options: ['Checking', 'Savings', 'Credit Card'] },
                { id: "path", type: "file" }
            ]
        }
    };


    const [sections, setSections] = useState<Sections>(initialSections);
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
    const nextInstanceId = useRef(1);

    useEffect(() => {
        const loadUserConfig = async () => {
            try {
                const response = await api.get(`/config/${acctId}`);
                console.log('Loaded data:', response.data);
                // console.log(`section: ${JSON.stringify(sections, null, 2)}`)

                setSections(prev => {
                    const updated = { ...prev };

                    Object.keys(prev).forEach(sectionKey => {
                        const apiData = response.data[sectionKey];

                        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
                            // console.log(`if kicked off`)
                            updated[sectionKey] = {
                                ...prev[sectionKey],
                                rows: apiData.map((item) => {
                                    // Remove id and account_id
                                    const { id, account_id, ...cleanData } = item;
                                    const instanceId = nextInstanceId.current++;
                                    // console.log("instane id: ", instanceId);
                                    // console.log("clean data: ", cleanData);


                                    return {
                                        instanceId,
                                        dbId: id,
                                        data: cleanData
                                    };
                                })
                            };
                        }
                    });

                    return updated;
                });

            } catch (err) {
                console.error('Load error:', err);
            }
        };

        loadUserConfig();
    }, [acctId]);


    const handleFileUploadComplete = async (
        event: React.ChangeEvent<HTMLInputElement>,
        instanceId: number,
        sectionKey: string
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Get category first
        const container = event.target.closest('[data-instanceid]') as HTMLDivElement;
        const categorySelect = container?.querySelector('select') as HTMLSelectElement;
        const category = categorySelect?.value ==="Credit Card" ? 'creditCards' : '';

        if (!category) {
            alert("Please select a category first");
            event.target.value = ''; // Reset file input
            return;
        }

        // Parse the CSV
        Papa.parse(file, {
            header: false, //first row is headers, if so , returns object
            skipEmptyLines: true,
            skipFirstNLines: 1,  // Skip the header row
            complete: async (results) => {
                if (results.errors.length > 0) {
                    alert('CSV parsing errors detected');
                    console.error(results.errors);
                    return;
                }

                try {
                    // Upload immediately after parsing
                    const response = await api.post('/config/upload', {
                        data: results.data,
                        acctId,
                        category
                    });

                    alert(`${results.data.length} rows uploaded successfully`);
                    event.target.value = ''; // Reset file input

                } catch (err) {
                    console.error("Upload error:", err);
                    alert("Failed to upload data");
                }
            },
            error: (error) => {
                console.error('Parse error:', error);
                alert('Invalid CSV file');
            }
        });
    };

    const handleInputChanges = async (event: React.FormEvent<HTMLDivElement>) => {
        // console.log(`section: ${JSON.stringify(sections)}`)
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        const parent = target.closest('.config-input-container') as HTMLDivElement;

        if (!parent) return;

        const sectionKey = parent.closest('.config-box')?.id;
        if (!sectionKey || sectionKey === "upload") return;

        const rowInstanceId = Number(parent.getAttribute('data-instanceid'));

        // 1. Find the current row in state to see if it already has a dbId
        // Use 'as keyof Sections' to reassure TypeScript
        const currentRow = sections[sectionKey as keyof Sections]?.rows.find(r => r.instanceId === rowInstanceId);
        const existingDbId = currentRow?.dbId;
        // console.log('Current row:', currentRow);

        const allSiblings = Array.from(parent.querySelectorAll('input:not([type="file"]), select'));
        const values: (string | number)[] = [acctId];
        let allFieldsFilled = true;

        //add value from all fields into an array once all are filled
        allSiblings.forEach((sibling) => {
            const element = sibling as HTMLInputElement | HTMLSelectElement;
            const value = element.value;
            if (value.length > 0) {
                const cleanValue = value.replace(/,/g, '');
                if (!isNaN(Number(cleanValue))) {
                    values.push(cleanValue);

                } else {
                    values.push(value);
                }


            } else {
                allFieldsFilled = false;
            }
        });

        // 2. Only proceed if the row is complete
        if (allFieldsFilled && values.length > 1) {
            try {
                if (existingDbId) {
                    // --- UPDATE (PUT) ---
                    console.log(`Updating existing record ${existingDbId}`);
                    await api.put(`/config/${sectionKey}/${target.id}/${existingDbId}`, [target.value]);
                    // No need to update state because the dbId is already there
                } else {
                    // --- CREATE (POST) ---
                    console.log("Creating new record");
                    const response = await api.post(`/config/${sectionKey}`, { values });
                    // console.log('Full API Response:', response.data);
                    const newDbId = response.data.data;

                    console.log('New DB ID:', newDbId);

                    // Save the new ID so the next change triggers a PUT
                    setSections(prev => ({
                        ...prev,
                        [sectionKey]: {
                            ...prev[sectionKey],
                            rows: prev[sectionKey].rows.map(row =>
                                row.instanceId === rowInstanceId ? { ...row, dbId: newDbId } : row
                            )
                        }
                    }));
                }
            } catch (err) {
                console.error("API Error:", err);
            }
        }
    };

    const addRow = (sectionKey: string) => {
        setSections(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                rows: [...prev[sectionKey].rows, { instanceId: nextInstanceId.current++ }]
            }
        }));
    };

    const removeRow = async (sectionKey: string, row: RowData) => {
        console.log("row: ", row)
        if (row.dbId) {
            try {
                await api.delete(`/config/${sectionKey}/${row.dbId}`);
            } catch (err) {
                console.error("Delete error:", err);
            }
        }

        setSections(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                rows: prev[sectionKey].rows.filter(r => r.instanceId !== row.instanceId)
            }
        }));
    };

    const renderField = (field: Field, index: number, instanceId: number, rowData?: any, sectionKey?: string) => {
        console.log('rendering fields')
        const commonClass = 'input-tag';

        // Map field order to database column names
        const fieldMappings: { [section: string]: string[] } = {
            demographics: ['first_name', 'last_name', 'gender', 'industry'],
            incomes: ['source', 'frequency', 'amount'],
            assets: ['name', 'category', 'value'],
            liabilities: ['name', 'category', 'value'],
            fixedCosts: ['name', 'category', 'amount']
        };

        const columnName = sectionKey ? fieldMappings[sectionKey]?.[index] : undefined;
        const dbValue = columnName ? rowData?.[columnName] : undefined;

        // console.log('Rendering field:', {
        //     sectionKey,
        //     index,
        //     columnName,
        //     dbValue,
        //     rowData,
        //     fieldType: field.type
        // });


        switch (field.type) {
            case 'text':
                return (
                    <input
                        key={index}
                        type="text"
                        id={field.id}
                        className={commonClass}
                        placeholder={field.placeholder}
                        defaultValue={dbValue || ''}
                    />
                );
            case 'select':
                return (
                    <select
                        key={index}
                        id={field.id}
                        className={commonClass}
                        defaultValue={dbValue || ''}
                    >
                        <option value="" disabled hidden>{field.placeholder}</option>
                        {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                );
            case 'checkbox':
                return (
                    <label key={index} className='checkbox-label'>
                        <input
                            type="checkbox"
                            id={field.id}
                            defaultChecked={dbValue || false}
                        />
                        {field.label}
                    </label>
                );
            case 'button':
                return (
                    <button key={index} type="button" className='config-button'>
                        {field.child}
                    </button>
                );
            case 'file':
                {
                    const fileKey = `${sectionKey}-${instanceId}`;
                    const hasFile = uploadedFiles[fileKey];

                    return (
                        <div key={index} className='file-upload-wrapper'>
                            <label className='file-label'>
                                <input
                                    type="file"
                                    id={field.id}
                                    className='file-input'
                                    accept={field.accept}
                                    onChange={(e) => handleFileUploadComplete(e, instanceId, sectionKey!)}
                                />
                                {hasFile ? hasFile.name : (field.label || 'Choose file')}
                            </label>
                            {hasFile && (
                                <button
                                    type="button"
                                    className='upload-button'
                                    // onClick={() => handleFileUpload(sectionKey!, instanceId!)}
                                >
                                    Upload
                                </button>
                            )}
                        </div>
                    );
                }
            default:
                return null;
        }
    };

    return (
        <div className='config-container' onBlur={handleInputChanges}>
            <h1>Profile Configuration</h1>

            {Object.entries(sections).map(([key, section]) => (
                <div key={key} id={key} className='config-box'>
                    <h2>{section.title}</h2>

                    {section.rows.map(row => (
                        <div
                            //adding row.dbId below forces react to rerender when data loads, 
                            // in the future, may need each input to be controlled, will do when breaking this to components
                            // key={`${row.instanceId}-${row.dbId || 'new'}`}
                            key={row.instanceId}
                            id={key}
                            data-instanceid={row.instanceId}
                            className='config-input-container'
                        >
                            {section.fields.map((field, idx) => renderField(field, idx, row.instanceId, row.data, key))}

                            {row.dbId && (
                                <button
                                    className='remove-button'
                                    onClick={() => removeRow(key, row)}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}

                    <button className='add-button' onClick={() => addRow(key)}>
                        + Add {section.title}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default UserConfig;