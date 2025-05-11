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

  const [calendarDays, setCalendarDays] = useState([]); // Array of Date objects
  const [activityStatus, setActivityStatus] = useState({}); // Map of dateString to 'today', 'yesterday', or 'other'
  const [monthLabels, setMonthLabels] = useState([]); // Array of { name: string, startOffsetRem: number }

  const CELL_SIZE_REM = 1.5; // Corresponds to w-6/h-6 in Tailwind (1.5rem)
  const GAP_REM = 0.25; // Corresponds to gap-1 in Tailwind (0.25rem)
  const EFFECTIVE_CELL_PITCH_REM = CELL_SIZE_REM + GAP_REM; // Distance from start of one cell to start of next in a row/col flow

  useEffect(() => {
    const endDate = new Date(2025, 4, 10); // May 11, 2025 (Month is 0-indexed)
    const todayFormatted = formatDate(endDate);
    const yesterdayDate = new Date(endDate);
    yesterdayDate.setDate(endDate.getDate() - 1);
    const yesterdayFormatted = formatDate(yesterdayDate);

    const tempActivityStatus = {};
    tempActivityStatus[todayFormatted] = "today";
    tempActivityStatus[yesterdayFormatted] = "yesterday";
    setActivityStatus(tempActivityStatus);

    const numWeeksToDisplay = 53;
    const numDaysInGrid = numWeeksToDisplay * 7;

    const startDateForGrid = new Date(endDate);
    startDateForGrid.setDate(endDate.getDate() - numDaysInGrid + 1);
    // Adjust startDateForGrid to be a Sunday to make full weeks
    startDateForGrid.setDate(startDateForGrid.getDate() - startDateForGrid.getDay());

    const days = [];
    for (let i = 0; i < numDaysInGrid; i++) {
      const date = new Date(startDateForGrid);
      date.setDate(startDateForGrid.getDate() + i);
      days.push(date);
    }
    setCalendarDays(days);

    // Generate month labels
    const uniqueMonths = [];
    let lastMonthProcessed = -1;
    let lastWeekIndexForMonthLabel = -10; // Ensure first month label is always added

    days.forEach((dateObj, dayIndex) => {
      const currentMonth = dateObj.getMonth();
      const currentWeekIndex = Math.floor(dayIndex / 7);

      if (currentMonth !== lastMonthProcessed) {
        if (uniqueMonths.length === 0 || currentWeekIndex > lastWeekIndexForMonthLabel + 2) { // Spacing for labels
          uniqueMonths.push({
            name: dateObj.toLocaleString('default', { month: 'short' }),
            // Offset aligns with the start of the week column
            startOffsetRem: currentWeekIndex * EFFECTIVE_CELL_PITCH_REM,
          });
          lastWeekIndexForMonthLabel = currentWeekIndex;
        }
        lastMonthProcessed = currentMonth;
      }
    });
    setMonthLabels(uniqueMonths);
  }, []);

  const getDayCellStyle = (dateString) => {
    const status = activityStatus[dateString];
    if (status === "today") {
      return "bg-[#B200FF] hover:bg-[#C133FF]"; // Brightest purple
    }
    if (status === "yesterday") {
      return "bg-[#8A00FF] hover:bg-[#9B21FF]"; // Darker purple
    }
    return "bg-slate-700/40 hover:bg-slate-600/50"; // Default for other days
  };

  const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const displayEndDate = new Date(2025, 4, 11);

  return (
    <div className="bg-gradient-to-br from-black/80 to-black/60 border border-[#B200FF]/30 p-6 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-lg text-white">
      <h2 className="text-2xl font-bold text-[#B200FF] mb-6 tracking-wide">
        Yearly Activity Overview
      </h2>
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#B200FF]/40 scrollbar-track-transparent pb-3">
        {/* Month Labels Container */}
        <div className="relative h-6 mb-2" style={{ paddingLeft: `calc(${CELL_SIZE_REM}rem + ${GAP_REM * 2}rem)` /* Approx align with start of day grid */ }}>
          {monthLabels.map((label, idx) => (
            <div
              key={idx}
              className="absolute text-xs text-gray-400"
              style={{ left: `calc(${label.startOffsetRem}rem)` }}
            >
              {label.name}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Weekday Labels (Side) */}
          <div className="flex flex-col mr-3 space-y-1 items-center shrink-0" style={{ width: `calc(${CELL_SIZE_REM}rem)`}}>
            {weekDayLabels.map((label, index) => (
              (index % 2 !== 0) ? // Display Mon, Wed, Fri for brevity
              <div key={label} className="h-6 flex items-center text-xs text-gray-400">{label.substring(0,1)}</div> :
              <div key={label} className="h-6"></div> // Empty div for spacing to match day cells
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {calendarDays.map((dateObj) => {
              const dateString = formatDate(dateObj);
              // Cells for dates beyond the "current" display end date are styled differently
              const isFuturePadding = dateObj > displayEndDate;
              const cellStyle = isFuturePadding
                ? "bg-black/30" // Style for future/padding cells
                : getDayCellStyle(dateString);

              return (
                <div
                  key={dateString}
                  className={`w-6 h-6 rounded-md transition-all duration-150 ${cellStyle}`}
                  title={isFuturePadding ? formatDate(dateObj) + ' (Future/Padding)' : `${dateString} - ${activityStatus[dateString] || 'No special activity'}`}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Legend */}
    </div>
  );
};

export default Streaks;
