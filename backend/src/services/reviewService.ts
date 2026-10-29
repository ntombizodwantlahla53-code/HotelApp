import { query } from "../config/database";
import { Review, NewReview, HotelReview } from "./../types/review.types"

export const saveReview = async (
    hotel_id: number,
    user_id: number,
    appData: NewReview
): Promise<Review> => {
    const { rating, comment } = appData;
    const { rows } = await query(
        `INSERT INTO reviews (hotel_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, hotel_id)
        DO UPDATE SET rating = $3, comment = $4, created_at = NOW()
        RETURNING *`,
        [hotel_id, user_id, rating, comment]
    );
    return rows[0];
};

export const findHotelReviews = async (hotel_id: number): Promise<HotelReview[]> => {
    const { rows } = await query(
        `SELECT reviews.review_id, reviews.user_id, reviews.rating, reviews.comment,
        reviews.created_at, users.name AS user_name
        FROM reviews JOIN users ON reviews.user_id = users.id
        WHERE reviews.hotel_id = $1
        ORDER BY reviews.created_at DESC`,
        [hotel_id]
    );
    return rows;
};

export const deleteReview = async (review_id: number, user_id: number) => {
    const { rows } = await query(
        "DELETE FROM reviews WHERE review_id = $1 AND user_id = $2 RETURNING review_id",
        [review_id, user_id]
    );
    return rows[0] || null;
};