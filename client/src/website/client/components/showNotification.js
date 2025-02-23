import Swal from 'sweetalert2';

const showNotification = (isError, message, autoClose = false) => {
    Swal.fire({
        toast: true,
        position: 'top-end', // Top-right position
        icon: isError ? 'error' : 'success',
        title: message,
        showConfirmButton: false,
        timer: autoClose ? null : 3000 
    });
};

export default showNotification;
