"use client";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  property_id?: string | null;
  created_at: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      ></i>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-dark mb-1">{testimonial.name}</h4>
          <div className="flex items-center gap-1 mb-2">
            {renderStars(testimonial.rating)}
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(testimonial.created_at)}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{testimonial.review}</p>
    </div>
  );
}
