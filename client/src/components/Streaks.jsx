import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Streaks = () => {
  const { user } = useSelector((state) => state.auth); // Kept for future use
  const [streaksData, setStreaksData] = useState([]); // Holds data for each month block
  const [activityStatus, setActivityStatus] = useState({});

  // Define today's date here to be accessible in both useEffect and render
  const todayRefDate = new Date(2025, 4, 11); // May 11, 2025

  useEffect(() => {
    const numberOfMonthsToDisplay = 10; // Display current and past 9 months (10 total)
    const newMonthlyData = [];

    for (let i = 0; i < numberOfMonthsToDisplay; i++) {
      const targetIterationDate = new Date(todayRefDate.getFullYear(), todayRefDate.getMonth() - i, 1);
      const monthName = targetIterationDate.toLocaleString('default', { month: 'short' });
      const year = targetIterationDate.getFullYear();
      
      const firstDayOfMonth = new Date(targetIterationDate.getFullYear(), targetIterationDate.getMonth(), 1);
      const lastDayOfMonth = new Date(targetIterationDate.getFullYear(), targetIterationDate.getMonth() + 1, 0);
      
      const daysInMonthGrid = [];
      const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
      
      // Add initial padding cells for the first week
      for (let j = 0; j < startingDayOfWeek; j++) {
        daysInMonthGrid.push({ type: 'padding', key: `padding-${monthName}-${year}-${j}` });
      }
      
      // Add day cells
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDateObject = new Date(targetIterationDate.getFullYear(), targetIterationDate.getMonth(), day);
        daysInMonthGrid.push({
          type: 'day',
          date: currentDateObject,
          dateString: formatDate(currentDateObject),
          key: formatDate(currentDateObject)
        });
      }
      
      newMonthlyData.push({ monthName, year, days: daysInMonthGrid, key: `${year}-${monthName}` });
    }

    setStreaksData(newMonthlyData.reverse()); // Show past months first, up to current

    // Set activity status
    const todayFormatted = formatDate(todayRefDate);
    const yesterdayDate = new Date(todayRefDate);
    yesterdayDate.setDate(todayRefDate.getDate() - 1);
    const yesterdayFormatted = formatDate(yesterdayDate);

    const tempActivityStatus = {};
    tempActivityStatus[todayFormatted] = "today";
    tempActivityStatus[yesterdayFormatted] = "yesterday";
    // In a real app, you'd fetch user.activityData here and merge/set accordingly
    setActivityStatus(tempActivityStatus);

  }, []); // Runs once on mount

  const getDayCellStyle = (dateString) => {
    const status = activityStatus[dateString];
    if (status === "today") {
      return "bg-[#B200FF] hover:bg-[#C133FF]"; // Brightest purple
    }
    if (status === "yesterday") {
      return "bg-[#8A00FF] hover:bg-[#9B21FF]"; // Darker purple
    }
    // Check if the date is in the future compared to todayRefDate
    const cellDate = new Date(dateString);
    if (cellDate > todayRefDate) {
        return "bg-slate-500/20"; // Different style for future days within the rendered months
    }
    return "bg-slate-400/40 hover:bg-slate-300/50"; // Default for other past/current days
  };

  const weekDayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="bg-gradient-to-br from-black/80 to-black/60 border border-[#B200FF]/30 p-4 rounded-lg shadow-xl shadow-black/40 backdrop-blur-md text-white w-full mx-auto flex flex-col items-center"> {/* Centered with mx-auto and max-w-screen-md */}
      <h2 className="text-xl font-bold text-[#B200FF] mb-4 tracking-normal text-center">
        Activity Overview
      </h2>
      <div className="flex flex-row overflow-x-auto py-2 space-x-4 scrollbar-thin scrollbar-thumb-[#B200FF]/40 scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        {streaksData.map(monthData => (
          <div key={monthData.key} className="flex-shrink-0">
            <h3 className="text-base font-semibold text-center text-purple-300 mb-2">
              {monthData.monthName} {monthData.year}
            </h3>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {weekDayLabels.map(label => (
                <div key={`${monthData.key}-${label}`} className="w-4 h-4 flex items-center justify-center text-xs text-gray-200 font-medium">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {monthData.days.map(dayItem => {
                if (dayItem.type === 'padding') {
                  return <div key={dayItem.key} className="w-4 h-4 rounded-sm"></div>;
                }
                
                const cellStyle = getDayCellStyle(dayItem.dateString);
                
                return (
                  <div
                    key={dayItem.key}
                    className={`w-4 h-4 rounded-sm transition-all duration-150 ${cellStyle}`}
                    title={`${dayItem.dateString} - ${activityStatus[dayItem.dateString] || 'No activity'}`}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Streaks;
