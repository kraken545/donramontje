/* ============================================================
   DON RAMON JETFUEL — STAFF-EDITABLE DATA
   Edita este archivo para cambiar menú, precios, horarios,
   ubicación y contactos. No toques el HTML ni el CSS.

   Trucos:
   - Precios: {"xcg": 15, "usd": 9}
   - Textos bilingües: {"en": "...", "es": "..."}
   - Horario cerrado: time = "" (aparece CLOSED / CERRADO)
   - Para cambiar la foto del hero: cambia heroImage.
   ============================================================ */

window.DR_DATA = {
  brand: {
    name: "DON RAMON JETFUEL",
    nameLine1: "DON RAMON",
    nameLine2: "JETFUEL",
    logo: "", /* ruta del logo real, p.ej. "assets/img/logo.png" — PENDIENTE del cliente */
    city: "Curaçao"
  },

  contact: {
    whatsapp: "59990000000",          /* número con código de país, solo dígitos — PENDIENTE */
    instagram: "https://instagram.com/donramontje",  /* PENDIENTE confirmar handle */
    phoneDisplay: "+5999 000 0000",   /* como se muestra — PENDIENTE */
    phone: "tel:+59990000000"         /* href tel: — PENDIENTE */
  },

  location: {
    address: { en: "Curaçao — exact location coming soon. Check Instagram for today's spot!", es: "Curaçao — ubicación exacta pronto. ¡Mira Instagram para el punto de hoy!" },
    mapsEmbed: "", /* URL embed de Google Maps (share > Embed a map > copiar src) — PENDIENTE */
    mapsLink: "https://maps.google.com/?q=Curaçao" /* link "cómo llegar" — PENDIENTE */
  },

  hours: [
    { day: { en: "Monday",   es: "Lunes" },    time: "" },
    { day: { en: "Tuesday",  es: "Martes" },   time: "" },
    { day: { en: "Wednesday", es: "Miércoles" }, time: "" },
    { day: { en: "Thursday", es: "Jueves" },   time: "" },
    { day: { en: "Friday",   es: "Viernes" },  time: "" },
    { day: { en: "Saturday", es: "Sábado" },   time: "" },
    { day: { en: "Sunday",   es: "Domingo" },  time: "" }
  ], /* PENDIENTE: horarios reales, formato "5:00 PM – 11:00 PM" */

  heroImage: "assets/img/food/food-06-hero.webp",
  heroAlt: "Grilled food with fries from Don Ramon Jetfuel",

  gallery: [
    { src: "assets/img/food/food-01-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-02-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-03-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-04-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-05-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-06-grid.webp", alt: "Grilled food with fries" },
    { src: "assets/img/food/food-07-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-08-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-09-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-10-grid.webp", alt: "Don Ramon Jetfuel dish" },
    { src: "assets/img/food/food-11-grid.webp", alt: "Grill and preparation" },
    { src: "assets/img/food/food-12-grid.webp", alt: "Don Ramon Jetfuel dish" }
  ],

  menu: [
    {
      id: "donramontje",
      label: { en: "DON RAMONTJE", es: "DON RAMONTJE" },
      note: {
        en: "Served with French fries, green salad & macaroni salad.",
        es: "Servido con papas fritas, ensalada verde y ensalada de macarrones."
      },
      items: [
        { name: { en: "Chicken",   es: "Pollo" },     desc: { en: "Grilled chicken, done right.", es: "Pollo a la parrilla, bien hecho." }, price: { xcg: 15, usd: 9 } },
        { name: { en: "Pork Chop", es: "Chuleta de cerdo" }, desc: { en: "Flame-grilled pork chop.", es: "Chuleta de cerdo a las llamas." }, price: { xcg: 18, usd: 11 } },
        { name: { en: "Steak",     es: "Bistec" },    desc: { en: "Charred steak, juicy inside.", es: "Bistec sellado, jugoso por dentro." }, price: { xcg: 19, usd: 12 } },
        { name: { en: "Chorizo",   es: "Chorizo" },   desc: { en: "Smoky grilled chorizo.", es: "Chorizo ahumado a la parrilla." }, price: { xcg: 19, usd: 12 } }
      ]
    },
    {
      id: "kapsalon",
      label: { en: "KAPSALON", es: "KAPSALON" },
      note: {
        en: "French fries, mozzarella cheese, lettuce, garlic & Don Ramon house sauce.",
        es: "Papas fritas, queso mozzarella, lechuga, ajo y salsa de la casa Don Ramon."
      },
      items: [
        { name: { en: "Chicken",     es: "Pollo" },       desc: { en: "The classic. Fries loaded with grilled chicken.", es: "El clásico. Papas cargadas con pollo a la parrilla." }, price: { xcg: 20, usd: 12 } },
        { name: { en: "Steak",       es: "Bistec" },      desc: { en: "Grilled steak over crispy fries.", es: "Bistec a la parrilla sobre papas crujientes." }, price: { xcg: 22, usd: 13 } },
        { name: { en: "Shrimps",     es: "Camarones" },   desc: { en: "Shrimps on the fire, piled high.", es: "Camarones al fuego, bien cargado." }, price: { xcg: 28, usd: 16 } },
        { name: { en: "Tenderloin",  es: "Lomito" },      desc: { en: "Premium tenderloin, street style.", es: "Lomito premium, estilo callejero." }, price: { xcg: 28, usd: 16 } },
        { name: { en: "Mix (choose 2 proteins)", es: "Mix (elige 2 proteínas)" }, desc: { en: "Two proteins. Zero regrets.", es: "Dos proteínas. Cero arrepentimientos." }, price: { xcg: 35, usd: 20 } }
      ]
    }
  ],

  i18n: {
    en: {
      "skip": "Skip to content",
      "nav.home": "HOME", "nav.menu": "MENU", "nav.about": "ABOUT",
      "nav.gallery": "GALLERY", "nav.location": "LOCATION", "nav.contact": "CONTACT",
      "cta.order": "ORDER NOW", "cta.viewmenu": "VIEW MENU",
      "hero.eyebrow": "CURAÇAO STREET GRILL & FOOD TRUCK",
      "hero.sub": "Grilled meat, kapsalon and loaded fries — fresh off the fire, made to order.",
      "hero.badge1": "FRESH GRILL DAILY", "hero.badge2": "BIG PORTIONS", "hero.badge3": "MADE TO ORDER",
      "menu.kicker": "WHAT WE GRILL", "menu.title": "THE MENU",
      "menu.sub": "Two signature ways to get fed. Same rule for everything: no small portions.",
      "menu.more": "MORE DISHES ON INSTAGRAM",
      "about.kicker": "FIRE & FLAVOR", "about.title": "ABOUT THE GRILL",
      "about.p1": "Don Ramon Jetfuel is a Curaçao street-food truck built on one idea: food should hit like jet fuel — hot, bold and generous. Everything is grilled to order over open fire and served the street way: fast, fresh and messy in the best way.",
      "about.p2": "No frozen corners, no sad portions. Just meat, fire, fries and sauce, made by people who love the grill as much as you'll love the food.",
      "about.point1": "Grilled fresh to order", "about.point2": "Generous street-food portions", "about.point3": "100% Curaçao street energy",
      "about.cta": "FIND THE TRUCK",
      "gallery.kicker": "STRAIGHT FROM THE FIRE", "gallery.title": "GALLERY",
      "loc.kicker": "COME FIND US", "loc.title": "LOCATION & HOURS", "loc.hours": "HOURS",
      "loc.howto": "HOW TO ORDER",
      "loc.step1": "Tap ORDER NOW and message us on WhatsApp.",
      "loc.step2": "Tell us what you want — we fire it up fresh.",
      "loc.step3": "Pick up hot, or check delivery options with us.",
      "loc.directions": "GET DIRECTIONS",
      "contact.kicker": "TALK TO US", "contact.title": "CONTACT",
      "contact.sub": "Fastest way to food: WhatsApp. We answer between the flames.",
      "contact.wa": "WHATSAPP", "contact.wasub": "Order now — fastest response",
      "contact.ig": "INSTAGRAM", "contact.tel": "PHONE",
      "footer.tag": "Big flavor. No small portions.",
      "closed": "CLOSED"
    },
    es: {
      "skip": "Saltar al contenido",
      "nav.home": "INICIO", "nav.menu": "MENÚ", "nav.about": "NOSOTROS",
      "nav.gallery": "GALERÍA", "nav.location": "UBICACIÓN", "nav.contact": "CONTACTO",
      "cta.order": "PEDIR AHORA", "cta.viewmenu": "VER MENÚ",
      "hero.eyebrow": "GRILL & FOOD TRUCK CALLEJERO DE CURAÇAO",
      "hero.sub": "Carne a la parrilla, kapsalon y papas cargadas — recién salido del fuego, hecho al momento.",
      "hero.badge1": "GRILL FRESCO A DIARIO", "hero.badge2": "PORCIONES GRANDES", "hero.badge3": "HECHO AL MOMENTO",
      "menu.kicker": "LO QUE ASAMOS", "menu.title": "EL MENÚ",
      "menu.sub": "Dos formas estrella de llenarte. Misma regla en todo: sin porciones pequeñas.",
      "menu.more": "MÁS PLATOS EN INSTAGRAM",
      "about.kicker": "FUEGO Y SABOR", "about.title": "SOBRE EL GRILL",
      "about.p1": "Don Ramon Jetfuel es un food truck de Curaçao construido sobre una idea: la comida debe pegar como combustible de avión — caliente, con carácter y generosa. Todo se asa al momento sobre fuego vivo y se sirve a la calle: rápido, fresco y deliciosamente cargado.",
      "about.p2": "Sin atajos congelados ni porciones tristes. Solo carne, fuego, papas y salsa, hechos por gente que ama el grill tanto como tú amarás la comida.",
      "about.point1": "Asado fresco al momento", "about.point2": "Porciones callejeras generosas", "about.point3": "100% energía callejera de Curaçao",
      "about.cta": "ENCUENTRA EL TRUCK",
      "gallery.kicker": "RECIÉN SALIDO DEL FUEGO", "gallery.title": "GALERÍA",
      "loc.kicker": "VEN A BUSCARNOS", "loc.title": "UBICACIÓN Y HORARIO", "loc.hours": "HORARIO",
      "loc.howto": "CÓMO PEDIR",
      "loc.step1": "Toca PEDIR AHORA y escríbenos por WhatsApp.",
      "loc.step2": "Dinos qué quieres — lo ponemos al fuego fresco.",
      "loc.step3": "Recógelo caliente o consulta opciones de entrega con nosotros.",
      "loc.directions": "CÓMO LLEGAR",
      "contact.kicker": "HABLA CON NOSOTROS", "contact.title": "CONTACTO",
      "contact.sub": "El camino más rápido a la comida: WhatsApp. Contestamos entre llamas.",
      "contact.wa": "WHATSAPP", "contact.wasub": "Pide ahora — respuesta más rápida",
      "contact.ig": "INSTAGRAM", "contact.tel": "TELÉFONO",
      "footer.tag": "Sabor grande. Porciones grandes.",
      "closed": "CERRADO"
    }
  }
};
