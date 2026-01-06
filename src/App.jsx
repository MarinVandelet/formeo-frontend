import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CategoryFormationsPage from "./pages/CategoryFormationsPage.jsx";
import FormationSessionsPage from "./pages/FormationSessionsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Salle from "./pages/Salle.jsx";
import MentionsLegalesPage from "./pages/legal/MentionsLegalesPage.jsx";
import PolitiqueConfidentialitePage from "./pages/legal/PolitiqueConfidentialitePage.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/categories/:id" element={<CategoryFormationsPage />} />
          <Route path="/formations/:id/sessions" element={<FormationSessionsPage />}/>
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />}/>
          <Route path="/salle" element={<Salle />} />
          <Route path="/salle/:sessionId" element={<Salle />} /> 
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/paiement/success" element={<PaymentSuccessPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
