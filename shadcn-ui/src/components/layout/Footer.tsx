import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SimpliOptions</h3>
            <p className="text-sm text-muted-foreground">
              Simplifying options trading with plain language and intuitive tools for casual retail traders.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/trade" className="text-sm text-muted-foreground hover:text-foreground">
                  Trade Options
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-foreground">
                  Portfolio Management
                </Link>
              </li>
              <li>
                <Link to="/screener" className="text-sm text-muted-foreground hover:text-foreground">
                  Options Screener
                </Link>
              </li>
              <li>
                <Link to="/paper-trading" className="text-sm text-muted-foreground hover:text-foreground">
                  Paper Trading
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/education" className="text-sm text-muted-foreground hover:text-foreground">
                  Learning Center
                </Link>
              </li>
              <li>
                <Link to="/glossary" className="text-sm text-muted-foreground hover:text-foreground">
                  Options Glossary
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SimpliOptions. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-muted-foreground">
              Options trading involves risk and is not suitable for all investors. 
              SimpliOptions is a demo project and not a real trading platform.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;