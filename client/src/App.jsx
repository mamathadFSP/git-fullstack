import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import AnalyzePage from "./pages/AnalyzePage.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/analyze/:username" element={<AnalyzePage />} />
            </Routes>
        </BrowserRouter>
    );
}
