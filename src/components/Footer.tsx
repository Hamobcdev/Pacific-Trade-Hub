import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-teal-800 text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Pacific Trade Hub</h3>
          <p>A regulated marketplace for Pacific goods.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-gray-200">Contact Us</a></li>
            <li><a href="#" className="hover:text-gray-200">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-gray-200">Terms of Service</a></li>
            <li><a href="#" className="hover:text-gray-200">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Newsletter</h3>
          <input type="email" placeholder="Your email" className="w-full p-2 rounded-lg text-black" />
          <button className="btn-primary mt-2 w-full">Subscribe</button>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>&copy; 2025 Pacific Trade Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;