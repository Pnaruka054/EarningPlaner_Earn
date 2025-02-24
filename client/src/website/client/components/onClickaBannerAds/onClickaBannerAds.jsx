import { useEffect, useRef } from "react";

const OnClickaBannerAds = ({ banner_id }) => {
    const adContainerRef = useRef(null);

    useEffect(() => {
        // Pehle ensure karo ki koi purana script na ho
        document.querySelectorAll('script[data-admpid="288643"]').forEach(script => script.remove());

        // Ensure karo ki script ek hi baar inject ho
        if (!document.querySelector('script[data-admpid="288643"]')) {
            const script = document.createElement("script");
            script.src = "https://js.onclckmn.com/static/onclicka.js";
            script.setAttribute("async", "true");
            script.setAttribute("data-admpid", "288643");

            // Ad container ke andar script inject karna
            if (adContainerRef.current) {
                adContainerRef.current.innerHTML = ""; // Purana content clear karo
                adContainerRef.current.appendChild(script);
            }
        }
    }, []);

    return <div ref={adContainerRef} data-banner-id={banner_id}></div>;
};

export default OnClickaBannerAds;
