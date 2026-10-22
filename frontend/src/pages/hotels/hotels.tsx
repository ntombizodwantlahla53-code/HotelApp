import styles from "./hotels.module.css"
import { IoIosAddCircle } from "react-icons/io";
import {useSelector,useDispatch,} from "react-redux";
import type {RootState,AppDispatch,} from "../../Redux/store";
import {Link} from "react-router-dom";
import {fetchHotels,updateHotel,clearHotel,} from "../../components/features/hotelslice"
import { MdArrowBackIos } from "react-icons/md";

export const hotel = () => {
  const info = useSelector((state: RootState) => state.hotels.info);
  const loading = useSelector((state: RootState) => state.hotels.loading);
  const error = useSelector((state: RootState) => state.hotels.error);

  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!info.name) {
      alert("Name cannot be empty. Please enter a name.");
      return;
    }
    
    if (!info.description) {
      alert("Description cannot be empty. Please enter an description.");
      return;
    }

    if (!info.address) {
      alert("Email cannot be empty. Please enter an email address.");
      return;
    }
    if (!info.city) {
    alert("City cannot be empty. Please enter a city.");
      return;
    }
    if (!info.country) {
    alert("Country cannot be empty. Please enter a country.");
      return;
    }
    if (!info.ammenities) {
    alert("Ammenities cannot be empty. Please enter a ammenities.");
      return;
    }
    if (!info.star_rating) {
    alert("Please write ur rating.");
      return;
    }
    if (!info.image_url) {
    alert("where's image");
      return;
    }
    dispatch(
      fetchHotels({
        name: info.name,
        description: info.description,
        address: info.address,
        city: info.city,
        country: info.country,
        ammenities: info.ammenities,
        star_rating: info.star_rating,
        image_url: info.image_url
      }))
      .unwrap()
      .then(() => {
        dispatch(clearHotel());
     
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
        <h1 className={styles.Mytitle}>PAGE TO ADD HOTELs</h1>
        <p className={styles.Myp}>
        ADD HOTELS
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.insideContainer}>
          <div className={styles.linkss}>
            <div className={styles.title}>
              <label>name</label>
              <input className={styles.inputtitle}
                value={info.name}
                type="text"
                onChange={(e) => dispatch(updateHotel({ name: e.target.value }))}
                placeholder="Name"/>
            </div>
            <div className={styles.title}>
              <label>description</label>
              <input className={styles.inputtitle}
                value={info.description}
                type="text"
                onChange={(e) => dispatch(updateHotel({ description: e.target.value }))}
                placeholder="Description"/>
            </div>
            <div className={styles.title}>
              <label>address</label>
              <input className={styles.inputtitle}
                value={info.address}
                type="text"
                onChange={(e) => dispatch(updateHotel({ address: e.target.value }))}
                placeholder="Address"/>
            </div>
            <div className={styles.title}>
              <label>city</label>
              <input className={styles.inputtitle}
                value={info.city}
                type="text"
                onChange={(e) => dispatch(updateHotel({ city: e.target.value }))}
                placeholder="City"/>
            </div>
            <div className={styles.title}>
              <label>country</label>
              <input className={styles.inputtitle}
                value={info.country}
                type="text"
                onChange={(e) => dispatch(updateHotel({ country: e.target.value }))}
                placeholder="Country"/>
            </div>
            <div className={styles.title}>
              <label>ammenities</label>
              <input className={styles.inputtitle}
                value={info.ammenities}
                type="text"
                onChange={(e) => dispatch(updateHotel({ ammenities: e.target.value }))}
                placeholder="Ammenities"/>
            </div>
            <div className={styles.title}>
              <label>satr_rating</label>
              <input className={styles.inputtitle}
                value={info.star_rating ?? ""}
                type="text"
                onChange={(e) => dispatch(updateHotel({ star_rating: Number(e.target.value) }))}
                placeholder="Star rating"/>
            </div>

             <div className={styles.title}>
              <label>image</label>
              <input className={styles.inputtitle}
                value={info.image_url}
                type="text"
                onChange={(e) => dispatch(updateHotel({ image_url:(e.target.value) }))}
                placeholder="Image"/>
                {info.image_url && (
                  <img src= {info.image_url} alt ="preview"/>
                )}
            </div>
            
            <button type="submit" className={styles.inputting}>
              <IoIosAddCircle /> {loading ? "Hotels..." : "addhotels"}
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