import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage.jsx'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import UserAuth from './pages/UserAuth.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Footer from './components/Footer.jsx'
import Account from './pages/Account.jsx'
import Checkout from './pages/Checkout.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import Faqs from './pages/Faqs.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import OrderStatus from './pages/OrderStatus.jsx'
import ContactUs from './pages/ContactUs.jsx'
import ReturnsRefunds from './pages/ReturnsRefunds.jsx'
import AboutUs from './pages/AboutUs.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
   
      <ScrollToTop />
        <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/account' element={<Account />} />
          <Route path='/user-login' element={<UserAuth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/check-out' element={<Checkout />} />
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path='/faqs' element= {<Faqs />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={ <TermsAndConditions /> } />
          <Route path='/contact' element={ <ContactUs /> } />
          <Route path='/returns' element={ <ReturnsRefunds /> } />
          <Route path='/about' element={ <AboutUs /> } />

        </Routes>
      </main>
      <WhatsAppButton />
      
      <Footer />
     
    </div>
  )
}

export default App
