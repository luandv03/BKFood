import { useState } from "react";
import { FaStar, FaTimes, FaCamera } from "react-icons/fa";
import "./ReviewForm.css";

const ReviewForm = ({ onSubmit, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");

    const handleRatingClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 3) {
            setError("Chỉ được tải lên tối đa 3 ảnh");
            return;
        }

        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages([...images, ...newImages]);
        setError("");
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...images];
        URL.revokeObjectURL(updatedImages[index].preview);
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Vui lòng chọn đánh giá sao");
            return;
        }

        if (comment.trim() === "") {
            setError("Vui lòng nhập nội dung đánh giá");
            return;
        }

        // Create the review object
        const newReview = {
            userName: "Đinh Văn Luận",
            userAvatar:
                "https://schooler.sun-asterisk.com/storage/images/avatar/student/6741fcdd6cafd.",
            rating,
            comment,
            images: images.map((img) => img.preview), // In a real app, we'd upload these and use the URLs
        };

        onSubmit(newReview);
    };

    return (
        <div className="review-form-container">
            <div className="review-form-header">
                <h2>Viết đánh giá</h2>
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="rating-input">
                    <p>Đánh giá của bạn</p>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`star ${
                                    star <= (hover || rating) ? "active" : ""
                                }`}
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            />
                        ))}
                    </div>
                </div>

                <div className="comment-input">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        rows={4}
                    />
                </div>

                <div className="image-upload">
                    <p>Thêm hình ảnh (tối đa 3)</p>
                    <div className="image-preview-container">
                        {images.map((image, index) => (
                            <div key={index} className="image-preview">
                                <img
                                    src={image.preview}
                                    alt={`Preview ${index}`}
                                />
                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                        {images.length < 3 && (
                            <label className="upload-button">
                                <FaCamera />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    hidden
                                />
                            </label>
                        )}
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <div className="button-group">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button type="submit" className="submit-button">
                            Gửi đánh giá
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
