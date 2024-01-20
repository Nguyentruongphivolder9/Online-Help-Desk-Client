import Header from '@/common/components/Header'
import Footer from '@/common/components/Footer'
export default function MainClientLayout({ children }) {
  return (
    <div>
      <Header></Header>
      MainLayout
      {children}
      <Footer />
    </div>
  )
}
