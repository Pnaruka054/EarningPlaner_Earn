import { useEffect, useState } from "react";

const ReferrerCheck = () => {
  const [referrer, setReferrer] = useState("");

  useEffect(() => {
    const ref = document.referrer;
    
    if (ref && !ref.includes(window.location.hostname)) {
      setReferrer(ref);
    }
  }, []);

  return (
    <div>
      {referrer ? (
        <p>User is coming from: <strong>{referrer}</strong></p>
      ) : (
        <p>No external referrer detected.</p>
      )}
    </div>
  );
};

export default ReferrerCheck;
