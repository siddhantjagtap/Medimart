// App.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from './Components/Loader';
import GotoTop from './Components/GotoTop';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import { AuthProviderWithNavigation } from './Components/AuthProvider';
import { CartProvider } from './Components/CartProvider';
import ResetPassword from './pages/ResetPassword';
import FAQ from './Components/FAQ';


const Profile = lazy(() => import('./pages/Profile'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Login = lazy(() => import('./pages/Login'));
const ForgetPassword = lazy(() => import('./pages/ForgetPassword'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Category = lazy(() => import('./pages/Category'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const OrderPlaced = lazy(() => import('./pages/OrderPlaced'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Address = lazy(() => import('./pages/Address'));
const PrivacyPolicyTermsCondition = lazy(() => import('./pages/PrivacyPolicyTermsCondition'));

const AppWrapper = () => {
  const navigate = useNavigate();

  return (
    <AuthProviderWithNavigation navigate={navigate}>
      <CartProvider>
        <div className='font-Poppins'>
          <Suspense fallback={<Loader />}>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/Shop/:pg?" element={<Shop />} />
              <Route exact path="/Login" element={<Login />} />
              <Route exact path="/verifyOTP" element={<VerifyOTP />} />
              <Route exact path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route exact path="/Register" element={<Register />} />
              <Route path="/:subCategory/:formattedName" element={<Category />} />
              <Route exact path="/cart" element={<Cart />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/contact" element={<Contact />} />
              <Route exact path="*" element={<ErrorPage />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/checkout" element={<Checkout />} />
              <Route path="/orderplaced/:orderId" element={<OrderPlaced />} />
              <Route exact path="/orderhistory" element={<OrderHistory />} />
              <Route exact path="/address" element={<Address />} />
              <Route exact path="/faq" element={<FAQ />} />
              <Route exact path="/PrivacyPolicyTermsCondition" element={<PrivacyPolicyTermsCondition />} />
            </Routes>
            <GotoTop />
            <Footer />
          </Suspense>
        </div>
      </CartProvider>
    </AuthProviderWithNavigation>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
