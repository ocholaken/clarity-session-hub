export const handleBookSession = () => {
  const isLoggedIn = sessionStorage.getItem("user") || sessionStorage.getItem("token") || false;

  if (!isLoggedIn) {
    sessionStorage.setItem("redirectAfterLogin", "/booking");
    window.location.href = "/login";
    return;
  }

  window.location.href = "/booking";
};