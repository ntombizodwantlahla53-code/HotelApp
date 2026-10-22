import styles from "./roomlist.module.css"
import { IoIosAddCircle } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store"
import { Link, useParams } from "react-router-dom";
import { fetchRoom } from "../../components/features/roomslice"
import { MdArrowBackIos } from "react-icons/md";
import { useEffect } from "react";
import { isAdmin } from "../../components/features/loginslice";

export const roomlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotel_id } = useParams();
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const loading = useSelector((state: RootState) => state.rooms.loading);
  const error = useSelector((state: RootState) => state.rooms.error);

  useEffect(() => {
    if (hotel_id) {
      dispatch(fetchRoom(Number(hotel_id)));
    }
  }, [dispatch, hotel_id]);

  const hotelRooms = rooms.filter(
    (room) => Number(room.hotel_id) === Number(hotel_id)
  );

  return (
    <div className={styles.linkContainer}>
      <Link to={isAdmin() ? "/Admin" : "/"}>
        <div className={styles.bc}>
          <MdArrowBackIos />
        </div>
      </Link>
      <div className={styles.Topic}>
        <h1 className={styles.Mytitle}> Rooms for hotel {hotel_id}</h1>
        {loading && <p>Loading rooms...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && hotelRooms.length === 0 && (
          <p>No rooms are available yet.</p>
        )}
        <div className={styles.flex}>
          {hotelRooms.map((room) => (
            <div className={styles.firstplace} key={room.room_id}>
              <h2>Room {room.room_id}</h2>
              <p>{room.description}</p>
              <p>Amenities: {room.ammenities}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Quantity: {room.quantity}</p>
              <p>Price: {room.price}</p>
            </div>
          ))}
        </div>
        {isAdmin() && (
          <Link to={`/Rooms/${hotel_id}`}>
            <button type="button" className={styles.inputting}>
              <IoIosAddCircle /> Add rooms
            </button>
          </Link>
        )}
      </div>
    </div>
  )
};
export default roomlist;