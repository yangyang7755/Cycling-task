const express = require('express');
const bodyParser = require('body-parser');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Function to get the CSV file path for a participant and date
function getCsvFilePath(participantId, sessionDate) {
  const formattedDate = sessionDate.replace(/-/g, ''); // Remove hyphens from the date
  return path.join(__dirname, `vas_results_${participantId}_${formattedDate}.csv`);
}

// Save VAS results to CSV
app.post('/save-vas', (req, res) => {
  const {
    participantId,
    sessionDate,
    taskId,
    taskSpeed,
    taskPower,
    taskHR,
    rewardResult,
    painResult,
    physicalDifficultyResult,
    mentalDifficultyResult,
  } = req.body;

  const timestamp = new Date().toISOString();
  const csvFilePath = getCsvFilePath(participantId, sessionDate);

  // Initialize CSV file with headers if it doesn't exist
  if (!fs.existsSync(csvFilePath)) {
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'taskId', title: 'Task ID' },
        { id: 'taskSpeed', title: 'Speed (km/h)' },
        { id: 'taskPower', title: 'Average Power (W)' },
        { id: 'taskHR', title: 'Average HR (bpm)' },
        { id: 'rewardResult', title: 'Reward' },
        { id: 'painResult', title: 'Pain/Discomfort' },
        { id: 'physicalDifficultyResult', title: 'Physical Difficulty' },
        { id: 'mentalDifficultyResult', title: 'Mental Difficulty' },
        { id: 'timestamp', title: 'Timestamp' },
      ],
    });
    csvWriter.writeRecords([]); // Write empty records to create the file
  }

  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'taskId', title: 'Task ID' },
      { id: 'taskSpeed', title: 'Speed (km/h)' },
      { id: 'taskPower', title: 'Average Power (W)' },
      { id: 'taskHR', title: 'Average HR (bpm)' },
      { id: 'rewardResult', title: 'Reward' },
      { id: 'painResult', title: 'Pain/Discomfort' },
      { id: 'physicalDifficultyResult', title: 'Physical Difficulty' },
      { id: 'mentalDifficultyResult', title: 'Mental Difficulty' },
      { id: 'timestamp', title: 'Timestamp' },
    ],
    append: true, // Append to the existing file
  });

  const data = {
    taskId,
    taskSpeed,
    taskPower,
    taskHR,
    rewardResult,
    painResult,
    physicalDifficultyResult,
    mentalDifficultyResult,
    timestamp,
  };

  csvWriter.writeRecords([data])
    .then(() => {
      console.log('Results saved to CSV:', data);
      res.status(200).send('Results saved');
    })
    .catch((err) => {
      console.error('Error writing to CSV:', err);
      res.status(500).send('Failed to save results');
    });
});

// Serve the frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});