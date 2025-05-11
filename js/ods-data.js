// js/ods-data.js

const odsData = {
  1: {
    num: 1,
    title: "Fin de la Pobreza",
    color: "#E5243B",
    imageUrl: "assets/img/ods/ods-1.png",
    url: "https://www.un.org/sustainabledevelopment/es/poverty/",
  },
  2: {
    num: 2,
    title: "Hambre Cero",
    color: "#DDA63A",
    imageUrl: "assets/img/ods/ods-2.png",
    url: "https://www.un.org/sustainabledevelopment/es/hunger/",
  },
  3: {
    num: 3,
    title: "Salud y Bienestar",
    color: "#4C9F38",
    imageUrl: "assets/img/ods/ods-3.png",
    url: "https://www.un.org/sustainabledevelopment/es/health/",
  },
  4: {
    num: 4,
    title: "Educación de Calidad",
    color: "#C5192D",
    imageUrl: "assets/img/ods/ods-4.png",
    url: "https://www.un.org/sustainabledevelopment/es/education/",
  },
  5: {
    num: 5,
    title: "Igualdad de Género",
    color: "#FF3A21",
    imageUrl: "assets/img/ods/ods-5.png",
    url: "https://www.un.org/sustainabledevelopment/es/gender-equality/",
  },
  6: {
    num: 6,
    title: "Agua Limpia y Saneamiento",
    color: "#26BDE2",
    imageUrl: "assets/img/ods/ods-6.png",
    url: "https://www.un.org/sustainabledevelopment/es/water-and-sanitation/",
  },
  7: {
    num: 7,
    title: "Energía Asequible y No Contaminante",
    color: "#FCC30B",
    imageUrl: "assets/img/ods/ods-7.png",
    url: "https://www.un.org/sustainabledevelopment/es/energy/",
  },
  8: {
    num: 8,
    title: "Trabajo Decente y Crecimiento Económico",
    color: "#A21942",
    imageUrl: "assets/img/ods/ods-8.png",
    url: "https://www.un.org/sustainabledevelopment/es/economic-growth/",
  },
  9: {
    num: 9,
    title: "Industria, Innovación e Infraestructura",
    color: "#FD6925",
    imageUrl: "assets/img/ods/ods-9.png",
    url: "https://www.un.org/sustainabledevelopment/es/infrastructure/",
  },
  10: {
    num: 10,
    title: "Reducción de las Desigualdades",
    color: "#DD1367",
    imageUrl: "assets/img/ods/ods-10.png",
    url: "https://www.un.org/sustainabledevelopment/es/inequality/",
  },
  11: {
    num: 11,
    title: "Ciudades y Comunidades Sostenibles",
    color: "#FD9D24",
    imageUrl: "assets/img/ods/ods-11.png",
    url: "https://www.un.org/sustainabledevelopment/es/cities/",
  },
  12: {
    num: 12,
    title: "Producción y Consumo Responsables",
    color: "#BF8B2E",
    imageUrl: "assets/img/ods/ods-12.png",
    url: "https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/",
  },
  13: {
    num: 13,
    title: "Acción por el Clima",
    color: "#3F7E44",
    imageUrl: "assets/img/ods/ods-13.png",
    url: "https://www.un.org/sustainabledevelopment/es/climate-change-2/",
  },
  14: {
    num: 14,
    title: "Vida Submarina",
    color: "#0A97D9",
    imageUrl: "assets/img/ods/ods-14.png",
    url: "https://www.un.org/sustainabledevelopment/es/oceans/",
  },
  15: {
    num: 15,
    title: "Vida de Ecosistemas Terrestres",
    color: "#56C02B",
    imageUrl: "assets/img/ods/ods-15.png",
    url: "https://www.un.org/sustainabledevelopment/es/biodiversity/",
  },
  16: {
    num: 16,
    title: "Paz, Justicia e Instituciones Sólidas",
    color: "#00689D",
    imageUrl: "assets/img/ods/ods-16.png",
    url: "https://www.un.org/sustainabledevelopment/es/peace-justice/",
  },
  17: {
    num: 17,
    title: "Alianzas para Lograr los Objetivos",
    color: "#19486A",
    imageUrl: "assets/img/ods/ods-17.png",
    url: "https://www.un.org/sustainabledevelopment/es/globalpartnerships/",
  },
};

// Helper function (opcional, pero útil)
function getOdsInfo(id) {
  return odsData[id] || null;
}
