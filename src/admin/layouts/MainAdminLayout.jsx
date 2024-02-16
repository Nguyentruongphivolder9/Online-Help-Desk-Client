import Footer from '@/common/components/Footer'
import Header from '@/common/components/Header'
import Navbar from '@/common/components/Navbar'
import React from 'react'

export default function MainAdminLayout({ children }) {
  return (
    <div>
      <Header>
        <Navbar></Navbar>
      </Header>
      {children}
      <Footer></Footer>
    </div>
  )
}
