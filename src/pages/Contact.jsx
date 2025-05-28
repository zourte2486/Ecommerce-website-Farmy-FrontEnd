import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Contact = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen px-4 py-12 max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-center mb-12">Contactez-nous</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Phone */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FaPhone className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
            <p className="text-gray-600">+212 6 23 45 67 89</p>
            <p className="text-gray-600">Lun-Ven: 9h-18h</p>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FaEnvelope className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600">contact@farmy.fr</p>
            <p className="text-gray-600">support@farmy.fr</p>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FaMapMarkerAlt className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Adresse</h3>
            <p className="text-gray-600">123 Rue du Commerce</p>
            <p className="text-gray-600">75015 Safi, maroc</p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Heures d'ouverture
        </h2>
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-gray-600">Lundi - Vendredi:</p>
            <p className="text-gray-800">9h00 - 18h00</p>
            <p className="text-gray-600">Samedi:</p>
            <p className="text-gray-800">10h00 - 16h00</p>
            <p className="text-gray-600">Dimanche:</p>
            <p className="text-gray-800">Fermé</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
