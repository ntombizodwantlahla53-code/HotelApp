import { useEffect } from "react";
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
    <div >
      <Link to="/">Back to hotels</Link>
      <h1>My profile</h1>
      <p>Role: {info.role}</p>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <p><label>Name<br />
            <input type="text"
              value={info.name}
              onChange={(e) => dispatch(updateProfile({ name: e.target.value }))}/>
          </label></p>
        <p><label>Email<br />
            <input type="email"
              value={info.email}
              onChange={(e) => dispatch(updateProfile({ email: e.target.value }))}/>
          </label></p>
        <p><label>New password (leave empty to keep the old one)<br />
        <input type="password"
              value={info.password}
              onChange={(e) => dispatch(updateProfile({ password: e.target.value }))}/>
          </label></p>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
            <h2>My bookings ({bookings.length})</h2>
            {bookings.length === 0 && <p>You have no bookings yet.</p>}
            {bookings.map((item) => (
              <div key={item.booking_id}>
                <h3>{item.hotel_name}</h3>
                <p>{item.room_description}</p>
                <p>Check-in: {item.check_in} | Check-out: {item.check_out} | Guests: {item.guests} | Rooms: {item.number_of_rooms}</p>
                <p> Total: R{Number(item.total_price).toFixed(2)} | Payment: {item.payment_status} | Status: {item.booking_status} </p>
                {item.payment_status === "Pending" && item.booking_status !== "Cancelled" && (
                  <Link to={`/Payment/${item.booking_id}`} state={{ total: item.total_price }}>Ready toPay now
                  </Link>
                )}
              </div>
            ))}

      <p><Link to="/Favourites">My favourite hotels</Link></p>
    </div>
  );
};

export default profile;