import React from "react";
import styles from "./addhotels.module.css"
import type {AppDispatch,RootState,} from "../../Redux/store";
import {useSelector,useDispatch,} from "react-redux";
import {fetchHotel,hotels,} from "../../components/features/hotelslice";
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md"
import { Link } from "react-router-dom";

export const Addhotels = () => {
  const details = useSelector((state: RootState) =>state.addhotels.details);
  const error = useSelector((state: RootState) =>state.addhotels.error);
  const user = useSelector((state: RootState) =>state.login.info);

  const dispatch =useDispatch<AppDispatch>();
  const navigate =useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {return;}

    dispatch(
      fetchHotel({
        hotel_id: 0,
        user_id: user.id,
        name: details.name,
        description: details.description,
        address: details.address,
        city: details.city,
        country: details.country,
        ammenities: details.ammenities,
        star_rating: details.star_rating,
        created_at: Date.now(),
        updated_at: Date.now(),
      })
    )
     .unwrap()
      .then(() => {
        navigate("/Hotels");
      })
      .catch(() => {});
  };
  return (
    <div>
      <div className={styles.linkContainer}>
        {/*going back to home page*/}
          <Link to ="/Hotels"><div className={styles.backbutton}><MdArrowBackIos/></div></Link>
        <div className={styles.Topic}>
          <h1 className={styles.Mytitle}>Add list</h1>
        </div>
        
       {/*handlesubmit form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.insideContainer}>
            <div className={styles.linkss}>
              <div className={styles.title}>
                <label></label>
                {/*update name as i type in the input field*/}
                <input className={styles.inputtitle}
                  placeholder="Name"
                  value={details.name}
                  onChange={(e) =>dispatch(hotels({name:e.target.value,}))
                  }/>
              </div>

              <div className={styles.title}>
                <label></label>
                {/*update name as i type in the input field*/}
                <input className={styles.inputtitle}
                  placeholder="Description"
                  value={details.description}
                  onChange={(e) =>dispatch(hotels({description:e.target.value,}))
                  }/>
              </div>

              <div className={styles.title}>
                <label></label>
                {/*update name as i type in the input field*/}
                <input className={styles.inputtitle}
                  placeholder="Address"
                  value={details.address}
                  onChange={(e) =>dispatch(hotels({address:e.target.value,}))
                  }/>
              </div>

              <div className={styles.title}>
                <label></label>
                {/*update name as i type in the input field*/}
                <input className={styles.inputtitle}
                  placeholder="City"
                  value={details.city}
                  onChange={(e) =>dispatch(hotels({city:e.target.value,}))
                  }/>
              </div>

              <div className={styles.title}>
                <label></label>
                {/*update name as i type in the input field*/}
                <input className={styles.inputtitle}
                  placeholder="Country"
                  value={details.country}
                  onChange={(e) =>dispatch(hotels({country:e.target.value,}))
                  }/>
              </div>

              <div className={styles.title}>
                <label></label>
                {/*update name as i type in the input field*/}
                <input className={styles.inputtitle}
                  placeholder="Ammenities"
                  value={details.ammenities}
                  onChange={(e) =>dispatch(hotels({ammenities:e.target.value,}))
                  }/>
              </div>

              <div className={styles.title}>
                <label></label>
                {/*update name as i type in the input field*/}
                <input className={styles.inputtitle}
                  placeholder="Star_rating"
                  value={details.star_rating ?? ""}
                  onChange={(e) =>dispatch(hotels({star_rating:Number(e.target.value),}))
                  }/>
              </div>

              
            <div className={styles.desc}><label></label>
              </div>
              <div className={styles.btn}>
                <Link to="/Hotels">
              <button type="submit">
                <IoIosAddCircle /> ADD LIST
              </button>
              </Link></div>
              {error && (<p>{error}</p>)} {/*if thes error, show the error message*/}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};