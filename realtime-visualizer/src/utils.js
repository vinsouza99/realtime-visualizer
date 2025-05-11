export function capitalizeText(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function updatePieChartData(prevData, newEmotions) {
  // Create a copy of previous data as an object for easy lookup
  const emotionMap = {};

  // Initialize with existing data
  if (prevData && prevData.length > 0) {
    prevData.forEach((item) => {
      emotionMap[item.label] = item.value;
    });
  }

  // Add the new emotion data
  if (newEmotions && newEmotions.length > 0) {
    newEmotions.forEach((emotion) => {
      // If emotion already exists, increment its value
      if (emotionMap[emotion.label] !== undefined) {
        emotionMap[emotion.label] += emotion.value;
      } else {
        // Otherwise create a new entry
        emotionMap[emotion.label] = emotion.value;
      }
    });
  }

  // Convert back to array format for the pie chart
  const aggregatedData = Object.keys(emotionMap).map((label) => ({
    label,
    value: emotionMap[label],
  }));

  console.log("Updated aggregated emotion data:", aggregatedData);
  return aggregatedData;
}
export function updateRadarChartData(prevData, newEmotions) {
  // Create a copy of previous data as an object for easy lookup
  const emotionMap = {};

  // Initialize with existing data
  if (prevData && prevData.length > 0) {
    prevData.forEach((item) => {
      emotionMap[item.label] = item.value;
    });
  }

  // Add the new emotion data
  if (newEmotions && newEmotions.length > 0) {
    newEmotions.forEach((emotion) => {
      // If emotion already exists, increment its value
      if (emotionMap[emotion.label] !== undefined) {
        emotionMap[emotion.label] += emotion.value;
      } else {
        // Otherwise create a new entry
        emotionMap[emotion.label] = emotion.value;
      }
    });
  }

  // Convert back to array format for the radar chart
  const aggregatedData = Object.keys(emotionMap).map((label) => ({
    label,
    value: emotionMap[label],
  }));

  console.log("Updated aggregated emotion data:", aggregatedData);
  return aggregatedData;
}
export function updateLineChartData(prevData, newData) {
  const updatedData = [...(prevData || []), ...(newData || [])];
  return updatedData;
}
