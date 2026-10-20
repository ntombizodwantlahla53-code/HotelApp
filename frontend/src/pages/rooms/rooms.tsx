import styles from "./rooms.module.css"
import { IoIosAddCircle } from "react-icons/io";
import {useSelector,useDispatch,} from "react-redux";
import type {RootState,AppDispatch,} from "../../Redux/store"
import {Link} from "react-router-dom";
import {addRooms,updateRoom,clearRoom,fetchRoom} from "../../components/features/roomslice"
import { MdArrowBackIos } from "react-icons/md";
import { useEffect } from "react";

export const room = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const loading = useSelector((state: RootState) => state.rooms.loading);
  const error = useSelector((state: RootState) => state.rooms.error);


useEffect(() => {
  dispatch(fetchRoom());
}, [dispatch]);


  return (
    <div className={styles.linkContainer}>
      <Link to="/">
        <div className={styles.bc}>
          <MdArrowBackIos />
        </div>
      </Link>
      <div className={styles.Topic}>
        <h1 className={styles.Mytitle}>PAGE TO ADD Rooms</h1>
        {loading && <p>Loading rooms...</p>}
{error && <p>{error}</p>}

            {!loading && !error && rooms.length === 0 && (
  <p>No rooms are available yet.</p>
)}
<div className={styles.flex}>
  {rooms.map((room, index) => (
    <div className={styles.firstplace} key={room.description ?? index}>
      <h2>Room {index + 1}</h2>
      <p>{room.description}</p>
      <p>Amenities: {room.ammenities}</p>
      <p>Capacity: {room.capacity}</p>
      <p>Quantity: {room.quantity}</p>
      <p>Price: {room.price}</p>
    </div>
  ))}
</div>
</div>
    </div>
  );
};