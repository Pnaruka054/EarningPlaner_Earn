
const OnClickaVideoAds = (src, dataAdmpid) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    script.setAttribute('data-admpid', dataAdmpid);
    document.body.appendChild(script);
}


export default OnClickaVideoAds;
