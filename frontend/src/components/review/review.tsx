import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store";
import { fetchReviews, saveReview, removeReview } from "../features/reviewslice"
import styles from "./reviews.module.css";

interface ReviewProps {
  hotel_id: number;
}

const showStars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

export const reviews = ({ hotel_id }: ReviewProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const allReviews = useSelector((state: RootState) => state.reviews.reviews);
  const loading = useSelector((state: RootState) => state.reviews.loading);
  const error = useSelector((state: RootState) => state.reviews.error);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");
  const saveUser = localStorage.getItem("user");
  const currentUser = saveUser ? JSON.parse(saveUser) : null;
  const isCustomer = Boolean(token) && currentUser?.role === "Customer";

  useEffect(() => {
    dispatch(fetchReviews(hotel_id));
  }, [dispatch, hotel_id]);

  const average = allReviews.length
    ? allReviews.reduce((total, item) => total + item.rating, 0) / allReviews.length
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveReview({ hotel_id, rating, comment }))
      .unwrap()
      .then(() => {
        setComment("");
        dispatch(fetchReviews(hotel_id));
      })
      .catch(() => {});
  };

  const handleDelete = (review_id: number) => {
    if (!window.confirm("Delete your review?")) return;
    dispatch(removeReview(review_id))
      .unwrap()
      .then(() => dispatch(fetchReviews(hotel_id)))
      .catch(() => {});
  };

  return (
    <div className={styles.box}>
      <h2>Guest reviews</h2>

      {allReviews.length > 0 && (
        <p className={styles.average}>
          <span className={styles.stars}>{showStars(Math.round(average))}</span>{" "}
          {average.toFixed(1)} out of 5 ({allReviews.length} reviews)
        </p>
      )}
      {allReviews.length === 0 && !loading && <p>No reviews yet. Be the first!</p>}

      {isCustomer && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Your rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={5}>★★★★★ (5)</option>
              <option value={4}>★★★★☆ (4)</option>
              <option value={3}>★★★☆☆ (3)</option>
              <option value={2}>★★☆☆☆ (2)</option>
              <option value={1}>★☆☆☆☆ (1)</option>
            </select>
          </label>
          <textarea
            placeholder="Tell others about your stay..."
            value={comment}
            maxLength={500}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit">Post review</button>
        </form>
      )}

      {error && <p>{error}</p>}

      {allReviews.map((item) => (
        <div key={item.review_id} className={styles.review}>
          <p className={styles.stars}>{showStars(item.rating)}</p>
          <p>{item.comment}</p>
          <p className={styles.who}>{item.user_name} - {new Date(item.created_at).toLocaleDateString()}</p>
          {item.user_id === currentUser?.id && (
            <button type="button" onClick={() => handleDelete(item.review_id)}>Delete my review</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default reviews;