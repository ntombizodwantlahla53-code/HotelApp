import styles from "./hotels.module.css"
import { IoIosAddCircle } from "react-icons/io";
import {useSelector,useDispatch,} from "react-redux";
import type {RootState,AppDispatch,} from "../../Redux/store"
import {Link} from "react-router-dom";
import {addRooms,updateRoom,clearRoom,fetchRoom} from "../../components/features/roomslice"
import { MdArrowBackIos } from "react-icons/md";
import { useEffect } from "react";

export const room = () => {
  const info = useSelector((state: RootState) => state.rooms.info);
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const loading = useSelector((state: RootState) => state.rooms.loading);
  const error = useSelector((state: RootState) => state.rooms.error);

  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

useEffect(() => {
  dispatch(fetchRoom());
}, [dispatch]);

dispatch(
     addRooms({
        description: info.description,
        ammenities: info.ammenities,
        capacity: info.capacity,
        quantity: info.quantity,
        price: info.price,
      }))
      .unwrap()
      .then(() => {
        dispatch(clearRoom());
     
      })
      .catch(() => {});
  };

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
        <p className={styles.Myp}>
        ADD HOTELS
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.insideContainer}>
          <div className={styles.linkss}>
            <div className={styles.title}>
              <label>description</label>
              <input className={styles.inputtitle}
                value={info.description}
                type="text"
                onChange={(e) => dispatch(updateRoom({ description: e.target.value }))}
                placeholder="Description"/>
            </div>
            <div className={styles.title}>
              <label>address</label>
              <input className={styles.inputtitle}
                value={info.ammenities}
                type="text"
                onChange={(e) => dispatch(updateRoom({ ammenities: e.target.value }))}
                placeholder="Ammenities"/>
            </div>
            <div className={styles.title}>
              <label>city</label>
              <input className={styles.inputtitle}
                value={info.capacity}
                type="text"
                onChange={(e) => dispatch(updateRoom({ capacity: Number(e.target.value) }))}
                placeholder="Capacity"/>
            </div>
            <div className={styles.title}>
              <label>country</label>
              <input className={styles.inputtitle}
                value={info.quantity}
                type="text"
                onChange={(e) => dispatch(updateRoom({ quantity: Number(e.target.value)  }))}
                placeholder="Quantity"/>
            </div>
            <div className={styles.title}>
              <label>satr_rating</label>
              <input className={styles.inputtitle}
                value={info.price}
                type="text"
                onChange={(e) => dispatch(updateRoom({ price: Number(e.target.value) }))}
                placeholder="Price"/>
            </div>

            
            <button type="submit" className={styles.inputting}>
              <IoIosAddCircle /> {loading ? "Rooms..." : "addrooms"}
            </button>

            {error && (<p>{error}</p>
            )}
            {/* <p className={styles.text}>
              Don't have an account?
            </p> */}
            {/* <Link to="/register">
              Sign Up
            </Link> */}
          </div>
        </div>
      </form>
    </div>
  );
};