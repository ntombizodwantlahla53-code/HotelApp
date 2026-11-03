import styles from "./hotels.module.css"
import { IoIosAddCircle } from "react-icons/io";
import {useSelector,useDispatch,} from "react-redux";
import type {RootState,AppDispatch,} from "../../Redux/store";
import {Link, useNavigate, useParams} from "react-router-dom";
import {fetchHotel,fetchHotels,editHotel,updateHotel,clearHotel,} from "../../components/features/hotelslice"
import { MdArrowBackIos } from "react-icons/md";
import { useEffect } from "react";


export const hotel = () => {
  const info = useSelector((state: RootState) => state.hotels.info);
  const loading = useSelector((state: RootState) => state.hotels.loading);
  const error = useSelector((state: RootState) => state.hotels.error);

  const dispatch = useDispatch<AppDispatch>();
  const hotels = useSelector((state: RootState) => state.hotels.hotels);
  const { hotel_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHotel());
    if (!hotel_id) dispatch(clearHotel());
  }, [dispatch, hotel_id]);

  useEffect(() => {
    const found = hotels.find((item) => item.hotel_id === Number(hotel_id));
    if (found) dispatch(updateHotel(found));
  }, [hotels, hotel_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!info.name) {
      alert("Name cannot be empty. Please enter a name.");
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
    if (!info.star_rating) {
    alert("Please write ur rating.");
      return;
    }
    if (!info.image_url) {
    alert("where's image");
      return;
    }
        const hotelData = {
      name: info.name,
      address: info.address,
      city: info.city,
      country: info.country,
      star_rating: info.star_rating,
      image_url: info.image_url
    };

    if (hotel_id) {
      dispatch(editHotel({ ...hotelData, hotel_id: Number(hotel_id) }))
        .unwrap()
        .then(() => {
          dispatch(clearHotel());
          navigate("/Admin");
        })
        .catch(() => {});
    } else {
      dispatch(fetchHotels(hotelData))
        .unwrap()
        .then(() => {
          dispatch(clearHotel());
        })
        .catch(() => {});
    }
  };

  return (
    <div className={styles.linkContainer}>
      <Link to="/" className={styles.bc}>
        <MdArrowBackIos />
      </Link>
      <div className={styles.Topic}>
        <h1 className={styles.Mytitle}>{hotel_id ? "Edit hotel" : "Add a hotel"}</h1>
        <p className={styles.Myp}>Fill in the details for a lovely new stay</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.insideContainer}>
        <div className={styles.linkss}>
        <div className={styles.title}>
          <label className={styles.label}>Name</label>
          <input className={styles.inputtitle}
            value={info.name}
            type="text"
            onChange={(e) => dispatch(updateHotel({ name: e.target.value }))}
            placeholder="Name"/>
        </div>
        <div className={styles.title}>
          <label className={styles.label}>Address</label>
          <input className={styles.inputtitle}
            value={info.address}
            type="text"
            onChange={(e) => dispatch(updateHotel({ address: e.target.value }))}
            placeholder="Address"/>
        </div>
        <div className={styles.title}>
          <label className={styles.label}>City</label>
          <input className={styles.inputtitle}
            value={info.city}
            type="text"
            onChange={(e) => dispatch(updateHotel({ city: e.target.value }))}
            placeholder="City"/>
        </div>
        <div className={styles.title}>
          <label className={styles.label}>Country</label>
          <input className={styles.inputtitle}
            value={info.country}
            type="text"
            onChange={(e) => dispatch(updateHotel({ country: e.target.value }))}
            placeholder="Country"/>
        </div>
        <div className={styles.title}>
          <label className={styles.label}>Star rating</label>
          <input className={styles.inputtitle}
            value={info.star_rating ?? ""}
            type="text"
            onChange={(e) => dispatch(updateHotel({ star_rating: Number(e.target.value) }))}
            placeholder="Star rating"/>
        </div>
        <div className={styles.title}>
          <label className={styles.label}>Image</label>
          <input className={styles.inputtitle}
            value={info.image_url}
            type="text"
            onChange={(e) => dispatch(updateHotel({ image_url: e.target.value }))}
            placeholder="Image"/>
          {info.image_url && (
            <img src={info.image_url} alt="preview" className={styles.preview}/>
          )}
        </div>

        <button type="submit" className={styles.inputting}>
          <IoIosAddCircle /> {loading ? "Saving..." : hotel_id ? "Save hotel" : "Add hotel"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
        </div>
      </form>
    </div>
  );
};
