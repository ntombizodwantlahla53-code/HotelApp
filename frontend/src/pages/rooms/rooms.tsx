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
  const hotels = useSelector((state: RootState) => state.hotels.hotels);

  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(!info.hotel_id){
      alert("select hotel");
      return;
    }

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
        <h1 className={styles.Mytitle}>Add Rooms</h1>
        <p className={styles.Myp}>Add a room to a hotel</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.insideContainer}>
          <div className={styles.linkss}>

            {/* CHANGED: select which hotel receives this room */}
            <div className={styles.title}>
              <label>Select hotel</label>
              <select
                className={styles.inputtitle}
                value={info.hotel_id || ""}
                onChange={(e) =>
                  dispatch(updateRoom({ hotel_id: Number(e.target.value) }))
                }
                required
              >
                <option value="">Choose a hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel.hotel_id} value={hotel.hotel_id}>
                    {hotel.name} (ID: {hotel.hotel_id})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.title}>
              <label>Description</label>
              <input
                className={styles.inputtitle}
                value={info.description}
                type="text"
                onChange={(e) =>
                  dispatch(updateRoom({ description: e.target.value }))
                }
                placeholder="Description"
                required
              />
            </div>

            <div className={styles.title}>
              <label>Amenities</label>
              <input
                className={styles.inputtitle}
                value={info.ammenities}
                type="text"
                onChange={(e) =>
                  dispatch(updateRoom({ ammenities: e.target.value }))
                }
                placeholder="Amenities"
                required
              />
            </div>

            <div className={styles.title}>
              <label>Capacity</label>
              <input
                className={styles.inputtitle}
                value={info.capacity || ""}
                type="number"
                min="1"
                onChange={(e) =>
                  dispatch(updateRoom({ capacity: Number(e.target.value) }))
                }
                placeholder="Capacity"
                required
              />
            </div>

            <div className={styles.title}>
              <label>Quantity</label>
              <input
                className={styles.inputtitle}
                value={info.quantity || ""}
                type="number"
                min="1"
                onChange={(e) =>
                  dispatch(updateRoom({ quantity: Number(e.target.value) }))
                }
                placeholder="Quantity"
                required
              />
            </div>

            <div className={styles.title}>
              <label>Price</label>
              <input
                className={styles.inputtitle}
                value={info.price || ""}
                type="number"
                min="0"
                onChange={(e) =>
                  dispatch(updateRoom({ price: Number(e.target.value) }))
                }
                placeholder="Price"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.inputting}
              disabled={loading}
            >
              <IoIosAddCircle />
              {loading ? "Adding room..." : "Add room"}
            </button>

            {error && <p>{error}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};
