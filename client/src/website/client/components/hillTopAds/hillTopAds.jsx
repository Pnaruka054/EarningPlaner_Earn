import React, { useEffect } from 'react';

const HillTopBannerAds = ({ id, src }) => {
  useEffect(() => {
    const div = document.getElementById(id);
    if (div && src) {
      // Create a new <script> element
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.referrerPolicy = 'no-referrer-when-downgrade';

      // Append the script to the div
      div.appendChild(script);
    }

    // Cleanup: Remove the script when the component unmounts
    return () => {
      const script = document.querySelector(`script[src='${src}']`);
      if (script) {
        script.remove();
      }
    };
  }, [id, src]); // Depend on id and src to ensure it updates if either changes

  return <div id={id}></div>;
};

export default HillTopBannerAds;
