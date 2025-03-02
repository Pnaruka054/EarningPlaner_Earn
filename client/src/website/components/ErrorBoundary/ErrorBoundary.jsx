import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Error ko catch karke state update karen
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Yahan error logging service ka use kar sakte hain
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Yahan aap apna custom error page ya message render kar sakte hain
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
            {/* Browser Upgrade Message */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2">
                Upgrade Your Browser
              </h2>
              <p className="text-gray-600">
                It looks like you might be using an outdated browser. For the best experience, please update to the latest version of modern browsers such as
                <span className="font-semibold"> Chrome, Firefox, Edge, or Safari.</span>
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h1 className="text-3xl font-extrabold text-red-600 mb-4">
                Something went wrong.
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                We are sorry for the inconvenience. Please try again later.
              </p>
              <p className="text-sm text-gray-600">
                To report this error, please WhatsApp us at{" "}
                <a
                  href="https://wa.me/918003398228"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  +91 8003398228
                </a>
              </p>
            </div>
          </div>
        </div>
      );

    }
    return this.props.children;
  }
}

export default ErrorBoundary;
