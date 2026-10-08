"use client";

import Footer from "./footer";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <div className="fixed top-2 right-2 bg-yellow-400 text-black px-3 py-1 rounded-md shadow-md text-xs font-bold z-50">
        {process.env.NEXT_PUBLIC_APP_ENV}
      </div>
      {children}
      <Footer />
    </>
  );
};

export default AdminLayout; 
