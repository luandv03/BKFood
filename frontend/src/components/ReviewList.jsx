import { FaStar } from 'react-icons/fa';
import './ReviewList.css';

const ReviewList = ({ reviews }) => {
    return (
        <div className="review-list">
            {reviews.map((review, index) => (
                <div key={index} className="review-item">
                    <div className="review-header">
                        <div className="reviewer-info">
                            <img 
                                src={review.userAvatar || 'https://via.placeholder.com/40'} 
                                alt={review.userName} 
                                className="reviewer-avatar"
                            />
                            <div className="reviewer-details">
                                <h4>{review.userName}</h4>
                                <div className="review-date">{review.date}</div>
                            </div>
                        </div>
                        <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className="star"
                                    color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                        <div className="review-images">
                            {review.images.map((image, imgIndex) => (
                                <img 
                                    key={imgIndex} 
                                    src={image} 
                                    alt={`Review image ${imgIndex + 1}`}
                                    className="review-image"
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList; 