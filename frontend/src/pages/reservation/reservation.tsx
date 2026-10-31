import { useEffect, useState } from "react";
import styles from "./reservation.module.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store";
import { fetchReservations, changeStatus, modifyReservation } from "../../components/features/reservationslice";
import type { reservation } from "../../components/features/reservationslice";

export const reservations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allReservations = useSelector((state: RootState) => state.reservations.reservations);
  const loading = useSelector((state: RootState) => state.reservations.loading);
  const error = useSelector((state: RootState) => state.reservations.error);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDetails, setNewDetails] = useState({ check_in: "", check_out: "", guests: 1 });

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const handleStatus = (booking_id: number, booking_status: string) => {
    if (!window.confirm(`Set booking ${booking_id} to ${booking_status}?`)) return;
    dispatch(changeStatus({ booking_id, booking_status }))
      .unwrap()
      .then(() => dispatch(fetchReservations()))
      .catch(() => {});
  };

  const startEditing = (item: reservation) => {
    setEditingId(item.booking_id);
    setNewDetails({ check_in: item.check_in, check_out: item.check_out, guests: item.guests });
  };

  const handleSave = (booking_id: number) => {
    dispatch(modifyReservation({ booking_id, ...newDetails }))
      .unwrap()
      .then(() => {
        setEditingId(null);
        dispatch(fetchReservations());
      })
      .catch(() => {});
  };

  return (
    <div className={styles.reservations}>
      <h2 className={styles.heading}>Reservations ({allReservations.length})</h2>
      {loading && <p className={styles.note}>Loading reservations...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {allReservations.map((item) => (
        <div key={item.booking_id} className={styles.card}>
          <h3 className={styles.title}>Booking {item.booking_id} - {item.hotel_name}</h3>
          <p className={styles.text}>Guest: {item.user_name} ({item.user_email})</p>
          <p className={styles.text}>Room: {item.room_description}</p>
          <p className={styles.text}>Check-in: {item.check_in} | Check-out: {item.check_out} | Guests: {item.guests} | Rooms: {item.number_of_rooms}</p>
          <p className={styles.meta}>
            Total: R{Number(item.total_price).toFixed(2)} | Payment: {item.payment_status} | Status: {item.booking_status}
          </p>

          {editingId === item.booking_id ? (
            <div className={styles.editor}>
              <input className={styles.input} type="date"
                value={newDetails.check_in}
                onChange={(e) => setNewDetails({ ...newDetails, check_in: e.target.value })} />
              <input className={styles.input} type="date"
                value={newDetails.check_out}
                onChange={(e) => setNewDetails({ ...newDetails, check_out: e.target.value })} />
              <input className={styles.input} type="number" min="1"
                value={newDetails.guests}
                onChange={(e) => setNewDetails({ ...newDetails, guests: Number(e.target.value) })} />
              <button type="button" className={styles.save} onClick={() => handleSave(item.booking_id)}>Save</button>
              <button type="button" className={styles.close} onClick={() => setEditingId(null)}>Close</button>
            </div>
          ) : (
            <div className={styles.actions}>
              {item.booking_status === "Pending" && (
                <button type="button" className={styles.approve} onClick={() => handleStatus(item.booking_id, "Approved")}>Approve</button>
              )}
              {item.booking_status !== "Cancelled" && (
                <>
                  <button type="button" className={styles.modify} onClick={() => startEditing(item)}>Modify</button>
                  <button type="button" className={styles.cancel} onClick={() => handleStatus(item.booking_id, "Cancelled")}>Cancel</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default reservations;
