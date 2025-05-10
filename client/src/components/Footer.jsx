function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-800 to-purple-900 text-white py-12 px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">About Us</h2>
          <p className="text-sm text-gray-300">
            We are dedicated to providing AI-driven solutions to enhance
            learning experiences and empower individuals to achieve their goals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="/about"
                className="text-sm hover:text-gray-200 transition"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/features"
                className="text-sm hover:text-gray-200 transition"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-sm hover:text-gray-200 transition"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="text-sm hover:text-gray-200 transition"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="text-sm text-gray-300">Email: support@yourbrand.com</p>
          <p className="text-sm text-gray-300">Phone: +1 (123) 456-7890</p>
          <div className="mt-4 flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <i className="fab fa-linkedin-in text-xl"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 border-t border-gray-700"></div>

      {/* Copyright */}
      <div className="mt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} YourBrand. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;