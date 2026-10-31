import { useEffect } from "react";
import styles from "./profile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../Redux/store";
import {fetchProfile,saveProfile,updateProfile,} from "../../components/features/profileslice";
import { fetchMyBookings } from "../../components/features/bookingslice";

export const profile = () => {
  const info = useSelector((state: RootState) => state.profile.info);
  const loading = useSelector((state: RootState) => state.profile.loading);
  const error = useSelector((state: RootState) => state.profile.error);
  const bookings = useSelector((state: RootState) => state.booking.bookings);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/Login");
      return;
    }
    dispatch(fetchProfile());
    dispatch(fetchMyBookings());
  }, [dispatch, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(saveProfile(info))
      .unwrap()
      .then(() => {
        alert("Profile updated successfully");
      })
      .catch(() => {});
  };

  return (
    <div className={styles.profile}>
      <Link to="/" className={styles.back}>Back to hotels</Link>
      <h1 className={styles.heading}>My profile</h1>
      <p className={styles.role}>Role: {info.role}</p>
      {loading && <p className={styles.note}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>Name
          <input className={styles.input} type="text"
            value={info.name}
            onChange={(e) => dispatch(updateProfile({ name: e.target.value }))}/>
        </label>
        <label className={styles.field}>Email
          <input className={styles.input} type="email"
            value={info.email}
            onChange={(e) => dispatch(updateProfile({ email: e.target.value }))}/>
        </label>
        <label className={styles.field}>New password (leave empty to keep the old one)
          <input className={styles.input} type="password"
            value={info.password}
            onChange={(e) => dispatch(updateProfile({ password: e.target.value }))}/>
        </label>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>

      <h2 className={styles.title}>My bookings ({bookings.length})</h2>
      {bookings.length === 0 && <p className={styles.empty}>You have no bookings yet.</p>}
      {bookings.map((item) => (
        <div key={item.booking_id} className={styles.booking}>
          <h3 className={styles.name}>{item.hotel_name}</h3>
          <p className={styles.text}>{item.room_description}</p>
          <p className={styles.text}>Check-in: {item.check_in} | Check-out: {item.check_out} | Guests: {item.guests} | Rooms: {item.number_of_rooms}</p>
          <p className={styles.meta}>Total: R{Number(item.total_price).toFixed(2)} | Payment: {item.payment_status} | Status: {item.booking_status}</p>
          {item.payment_status === "Pending" && item.booking_status !== "Cancelled" && (
            <Link to={`/Payment/${item.booking_id}`} state={{ total: item.total_price }} className={styles.pay}>
              Ready to pay now
            </Link>
          )}
        </div>
      ))}

      <Link to="/Favourites" className={styles.favlink}>♡ My favourite hotels</Link>
    </div>
  );
};

export default profile;
