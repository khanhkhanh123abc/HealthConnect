import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createReviewService } from '../services/reviewService';

const ReviewModal = ({ isOpen, onClose, booking, patientId, onSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !booking) return null;

    const handleClose = () => {
        if (isSubmitting) return;
        setRating(0);
        setHoverRating(0);
        setComment('');
        onClose?.();
    };

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            toast.error('Please choose a rating from 1 to 5 stars.');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await createReviewService({
                bookingId: booking.id,
                patientId,
                rating,
                comment: comment.trim()
            });
            if (res?.data?.errCode === 0) {
                toast.success('Thanks for your review!');
                onSubmitted?.(res.data.data);
                handleClose();
            } else {
                toast.error(res?.data?.errMessage || 'Could not submit review.');
            }
        } catch {
            toast.error('Connection error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={handleClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Rate Your Visit</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{booking.doctorName}</p>
                    </div>
                    <button onClick={handleClose} disabled={isSubmitting}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 my-6">
                    {[1, 2, 3, 4, 5].map(i => {
                        const active = i <= (hoverRating || rating);
                        return (
                            <button key={i}
                                onMouseEnter={() => setHoverRating(i)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(i)}
                                className="p-1 transition-transform hover:scale-110">
                                <Star className={`w-9 h-9 ${active ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                            </button>
                        );
                    })}
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Comment (optional)
                    </label>
                    <textarea value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        placeholder="Share your experience with this doctor..."
                        className="w-full bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all resize-none" />
                    <p className="text-[11px] text-gray-400 mt-1 text-right">{comment.length}/1000</p>
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={handleClose} disabled={isSubmitting}
                        className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting || rating < 1}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl transition-all duration-200 disabled:opacity-50">
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
