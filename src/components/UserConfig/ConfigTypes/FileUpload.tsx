export const FileUpload = () => {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldIndex: number) => {
        const file = event.target.files?.[0];
        console.log("file: ", file)
        if (file) {
            setUploadedFiles(prev => ({
                ...prev,
                [`field-${fieldIndex}`]: file
            }));
        }

        console.log("uploadedFiles ", uploadedFiles)
    };

    const handleFileUpload = async (sectionKey: string, instanceId: number) => {
        const fileKey = `${sectionKey}-${instanceId}`;
        const file = uploadedFiles[fileKey];

        if (!file) {
            alert("Please select a file first");
            return;
        }

        // Get the category from the select input
        const container = document.querySelector(
            `[data-instanceid="${instanceId}"]`
        ) as HTMLDivElement;
        const categorySelect = container?.querySelector('select') as HTMLSelectElement;
        const category = categorySelect?.value;

        if (!category) {
            alert("Please select a category");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('acctId', acctId);
        formData.append('category', category);

        try {
            const response = await api.post('/config/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('Upload response:', response.data);
            alert(`File uploaded successfully to ${response.data.path || 'server'}`);

            // Clear the file from state
            setUploadedFiles(prev => {
                const newState = { ...prev };
                delete newState[fileKey];
                return newState;
            });

            // Reset the file input
            const fileInput = container?.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload file. Please try again.");
        }
    };
    
    
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
                    onChange={(e) => handleFileChange(e, instanceId!, sectionKey!)}
                />
                {hasFile ? hasFile.name : (field.label || 'Choose file')}
            </label>
            {hasFile && (
                <button
                    type="button"
                    className='upload-button'
                    onClick={() => handleFileUpload(sectionKey!, instanceId!)}
                >
                    Upload
                </button>
            )}
        </div>
    );


}



