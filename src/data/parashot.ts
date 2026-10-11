export interface Parasha {
  num: number;
  name: string;
  book: 'Bereshit' | 'Shemot' | 'Vaikra' | 'Bamidbar' | 'Devarim';
  bookSlug: string;
  thumbnail: string;
  summary?: string;
}

export const parashotInfo: Parasha[] = [
  // --- BERESHIT (Génesis) ---
  { num: 1, name: 'Bereshit', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La creación del mundo, Adán y Eva, Caín y Abel, y el inicio de la humanidad.' },
  { num: 2, name: 'Noaj', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El arca de Noé, el diluvio, el arcoíris del pacto y la Torre de Babel.' },
  { num: 3, name: 'Lej Lejá', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El llamado de Avraham hacia la tierra prometida y el pacto de la circuncisión.' },
  { num: 4, name: 'Vaierá', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La hospitalidad de Avraham, el nacimiento de Itzjak y la prueba de la Akedá.' },
  { num: 5, name: 'Jaiei Sará', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La adquisición de la Cueva de Majpelá y la búsqueda de esposa para Itzjak (Rivká).' },
  { num: 6, name: 'Toldot', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1605374828135-2350849310b8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El nacimiento de Yaakov y Esav, la venta de la primogenitura y las bendiciones.' },
  { num: 7, name: 'Vaietzé', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044e?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El sueño de la escalera de Yaakov, los años con Laván y el nacimiento de las tribus.' },
  { num: 8, name: 'Vaishlaj', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El encuentro y reconciliación de Yaakov con Esav, y la lucha con el ángel.' },
  { num: 9, name: 'Vaieshev', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La túnica de colores de Yosef, los sueños y su venta a Egipto.' },
  { num: 10, name: 'Miketz', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1542640244-7e672d6cb461?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Los sueños del Faraón interpretados por Yosef y su ascenso como virrey de Egipto.' },
  { num: 11, name: 'Vaigash', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1533227260815-bdf9f345c225?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Yosef se revela a sus hermanos y el reencuentro de la familia en Goshen.' },
  { num: 12, name: 'Vayeji', book: 'Bereshit', bookSlug: 'bereshit', thumbnail: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Las bendiciones finales de Yaakov a sus doce hijos y su legado para siempre.' },

  // --- SHEMOT (Éxodo) ---
  { num: 13, name: 'Shemot', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La esclavitud en Egipto, el nacimiento de Moshé y la zarza ardiente.' },
  { num: 14, name: 'Vaerá', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Las primeras siete plagas sobre Egipto y las advertencias al Faraón.' },
  { num: 15, name: 'Bo', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Las últimas tres plagas, la plaga de los primogénitos y la salida de Egipto.' },
  { num: 16, name: 'Beshalaj', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La apertura del Mar Rojo, el Canto del Mar (Shirá) y el maná en el desierto.' },
  { num: 17, name: 'Itró', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El consejo de Itró y la entrega de los Diez Mandamientos en el Monte Sinaí.' },
  { num: 18, name: 'Mishpatim', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Leyes civiles y morales, justicia social y el pacto de Naasé Venishmá.' },
  { num: 19, name: 'Terumá', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Las ofrendas para la construcción del Tabernáculo (Mishkán) y el Arca.' },
  { num: 20, name: 'Tetzavé', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1605374828135-2350849310b8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El encendido de la Menorá y las vestiduras sagradas de los sacerdotes.' },
  { num: 21, name: 'Ki Tisá', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044e?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El medio shékel, el becerro de oro, las segundas tablas y los 13 atributos.' },
  { num: 22, name: 'Vaiakhel', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El precepto del Shabat y el ensamblaje diligente de los elementos del Mishkán.' },
  { num: 23, name: 'Pekudei', book: 'Shemot', bookSlug: 'shemot', thumbnail: 'https://images.unsplash.com/photo-1542640244-7e672d6cb461?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La rendición de cuentas del Mishkán y el reposo de la presencia divina.' },

  // --- VAIKRA (Levítico) ---
  { num: 24, name: 'Vaikra', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1533227260815-bdf9f345c225?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Leyes de las ofrendas (Korbanot) y la cercanía con el Creador.' },
  { num: 25, name: 'Tzav', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Instrucciones a los Kohanim y el fuego continuo sobre el altar.' },
  { num: 26, name: 'Sheminí', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La consagración del Mishkán y las leyes de Kashrut (alimentos permitidos).' },
  { num: 27, name: 'Tazría', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Pureza y purificación, y el cuidado contra la maledicencia (Lashón Hará).' },
  { num: 28, name: 'Metzorá', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El proceso de purificación espiritual y restauración comunitaria.' },
  { num: 29, name: 'Ajarei Mot', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El servicio del Sumo Sacerdote en Yom Kipur y la santidad en la vida íntima.' },
  { num: 30, name: 'Kedoshim', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Sed santos: Amarás a tu prójimo como a ti mismo y normas de rectitud ética.' },
  { num: 31, name: 'Emor', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1605374828135-2350849310b8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El calendario sagrado de festividades (Moadim) y las leyes sacerdotales.' },
  { num: 32, name: 'Behar', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044e?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El año sabático para la tierra (Shemitá) y el jubileo (Yovel).' },
  { num: 33, name: 'Bejukotai', book: 'Vaikra', bookSlug: 'vaikra', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Las bendiciones por seguir los caminos de la Torá y las advertencias.' },

  // --- BAMIDBAR (Números) ---
  { num: 34, name: 'Bamidbar', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El censo del pueblo de Israel y la disposición de las tribus alrededor del campamento.' },
  { num: 35, name: 'Nasó', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1542640244-7e672d6cb461?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La bendición sacerdotal (Birkat Kohanim) y las ofrendas de los líderes de las tribus.' },
  { num: 36, name: 'Beha\'alotjá', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1533227260815-bdf9f345c225?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Las trompetas de plata, el viaje por el desierto y el agradecimiento.' },
  { num: 37, name: 'Shlaj Lejá', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Los doce espías enviados a la tierra de Canaán y el precepto del Tzitzit.' },
  { num: 38, name: 'Kóraj', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La rebelión de Kóraj y la confirmación milagrosa del liderazgo de Aarón.' },
  { num: 39, name: 'Jukat', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La vaca roja, el agua de la roca y las victorias en el desierto.' },
  { num: 40, name: 'Balak', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El rey Balak, el profeta Bilam y sus bendiciones involuntarias sobre Israel.' },
  { num: 41, name: 'Pinjás', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El celo por la paz, el censo de la nueva generación y el calendario de ofrendas.' },
  { num: 42, name: 'Matot', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El valor de las promesas y juramentos, y la herencia de las tribus al este del Jordán.' },
  { num: 43, name: 'Masei', book: 'Bamidbar', bookSlug: 'bamidbar', thumbnail: 'https://images.unsplash.com/photo-1605374828135-2350849310b8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El resumen de las 42 jornadas por el desierto y las fronteras de la tierra prometida.' },

  // --- DEVARIM (Deuteronomio) ---
  { num: 44, name: 'Devarim', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044e?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Moshé repasa los 40 años de travesía y prepara al pueblo para cruzar el Jordán.' },
  { num: 45, name: 'Vaetjanán', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El rezo de Moshé, los Diez Mandamientos y la proclamación del Shemá Israel.' },
  { num: 46, name: 'Ékev', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600&h=450', summary: 'No solo de pan vive el hombre, las bendiciones de la tierra y la gratitud.' },
  { num: 47, name: 'Reé', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1542640244-7e672d6cb461?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La bendición y la maldición puestas ante el pueblo, y el deber con los necesitados.' },
  { num: 48, name: 'Shoftim', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1533227260815-bdf9f345c225?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Justicia, justicia perseguirás: Jueces, reyes y profetas rectos.' },
  { num: 49, name: 'Ki Tetzé', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=600&h=450', summary: '74 preceptos prácticos de bondad, compasión con los animales y honestidad en los negocios.' },
  { num: 50, name: 'Ki Tavó', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Las primicias (Bikurim) de la tierra y la gratitud por la historia del pueblo.' },
  { num: 51, name: 'Nitzavim', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=450', summary: 'Todos estamos hoy reunidos: El poder del retorno (Teshuvá) y la cercanía de la Torá.' },
  { num: 52, name: 'Vaiélej', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La despedida de Moshé, el traspaso del liderazgo a Yehoshúa y el precepto de Hakhel.' },
  { num: 53, name: 'Haazinu', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&q=80&w=600&h=450', summary: 'El majestuoso poema cósmico que atestigua el cielo y la tierra sobre Israel.' },
  { num: 54, name: 'Vezót Haberajá', book: 'Devarim', bookSlug: 'devarim', thumbnail: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=600&h=450', summary: 'La última bendición de Moshé a cada una de las doce tribus antes de partir.' }
];

export const getParashaByNumber = (num: number): Parasha => {
  return parashotInfo.find(p => p.num === num) || {
    num,
    name: `Parashá ${num}`,
    book: 'Bereshit',
    bookSlug: 'bereshit',
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600&h=450',
    summary: 'Estudio de la porción semanal de la Torá.'
  };
};

export const getParashotByBook = (book: string): Parasha[] => {
  return parashotInfo.filter(p => p.book.toLowerCase() === book.toLowerCase() || p.bookSlug.toLowerCase() === book.toLowerCase());
};
