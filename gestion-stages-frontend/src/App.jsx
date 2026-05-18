import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import StagiairesList from "./pages/stagiaires/StagiairesList";
import StagesList from "./pages/stages/StagesList";
import EntreprisesList from "./pages/entreprises/EntreprisesList";
import RapportsList from "./pages/rapports/RapportsList";
import UsersList from "./pages/users/UsersList";
import Profile from "./pages/users/Profile";
import FraisList from "./pages/frais/FraisList";
import Statistiques from "./pages/Statistiques";
import MinisteresList from "./pages/ministeres/MinisteresList";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login page FIRST */}
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/stagiaires"
          element={<Layout><StagiairesList/></Layout>}
        />

        <Route
          path="/stages"
          element={<Layout><StagesList/></Layout>}
        />

        <Route
          path="/entreprises"
          element={<Layout><EntreprisesList/></Layout>}
        />

        <Route
          path="/rapports"
          element={<Layout><RapportsList/></Layout>}
        />

        <Route
          path="/users"
          element={<Layout><UsersList/></Layout>}
        />

        <Route
          path="/profile"
          element={<Layout><Profile/></Layout>}
        />

        <Route
          path="/frais"
          element={<Layout><FraisList/></Layout>}
        />

        <Route
          path="/statistiques"
          element={<Layout><Statistiques/></Layout>}
        />

        <Route
          path="/ministeres"
          element={<Layout><MinisteresList/></Layout>}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;