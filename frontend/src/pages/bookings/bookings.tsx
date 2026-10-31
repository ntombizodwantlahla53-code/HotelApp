import { useEffect } from "react";
import styles from "./bookings.module.css"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { RootState, AppDispatch } from "../../Redux/store";
import {addBookings,fetchBookingRoom,updateBooking,clearBooking,} from "../../components/features/bookingslice";

export const booking = () => {
  const info = useSelector((state: RootState) => state.booking.info);
  const room = useSelector((state: RootState) => state.booking.room);
  const loading = useSelector((state: RootState) => state.booking.loading);
  const error = useSelector((state: RootState) => state.booking.error);

  const dispatch = useDispatch<AppDispatch>();
  const { room_id } = useParams();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-CA");
  const nights = info.check_in && info.check_out && info.check_out > info.check_in ? Math.round((new Date(info.check_out).getTime() -new Date(info.check_in).getTime()) /86400000): 0;
  const rooms = info.number_of_rooms || 1;
  const total = room ? Number(room.price) * nights * rooms : 0;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/Login");
      return;
    }
    if (room_id) {
      dispatch(clearBooking());
      dispatch(updateBooking({ room_id: Number(room_id) }));
      dispatch(fetchBookingRoom(Number(room_id)));
    }
  }, [dispatch, room_id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nights < 1) {
      alert("Check-out must be after check-in.");
      return;
    }

    dispatch(
      addBookings({
        room_id: info.room_id,
        check_in: info.check_in,
        check_out: info.check_out,
        guests: info.guests,
        number_of_rooms: info.number_of_rooms,
      }))
      .unwrap()
      .then((data) => {
        dispatch(clearBooking());
        navigate(`/Payment/${data.booking_id}`, { state: { total: data.total_price } });
      })
      .catch(() => {});
  };

  return (
    <div className={styles.books}>
      <Link to={room ? `/hotels/${room.hotel_id}/rooms` : "/"} className={styles.back}>
        ← Back to rooms
      </Link>
      <h1 className={styles.heading}>Book a room</h1>
      {loading && <p className={styles.note}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {room && (
        <>
          <div className={styles.card}>
            <h2 className={styles.title}>Room {room.room_id}</h2>
            <p className={styles.text}>{room.description}</p>
            <p className={styles.text}>Room capacity: {room.capacity} guest(s)</p>
            <p className={styles.price}>R{Number(room.price).toFixed(2)} per night</p>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>Check-in date
              <input className={styles.input} type="date"
                min={today}
                value={info.check_in}
                onChange={(e) => dispatch(updateBooking({ check_in: e.target.value, check_out: "" }))}/>
            </label>

            <label className={styles.field}>Check-out date
              <input className={styles.input} type="date"
                min={info.check_in || today}
                value={info.check_out}
                onChange={(e) => dispatch(updateBooking({ check_out: e.target.value }))}/>
            </label>

            <label className={styles.field}>Number of rooms (up to {room.quantity})
              <input className={styles.input} type="number"
                min="1"
                max={room.quantity}
                value={info.number_of_rooms}
                onChange={(e) => dispatch(updateBooking({ number_of_rooms: Number(e.target.value) }))}/>
            </label>

            <label className={styles.field}>Number of guests
              <input className={styles.input} type="number"
                min="1"
                max={room.capacity * rooms}
                value={info.guests}
                onChange={(e) => dispatch(updateBooking({ guests: Number(e.target.value) }))}/>
            </label>

            <div className={styles.summary}>
              <p className={styles.nights}>Nights: {nights}</p>
              <p className={styles.total}>Total price: R{total.toFixed(2)}</p>
            </div>
            <button type="submit" className={styles.button} disabled={loading || nights < 1}>
              {loading ? "Booking..." : "Confirm booking"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};
export default booking;
