import React from "react";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, addresses } = useAppContext();
  const navigate = useNavigate();

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center"
      >
        <img
          src={assets.profile_icon}
          alt="Login Required"
          className="w-24 mb-4 opacity-50"
        />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Connexion Requise
        </h2>
        <p className="text-gray-500 mb-4">
          Veuillez vous connecter pour voir votre profil
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full transition"
        >
          Se Connecter
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Mon Profil</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Informations Personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Nom</p>
                <p className="text-gray-800 font-medium">{user.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Adresses de Livraison
              </h2>
              <button
                onClick={() => navigate("/add-address")}
                className="text-primary hover:text-primary-dull text-sm font-medium flex items-center gap-2"
              >
                <span>Ajouter une adresse</span>
                <img
                  src={assets.add_icon}
                  alt="Add"
                  className="w-4 h-4 opacity-80"
                />
              </button>
            </div>
            <div className="space-y-4">
              {addresses && addresses.length > 0 ? (
                addresses.map((address) => (
                  <div
                    key={address._id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {address.street}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {address.city}, {address.state} {address.pincode}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {address.country}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/edit-address/${address._id}`)}
                        className="text-primary hover:text-primary-dull text-sm font-medium"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune adresse enregistrée</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
