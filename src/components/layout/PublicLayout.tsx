import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

/**
 * Public-facing shell: Navbar + animated page content + Footer.
 */
const PublicLayout: React.FC = () => (
  <>
    <Navbar />
    <PageTransition>
      <main>
        <Outlet />
      </main>
    </PageTransition>
    <Footer />
  </>
);

export default PublicLayout;
