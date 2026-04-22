/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
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

