import { DateTime } from "luxon";

export const mergeAvailabilities = (availability) => {
  if (!availability.length) return [];

  const sortedAvailability = availability
    .map((slot) => ({
      ...slot,
    }))
    .sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) {
        return a.day_of_week.localeCompare(b.day_of_week);
      }
      return (
        DateTime.fromFormat(a.start_time, "HH:mm:ss") -
        DateTime.fromFormat(b.start_time, "HH:mm:ss")
      );
    });

  const mergedAvailability = [];
  let prev = sortedAvailability[0];

  for (let i = 1; i < sortedAvailability.length; i++) {
    const curr = sortedAvailability[i];

    if (
      prev.day_of_week === curr.day_of_week &&
      prev.end_time === curr.start_time
    ) {
      // Extend the previous availability
      prev.end_time = curr.end_time;
    } else {
      // Push previous availability and move to the next
      mergedAvailability.push(prev);
      prev = curr;
    }
  }
  mergedAvailability.push(prev); // Push the last processed slot

  return mergedAvailability;
};
