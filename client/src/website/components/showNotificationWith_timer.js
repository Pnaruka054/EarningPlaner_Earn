import Swal from 'sweetalert2';

const showNotificationWith_timer = (isError, message, route = null, navigate, timer = 3000) => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: isError ? 'error' : 'success',
        title: message,
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
    });

    if (route) {
        navigate(route); // Alert show karte hi turant navigate ho jayega
    }
};

export default showNotificationWith_timer;
