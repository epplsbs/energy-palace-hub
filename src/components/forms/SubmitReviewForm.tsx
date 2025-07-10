import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createTestimonial } from '@/services/contentService';
import { Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const SubmitReviewForm = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating for your review.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await createTestimonial({
        customer_name: name,
        customer_email: email || undefined, // Optional
        content,
        rating,
        is_active: false, // Default to inactive for moderation
        display_order: 0, // Admin can adjust this later
        // customer_title can be added later by admin if needed
      });
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review is pending approval.",
      });
      // Reset form
      setName('');
      setEmail('');
      setRating(0);
      setHoverRating(0);
      setContent('');
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Could not submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="reviewerName" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Your Name <span className="text-red-500">*</span></Label>
        <Input
          id="reviewerName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`mt-1 ${theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700 text-gray-50'}`}
        />
      </div>
      <div>
        <Label htmlFor="reviewerEmail" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Your Email (Optional)</Label>
        <Input
          id="reviewerEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-1 ${theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700 text-gray-50'}`}
        />
      </div>
      <div>
        <Label className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Your Rating <span className="text-red-500">*</span></Label>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-7 w-7 cursor-pointer ${
                (hoverRating || rating) >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : (theme === 'light' ? 'text-gray-300' : 'text-gray-600')
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="reviewContent" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Your Review <span className="text-red-500">*</span></Label>
        <Textarea
          id="reviewContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className={`mt-1 ${theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700 text-gray-50'}`}
          placeholder="Share your experience with us..."
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3"
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default SubmitReviewForm;
