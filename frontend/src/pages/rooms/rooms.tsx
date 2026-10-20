import styles from "./rooms.module.css"
import { IoIosAddCircle } from "react-icons/io";
import {useSelector,useDispatch,} from "react-redux";
import type {RootState,AppDispatch,} from "../../Redux/store"
import {Link} from "react-router-dom";
import {addRooms,updateRoom,clearRoom} from "../../components/features/roomslice"
import { MdArrowBackIos } from "react-icons/md";

export const room = () => {
  const info = useSelector((state: RootState) => state.rooms.info);
  const loading = useSelector((state: RootState) => state.rooms.loading);
  const error = useSelector((state: RootState) => state.rooms.error);

  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


dispatch(
     addRooms({
      hotel_id:info.hotel_id,
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