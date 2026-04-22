export const parashotInfo = [
  { num: 1, name: 'Bereshit', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 2, name: 'Noaj', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 3, name: 'Lej Lejá', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 4, name: 'Vaierá', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 5, name: 'Jaiei Sará', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 6, name: 'Toldot', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1605374828135-2350849310b8?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 7, name: 'Vaietzé', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044e?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 8, name: 'Vaishlaj', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 9, name: 'Vaieshev', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 10, name: 'Miketz', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1542640244-7e672d6cb461?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 11, name: 'Vaigash', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1533227260815-bdf9f345c225?auto=format&fit=crop&q=80&w=600&h=450' },
  { num: 12, name: 'Vayeji', book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=600&h=450' },
];

export const getParashaByNumber = (num: number) => {
    return parashotInfo.find(p => p.num === num) || { num, name: `Parashá ${num}`, book: 'Bereshit', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600&h=450' };
};
