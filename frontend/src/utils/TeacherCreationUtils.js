export const mergeAvailabilities = (availability) => {
  if (!availability.length) return [];
  const sortedAvailability = [...availability].sort((a, b) => {
    if (a.day !== b.day) return a.day.localeCompare(b.day);
    return (
      //   DateTime.fromFormat(a.start_time, "h:mma") -
      //   DateTime.fromFormat(b.start_time, "h:mma")
      a.start_time - b.start_time
    );
  });

  const mergedAvailability = [];
  let prev = sortedAvailability[0];

  for (let i = 1; i < sortedAvailability.length; i++) {
    const curr = sortedAvailability[i];

    if (prev.day === curr.day && prev.end_time === curr.start_time) {
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
