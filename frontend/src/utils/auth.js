export const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken; // Return true if the token exists
  };
  