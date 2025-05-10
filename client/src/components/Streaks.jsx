import React, { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import axios from "axios";
import { useSelector } from "react-redux";

const Streaks = () => {
  const { user } = useSelector((state) => state.auth);
  const [loginData, setLoginData] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        // Record today's login
        await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/login/record/${user._id}`
        );

        // Fetch login data
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/login/get/${user._id}`
        );

        // Extract dates from the response data and update loginData
        const dates = res?.data?.map((entry) => entry.date) || [];
        setLoginData(dates);
      } catch (error) {
        console.error("Error in fetching login streak data:", error);
      }
    };

    fetchData();
  }, [user?._id]);

  // Prepare the calendar values from the fetched login data
  const calendarValues = loginData.reduce((acc, date) => {
    acc[date] = 1; // Color the days with logins (can use any value like 1 for streak)
    return acc;
  }, {});

  const customDates = {
    "2025-05-01": 1,
    "2025-05-02": 2,
    "2025-05-03": 4,
  };
  return (
    <div style={{ background: "black", padding: "10px", marginBottom: "10px" }}>
      <GitHubCalendar
        values={customDates}
        // blockSize={13}
        // blockMargin={3}
        // fontSize={12}
        // showWeekdayLabels
        style={{
          margin: "0 auto",
          color: "white",
        }}
      />
    </div>
  );
};

export default Streaks;
