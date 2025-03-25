const TrustpilotWidget = ({ rating = 4.3 }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const partialStarPercentage = (rating - fullStars) * 100;

  return (
    <div className="flex justify-center items-center">
      <a
        href="https://www.trustpilot.com/review/earnwiz.in"
        target="_blank"
        rel="noopener"
        className="cursor-pointer"
      >
        <div className="flex items-center border border-yellow-300 rounded-full px-4 py-2 shadow-sm bg-transparent">
          <div className="flex items-center mr-3">
            {[...Array(totalStars)].map((_, i) => {
              if (i < fullStars) {
                // Fully filled star
                return (
                  <svg
                    key={i}
                    className="w-4 h-4 mr-1 cursor-pointer text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    title="Click to leave a review"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.945 5.955 6.565.955-4.755 4.635 1.123 6.545z" />
                  </svg>
                );
              } else if (i === fullStars && partialStarPercentage > 0) {
                // Partially filled star with dynamic percentage
                return (
                  <svg
                    key={i}
                    className="w-4 h-4 mr-1 cursor-pointer"
                    viewBox="0 0 20 20"
                    title="Click to leave a review"
                  >
                    <defs>
                      <linearGradient id={`partialStar-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={`${partialStarPercentage}%`} stopColor="yellow" />
                        <stop offset={`${partialStarPercentage}%`} stopColor="gray" />
                      </linearGradient>
                    </defs>
                    <path
                      fill={`url(#partialStar-${i})`}
                      d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.945 5.955 6.565.955-4.755 4.635 1.123 6.545z"
                    />
                  </svg>
                );
              } else {
                // Unfilled star
                return (
                  <svg
                    key={i}
                    className="w-4 h-4 mr-1 cursor-pointer text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    title="Click to leave a review"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.945 5.955 6.565.955-4.755 4.635 1.123 6.545z" />
                  </svg>
                );
              }
            })}
          </div>
          <span className="text-white font-semibold text-sm">{rating}/5 on Trustpilot</span>
        </div>
      </a>
    </div>
  );
};

export default TrustpilotWidget;
