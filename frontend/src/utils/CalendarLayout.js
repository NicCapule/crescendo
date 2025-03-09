import { DateTime } from "luxon";

//=====================================================================================//
export const mergeConsecutiveSessions = (sessions) => {
  if (!sessions.length) return [];

  // Sort by session_start time
  const sortedSessions = [...sessions].sort(
    (a, b) =>
      a.session_date.localeCompare(b.session_date) ||
      a.session_start.localeCompare(b.session_start)
  );

  const mergedSessions = [];
  let currentSession = {
    ...sortedSessions[0],
    session_numbers: [sortedSessions[0].session_number],
  };

  for (let i = 1; i < sortedSessions.length; i++) {
    const nextSession = sortedSessions[i];

    const isSameProgram =
      currentSession.Program.program_id === nextSession.Program.program_id;
    const isSameDate = currentSession.session_date === nextSession.session_date;
    const isConsecutive =
      currentSession.session_end === nextSession.session_start;

    if (isSameProgram && isSameDate && isConsecutive) {
      // Merge consecutive sessions
      currentSession.session_end = nextSession.session_end;
      currentSession.session_numbers.push(nextSession.session_number);
    } else {
      // Push current session and start a new one
      mergedSessions.push(currentSession);
      currentSession = {
        ...nextSession,
        session_numbers: [nextSession.session_number],
      };
    }
  }
  // Push the last session
  mergedSessions.push(currentSession);

  return mergedSessions;
};
//=====================================================================================//
export const getSessionPosition = (session, allSessions, viewType = "day") => {
  const startHour = DateTime.fromFormat(session.session_start, "HH:mm:ss").hour;
  const endHour = DateTime.fromFormat(session.session_end, "HH:mm:ss").hour;
  const gridRowStart = startHour - 8 + 1;
  const gridRowSpan = endHour - startHour;

  if (viewType === "week") {
    const sessionDate = DateTime.fromISO(session.session_date);
    const startOfWeek = sessionDate.startOf("week");
    const gridColumnStart = sessionDate.diff(startOfWeek, "days").days + 1;

    return { gridRowStart, gridRowSpan, gridColumnStart };
  } else {
    const overlappingSessions = allSessions.filter(
      (s) =>
        DateTime.fromFormat(s.session_start, "HH:mm:ss").hour < endHour &&
        DateTime.fromFormat(s.session_end, "HH:mm:ss").hour > startHour
    );

    const positionIndex = overlappingSessions.indexOf(session);
    const gridColumnStart = positionIndex + 1;

    return { gridRowStart, gridRowSpan, gridColumnStart };
  }
};
//=====================================================================================//
export const groupSessionsByDate = (sessions) => {
  const grouped = sessions.reduce((acc, session) => {
    if (!acc[session.session_date]) {
      acc[session.session_date] = [];
    }
    acc[session.session_date].push(session);
    return acc;
  }, {});

  // Convert object into an array
  return Object.entries(grouped).map(([date, sessions]) => ({
    date,
    sessions,
  }));
};
