import { useEffect, useState } from "react";
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
        console.log(res);

        // Extract only dates from the response data
        const dates = res?.data?.map((entry) => entry.date) || [];
        setLoginData(dates);
      } catch (error) {
        console.error("Error in fetching login streak data:", error);
      }
    };

    fetchData();
  }, [user]);
  console.log(loginData);

  // Prepare the GitHubCalendar values
  const calendarValues = loginData.reduce((acc, date) => {
    acc[date] = 1; // You can set any value here, like 1 for each date
    return acc;
  }, {});

  const customTheme = {
    dark: [
      "#333333", // Background color for empty dots
      "#4A0099", // Grade 1
      "#6A00CC", // Grade 2
      "#8A00FF", // Grade 3
      "#B200FF", // Grade 4
    ],
  };

  return (
    <div className="bg-gradient-to-r h-full from-gray-800 to-gray-900 border border-[#B200FF]/20  p-4 shadow-lg">
      <h2 className="text-2xl font-bold text-[#B200FF] mb-4">Your Streaks</h2>
      <div className="flex flex-col items-center space-y-6">
        {Object.keys(calendarValues).length > 0 ? (
          <GitHubCalendar
            values={calendarValues}
            blockSize={13}
            blockMargin={3}
            fontSize={12}
            showWeekdayLabels
            theme={customTheme} // Apply custom theme
            className="rounded-lg bg-gray-900 p-4 shadow-md"
          />
        ) : (
          <p className="text-gray-300">Loading streaks...</p>
        )}
      </div>
    </div>
  );
};

export default Streaks;
