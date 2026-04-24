/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Watch } from './pages/Watch';
import { ParashotIndex } from './pages/ParashotIndex';
import { ParashaDetail } from './pages/ParashaDetail';
import { FestividadesIndex } from './pages/FestividadesIndex';
import { CuentosIndex } from './pages/CuentosIndex';
import { SeriesDetail } from './pages/SeriesDetail';
import { Shorts } from './pages/Shorts';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { IntroAnimation } from './components/ui/IntroAnimation';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('hasSeenIntro');
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  return (
    <BrowserRouter>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/category/parashot" element={<ParashotIndex />} />
          <Route path="/parashot/:number" element={<ParashaDetail />} />
          <Route path="/category/festividades" element={<FestividadesIndex />} />
          <Route path="/category/cuentos" element={<CuentosIndex />} />
          <Route path="/series/:slug" element={<SeriesDetail />} />
          <Route path="/series" element={<FestividadesIndex />} /> {/* Placeholder to prevent 404 */}
          {/* Default fallback route */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

