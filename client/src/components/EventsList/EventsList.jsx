import { useMemo } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import styles from './EventsList.module.sass';

export default function EventsList({ eventData, deleteEvent }) {
  const separator = eventData.date.includes('T') ? '' : 'T';
  const fullDateTime = `${eventData.date}${separator}${eventData.time}`;

  const [days, hours, minutes, seconds, remainingMs] =
    useCountdown(fullDateTime);

  const widthPercentage = useMemo(() => {
    if (remainingMs <= 0) return 0;

    const endTime = new Date(fullDateTime).getTime();
    const startTime = eventData.createdAt || Date.now();
    const totalDuration = endTime - startTime;

    if (totalDuration <= 0) return 0;

    const percent = (remainingMs / totalDuration) * 100;
    return Math.min(Math.max(percent, 0), 100);
  }, [remainingMs, fullDateTime, eventData.createdAt]);

  const isExpired = remainingMs <= 0;

  const renderTime = () => {
    if (isExpired) return "Time's up!";
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(' ');
  };

  return (
    <li className={`${styles.eventItem} ${isExpired ? styles.expired : ''}`}>
      <div
        className={styles.progressBar}
        style={{ width: `${widthPercentage}%` }}
      />

      <div className={styles.content}>
        <h3 className={styles.name}>{eventData.name}</h3>
        <span className={styles.timer}>{renderTime()}</span>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={() => deleteEvent(eventData.id)}
      >
        &times;
      </button>
    </li>
  );
}
