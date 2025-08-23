import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

// Function to generate random activity
const generateActivity = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

// Function to generate panel colors
const getPaneColors = (maxCount) => {
  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }
  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivity] = useState([]);
  const [paneColors, setPaneColors] = useState({});

  useEffect(() => {
    const fetchData = () => {
      const startDate = "2001-01-01";
      const endDate = "2001-01-31";
      const data = generateActivity(startDate, endDate);
      setActivity(data);

      const maxCount = Math.max(...data.map((d) => d.count));
      setPaneColors(getPaneColors(maxCount));
    };
    fetchData();
  }, []);

  return (
     <div className="heatmap-container">
      <h4>Recent Contributions</h4>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "700px", height: "200px" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={new Date("2001-01-01")}
        rectSize={15}
        space={3}
        rectProps={{
          rx: 2.5,
        }}
        panelColors={paneColors}
      />
    </div>
  );
};

export default HeatMapProfile;
