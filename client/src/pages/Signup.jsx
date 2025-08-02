import React, { useState, useEffect ,useMemo} from 'react';
import { FiEye, FiEyeOff, FiXCircle } from 'react-icons/fi';
import { Loader } from 'lucide-react';
import { useNavigate, useLocation, Link, redirect } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/utils';
import { motion } from 'framer-motion';
import { setUser } from "../features/user/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import Payment from '@/components/Payment';
import CourseBundleSelection from "../components/CourseBundleSelection";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Redirect if already logged in
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user && user.email) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const courseId = queryParams.get('courseId');
  const typeParam = queryParams.get('type') || 'bundle';
  const levelParam = queryParams.get('level');

  const bundles = useSelector((state) => state.bundle?.bundles[0] || []);
  const courses = useSelector((state) => state.course?.courses[0] || []);
  const cartItems = useSelector((state) => state.cart.cart);

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [referralCode, setReferralCode] = useState(queryParams.get('referralCode') || '');

  const steps = ['Info', 'Course', 'Payment'];

  const [digitalBundles, setDigitalBundles] = useState([]);

  useEffect(() => {
    const fetchBundles = async () => {
      
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/digitalBundle/getDigitalBundles`);

        
        setDigitalBundles(response.data.data.bundles);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorMsgs([error.message]);
        console.error("Error fetching bundles:", error);
      }
    };
    fetchBundles();
  }, []);

  // console.log("Digital Bundles:", digitalBundles);
  
  
  const specialBundles = useMemo(() => {
    return digitalBundles.slice().reverse();
  }, [digitalBundles]);
  const [selectedCourse, setSelectedCourse] = useState(() => {
    if (typeParam === 'cart') return cartItems;
    return {}; // temporary placeholder
  });
  
  // 3. Update selectedCourse once specialBundles (or other data) are available
  useEffect(() => {
    if (typeParam === 'specialbundle' && specialBundles.length >= 3) {
      const data = getSpecialBundleData(levelParam, specialBundles);
      setSelectedCourse(data);
    }
  
    if ((typeParam === 'course' || typeParam === 'bundle') && courseId) {
      const sourceList = typeParam === 'course' ? courses : bundles;
      const found = sourceList.find((item) => item._id === courseId);
      if (found) setSelectedCourse(found);
    }
  }, [specialBundles, typeParam, levelParam, courseId, courses, bundles]);
 
  const getSpecialBundleData = (level, specialBundles) => {
    switch (level) {
      case 'basic':
        return { 
          title: 'Basic Bundle', 
          image: '/specialBundle1.png', 
          price: specialBundles[0]?.discountPrice || 49999 
        };
      case 'intermediate':
        return { 
          title: 'Intermediate Bundle', 
          image: '/specialBundle2.png', 
          price: specialBundles[1]?.discountPrice || 79999 
        };
      case 'advance':
        return { 
          title: 'Advance Bundle', 
          image: '/specialBundle3.png', 
          price: specialBundles[2]?.discountPrice || 99999 
        };
      default:
        return null;
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    if ((typeParam === 'course' && courses.length > 0) || (typeParam === 'bundle' && bundles.length > 0)) {
      if (courseId) {
        const found = (typeParam === 'course'
          ? courses.find((c) => c._id === courseId)
          : bundles.find((b) => b._id === courseId)
        );
        if (found) setSelectedCourse(found);
      }
    }
  }, [courseId, typeParam, bundles, courses]);

  const checkUserExist = async (errors) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/checkuserexist`, { mobilenumber, email });
      if (res?.data?.statusCode === 200 && res?.data?.data == null) return;
    } catch (error) {
      errors.push(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleInitialSubmit = async () => {
    const errors = [];
    setLoading(true);

    if (!name.trim()) errors.push('Name is required.');
    if (!/^[0-9]{10}$/.test(mobilenumber)) {
      errors.push('Enter a valid 10-digit mobile number.');
    } else {
      await checkUserExist(errors);
    }

    if (!/.+@.+\..+/.test(email)) errors.push('Enter a valid email address.');
    if (password.length < 6) errors.push('Password must be at least 6 characters.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');

    if (errors.length > 0) {
      setErrorMsgs(errors);
    } else {
      setErrorMsgs([]);
      setStep(2);
    }

    setLoading(false);
  };

  const handleFinalSubmit=() => {
    setErrorMsgs([]);
    setLoading(true);
    
    setLoading(false);
    navigate('/login')

  };

  const itemsToShow = typeParam === 'cart'
    ? cartItems
    : typeParam === 'specialbundle'
      ? [getSpecialBundleData(levelParam, specialBundles)].filter(Boolean)
      : courseId
        ? [(typeParam === 'course' ? courses : bundles).find((item) => item._id === courseId)].filter(Boolean)
        : (typeParam === 'course' ? courses : bundles);

  if (typeParam === 'cart' && cartItems.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-gray-600">Please go back to the homepage and add some courses to your cart before continuing.</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Go to Homepage</Link>
      </div>
    );
  }
console.log(selectedCourse)
  return (
    <div className="bg-white lg:bg-gradient-to-br lg:from-orange-50 lg:to-blue-50 flex flex-col lg:flex-row items-center md:justify-center min-h-screen px-4 sm:px-6 mt-16">
      <div className="hidden lg:flex w-1/2 justify-start pr-8">
        <img src="/signup.jpg" alt="Signup" className="w-[90%] h-auto object-contain rounded-2xl" />
      </div>
      <div className="w-full max-w-screen-sm mx-auto bg-white lg:max-w-xl lg:shadow-xl lg:rounded-2xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 sm:mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-center mb-8 md:mb-10 bg-gradient-to-r from-orange-500 to-yellow-400 text-transparent bg-clip-text ">
          Signup to Joshguru
        </h2>

        <div className="flex justify-between items-center mb-10 px-2 lg:px-0">
          {steps.map((s, idx) => (
            <div key={s} className="flex-1 relative px-1">
              <motion.div
                className={`h-2 rounded-full ${step > idx ? '' : 'bg-gray-200'}`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.4 }}
                style={{
                  background: step > idx
                    ? 'linear-gradient(to right, #facc15, #f97316)'
                    : undefined,
                }}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-[-20px] text-xs sm:text-sm font-medium text-gray-600">
                {s}
              </div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleInitialSubmit(); }} className="space-y-4 text-sm sm:text-base">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="border p-2 sm:p-3 rounded w-full" required />
            <input type="tel" value={mobilenumber} pattern="[0-9]{10}" onChange={(e) => setMobileNumber(e.target.value)} placeholder="Mobile number" className="border p-2 sm:p-3 rounded w-full" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 sm:p-3 rounded w-full" required />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className="border p-2 sm:p-3 rounded w-full" minLength={6} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4 text-gray-500">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="border p-2 sm:p-3 rounded w-full" minLength={6} required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-4 text-gray-500">
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <input type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Referral code (optional)" className="border p-2 sm:p-3 rounded w-full" />
            <button type="submit" className="w-full bg-orange-500 text-white py-2 sm:py-3 rounded-md hover:bg-orange-600 transition" disabled={loading}>
              {loading ? <Loader size={20} className="animate-spin mx-auto" /> : 'Continue'}
            </button>

            {errorMsgs.length > 0 && (
              <div className="bg-red-100 text-red-700 border border-red-400 p-3 mt-4 rounded flex items-start gap-2">
                <FiXCircle className="mt-1" />
                <ul className="text-sm">
                  {errorMsgs.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <CourseBundleSelection
            itemsToShow={itemsToShow}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            typeParam={typeParam}
            setStep={setStep}
          />
        )}

        {step === 3 && (
          <div className="text-center">
            <Payment
              name={name}
              mobilenumber={mobilenumber}
              email={email}
              password={password}
              referralCode={referralCode}
              data={selectedCourse}
              type={typeParam}
              setStep={setStep}
              handleFinalSubmit={handleFinalSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;