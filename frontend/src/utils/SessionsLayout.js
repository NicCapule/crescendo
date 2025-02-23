import { DateTime } from "luxon";

//=====================================================================================//
export const mergeConsecutiveSessions = (sessions) => {
  if (!sessions.length) return [];

  // Sort by session_start time
  const sortedSessions = [...sessions].sort((a, b) =>
    a.session_start.localeCompare(b.session_start)
  );

  const mergedSessions = [];
  let currentSession = {
    ...sortedSessions[0],
    session_numbers: [sortedSessions[0].session_number],
  };

  for (let i = 1; i < sortedSessions.length; i++) {
    const nextSession = sortedSessions[i];

    // Ensure same program before merging
    const isSameProgram =
      currentSession.Program.program_id === nextSession.Program.program_id;

    if (
      isSameProgram &&
      currentSession.session_end === nextSession.session_start
    ) {
      // Extend current session's end time
      currentSession.session_end = nextSession.session_end;
      // Store session number for display
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
export const getSessionPosition = (session, allSessions) => {
  const startHour = DateTime.fromFormat(session.session_start, "HH:mm:ss").hour;
  const endHour = DateTime.fromFormat(session.session_end, "HH:mm:ss").hour;

  // Calculate top and height positions
  const top = (startHour - 8) * 70;
  const height = (endHour - startHour) * 70;

  const overlappingSessions = allSessions.filter(
    (s) =>
      DateTime.fromFormat(s.session_start, "HH:mm:ss").hour < endHour &&
      DateTime.fromFormat(s.session_end, "HH:mm:ss").hour > startHour
  );

  // Assign a column index to each session
  const positionIndex = overlappingSessions.indexOf(session);
  // const totalColumns = overlappingSessions.length;

  // Adjust width and left position to prevent overlap
  const width = 100 / 4;
  const left = positionIndex * width;
  return { top, height, left: `${left}%`, width: `${width}%` };
};
