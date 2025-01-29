import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Test from './components/test';
import Home from './Pages/Home';
import LaunchTokens from './Pages/LaunchTokens';
import Profile from './Pages/Profile';
import ComingSoon from './Pages/ComingSoon';
import HowItWorks from './Pages/HowItWorks';
import RevealsBestPerformers from './Pages/RevealsBestPerformers';
import UserProfile from './Pages/UserProfile';
import Threads from './Pages/Threads';
import TaskBar from './components/TaskBar/TaskBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsOfService from './Pages/TermsOfService';
import LaunchTokenSolana from './Pages/LaunchTokenSolana';

function App() {
  // localStorage.setItem('blockchain', 'SOL')
  const block = localStorage.getItem('blockchain')

  return (
    <>
      <Router>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route index path='/' element={<Home />} />
          <Route index path='/Test' element={<Test />} />
          <Route path='/launchToken' element={block ==='SOL'?<LaunchTokenSolana />:<LaunchTokens />} />
          <Route path='/editprofile' element={<Profile />} />
          <Route path='/userprofile/:id' element={<UserProfile />} />
          <Route path='/comingSoon' element={<ComingSoon />} />
          <Route path='/howitworks' element={<HowItWorks />} />
          <Route path='/revealsBestPerformers' element={<RevealsBestPerformers />} />
          <Route path='/trade/:id/:tokenid' element={<Threads />} />
          <Route path='/docs/privacy-policy' element={<PrivacyPolicy/>} />
          <Route path='/docs/terms-and-conditions' element={<TermsOfService/>} />
        </Routes>
        <Footer />
        <TaskBar />
      </Router>
    </>
  );
}

export default App;