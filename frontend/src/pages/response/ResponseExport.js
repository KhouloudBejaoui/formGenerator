import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResponsesByFormId, exportResponseToExcel } from '../../redux/actions/response'; 
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import fileSaver from 'file-saver';

const ResponseExport = () => {
  const [responses, setResponses] = useState([]); // State to store the responses
  const dispatch = useDispatch();
  const { formId } = useParams();

  useEffect(() => {
    // Fetch the responses from the backend using Redux action
    dispatch(getResponsesByFormId(formId)); // Make sure to dispatch the correct action
  }, [dispatch, formId]);

  // Use the Redux store to get the responses from the state
  const responsesData = useSelector((state) => state.response.responses);

  // Update the state when the responsesData changes
  useEffect(() => {
    setResponses(responsesData);
  }, [responsesData]);

  // Function to export the response to Excel
  const handleExportToExcel = async () => {
    if (responsesData.length === 0) return;
  
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      const sheetName = 'Responses';
      const worksheetData = [['USER ID','RESPONSE DURATION (ms)','percentageAnswered', ...responsesData[0].responseItems.map(item => item.questionText)]];
  
      // Add data to the worksheet
      responsesData.forEach(response => {
        const rowData = [response.userId, response.responseDuration,response.percentageAnswered, ...response.responseItems.map(item => item.textResponse)];
        worksheetData.push(rowData);
      });
  
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
       // Convert the workbook to a binary string
    const excelFile = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab(excelFile)], { type: 'application/octet-stream' });

    // Send the Excel file to the backend using the exportResponse function
    const formData = new FormData();
    formData.append('file', blob, 'response.xlsx');
    await exportResponseToExcel(formData);

    // Save the Excel file on the frontend
    fileSaver.saveAs(blob, 'response.xlsx');

  } catch (error) {
    console.error('Error exporting response to Excel:', error);
  }
};

  // Helper function to convert a string to an ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  function formatDuration(durationInMillis) {
    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = millisecondsPerSecond * 60;
    const millisecondsPerHour = millisecondsPerMinute * 60;
    const millisecondsPerDay = millisecondsPerHour * 24;
  
    const days = Math.floor(durationInMillis / millisecondsPerDay);
    const hours = Math.floor((durationInMillis % millisecondsPerDay) / millisecondsPerHour);
    const minutes = Math.floor((durationInMillis % millisecondsPerHour) / millisecondsPerMinute);
    const seconds = Math.floor((durationInMillis % millisecondsPerMinute) / millisecondsPerSecond);
  
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
  
    if (parts.length === 0) return 'less than a second';
    return parts.join(', ');
  }
  
  return (
    <main>
      <div className="page-header">
        <h1>Response</h1>
        <small>Home / Export response</small>
      </div>
      <div className="page-content">
        <div className="records table-responsive">
          <div className="record-header">
            <div className="add">

              <button onClick={handleExportToExcel} style={{cursor:'pointer'}} >Export</button>
            </div>
            <div className="browse">
              <input
                type="search"
                placeholder="Search"
                className="record-search"
              />
              <select name="" id="">
                <option value="">Status</option>
              </select>
            </div>
          </div>
          <div>
            <table width="100%">
              <thead>
                <tr>
                  <th>
                    USER ID
                  </th>
                  <th>
                    DURATION
                  </th>
                  <th>
                    PERCENTAGE ANSWERED
                  </th>
                  {responsesData.length > 0 && (
                    responsesData[0].responseItems.map((item) => (
                      <th key={item.questionId}>
                        {item.questionText}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {responsesData.map((res) => (
                  <tr key={res.responseId}>
                    <td>
                      <div className="client-info">
                        <h4>{res.userId}</h4>
                      </div>
                    </td>
                    <td>
                      <div className="client-info">
                        <h4>{formatDuration(res.responseDuration)}</h4>
                      </div>
                    </td>
                    <td>
                      <div className="client-info">
                        <h4>{res.percentageAnswered}%</h4>
                      </div>
                    </td>
                    {responsesData.length > 0 && (
                      res.responseItems.map((item) => (
                        <td key={item.questionId}>
                          {item.textResponse}
                        </td>
                      ))
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResponseExport;
