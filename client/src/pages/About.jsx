import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addMentors } from "@/features/mentors/mentorSlice";
import axios from "axios";
import { BASE_URL } from "../utils/utils";

const About = () => {
  const dispatch = useDispatch();
  const mentors = useSelector((state) => state.mentor?.mentors[0] || []);
  const [selected, setSelected] = useState(null);
  const [team,setTeam]= useState([])
  const [aboutData, setAboutData] = useState({
    description:
      "Joshguru Technologies Private Limited is a new-age EdTech company dedicated to empowering youth with in-demand skills and guaranteed career growth. We offer offline and online Monday to Friday industry-relevant courses like: Digital Marketing, Full Stack Development, Microsoft 365, Odoo ERP. With placement assistance, internships, and international job support, our goal is to make every student job-ready. Whether you’re a fresher, working professional, or business owner, Joshguru is your trusted partner for skill development and success. We have more courses but all those courses for affiliates and that courses in recorded format only.",
      
    bannerImage: "/aboutus.jpeg",
    ourMission:
      "Joshguru’s mission is to provide skills development education to youth in every village and corner of India. Joshguru helps all capable youth to change their skills, their presence of mind and the lives of their families. We are here to provide skill-based learning to every interested student, professional, entrepreneur, or a person of any background at a very affordable price.",
    ourVision:
      "Our Vision is to make more and more youth independent so that they do not bother for jobs after 12th, and can live their life in a better way and to upskill 10 lakh+ learners by 2030 through high-quality, practical education.",
    founderImage: "/founder.jpeg",
    aboutFounder:
      "Kamal Joshi, the Founder and Managing Director of Joshguru Pvt. Ltd, has 10+ years of experience in the marketing industry. A professional networker who began his journey in direct selling at age 24, Kamal has empowered youth to become independent and successful through education and entrepreneurship.",
  });

  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/mentors/getAllMentors`, {
        withCredentials: true,
      });
      const mentorList = response.data.data.mentors;
      dispatch(addMentors(mentorList));
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  const fetchAboutData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/about`, {
        withCredentials: true,
      });
      const data = res.data?.data;
      if (data) {
        setAboutData((prev) => ({
          ...prev,
          description: data?.description || prev.description,
          bannerImage: data?.bannerImage || prev.bannerImage,
          ourMission: data?.ourMission || prev.ourMission,
          ourVision: data?.ourVision || prev.ourVision,
          founderImage: data?.founderImage || prev.founderImage,
          aboutFounder: data?.aboutFounder || prev.aboutFounder,
        }));
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };
  const fetchManagement = async () => {

    try {
      const response = await axios.get(`${BASE_URL}/management/getTeam`, {
        withCredentials: true,
      });
      const teamList = response.data.data;
      console.log(teamList)
      setTeam(teamList)
      // dispatch(addMentors(teamList));
    } catch (error) {
      console.error("Error fetching management team:", error);
    }
  };
  useEffect(() => {
    if (mentors.length === 0) {
      fetchMentors();
    }
    if(team.length ===0){
      fetchManagement()
    }
    fetchManagement()
    fetchAboutData();
  }, []);

  const galleryData = [
    {
      title: "Events",
      image: "/event1.webp",
      path: "/Events",
    },
    {
      title: "Trips",
      image: "/event2.webp",
      path: "/Trips",
    },
    {
      title: "Ocassions",
      image: "/event3.webp",
      path: "/Ocassions",
    },
  ];

  return (
    <section className="px-4 md:px-10 lg:px-20 py-10 bg-gradient-to-b from-gray-50 to-white mt-20">
      <div className="flex flex-col items-center gap-12">

        {/* About Banner */}
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={aboutData.bannerImage}
            alt="About us"
            className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* About Text */}
        <motion.div
          className="text-justify text-base md:text-lg lg:text-xl mt-4 max-w-5xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-700 leading-relaxed">
            {aboutData.description}
          </p>
        </motion.div>

        {/* Founder Section */}
        <div className="w-full max-w-6xl flex flex-col  items-center gap-8">
          <motion.div
            className="md:w-1/2 text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-black">Our </span>
              <span className="text-orange-500">Management Team</span>
            </h2>
            {/* <div className="overflow-hidden rounded-xl shadow-2xl hover:scale-105 transition duration-300">
              <img src={aboutData.founderImage} alt="Founder" className="h-96 w-full object-cover" />
            </div> */}
          </motion.div>
          <div className="sm:flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-thin scrollbar-thumb-orange-300 pb-2 sm:pb-0">
    {team.map((member, index) => (
      <motion.div
        key={member?._id}
        className="min-w-[260px] sm:min-w-[300px] bg-gradient-to-tr from-white/80 to-orange-50/80 backdrop-blur-lg rounded-2xl border border-orange-100 shadow-md hover:shadow-lg hover:scale-[1.02] hover:-rotate-1 transition-all duration-300 flex-shrink-0 p-6 mx-auto flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        onClick={() => setSelected(member)}
      >
        <img
          src={member?.image || "/placeholder.svg"}
          alt={member.name}
          className="w-28 h-28 sm:w-32 sm:h-32 mb-5 rounded-full object-cover border-4 border-orange-400 shadow-lg"
        />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {member?.name}
        </h3>
        <p className="text-sm sm:text-base text-orange-600 font-medium mt-1">
          {member?.role}
        </p>
      </motion.div>
    ))}
  </div>

        </div>

        {/* Mission Section */}
        <motion.div
          className="w-full max-w-6xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-black">Our </span>
            <span className="text-orange-500">Mission</span>
          </h2>
          <p className="text-gray-700 text-justify text-base md:text-lg leading-relaxed">
            {aboutData.ourMission}
          </p>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          className="w-full max-w-6xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white shadow-md rounded-xl p-6 mt-4 relative">
            <p className="text-gray-600 text-base md:text-lg leading-relaxed italic relative">
              <span className="text-6xl text-orange-400 absolute -top-6 -left-4">“</span>
              <span className="mx-6 block">{aboutData.ourVision}</span>
              <span className="text-6xl text-orange-400 absolute -bottom-6 right-4 rotate-180">“</span>
            </p>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-6">
            <span className="text-black">Meet Our </span>
            <span className="text-orange-500">Team</span>
          </h2>

          <div className="flex gap-6 px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-orange-300 pb-4">
            {mentors.map((member, index) => (
              <motion.div
                key={member?._id}
                className="min-w-[260px] max-w-[280px] bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex-shrink-0 cursor-pointer flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => setSelected(member)}
              >
                <img
                  src={member?.profileImage || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 mb-4 rounded-full object-cover border-4 border-orange-400"
                />
                <h3 className="text-lg font-bold text-gray-800">{member?.name}</h3>
                <p className="text-orange-500 font-medium">{member?.position}</p>
              </motion.div>
            ))}
          </div>

          {selected && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-[90vw] relative text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-orange-500 text-2xl font-bold"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <img
                  src={selected?.profileImage || "/placeholder.svg"}
                  alt={selected.name}
                  className="w-28 h-28 mb-4 rounded-full object-cover border-4 border-orange-400 mx-auto"
                />
                <h3 className="text-2xl font-bold text-gray-800">{selected?.name}</h3>
                <p className="text-orange-500 font-medium mb-2">{selected?.position}</p>
                <p className="text-gray-700 mt-4">{selected?.about}</p>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Gallery Section */}
        <section className="w-full max-w-7xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-8">
            <span className="text-black">Our </span>
            <span className="text-orange-500">Gallery</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
            {galleryData.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-xl shadow-xl hover:shadow-2xl bg-white"
              >
                <Link to={`/gallery${item.path}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.date}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default About;
