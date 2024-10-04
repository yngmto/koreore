import { toast } from "react-toastify";

export function errorToast  (message) {
    toast.error(message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }});
  }

export function successToast  (message) {
    toast.success(message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }});
  }