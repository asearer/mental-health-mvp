import React from 'react';

const PatientHistory = ({ historyData }) => {
  // Ensure historyData is an array before trying to map it
  if (!historyData || historyData.length === 0) {
    return <div>No history available</div>;
  }

  return (
    <div>
      <h3>Patient History</h3>
      <ul>
        {historyData.map((item, index) => (
          <li key={index}>
            <p>{item.description}</p>
            <p>{item.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientHistory;







