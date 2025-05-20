import { FaCheckCircle, FaMotorcycle, FaSpinner } from "react-icons/fa";
import "../styles/OrderTracker.css";

/**
 * OrderTracker component for web - tương ứng với OrderTracker.tsx trong React Native
 */
const OrderTracker = ({ order }) => {
    // Kiểm tra trạng thái của từng bước
    const getStepStatus = (stepIndex) => {
        const currentStep = order.currentStep;

        if (stepIndex < currentStep) return "completed";
        if (stepIndex === currentStep) return "current";
        return "upcoming";
    };

    return (
        <div className="order-tracker">
            <div className="tracker-header">
                <h3>Theo dõi đơn hàng</h3>
                <div className="order-id">#{order.id}</div>
            </div>

            <div className="estimated-delivery">
                <div className="estimate-icon">
                    <FaMotorcycle />
                </div>
                <div className="estimate-info">
                    <div className="estimate-label">
                        Thời gian giao hàng dự kiến
                    </div>
                    <div className="estimate-time">
                        {order.estimatedArrival}
                    </div>
                </div>
            </div>

            <div className="tracking-steps">
                {order.steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`tracking-step ${getStepStatus(index)}`}
                    >
                        <div className="step-indicator">
                            {getStepStatus(index) === "completed" ? (
                                <FaCheckCircle className="step-icon completed" />
                            ) : getStepStatus(index) === "current" ? (
                                <FaSpinner className="step-icon current spinning" />
                            ) : (
                                <div className="step-circle" />
                            )}
                        </div>

                        <div className="step-content">
                            <div className="step-info">
                                <div className="step-name">{step.title}</div>
                                {step.time && (
                                    <div className="step-time">{step.time}</div>
                                )}
                            </div>

                            {index < order.steps.length - 1 && (
                                <div
                                    className={`step-line ${
                                        getStepStatus(index) === "completed"
                                            ? "completed"
                                            : ""
                                    }`}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="tracker-actions">
                <button className="tracker-button secondary">
                    Xem chi tiết
                </button>
                <button className="tracker-button primary">
                    Theo dõi người giao
                </button>
            </div>
        </div>
    );
};

export default OrderTracker;
