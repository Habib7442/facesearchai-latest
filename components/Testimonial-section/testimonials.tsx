import { Suspense } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { LoadingSpinner } from "../ui/loading-spinner";

async function getFeedbackData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/feedback/all`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch feedback: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return { feedback: [] };
  }
}

async function TestimonialList() {
  const data = await getFeedbackData();

  if (!data?.feedback) {
    return (
      <div className="text-center text-muted-foreground">
        No testimonials available
      </div>
    );
  }

  const transformedTestimonials = data.feedback.map((feedback, index) => ({
    id: `${feedback.user_name}-${feedback.submitted_at}-${index}`,
    quote: feedback.content,
    name: feedback.user_name,
    title: `${feedback.rating} ★ Rating`,
  }));

  const finalTestimonials =
    transformedTestimonials.length < 5
      ? [
          ...transformedTestimonials,
          ...transformedTestimonials.map((t) => ({
            ...t,
            id: `${t.id}-duplicate`,
          })),
        ]
      : transformedTestimonials;

  return (
    <div className="rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
      {finalTestimonials.length > 0 ? (
        <InfiniteMovingCards
          items={finalTestimonials}
          direction="right"
          speed="slow"
        />
      ) : (
        <div className="text-center text-muted-foreground">
          No testimonials available yet
        </div>
      )}
    </div>
  );
}

export default function TestimonialContent() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      }
    >
      <TestimonialList />
    </Suspense>
  );
}
