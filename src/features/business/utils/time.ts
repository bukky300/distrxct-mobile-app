/** "09:00:00" (24h, backend) -> "09:00 AM" (display) */
export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${String(displayHour).padStart(2, '0')}:${mStr} ${period}`;
}

/** Every half-hour slot in a day, as { value: "HH:MM:SS", label: "12:00 AM" } — used by the
 * Hours edit sheet's time pickers since there's no native time-picker dependency in the app. */
export const TIME_SLOTS: { value: string; label: string }[] = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const value = `${String(hour).padStart(2, '0')}:${minute}:00`;
  return { value, label: formatTime12h(value) };
});
