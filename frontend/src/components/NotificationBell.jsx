import { useState, useRef, useEffect } from "react";
import { useNotifications, useMarkNotification } from "../api/notifications";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { data: notifications = [], isLoading } = useNotifications();
  const markNotification = useMarkNotification();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen() {
    setOpen((prev) => !prev);
  }

  function handleMarkRead(notification) {
    if (!notification.is_read) {
      markNotification.mutate({
        notificationId: notification.id,
        isRead: true,
      });
    }
  }

  return (
    <div className="bell" ref={ref}>
      <button
        className="bell__trigger"
        onClick={handleOpen}
        aria-label="Notifications"
      >
        <BellIcon />
        {unreadCount > 0 && <span className="bell__badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="bell__dropdown">
          <div className="bell__header">Notifications</div>

          {isLoading && <div className="bell__empty">Loading…</div>}

          {!isLoading && notifications.length === 0 && (
            <div className="bell__empty">Nothing here yet.</div>
          )}

          <ul className="bell__list">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`bell__item ${n.is_read ? "" : "bell__item--unread"}`}
                onClick={() => handleMarkRead(n)}
              >
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
