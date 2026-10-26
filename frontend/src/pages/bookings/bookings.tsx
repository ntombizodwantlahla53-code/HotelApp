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
  const total = room ? Number(room.price) * nights : 0;

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
      }))
      .unwrap()
      .then((data) => {
        alert(`Booking successful! Total: R${Number(data.total_price).toFixed(2)}`);
        dispatch(clearBooking());
        navigate("/");
      })
      .catch(() => {});
  };

  return (
    <div className={styles.books}>
      <Link to={room ? `/hotels/${room.hotel_id}/rooms` : "/"}>
        Back to rooms</Link>
      <h1>Book a room</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {room && (
        <>
          <h2>Room {room.room_id}</h2>
          <p>{room.description}</p>
          <p>Price per night: R{Number(room.price).toFixed(2)}</p>
          <p>Room capacity: {room.capacity} guest(s)</p>
          <form onSubmit={handleSubmit}>
            <p><label>Check-in date<br />
                <input type="date"
                  min={today}
                  value={info.check_in}
                  onChange={(e) => dispatch(updateBooking({ check_in: e.target.value, check_out: "" }))}/>
              </label></p>

            <p><label>Check-out date<br />
                <input type="date"
                  min={info.check_in || today}
                  value={info.check_out}
                  onChange={(e) => dispatch(updateBooking({ check_out: e.target.value }))}/>
              </label></p>

            <p><label>
                Number of guests
                <br />
                <input type="number"
                  min="1"
                  max={room.capacity}
                  value={info.guests}
                  onChange={(e) =>dispatch(updateBooking({ guests: Number(e.target.value) }))}/>
              </label></p>
            <h3>Nights: {nights}</h3>
            <h3>Total price: R{total.toFixed(2)}</h3>
            <button type="submit" disabled={loading || nights < 1}>
              {loading ? "Booking..." : "Confirm booking"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};
export default booking;