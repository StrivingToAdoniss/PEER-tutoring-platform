import React, { useEffect } from 'react';
import '../styles/Navbar.css'; // Import the same CSS file

const NavLink = ({ href, children }) => {
  useEffect(() => {
    // Get all links with the class 'custom-nav-link'
    const links = document.querySelectorAll('.custom-nav-link');

    // Add an event listener to each link
    links.forEach(link => {
      link.addEventListener('click', function () {
        // Remove the 'active' class from all links
        links.forEach(l => l.classList.remove('active'));

        // Add the 'active' class to the clicked link
        this.classList.add('active');
      });
    });

    // Cleanup event listeners on component unmount
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', function () {
          links.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        });
      });
    };
  }, []);

  return (
    <a href={href} className="custom-nav-link">
      {children}
    </a>
  );
};

export default NavLink;
