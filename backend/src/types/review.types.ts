export interface Review {
    review_id: number,
    user_id: number,
    hotel_id: number,
    rating: number,
    comment: string,
    created_at: Date
}

export type NewReview = Omit<Review, 'review_id' | 'user_id' | 'hotel_id' | 'created_at'>
export type HotelReview = Omit<Review, 'hotel_id'> & { user_name: string }