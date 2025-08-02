import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  FaTimes,
  FaChevronLeft,
  FaWallet,
  FaBook,
  FaGift,
  FaHeadset,
  FaUser,
  FaSignOutAlt,
  FaInfoCircle,
  FaUsers,
  FaVideo,
  FaBookOpen,
  FaBlog,
  FaSignInAlt,
  FaGraduationCap,
  FaStar,
} from "react-icons/fa"
import { MdHome, MdExplore } from "react-icons/md"
import { Link } from "react-router-dom"
import { FaArrowTrendUp } from "react-icons/fa6"
import axios from "axios";
import { BASE_URL } from "../utils/utils";

// Animation variants
const slideIn = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.3,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

  const bookDetails = [
    {
      title: "Freelancing Road To 1 lakhs",
      image: "/specialBundle1.png",
      titleColor: "#F2B46F",
      link: "basicBundle",
    },
    {
      title: "Freelancing Road To 3 Lakhs",
      image: "/specialBundle2.png",
      titleColor: "#88BD9F",
      link: "intermediateBundle",
    },
    {
      title: "Freelancing Road To 5 Lakhs",
      image: "/specialBundle3.png",
      titleColor: "#7C42B0",
      link: "advanceBundle",
    },
  ];

const Sidebar = ({ isOpen, onClose, isLoggedIn, bundles, specialBundles, trendingCourses, allCourses, logout }) => {
  const [view, setView] = useState("main")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const [activeItem, setActiveItem] = useState("")

  const [digitalBundles, setDigitalBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/digitalBundle/getDigitalBundles`);
        
        
        setDigitalBundles(response.data.data.bundles); // pick first 3 bundles only
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.error("Error fetching bundles:", error);
      }
    };
    fetchBundles();
  }, []);

  

  const mergedBundles = [...digitalBundles].reverse().map((digitalBundles, index) => ({
    ...bookDetails[index],
    ...digitalBundles,
    _id: digitalBundles._id || `fallback-${index}`,
    title: bookDetails[index].title || digitalBundles.bundleName,
    link: bookDetails[index]?.link || "fallback-link"

  }));

  
  


  const coursesData = [
    {
      category: "SPECIAL BUNDLES",
      id: "specialBundles",
      icon: <FaBook />,
      courses: bundles.map((bundle) => ({
        key: bundle?._id,
        id: bundle?._id,
        title: bundle?.bundleName,
        link: `/bundle/${bundle?._id}`
      }))
    },
    {
      category: "TRENDING COURSES",
      id: "trending",
      icon: <FaArrowTrendUp />,
      courses: trendingCourses?.map((course) => ({
        key: course?._id,
        id: course?._id,
        title: course?.title,
        link: `/course/${course?._id}`,
      }))
    },
    {
      category: "DIGITAL LEARNING BUNDLES",
      id: "digital",
      icon: <FaStar />,
      courses: mergedBundles?.map((bundle) => ({
        key: bundle?._id,
        id: bundle?._id,
        title: bundle?.title,
        link: `/digitallearningbundles/${bundle.link}/${bundle._id}`,
      }))
    },
    {
      category: "CHOOSE YOUR SKILL",
      id: "skills",
      icon: <FaBookOpen />,
      courses: allCourses?.map((course) => ({
        key: course?._id,
        id: course?._id,
        title: course?.title,
        link: `/course/${course?._id}`,
      }))
    }
  ]

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("main")
        setSelectedCategory(null)
        setSelectedCourse(null)
        setBreadcrumbs([])
      }, 200)
    }
  }, [isOpen])

  const handleRouteChange = (path) => {
    setActiveItem(path)
    setTimeout(() => {
      onClose(false)
    }, 20)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar")
      const overlay = document.getElementById("sidebar-overlay")
      if (isOpen && !sidebar.contains(event.target) && overlay.contains(event.target)) {
        onClose(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const navigateToCategories = () => {
    setView("categories");
  };

  const navigateToCourses = (category) => {
    setSelectedCategory(category);
    setView("courses");
  };

  const MenuItem = ({ icon, label, path, onClick }) => (
    <motion.button
      variants={itemVariants}
      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
        activeItem === path
          ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 font-medium"
          : "hover:bg-orange-50 text-gray-700 hover:text-orange-600"
      }`}
      onClick={() => (onClick ? onClick() : handleRouteChange(path))}
    >
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-lg ${
          activeItem === path
            ? "bg-orange-500 text-white"
            : "bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600"
        }`}
      >
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </motion.button>
  )

  const renderMainMenu = () => (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={slideIn} className="flex flex-col space-y-1 w-full">
      {isLoggedIn ? (
        <>
          <Link to={"/dashboard/profile/personalinformation"}><MenuItem icon={<FaUser />} label="Personal Info" path="/dashboard/profile" /></Link>
          <Link to={"/dashboard/profile/invoices"}><MenuItem icon={<FaUser />} label="Invoices" path="/dashboard/profile/invoices" /></Link>
          <Link to={"/dashboard/profile/privacyandsecurity"}><MenuItem icon={<FaUser />} label="Privacy" path="/dashboard/profile/privacyandsecurity" /></Link>
          <Link to={"/about"}><MenuItem icon={<FaInfoCircle />} label="About" path="/about" /></Link>
          <Link to={"/dashboard/mywallet"}><MenuItem icon={<FaWallet />} label="My Wallet" path="/dashboard/wallet" /></Link>
          <Link to={"/dashboard/mycourses"}><MenuItem icon={<FaBook />} label="My Courses" path="/dashboard/courses" /></Link>
          <Link to={"/dashboard/refer&earn"}><MenuItem icon={<FaGift />} label="Refer & Earn" path="/dashboard/refer&earn" /></Link>
          <Link to={"/dashboard/help&support"}><MenuItem icon={<FaHeadset />} label="Help & Support" path="/dashboard/support" /></Link>
          <Link to={"webinars"}><MenuItem icon={<FaVideo />} label="Webinars" path="/webinars" /></Link>
          <Link to={"/blogs"}><MenuItem icon={<FaBlog />} label="Blogs" path="/blogs" /></Link>

          <motion.div variants={itemVariants} className="pt-4 px-3">
            <button
              onClick={logout}
              className="w-full text-center border border-orange-500 text-orange-500 flex items-center justify-center gap-2 py-3 px-4 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <FaSignOutAlt className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        </>
      ) : (
        <>
          <Link to={"/"}><MenuItem icon={<MdHome />} label="Home" path="/" /></Link>
          <Link to={"/about"}><MenuItem icon={<FaInfoCircle />} label="About" path="/about" /></Link>
          <MenuItem icon={<FaGraduationCap />} label="Courses" path="/courses" onClick={navigateToCategories} />
          <Link to={"/courses"}><MenuItem icon={<MdExplore />} label="Explore" path="/course" /></Link>
          <Link to={"/webinars"}><MenuItem icon={<FaVideo />} label="Webinars" path="/webinars" /></Link>
          <Link to={"/blogs"}><MenuItem icon={<FaBlog />} label="Blogs" path="/blogs" /></Link>
          <motion.div variants={itemVariants} className="pt-4 px-3">
            <Link to={"/login"}>
              <button className="w-full text-center border border-orange-500 text-orange-500 flex items-center justify-center gap-2 py-3 px-4 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 text-sm font-medium mb-3 mt-5" onClick={()=>onClose(false)}>
                <FaSignInAlt className="w-4 h-4 " /> Login
              </button>
            </Link>
            <Link to={"/signup"}>
              <button className="w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center gap-2 py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg" onClick={()=>onClose(false)}>
                <FaSignInAlt className="w-4 h-4" /> Sign Up
              </button>
            </Link>
          </motion.div>
        </>
      )}
    </motion.div>
  )

  const renderCategoriesMenu = () => (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={slideIn} className="flex flex-col space-y-4 w-full">
      <button onClick={() => setView("main")} className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition">
        <FaChevronLeft /> Back to Main Menu
      </button>
      {coursesData.map((category) => (
        <motion.div
          key={category.id}
          variants={itemVariants}
          className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-orange-50 rounded-lg"
          onClick={() => navigateToCourses(category)}
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            {category.icon}
          </div>
          <h3 className="font-semibold text-sm text-gray-800">
            {category.category}
          </h3>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderCoursesMenu = () => (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={slideIn} className="flex flex-col space-y-4 w-full">
      <button onClick={() => setView("categories")} className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition">
        <FaChevronLeft /> Back to Categories
      </button>
      <h3 className="font-semibold text-lg px-4">
        {selectedCategory?.category}
      </h3>
      {selectedCategory?.courses.map((course) => (
        <Link to={course.link} key={course.id} onClick={() => handleRouteChange(course.link)}>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-orange-50 rounded-lg"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <FaBook />
            </div>
            <h4 className="text-sm text-gray-800">{course.title}</h4>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div id="sidebar-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <motion.div id="sidebar" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-50 rounded-full -ml-40 -mb-40 opacity-50"></div>

            <div className="relative z-10 flex items-center justify-between p-5 border-b border-gray-100">
              {breadcrumbs.length > 0 ? (
                <div className="flex items-center gap-3">
                  <button onClick={breadcrumbs[breadcrumbs.length - 1].action} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <FaChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="font-medium text-gray-800">
                    {view === "subcourses" ? selectedCourse?.title : breadcrumbs[breadcrumbs.length - 1].name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white">
                    <FaGraduationCap className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-gray-800">JoshGuru</span>
                </div>
              )}
              <button onClick={() => onClose(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200">
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 relative z-10">
              <AnimatePresence mode="wait">
                {view === "main" && renderMainMenu()}
                {view === "categories" && renderCategoriesMenu()}
                {view === "courses" && renderCoursesMenu()}
              </AnimatePresence>
            </div>

            <div className="relative z-10 p-4 border-t border-gray-100 bg-white">
              <div className="text-xs text-gray-500 text-center">© 2025 Josh Guru • All rights reserved</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
