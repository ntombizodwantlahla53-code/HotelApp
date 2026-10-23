import styles from "./roomlist.module.css"
import { IoIosAddCircle } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store"
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchRoom } from "../../components/features/roomslice"
import { MdArrowBackIos } from "react-icons/md";
import { useEffect } from "react";

export const roomlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotel_id } = useParams();
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const loading = useSelector((state: RootState) => state.rooms.loading);
  const error = useSelector((state: RootState) => state.rooms.error);
  const saveUser = localStorage.getItem("user");
  const profile = saveUser ? JSON.parse(saveUser) : null;
  const isAdmin = profile?.role === "Admin";
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = isAdmin && location.pathname.toLowerCase().startsWith("/admin");

  const handleBook = (room_id?: number) => {
    if (!localStorage.getItem("token")) {
      navigate("/Login");
      return;
    }

    alert(`Booking room ${room_id} - booking page coming soon`);
  };

  useEffect(() => {
    if (hotel_id) {
      dispatch(fetchRoom(Number(hotel_id)));
    }
  }, [dispatch, hotel_id]);


  const hotelRooms = rooms.filter(
    (r) => Number(r.hotel_id) === Number(hotel_id)
  );

  return (
    <div className={styles.linkContainer}>
      
      <Link to={isAdminPage ?"/Admin":"/"}>
        <div className={styles.bc}>
          <MdArrowBackIos />
        </div>
      </Link>
      <div className={styles.Topic}>
        <h1 className={styles.Mytitle}>Rooms for hotel {hotel_id}</h1>
        {loading && <p>Loading rooms...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && hotelRooms.length === 0 && (
          <p>No rooms are available yet.</p>
        )}
        <div className={styles.flex}>
          {hotelRooms.map((room) => (
            <div className={styles.firstplace} key={room.room_id}>
              {room.image_url && (
                <img src={room.image_url} alt={`Room ${room.room_id}`}  className={styles.image}/>
              )}
              <h2>Room {room.room_id}</h2>
              <p>{room.description}</p>
              <p>Amenities: {room.ammenities}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Quantity: {room.quantity}</p>
              <p>Price: {room.price}</p>
              {!isAdminPage && (
                <button
                  type="button"
                  className={styles.inputting}
                  onClick={() => handleBook(room.room_id)}>
                  Book now
                </button>
              )}
            </div>
          ))}
        </div>
        {isAdminPage &&(
          <Link to={`/Rooms/${hotel_id}`}>
            <button type="button" className={styles.inputting}>
              <IoIosAddCircle/>Add rooms
            </button>
          </Link>
        )}
      </div>
    </div>
  )
};
export default roomlist;