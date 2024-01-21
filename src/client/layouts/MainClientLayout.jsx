import Header from '@/common/components/Header'
import Footer from '@/common/components/Footer'
import Navbar from '@/common/components/Navbar'
export default function MainClientLayout({ children }) {
  return (
    <div>
      <Header>
        <Navbar></Navbar>
      </Header>
      {children}
      <Footer />
    </div>
  )
}
