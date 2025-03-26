import { useEffect } from 'react';

const useExternalLinkHandler = () => {
  useEffect(() => {
    const handleLinkClick = (event) => {
      // Closest parent <a> element ko dhundhna
      const anchor = event.target.closest('a');
      if (anchor) {
        const linkUrl = new URL(anchor.href);
        // Agar link ka hostname aapke current hostname se different hai, toh external samjho
        if (linkUrl.hostname !== window.location.hostname) {
          event.preventDefault();
          window.open(anchor.href, '_blank');
        }
      }
    };

    // Document par event listener lagao
    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);
};

export default useExternalLinkHandler;
