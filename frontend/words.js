// ===================== SO'Z BANKI =====================
// Har bir daraja mavzuli darslarga bo'lingan (har darsda 10 ta so'z).
// So'zlar kundalik hayotda eng ko'p kerak bo'ladigan so'zlar bo'yicha tanlangan.
// Yangi so'z qo'shish uchun: darajaga { theme, words:[{en, uz} x10] } obyektini qo'shing.
const WORD_THEMES = {
 "A1": [
  {
   "theme": "Salomlashish",
   "words": [
    {
     "en": "hello",
     "uz": "salom"
    },
    {
     "en": "goodbye",
     "uz": "xayr"
    },
    {
     "en": "please",
     "uz": "iltimos"
    },
    {
     "en": "thanks",
     "uz": "rahmat"
    },
    {
     "en": "sorry",
     "uz": "kechirasiz"
    },
    {
     "en": "yes",
     "uz": "ha"
    },
    {
     "en": "no",
     "uz": "yo'q"
    },
    {
     "en": "welcome",
     "uz": "xush kelibsiz"
    },
    {
     "en": "friend",
     "uz": "do'st"
    },
    {
     "en": "name",
     "uz": "ism"
    }
   ]
  },
  {
   "theme": "Oila",
   "words": [
    {
     "en": "mother",
     "uz": "ona"
    },
    {
     "en": "father",
     "uz": "ota"
    },
    {
     "en": "sister",
     "uz": "opa-singil"
    },
    {
     "en": "brother",
     "uz": "aka-uka"
    },
    {
     "en": "son",
     "uz": "o'g'il"
    },
    {
     "en": "daughter",
     "uz": "qiz (farzand)"
    },
    {
     "en": "grandmother",
     "uz": "buvi"
    },
    {
     "en": "grandfather",
     "uz": "bobo"
    },
    {
     "en": "husband",
     "uz": "er"
    },
    {
     "en": "wife",
     "uz": "xotin"
    }
   ]
  },
  {
   "theme": "Raqamlar",
   "words": [
    {
     "en": "one",
     "uz": "bir"
    },
    {
     "en": "two",
     "uz": "ikki"
    },
    {
     "en": "three",
     "uz": "uch"
    },
    {
     "en": "four",
     "uz": "to'rt"
    },
    {
     "en": "five",
     "uz": "besh"
    },
    {
     "en": "six",
     "uz": "olti"
    },
    {
     "en": "seven",
     "uz": "yetti"
    },
    {
     "en": "eight",
     "uz": "sakkiz"
    },
    {
     "en": "nine",
     "uz": "to'qqiz"
    },
    {
     "en": "ten",
     "uz": "o'n"
    }
   ]
  },
  {
   "theme": "Ranglar",
   "words": [
    {
     "en": "red",
     "uz": "qizil"
    },
    {
     "en": "blue",
     "uz": "ko'k"
    },
    {
     "en": "green",
     "uz": "yashil"
    },
    {
     "en": "yellow",
     "uz": "sariq"
    },
    {
     "en": "black",
     "uz": "qora"
    },
    {
     "en": "white",
     "uz": "oq"
    },
    {
     "en": "brown",
     "uz": "jigarrang"
    },
    {
     "en": "pink",
     "uz": "pushti"
    },
    {
     "en": "gray",
     "uz": "kulrang"
    },
    {
     "en": "purple",
     "uz": "binafsha"
    }
   ]
  },
  {
   "theme": "Ovqat va ichimlik",
   "words": [
    {
     "en": "bread",
     "uz": "non"
    },
    {
     "en": "water",
     "uz": "suv"
    },
    {
     "en": "milk",
     "uz": "sut"
    },
    {
     "en": "rice",
     "uz": "guruch"
    },
    {
     "en": "meat",
     "uz": "go'sht"
    },
    {
     "en": "fish",
     "uz": "baliq"
    },
    {
     "en": "egg",
     "uz": "tuxum"
    },
    {
     "en": "tea",
     "uz": "choy"
    },
    {
     "en": "salt",
     "uz": "tuz"
    },
    {
     "en": "sugar",
     "uz": "shakar"
    }
   ]
  },
  {
   "theme": "Meva va sabzavotlar",
   "words": [
    {
     "en": "apple",
     "uz": "olma"
    },
    {
     "en": "potato",
     "uz": "kartoshka"
    },
    {
     "en": "tomato",
     "uz": "pomidor"
    },
    {
     "en": "onion",
     "uz": "piyoz"
    },
    {
     "en": "carrot",
     "uz": "sabzi"
    },
    {
     "en": "banana",
     "uz": "banan"
    },
    {
     "en": "grape",
     "uz": "uzum"
    },
    {
     "en": "lemon",
     "uz": "limon"
    },
    {
     "en": "orange",
     "uz": "apelsin"
    },
    {
     "en": "cucumber",
     "uz": "bodring"
    }
   ]
  },
  {
   "theme": "Uy",
   "words": [
    {
     "en": "house",
     "uz": "uy"
    },
    {
     "en": "room",
     "uz": "xona"
    },
    {
     "en": "kitchen",
     "uz": "oshxona"
    },
    {
     "en": "bathroom",
     "uz": "hammom"
    },
    {
     "en": "bedroom",
     "uz": "yotoqxona"
    },
    {
     "en": "door",
     "uz": "eshik"
    },
    {
     "en": "window",
     "uz": "deraza"
    },
    {
     "en": "wall",
     "uz": "devor"
    },
    {
     "en": "floor",
     "uz": "pol"
    },
    {
     "en": "roof",
     "uz": "tom"
    }
   ]
  },
  {
   "theme": "Uy jihozlari",
   "words": [
    {
     "en": "table",
     "uz": "stol"
    },
    {
     "en": "chair",
     "uz": "stul"
    },
    {
     "en": "bed",
     "uz": "karavot"
    },
    {
     "en": "lamp",
     "uz": "chiroq"
    },
    {
     "en": "sofa",
     "uz": "divan"
    },
    {
     "en": "mirror",
     "uz": "ko'zgu"
    },
    {
     "en": "key",
     "uz": "kalit"
    },
    {
     "en": "clock",
     "uz": "devor soati"
    },
    {
     "en": "phone",
     "uz": "telefon"
    },
    {
     "en": "television",
     "uz": "televizor"
    }
   ]
  },
  {
   "theme": "Kiyimlar",
   "words": [
    {
     "en": "shirt",
     "uz": "ko'ylak"
    },
    {
     "en": "trousers",
     "uz": "shim"
    },
    {
     "en": "dress",
     "uz": "libos"
    },
    {
     "en": "shoes",
     "uz": "poyabzal"
    },
    {
     "en": "hat",
     "uz": "shapka"
    },
    {
     "en": "coat",
     "uz": "palto"
    },
    {
     "en": "socks",
     "uz": "paypoq"
    },
    {
     "en": "jacket",
     "uz": "kurtka"
    },
    {
     "en": "bag",
     "uz": "sumka"
    },
    {
     "en": "belt",
     "uz": "kamar"
    }
   ]
  },
  {
   "theme": "Tana a'zolari",
   "words": [
    {
     "en": "head",
     "uz": "bosh"
    },
    {
     "en": "eye",
     "uz": "ko'z"
    },
    {
     "en": "ear",
     "uz": "quloq"
    },
    {
     "en": "nose",
     "uz": "burun"
    },
    {
     "en": "mouth",
     "uz": "og'iz"
    },
    {
     "en": "hand",
     "uz": "qo'l"
    },
    {
     "en": "leg",
     "uz": "oyoq"
    },
    {
     "en": "face",
     "uz": "yuz"
    },
    {
     "en": "hair",
     "uz": "soch"
    },
    {
     "en": "heart",
     "uz": "yurak"
    }
   ]
  },
  {
   "theme": "Hayvonlar",
   "words": [
    {
     "en": "dog",
     "uz": "it"
    },
    {
     "en": "cat",
     "uz": "mushuk"
    },
    {
     "en": "horse",
     "uz": "ot"
    },
    {
     "en": "cow",
     "uz": "sigir"
    },
    {
     "en": "sheep",
     "uz": "qo'y"
    },
    {
     "en": "bird",
     "uz": "qush"
    },
    {
     "en": "chicken",
     "uz": "tovuq"
    },
    {
     "en": "lion",
     "uz": "sher"
    },
    {
     "en": "wolf",
     "uz": "bo'ri"
    },
    {
     "en": "mouse",
     "uz": "sichqon"
    }
   ]
  },
  {
   "theme": "Kundalik fe'llar 1",
   "words": [
    {
     "en": "eat",
     "uz": "yemoq"
    },
    {
     "en": "drink",
     "uz": "ichmoq"
    },
    {
     "en": "sleep",
     "uz": "uxlamoq"
    },
    {
     "en": "walk",
     "uz": "yurmoq"
    },
    {
     "en": "run",
     "uz": "yugurmoq"
    },
    {
     "en": "read",
     "uz": "o'qimoq"
    },
    {
     "en": "write",
     "uz": "yozmoq"
    },
    {
     "en": "speak",
     "uz": "gapirmoq"
    },
    {
     "en": "listen",
     "uz": "tinglamoq"
    },
    {
     "en": "look",
     "uz": "qaramoq"
    }
   ]
  },
  {
   "theme": "Kundalik fe'llar 2",
   "words": [
    {
     "en": "go",
     "uz": "bormoq"
    },
    {
     "en": "come",
     "uz": "kelmoq"
    },
    {
     "en": "open",
     "uz": "ochmoq"
    },
    {
     "en": "close",
     "uz": "yopmoq"
    },
    {
     "en": "give",
     "uz": "bermoq"
    },
    {
     "en": "take",
     "uz": "olmoq"
    },
    {
     "en": "buy",
     "uz": "sotib olmoq"
    },
    {
     "en": "sell",
     "uz": "sotmoq"
    },
    {
     "en": "work",
     "uz": "ishlamoq"
    },
    {
     "en": "play",
     "uz": "o'ynamoq"
    }
   ]
  },
  {
   "theme": "Oddiy sifatlar",
   "words": [
    {
     "en": "big",
     "uz": "katta"
    },
    {
     "en": "small",
     "uz": "kichik"
    },
    {
     "en": "good",
     "uz": "yaxshi"
    },
    {
     "en": "bad",
     "uz": "yomon"
    },
    {
     "en": "new",
     "uz": "yangi"
    },
    {
     "en": "old",
     "uz": "eski"
    },
    {
     "en": "hot",
     "uz": "issiq"
    },
    {
     "en": "cold",
     "uz": "sovuq"
    },
    {
     "en": "fast",
     "uz": "tez"
    },
    {
     "en": "slow",
     "uz": "sekin"
    }
   ]
  },
  {
   "theme": "Holat va sifatlar",
   "words": [
    {
     "en": "happy",
     "uz": "xursand"
    },
    {
     "en": "sad",
     "uz": "xafa"
    },
    {
     "en": "tired",
     "uz": "charchagan"
    },
    {
     "en": "hungry",
     "uz": "och"
    },
    {
     "en": "thirsty",
     "uz": "chanqagan"
    },
    {
     "en": "angry",
     "uz": "jahldor"
    },
    {
     "en": "beautiful",
     "uz": "chiroyli"
    },
    {
     "en": "easy",
     "uz": "oson"
    },
    {
     "en": "difficult",
     "uz": "qiyin"
    },
    {
     "en": "clean",
     "uz": "toza"
    }
   ]
  },
  {
   "theme": "Vaqt",
   "words": [
    {
     "en": "today",
     "uz": "bugun"
    },
    {
     "en": "tomorrow",
     "uz": "ertaga"
    },
    {
     "en": "yesterday",
     "uz": "kecha"
    },
    {
     "en": "morning",
     "uz": "ertalab"
    },
    {
     "en": "evening",
     "uz": "kechqurun"
    },
    {
     "en": "night",
     "uz": "tun"
    },
    {
     "en": "day",
     "uz": "kun"
    },
    {
     "en": "week",
     "uz": "hafta"
    },
    {
     "en": "month",
     "uz": "oy (vaqt)"
    },
    {
     "en": "year",
     "uz": "yil"
    }
   ]
  },
  {
   "theme": "Hafta kunlari",
   "words": [
    {
     "en": "Monday",
     "uz": "dushanba"
    },
    {
     "en": "Tuesday",
     "uz": "seshanba"
    },
    {
     "en": "Wednesday",
     "uz": "chorshanba"
    },
    {
     "en": "Thursday",
     "uz": "payshanba"
    },
    {
     "en": "Friday",
     "uz": "juma"
    },
    {
     "en": "Saturday",
     "uz": "shanba"
    },
    {
     "en": "Sunday",
     "uz": "yakshanba"
    },
    {
     "en": "time",
     "uz": "vaqt"
    },
    {
     "en": "hour",
     "uz": "soat"
    },
    {
     "en": "minute",
     "uz": "daqiqa"
    }
   ]
  },
  {
   "theme": "Shahar joylari",
   "words": [
    {
     "en": "city",
     "uz": "shahar"
    },
    {
     "en": "street",
     "uz": "ko'cha"
    },
    {
     "en": "school",
     "uz": "maktab"
    },
    {
     "en": "shop",
     "uz": "do'kon"
    },
    {
     "en": "market",
     "uz": "bozor"
    },
    {
     "en": "hospital",
     "uz": "kasalxona"
    },
    {
     "en": "park",
     "uz": "bog'"
    },
    {
     "en": "bank",
     "uz": "bank"
    },
    {
     "en": "station",
     "uz": "vokzal"
    },
    {
     "en": "bridge",
     "uz": "ko'prik"
    }
   ]
  },
  {
   "theme": "Transport",
   "words": [
    {
     "en": "car",
     "uz": "mashina"
    },
    {
     "en": "bus",
     "uz": "avtobus"
    },
    {
     "en": "train",
     "uz": "poyezd"
    },
    {
     "en": "plane",
     "uz": "samolyot"
    },
    {
     "en": "bicycle",
     "uz": "velosiped"
    },
    {
     "en": "taxi",
     "uz": "taksi"
    },
    {
     "en": "road",
     "uz": "yo'l"
    },
    {
     "en": "ticket",
     "uz": "chipta"
    },
    {
     "en": "driver",
     "uz": "haydovchi"
    },
    {
     "en": "boat",
     "uz": "qayiq"
    }
   ]
  },
  {
   "theme": "Ob-havo va tabiat",
   "words": [
    {
     "en": "sun",
     "uz": "quyosh"
    },
    {
     "en": "rain",
     "uz": "yomg'ir"
    },
    {
     "en": "snow",
     "uz": "qor"
    },
    {
     "en": "wind",
     "uz": "shamol"
    },
    {
     "en": "cloud",
     "uz": "bulut"
    },
    {
     "en": "tree",
     "uz": "daraxt"
    },
    {
     "en": "flower",
     "uz": "gul"
    },
    {
     "en": "river",
     "uz": "daryo"
    },
    {
     "en": "mountain",
     "uz": "tog'"
    },
    {
     "en": "sea",
     "uz": "dengiz"
    }
   ]
  },
  {
   "theme": "Maktab",
   "words": [
    {
     "en": "book",
     "uz": "kitob"
    },
    {
     "en": "pen",
     "uz": "qalam"
    },
    {
     "en": "paper",
     "uz": "qog'oz"
    },
    {
     "en": "teacher",
     "uz": "o'qituvchi"
    },
    {
     "en": "student",
     "uz": "o'quvchi"
    },
    {
     "en": "lesson",
     "uz": "dars"
    },
    {
     "en": "word",
     "uz": "so'z"
    },
    {
     "en": "question",
     "uz": "savol"
    },
    {
     "en": "answer",
     "uz": "javob"
    },
    {
     "en": "exam",
     "uz": "imtihon"
    }
   ]
  },
  {
   "theme": "Savol so'zlari",
   "words": [
    {
     "en": "who",
     "uz": "kim"
    },
    {
     "en": "what",
     "uz": "nima"
    },
    {
     "en": "where",
     "uz": "qayerda"
    },
    {
     "en": "when",
     "uz": "qachon"
    },
    {
     "en": "why",
     "uz": "nega"
    },
    {
     "en": "how",
     "uz": "qanday"
    },
    {
     "en": "which",
     "uz": "qaysi"
    },
    {
     "en": "here",
     "uz": "bu yerda"
    },
    {
     "en": "there",
     "uz": "u yerda"
    },
    {
     "en": "very",
     "uz": "juda"
    }
   ]
  }
 ],
 "A2": [
  {
   "theme": "Do'konda",
   "words": [
    {
     "en": "price",
     "uz": "narx"
    },
    {
     "en": "cheap",
     "uz": "arzon"
    },
    {
     "en": "expensive",
     "uz": "qimmat"
    },
    {
     "en": "discount",
     "uz": "chegirma"
    },
    {
     "en": "receipt",
     "uz": "chek"
    },
    {
     "en": "cash",
     "uz": "naqd pul"
    },
    {
     "en": "change",
     "uz": "qaytim"
    },
    {
     "en": "size",
     "uz": "o'lcham"
    },
    {
     "en": "customer",
     "uz": "xaridor"
    },
    {
     "en": "sale",
     "uz": "aksiya"
    }
   ]
  },
  {
   "theme": "Restoranda",
   "words": [
    {
     "en": "menu",
     "uz": "menyu"
    },
    {
     "en": "waiter",
     "uz": "ofitsiant"
    },
    {
     "en": "bill",
     "uz": "hisob-kitob"
    },
    {
     "en": "order",
     "uz": "buyurtma bermoq"
    },
    {
     "en": "delicious",
     "uz": "mazali"
    },
    {
     "en": "breakfast",
     "uz": "nonushta"
    },
    {
     "en": "lunch",
     "uz": "tushlik"
    },
    {
     "en": "dinner",
     "uz": "kechki ovqat"
    },
    {
     "en": "dessert",
     "uz": "shirinlik"
    },
    {
     "en": "spicy",
     "uz": "achchiq"
    }
   ]
  },
  {
   "theme": "Sayohat va aeroport",
   "words": [
    {
     "en": "airport",
     "uz": "aeroport"
    },
    {
     "en": "passport",
     "uz": "pasport"
    },
    {
     "en": "luggage",
     "uz": "yuk"
    },
    {
     "en": "flight",
     "uz": "reys"
    },
    {
     "en": "journey",
     "uz": "sayohat"
    },
    {
     "en": "tourist",
     "uz": "sayyoh"
    },
    {
     "en": "map",
     "uz": "xarita"
    },
    {
     "en": "visa",
     "uz": "viza"
    },
    {
     "en": "arrive",
     "uz": "yetib kelmoq"
    },
    {
     "en": "depart",
     "uz": "jo'nab ketmoq"
    }
   ]
  },
  {
   "theme": "Mehmonxona",
   "words": [
    {
     "en": "hotel",
     "uz": "mehmonxona"
    },
    {
     "en": "reservation",
     "uz": "bron qilish"
    },
    {
     "en": "guest",
     "uz": "mehmon"
    },
    {
     "en": "reception",
     "uz": "qabulxona"
    },
    {
     "en": "elevator",
     "uz": "lift"
    },
    {
     "en": "towel",
     "uz": "sochiq"
    },
    {
     "en": "pillow",
     "uz": "yostiq"
    },
    {
     "en": "blanket",
     "uz": "ko'rpa"
    },
    {
     "en": "laundry",
     "uz": "kir yuvish"
    },
    {
     "en": "noise",
     "uz": "shovqin"
    }
   ]
  },
  {
   "theme": "Sog'liq",
   "words": [
    {
     "en": "doctor",
     "uz": "shifokor"
    },
    {
     "en": "medicine",
     "uz": "dori"
    },
    {
     "en": "pain",
     "uz": "og'riq"
    },
    {
     "en": "fever",
     "uz": "isitma"
    },
    {
     "en": "cough",
     "uz": "yo'tal"
    },
    {
     "en": "headache",
     "uz": "bosh og'rig'i"
    },
    {
     "en": "healthy",
     "uz": "sog'lom"
    },
    {
     "en": "sick",
     "uz": "kasal"
    },
    {
     "en": "pharmacy",
     "uz": "dorixona"
    },
    {
     "en": "appointment",
     "uz": "qabul vaqti"
    }
   ]
  },
  {
   "theme": "Kasblar",
   "words": [
    {
     "en": "engineer",
     "uz": "muhandis"
    },
    {
     "en": "nurse",
     "uz": "hamshira"
    },
    {
     "en": "lawyer",
     "uz": "advokat"
    },
    {
     "en": "farmer",
     "uz": "dehqon"
    },
    {
     "en": "chef",
     "uz": "oshpaz"
    },
    {
     "en": "pilot",
     "uz": "uchuvchi"
    },
    {
     "en": "singer",
     "uz": "qo'shiqchi"
    },
    {
     "en": "businessman",
     "uz": "tadbirkor"
    },
    {
     "en": "manager",
     "uz": "menejer"
    },
    {
     "en": "dentist",
     "uz": "tish shifokori"
    }
   ]
  },
  {
   "theme": "Ofis va ish",
   "words": [
    {
     "en": "office",
     "uz": "ofis"
    },
    {
     "en": "job",
     "uz": "ish"
    },
    {
     "en": "salary",
     "uz": "maosh"
    },
    {
     "en": "boss",
     "uz": "boshliq"
    },
    {
     "en": "colleague",
     "uz": "hamkasb"
    },
    {
     "en": "meeting",
     "uz": "yig'ilish"
    },
    {
     "en": "email",
     "uz": "elektron pochta"
    },
    {
     "en": "report",
     "uz": "hisobot"
    },
    {
     "en": "project",
     "uz": "loyiha"
    },
    {
     "en": "team",
     "uz": "jamoa"
    }
   ]
  },
  {
   "theme": "Texnologiya",
   "words": [
    {
     "en": "computer",
     "uz": "kompyuter"
    },
    {
     "en": "internet",
     "uz": "internet"
    },
    {
     "en": "website",
     "uz": "veb-sayt"
    },
    {
     "en": "password",
     "uz": "parol"
    },
    {
     "en": "screen",
     "uz": "ekran"
    },
    {
     "en": "battery",
     "uz": "batareya"
    },
    {
     "en": "charger",
     "uz": "zaryadlovchi"
    },
    {
     "en": "download",
     "uz": "yuklab olmoq"
    },
    {
     "en": "app",
     "uz": "ilova"
    },
    {
     "en": "camera",
     "uz": "kamera"
    }
   ]
  },
  {
   "theme": "Hobbi",
   "words": [
    {
     "en": "hobby",
     "uz": "sevimli mashg'ulot"
    },
    {
     "en": "music",
     "uz": "musiqa"
    },
    {
     "en": "movie",
     "uz": "film"
    },
    {
     "en": "song",
     "uz": "qo'shiq"
    },
    {
     "en": "photo",
     "uz": "surat"
    },
    {
     "en": "dance",
     "uz": "raqsga tushmoq"
    },
    {
     "en": "sing",
     "uz": "kuylamoq"
    },
    {
     "en": "swim",
     "uz": "suzmoq"
    },
    {
     "en": "draw",
     "uz": "chizmoq"
    },
    {
     "en": "cook",
     "uz": "pishirmoq"
    }
   ]
  },
  {
   "theme": "Sport",
   "words": [
    {
     "en": "football",
     "uz": "futbol"
    },
    {
     "en": "player",
     "uz": "o'yinchi"
    },
    {
     "en": "match",
     "uz": "o'yin (musobaqa)"
    },
    {
     "en": "win",
     "uz": "g'alaba qozonmoq"
    },
    {
     "en": "lose",
     "uz": "yutqazmoq"
    },
    {
     "en": "coach",
     "uz": "murabbiy"
    },
    {
     "en": "ball",
     "uz": "to'p"
    },
    {
     "en": "exercise",
     "uz": "mashq"
    },
    {
     "en": "stadium",
     "uz": "stadion"
    },
    {
     "en": "race",
     "uz": "poyga"
    }
   ]
  },
  {
   "theme": "His-tuyg'ular",
   "words": [
    {
     "en": "excited",
     "uz": "hayajonlangan"
    },
    {
     "en": "bored",
     "uz": "zerikkan"
    },
    {
     "en": "worried",
     "uz": "xavotirda"
    },
    {
     "en": "nervous",
     "uz": "asabiy"
    },
    {
     "en": "proud",
     "uz": "faxrlangan"
    },
    {
     "en": "lonely",
     "uz": "yolg'iz"
    },
    {
     "en": "surprised",
     "uz": "hayratlangan"
    },
    {
     "en": "afraid",
     "uz": "qo'rqqan"
    },
    {
     "en": "calm",
     "uz": "xotirjam"
    },
    {
     "en": "confident",
     "uz": "ishonchli"
    }
   ]
  },
  {
   "theme": "Kundalik harakatlar",
   "words": [
    {
     "en": "wake up",
     "uz": "uyg'onmoq"
    },
    {
     "en": "get up",
     "uz": "o'rnidan turmoq"
    },
    {
     "en": "wash",
     "uz": "yuvmoq"
    },
    {
     "en": "sweep",
     "uz": "supurmoq"
    },
    {
     "en": "wait",
     "uz": "kutmoq"
    },
    {
     "en": "meet",
     "uz": "uchrashmoq"
    },
    {
     "en": "visit",
     "uz": "tashrif buyurmoq"
    },
    {
     "en": "invite",
     "uz": "taklif qilmoq"
    },
    {
     "en": "borrow",
     "uz": "qarzga olmoq"
    },
    {
     "en": "lend",
     "uz": "qarzga bermoq"
    }
   ]
  },
  {
   "theme": "Yo'nalish va joy",
   "words": [
    {
     "en": "straight",
     "uz": "to'g'riga"
    },
    {
     "en": "turn",
     "uz": "burilmoq"
    },
    {
     "en": "corner",
     "uz": "burchak"
    },
    {
     "en": "opposite",
     "uz": "qarshisida"
    },
    {
     "en": "next to",
     "uz": "yonida"
    },
    {
     "en": "behind",
     "uz": "orqasida"
    },
    {
     "en": "between",
     "uz": "orasida"
    },
    {
     "en": "in front of",
     "uz": "oldida"
    },
    {
     "en": "direction",
     "uz": "yo'nalish"
    },
    {
     "en": "distance",
     "uz": "masofa"
    }
   ]
  },
  {
   "theme": "Fasllar va oylar",
   "words": [
    {
     "en": "spring",
     "uz": "bahor"
    },
    {
     "en": "summer",
     "uz": "yoz"
    },
    {
     "en": "autumn",
     "uz": "kuz"
    },
    {
     "en": "winter",
     "uz": "qish"
    },
    {
     "en": "January",
     "uz": "yanvar"
    },
    {
     "en": "July",
     "uz": "iyul"
    },
    {
     "en": "October",
     "uz": "oktyabr"
    },
    {
     "en": "December",
     "uz": "dekabr"
    },
    {
     "en": "holiday",
     "uz": "bayram"
    },
    {
     "en": "birthday",
     "uz": "tug'ilgan kun"
    }
   ]
  },
  {
   "theme": "Pul va to'lov",
   "words": [
    {
     "en": "money",
     "uz": "pul"
    },
    {
     "en": "account",
     "uz": "hisob raqami"
    },
    {
     "en": "card",
     "uz": "karta"
    },
    {
     "en": "save",
     "uz": "jamg'armoq"
    },
    {
     "en": "spend",
     "uz": "sarflamoq"
    },
    {
     "en": "pay",
     "uz": "to'lamoq"
    },
    {
     "en": "earn",
     "uz": "ishlab topmoq"
    },
    {
     "en": "coin",
     "uz": "tanga"
    },
    {
     "en": "wallet",
     "uz": "hamyon"
    },
    {
     "en": "rich",
     "uz": "boy"
    }
   ]
  },
  {
   "theme": "Aloqa",
   "words": [
    {
     "en": "call",
     "uz": "qo'ng'iroq qilmoq"
    },
    {
     "en": "message",
     "uz": "xabar"
    },
    {
     "en": "letter",
     "uz": "xat"
    },
    {
     "en": "send",
     "uz": "yubormoq"
    },
    {
     "en": "receive",
     "uz": "qabul qilmoq"
    },
    {
     "en": "reply",
     "uz": "javob bermoq"
    },
    {
     "en": "language",
     "uz": "til"
    },
    {
     "en": "mail",
     "uz": "pochta"
    },
    {
     "en": "address",
     "uz": "manzil"
    },
    {
     "en": "contact",
     "uz": "bog'lanmoq"
    }
   ]
  },
  {
   "theme": "Oshxona buyumlari",
   "words": [
    {
     "en": "fridge",
     "uz": "muzlatgich"
    },
    {
     "en": "stove",
     "uz": "plita"
    },
    {
     "en": "cup",
     "uz": "piyola"
    },
    {
     "en": "plate",
     "uz": "likopcha"
    },
    {
     "en": "knife",
     "uz": "pichoq"
    },
    {
     "en": "spoon",
     "uz": "qoshiq"
    },
    {
     "en": "fork",
     "uz": "vilka"
    },
    {
     "en": "soap",
     "uz": "sovun"
    },
    {
     "en": "garbage",
     "uz": "chiqindi"
    },
    {
     "en": "dishes",
     "uz": "idish-tovoq"
    }
   ]
  },
  {
   "theme": "Shahar xizmatlari",
   "words": [
    {
     "en": "library",
     "uz": "kutubxona"
    },
    {
     "en": "museum",
     "uz": "muzey"
    },
    {
     "en": "cinema",
     "uz": "kinoteatr"
    },
    {
     "en": "restaurant",
     "uz": "restoran"
    },
    {
     "en": "supermarket",
     "uz": "supermarket"
    },
    {
     "en": "bakery",
     "uz": "nonvoyxona"
    },
    {
     "en": "post office",
     "uz": "pochta bo'limi"
    },
    {
     "en": "crossroad",
     "uz": "chorraha"
    },
    {
     "en": "traffic",
     "uz": "tirbandlik"
    },
    {
     "en": "police",
     "uz": "politsiya"
    }
   ]
  },
  {
   "theme": "Munosabatlar",
   "words": [
    {
     "en": "neighbor",
     "uz": "qo'shni"
    },
    {
     "en": "relative",
     "uz": "qarindosh"
    },
    {
     "en": "couple",
     "uz": "juftlik"
    },
    {
     "en": "marry",
     "uz": "uylanmoq"
    },
    {
     "en": "wedding",
     "uz": "to'y"
    },
    {
     "en": "gift",
     "uz": "sovg'a"
    },
    {
     "en": "party",
     "uz": "ziyofat"
    },
    {
     "en": "stranger",
     "uz": "notanish"
    },
    {
     "en": "together",
     "uz": "birga"
    },
    {
     "en": "guest list",
     "uz": "mehmonlar ro'yxati"
    }
   ]
  },
  {
   "theme": "Foydali so'zlar",
   "words": [
    {
     "en": "important",
     "uz": "muhim"
    },
    {
     "en": "possible",
     "uz": "mumkin"
    },
    {
     "en": "necessary",
     "uz": "zarur"
    },
    {
     "en": "free",
     "uz": "bepul"
    },
    {
     "en": "busy",
     "uz": "band"
    },
    {
     "en": "ready",
     "uz": "tayyor"
    },
    {
     "en": "dangerous",
     "uz": "xavfli"
    },
    {
     "en": "safe",
     "uz": "xavfsiz"
    },
    {
     "en": "usually",
     "uz": "odatda"
    },
    {
     "en": "suddenly",
     "uz": "to'satdan"
    }
   ]
  }
 ],
 "B1": [
  {
   "theme": "Ish topish",
   "words": [
    {
     "en": "career",
     "uz": "kasb yo'li"
    },
    {
     "en": "application",
     "uz": "ariza"
    },
    {
     "en": "interview",
     "uz": "suhbat"
    },
    {
     "en": "experience",
     "uz": "tajriba"
    },
    {
     "en": "skill",
     "uz": "ko'nikma"
    },
    {
     "en": "resume",
     "uz": "rezyume"
    },
    {
     "en": "employer",
     "uz": "ish beruvchi"
    },
    {
     "en": "employee",
     "uz": "xodim"
    },
    {
     "en": "qualification",
     "uz": "malaka"
    },
    {
     "en": "vacancy",
     "uz": "bo'sh ish o'rni"
    }
   ]
  },
  {
   "theme": "Ish jarayoni",
   "words": [
    {
     "en": "schedule",
     "uz": "jadval"
    },
    {
     "en": "deadline",
     "uz": "oxirgi muddat"
    },
    {
     "en": "task",
     "uz": "vazifa"
    },
    {
     "en": "achieve",
     "uz": "erishmoq"
    },
    {
     "en": "manage",
     "uz": "boshqarmoq"
    },
    {
     "en": "responsible",
     "uz": "mas'ul"
    },
    {
     "en": "improve",
     "uz": "yaxshilamoq"
    },
    {
     "en": "suggest",
     "uz": "taklif qilmoq"
    },
    {
     "en": "decision",
     "uz": "qaror"
    },
    {
     "en": "priority",
     "uz": "ustuvor vazifa"
    }
   ]
  },
  {
   "theme": "Ta'lim",
   "words": [
    {
     "en": "education",
     "uz": "ta'lim"
    },
    {
     "en": "degree",
     "uz": "ilmiy daraja"
    },
    {
     "en": "university",
     "uz": "universitet"
    },
    {
     "en": "subject",
     "uz": "fan"
    },
    {
     "en": "course",
     "uz": "kurs"
    },
    {
     "en": "scholarship",
     "uz": "stipendiya"
    },
    {
     "en": "knowledge",
     "uz": "bilim"
    },
    {
     "en": "mistake",
     "uz": "xato"
    },
    {
     "en": "practice",
     "uz": "mashq qilmoq"
    },
    {
     "en": "graduate",
     "uz": "bitirmoq"
    }
   ]
  },
  {
   "theme": "Sog'lom turmush",
   "words": [
    {
     "en": "diet",
     "uz": "parhez"
    },
    {
     "en": "stress",
     "uz": "stress"
    },
    {
     "en": "habit",
     "uz": "odat"
    },
    {
     "en": "energy",
     "uz": "quvvat"
    },
    {
     "en": "weight",
     "uz": "vazn"
    },
    {
     "en": "injury",
     "uz": "jarohat"
    },
    {
     "en": "recover",
     "uz": "tuzalmoq"
    },
    {
     "en": "balanced",
     "uz": "muvozanatli"
    },
    {
     "en": "avoid",
     "uz": "oldini olmoq"
    },
    {
     "en": "treatment",
     "uz": "davolash"
    }
   ]
  },
  {
   "theme": "Pul va moliya",
   "words": [
    {
     "en": "budget",
     "uz": "byudjet"
    },
    {
     "en": "loan",
     "uz": "kredit"
    },
    {
     "en": "interest",
     "uz": "foiz"
    },
    {
     "en": "tax",
     "uz": "soliq"
    },
    {
     "en": "income",
     "uz": "daromad"
    },
    {
     "en": "expense",
     "uz": "xarajat"
    },
    {
     "en": "debt",
     "uz": "qarz"
    },
    {
     "en": "invest",
     "uz": "sarmoya kiritmoq"
    },
    {
     "en": "profit",
     "uz": "foyda"
    },
    {
     "en": "afford",
     "uz": "qurbi yetmoq"
    }
   ]
  },
  {
   "theme": "Yangiliklar va media",
   "words": [
    {
     "en": "news",
     "uz": "yangilik"
    },
    {
     "en": "headline",
     "uz": "sarlavha"
    },
    {
     "en": "journalist",
     "uz": "jurnalist"
    },
    {
     "en": "article",
     "uz": "maqola"
    },
    {
     "en": "broadcast",
     "uz": "efirga uzatmoq"
    },
    {
     "en": "social media",
     "uz": "ijtimoiy tarmoqlar"
    },
    {
     "en": "advertisement",
     "uz": "reklama"
    },
    {
     "en": "rumor",
     "uz": "mish-mish"
    },
    {
     "en": "source",
     "uz": "manba"
    },
    {
     "en": "audience",
     "uz": "auditoriya"
    }
   ]
  },
  {
   "theme": "Sayohat vaziyatlari",
   "words": [
    {
     "en": "delay",
     "uz": "kechikish"
    },
    {
     "en": "cancel",
     "uz": "bekor qilmoq"
    },
    {
     "en": "customs",
     "uz": "bojxona"
    },
    {
     "en": "insurance",
     "uz": "sug'urta"
    },
    {
     "en": "souvenir",
     "uz": "esdalik sovg'a"
    },
    {
     "en": "accommodation",
     "uz": "turar joy"
    },
    {
     "en": "destination",
     "uz": "borish manzili"
    },
    {
     "en": "itinerary",
     "uz": "sayohat rejasi"
    },
    {
     "en": "complain",
     "uz": "shikoyat qilmoq"
    },
    {
     "en": "luggage allowance",
     "uz": "yuk me'yori"
    }
   ]
  },
  {
   "theme": "Munosabatlar",
   "words": [
    {
     "en": "argument",
     "uz": "janjal"
    },
    {
     "en": "trust",
     "uz": "ishonch"
    },
    {
     "en": "respect",
     "uz": "hurmat"
    },
    {
     "en": "support",
     "uz": "qo'llab-quvvatlamoq"
    },
    {
     "en": "apologize",
     "uz": "uzr so'ramoq"
    },
    {
     "en": "misunderstand",
     "uz": "noto'g'ri tushunmoq"
    },
    {
     "en": "relationship",
     "uz": "munosabat"
    },
    {
     "en": "behave",
     "uz": "o'zini tutmoq"
    },
    {
     "en": "forgive",
     "uz": "kechirmoq"
    },
    {
     "en": "generous",
     "uz": "saxiy"
    }
   ]
  },
  {
   "theme": "Fikr bildirish",
   "words": [
    {
     "en": "opinion",
     "uz": "fikr"
    },
    {
     "en": "agree",
     "uz": "kelishmoq"
    },
    {
     "en": "disagree",
     "uz": "rozi bo'lmaslik"
    },
    {
     "en": "argue",
     "uz": "bahslashmoq"
    },
    {
     "en": "recommend",
     "uz": "tavsiya qilmoq"
    },
    {
     "en": "prefer",
     "uz": "afzal ko'rmoq"
    },
    {
     "en": "suppose",
     "uz": "faraz qilmoq"
    },
    {
     "en": "prove",
     "uz": "isbotlamoq"
    },
    {
     "en": "doubt",
     "uz": "shubha"
    },
    {
     "en": "insist",
     "uz": "turib olmoq"
    }
   ]
  },
  {
   "theme": "Atrof-muhit",
   "words": [
    {
     "en": "environment",
     "uz": "atrof-muhit"
    },
    {
     "en": "pollution",
     "uz": "ifloslanish"
    },
    {
     "en": "recycle",
     "uz": "qayta ishlamoq"
    },
    {
     "en": "climate",
     "uz": "iqlim"
    },
    {
     "en": "fuel",
     "uz": "yoqilg'i"
    },
    {
     "en": "resource",
     "uz": "resurs"
    },
    {
     "en": "protect",
     "uz": "himoya qilmoq"
    },
    {
     "en": "wildlife",
     "uz": "yovvoyi tabiat"
    },
    {
     "en": "waste",
     "uz": "chiqindi"
    },
    {
     "en": "flood",
     "uz": "toshqin"
    }
   ]
  },
  {
   "theme": "Raqamli hayot",
   "words": [
    {
     "en": "software",
     "uz": "dasturiy ta'minot"
    },
    {
     "en": "update",
     "uz": "yangilamoq"
    },
    {
     "en": "install",
     "uz": "o'rnatmoq"
    },
    {
     "en": "device",
     "uz": "qurilma"
    },
    {
     "en": "network",
     "uz": "tarmoq"
    },
    {
     "en": "data",
     "uz": "ma'lumotlar"
    },
    {
     "en": "file",
     "uz": "fayl"
    },
    {
     "en": "search",
     "uz": "qidirmoq"
    },
    {
     "en": "online",
     "uz": "onlayn"
    },
    {
     "en": "security",
     "uz": "xavfsizlik"
    }
   ]
  },
  {
   "theme": "Jamiyat",
   "words": [
    {
     "en": "community",
     "uz": "hamjamiyat"
    },
    {
     "en": "citizen",
     "uz": "fuqaro"
    },
    {
     "en": "law",
     "uz": "qonun"
    },
    {
     "en": "right",
     "uz": "huquq"
    },
    {
     "en": "government",
     "uz": "hukumat"
    },
    {
     "en": "population",
     "uz": "aholi"
    },
    {
     "en": "tradition",
     "uz": "an'ana"
    },
    {
     "en": "culture",
     "uz": "madaniyat"
    },
    {
     "en": "society",
     "uz": "jamiyat"
    },
    {
     "en": "volunteer",
     "uz": "ko'ngilli"
    }
   ]
  },
  {
   "theme": "His-tuyg'ular (chuqur)",
   "words": [
    {
     "en": "disappointed",
     "uz": "hafsalasi pir bo'lgan"
    },
    {
     "en": "embarrassed",
     "uz": "xijolat bo'lgan"
    },
    {
     "en": "frustrated",
     "uz": "g'ashi kelgan"
    },
    {
     "en": "grateful",
     "uz": "minnatdor"
    },
    {
     "en": "anxious",
     "uz": "bezovta"
    },
    {
     "en": "curious",
     "uz": "qiziquvchan"
    },
    {
     "en": "thrilled",
     "uz": "behad xursand"
    },
    {
     "en": "confused",
     "uz": "sarosimada"
    },
    {
     "en": "relieved",
     "uz": "yengil tortgan"
    },
    {
     "en": "determined",
     "uz": "qat'iyatli"
    }
   ]
  },
  {
   "theme": "Reja va tanlov",
   "words": [
    {
     "en": "intend",
     "uz": "niyat qilmoq"
    },
    {
     "en": "aim",
     "uz": "maqsad qilmoq"
    },
    {
     "en": "goal",
     "uz": "maqsad"
    },
    {
     "en": "opportunity",
     "uz": "imkoniyat"
    },
    {
     "en": "risk",
     "uz": "xavf"
    },
    {
     "en": "choice",
     "uz": "tanlov"
    },
    {
     "en": "alternative",
     "uz": "muqobil"
    },
    {
     "en": "expect",
     "uz": "kutmoq"
    },
    {
     "en": "depend",
     "uz": "bog'liq bo'lmoq"
    },
    {
     "en": "option",
     "uz": "variant"
    }
   ]
  },
  {
   "theme": "Sabab va natija",
   "words": [
    {
     "en": "reason",
     "uz": "sabab"
    },
    {
     "en": "result",
     "uz": "natija"
    },
    {
     "en": "effect",
     "uz": "ta'sir"
    },
    {
     "en": "cause",
     "uz": "sabab bo'lmoq"
    },
    {
     "en": "influence",
     "uz": "ta'sir qilmoq"
    },
    {
     "en": "purpose",
     "uz": "maqsad (nima uchun)"
    },
    {
     "en": "benefit",
     "uz": "naf"
    },
    {
     "en": "damage",
     "uz": "zarar"
    },
    {
     "en": "solve",
     "uz": "hal qilmoq"
    },
    {
     "en": "solution",
     "uz": "yechim"
    }
   ]
  },
  {
   "theme": "Kundalik muammolar",
   "words": [
    {
     "en": "repair",
     "uz": "ta'mirlamoq"
    },
    {
     "en": "broken",
     "uz": "singan"
    },
    {
     "en": "lost",
     "uz": "yo'qolgan"
    },
    {
     "en": "complaint",
     "uz": "shikoyat"
    },
    {
     "en": "refund",
     "uz": "pulni qaytarish"
    },
    {
     "en": "warranty",
     "uz": "kafolat"
    },
    {
     "en": "service",
     "uz": "xizmat"
    },
    {
     "en": "fault",
     "uz": "nuqson"
    },
    {
     "en": "replace",
     "uz": "almashtirmoq"
    },
    {
     "en": "damaged",
     "uz": "shikastlangan"
    }
   ]
  },
  {
   "theme": "Xarakter sifatlari",
   "words": [
    {
     "en": "reliable",
     "uz": "ishonchli"
    },
    {
     "en": "honest",
     "uz": "halol"
    },
    {
     "en": "polite",
     "uz": "muloyim"
    },
    {
     "en": "rude",
     "uz": "qo'pol"
    },
    {
     "en": "lazy",
     "uz": "dangasa"
    },
    {
     "en": "ambitious",
     "uz": "intiluvchan"
    },
    {
     "en": "patient",
     "uz": "sabrli"
    },
    {
     "en": "creative",
     "uz": "ijodkor"
    },
    {
     "en": "shy",
     "uz": "uyatchan"
    },
    {
     "en": "stubborn",
     "uz": "o'jar"
    }
   ]
  },
  {
   "theme": "Ko'p ishlatiladigan fe'llar",
   "words": [
    {
     "en": "carry",
     "uz": "ko'tarib yurmoq"
    },
    {
     "en": "collect",
     "uz": "yig'moq"
    },
    {
     "en": "compare",
     "uz": "solishtirmoq"
    },
    {
     "en": "consider",
     "uz": "o'ylab ko'rmoq"
    },
    {
     "en": "contain",
     "uz": "o'z ichiga olmoq"
    },
    {
     "en": "describe",
     "uz": "ta'riflamoq"
    },
    {
     "en": "develop",
     "uz": "rivojlanmoq"
    },
    {
     "en": "explain",
     "uz": "tushuntirmoq"
    },
    {
     "en": "increase",
     "uz": "oshmoq"
    },
    {
     "en": "reduce",
     "uz": "kamaytirmoq"
    }
   ]
  },
  {
   "theme": "Bog'lovchi so'zlar",
   "words": [
    {
     "en": "although",
     "uz": "garchi"
    },
    {
     "en": "however",
     "uz": "biroq"
    },
    {
     "en": "therefore",
     "uz": "shuning uchun"
    },
    {
     "en": "meanwhile",
     "uz": "shu orada"
    },
    {
     "en": "besides",
     "uz": "bundan tashqari"
    },
    {
     "en": "otherwise",
     "uz": "aks holda"
    },
    {
     "en": "instead",
     "uz": "o'rniga"
    },
    {
     "en": "actually",
     "uz": "aslida"
    },
    {
     "en": "probably",
     "uz": "ehtimol"
    },
    {
     "en": "especially",
     "uz": "ayniqsa"
    }
   ]
  },
  {
   "theme": "Vaqt va chastota",
   "words": [
    {
     "en": "recently",
     "uz": "yaqinda"
    },
    {
     "en": "currently",
     "uz": "hozirgi paytda"
    },
    {
     "en": "previously",
     "uz": "ilgari"
    },
    {
     "en": "frequently",
     "uz": "tez-tez"
    },
    {
     "en": "occasionally",
     "uz": "ba'zan"
    },
    {
     "en": "permanent",
     "uz": "doimiy"
    },
    {
     "en": "temporary",
     "uz": "vaqtinchalik"
    },
    {
     "en": "regularly",
     "uz": "muntazam"
    },
    {
     "en": "immediately",
     "uz": "darhol"
    },
    {
     "en": "finally",
     "uz": "nihoyat"
    }
   ]
  }
 ],
 "B2": [
  {
   "theme": "Biznes",
   "words": [
    {
     "en": "revenue",
     "uz": "tushum"
    },
    {
     "en": "negotiate",
     "uz": "muzokara olib bormoq"
    },
    {
     "en": "contract",
     "uz": "shartnoma"
    },
    {
     "en": "competitor",
     "uz": "raqobatchi"
    },
    {
     "en": "strategy",
     "uz": "strategiya"
    },
    {
     "en": "supplier",
     "uz": "yetkazib beruvchi"
    },
    {
     "en": "invoice",
     "uz": "hisob-faktura"
    },
    {
     "en": "stakeholder",
     "uz": "manfaatdor tomon"
    },
    {
     "en": "merchant",
     "uz": "savdogar"
    },
    {
     "en": "logistics",
     "uz": "logistika"
    }
   ]
  },
  {
   "theme": "Ish joyida",
   "words": [
    {
     "en": "promotion",
     "uz": "lavozimda ko'tarilish"
    },
    {
     "en": "resign",
     "uz": "iste'foga chiqmoq"
    },
    {
     "en": "workload",
     "uz": "ish hajmi"
    },
    {
     "en": "delegate",
     "uz": "vazifa topshirmoq"
    },
    {
     "en": "collaborate",
     "uz": "hamkorlik qilmoq"
    },
    {
     "en": "feedback",
     "uz": "fikr-mulohaza"
    },
    {
     "en": "performance",
     "uz": "samaradorlik"
    },
    {
     "en": "expertise",
     "uz": "mahorat"
    },
    {
     "en": "commute",
     "uz": "ishga qatnamoq"
    },
    {
     "en": "overtime",
     "uz": "qo'shimcha ish vaqti"
    }
   ]
  },
  {
   "theme": "Ilm va tadqiqot",
   "words": [
    {
     "en": "hypothesis",
     "uz": "gipoteza"
    },
    {
     "en": "evidence",
     "uz": "dalil"
    },
    {
     "en": "analyze",
     "uz": "tahlil qilmoq"
    },
    {
     "en": "theory",
     "uz": "nazariya"
    },
    {
     "en": "survey",
     "uz": "so'rovnoma"
    },
    {
     "en": "conclude",
     "uz": "xulosa qilmoq"
    },
    {
     "en": "assumption",
     "uz": "taxmin"
    },
    {
     "en": "statistics",
     "uz": "statistika"
    },
    {
     "en": "findings",
     "uz": "natijalar"
    },
    {
     "en": "valid",
     "uz": "asosli"
    }
   ]
  },
  {
   "theme": "Munozara",
   "words": [
    {
     "en": "debate",
     "uz": "munozara"
    },
    {
     "en": "persuade",
     "uz": "ko'ndirmoq"
    },
    {
     "en": "criticize",
     "uz": "tanqid qilmoq"
    },
    {
     "en": "justify",
     "uz": "asoslamoq"
    },
    {
     "en": "refute",
     "uz": "rad etmoq"
    },
    {
     "en": "oppose",
     "uz": "qarshi chiqmoq"
    },
    {
     "en": "admit",
     "uz": "tan olmoq"
    },
    {
     "en": "emphasize",
     "uz": "ta'kidlamoq"
    },
    {
     "en": "controversial",
     "uz": "bahsli"
    },
    {
     "en": "viewpoint",
     "uz": "nuqtai nazar"
    }
   ]
  },
  {
   "theme": "Ijtimoiy muammolar",
   "words": [
    {
     "en": "poverty",
     "uz": "qashshoqlik"
    },
    {
     "en": "inequality",
     "uz": "tengsizlik"
    },
    {
     "en": "unemployment",
     "uz": "ishsizlik"
    },
    {
     "en": "discrimination",
     "uz": "kamsitish"
    },
    {
     "en": "crime",
     "uz": "jinoyat"
    },
    {
     "en": "homeless",
     "uz": "uysiz"
    },
    {
     "en": "immigration",
     "uz": "immigratsiya"
    },
    {
     "en": "welfare",
     "uz": "farovonlik"
    },
    {
     "en": "violence",
     "uz": "zo'ravonlik"
    },
    {
     "en": "corruption",
     "uz": "korrupsiya"
    }
   ]
  },
  {
   "theme": "Psixologiya",
   "words": [
    {
     "en": "motivation",
     "uz": "motivatsiya"
    },
    {
     "en": "self-esteem",
     "uz": "o'zini qadrlash"
    },
    {
     "en": "mindset",
     "uz": "fikrlash tarzi"
    },
    {
     "en": "behavior",
     "uz": "xulq-atvor"
    },
    {
     "en": "anxiety",
     "uz": "xavotir"
    },
    {
     "en": "perception",
     "uz": "idrok"
    },
    {
     "en": "resilience",
     "uz": "chidamlilik"
    },
    {
     "en": "memory",
     "uz": "xotira"
    },
    {
     "en": "attitude",
     "uz": "munosabat"
    },
    {
     "en": "instinct",
     "uz": "instinkt"
    }
   ]
  },
  {
   "theme": "Texnologiya va internet",
   "words": [
    {
     "en": "artificial intelligence",
     "uz": "sun'iy intellekt"
    },
    {
     "en": "algorithm",
     "uz": "algoritm"
    },
    {
     "en": "privacy",
     "uz": "shaxsiy hayot daxlsizligi"
    },
    {
     "en": "hacker",
     "uz": "xaker"
    },
    {
     "en": "encryption",
     "uz": "shifrlash"
    },
    {
     "en": "innovation",
     "uz": "innovatsiya"
    },
    {
     "en": "automation",
     "uz": "avtomatlashtirish"
    },
    {
     "en": "digital",
     "uz": "raqamli"
    },
    {
     "en": "platform",
     "uz": "platforma"
    },
    {
     "en": "breakthrough",
     "uz": "yangi kashfiyot"
    }
   ]
  },
  {
   "theme": "Tibbiyot",
   "words": [
    {
     "en": "symptom",
     "uz": "alomat"
    },
    {
     "en": "diagnosis",
     "uz": "tashxis"
    },
    {
     "en": "prescription",
     "uz": "retsept"
    },
    {
     "en": "chronic",
     "uz": "surunkali"
    },
    {
     "en": "allergy",
     "uz": "allergiya"
    },
    {
     "en": "vaccine",
     "uz": "vaksina"
    },
    {
     "en": "surgery",
     "uz": "jarrohlik"
    },
    {
     "en": "disease",
     "uz": "kasallik"
    },
    {
     "en": "immune",
     "uz": "immunitetli"
    },
    {
     "en": "ambulance",
     "uz": "tez yordam"
    }
   ]
  },
  {
   "theme": "Ekologiya",
   "words": [
    {
     "en": "sustainable",
     "uz": "barqaror"
    },
    {
     "en": "renewable",
     "uz": "qayta tiklanadigan"
    },
    {
     "en": "emission",
     "uz": "zararli chiqindilar"
    },
    {
     "en": "deforestation",
     "uz": "o'rmonlarning kesilishi"
    },
    {
     "en": "endangered",
     "uz": "yo'qolib borayotgan"
    },
    {
     "en": "global warming",
     "uz": "global isish"
    },
    {
     "en": "conservation",
     "uz": "tabiatni muhofaza qilish"
    },
    {
     "en": "greenhouse",
     "uz": "issiqxona"
    },
    {
     "en": "extinct",
     "uz": "qirilib ketgan"
    },
    {
     "en": "drought",
     "uz": "qurg'oqchilik"
    }
   ]
  },
  {
   "theme": "Qonun va davlat",
   "words": [
    {
     "en": "legislation",
     "uz": "qonunchilik"
    },
    {
     "en": "election",
     "uz": "saylov"
    },
    {
     "en": "policy",
     "uz": "siyosat"
    },
    {
     "en": "regulation",
     "uz": "qoida-tartib"
    },
    {
     "en": "parliament",
     "uz": "parlament"
    },
    {
     "en": "constitution",
     "uz": "konstitutsiya"
    },
    {
     "en": "vote",
     "uz": "ovoz bermoq"
    },
    {
     "en": "candidate",
     "uz": "nomzod"
    },
    {
     "en": "court",
     "uz": "sud"
    },
    {
     "en": "verdict",
     "uz": "hukm"
    }
   ]
  },
  {
   "theme": "Ommaviy axborot",
   "words": [
    {
     "en": "censorship",
     "uz": "senzura"
    },
    {
     "en": "bias",
     "uz": "tarafkashlik"
    },
    {
     "en": "publish",
     "uz": "nashr etmoq"
    },
    {
     "en": "editor",
     "uz": "muharrir"
    },
    {
     "en": "viral",
     "uz": "tez tarqaluvchi"
    },
    {
     "en": "credible",
     "uz": "ishonchli (manba)"
    },
    {
     "en": "propaganda",
     "uz": "tashviqot"
    },
    {
     "en": "coverage",
     "uz": "yoritish"
    },
    {
     "en": "subscribe",
     "uz": "obuna bo'lmoq"
    },
    {
     "en": "fake",
     "uz": "soxta"
    }
   ]
  },
  {
   "theme": "Rasmiy fe'llar 1",
   "words": [
    {
     "en": "acquire",
     "uz": "egallamoq"
    },
    {
     "en": "allocate",
     "uz": "ajratmoq"
    },
    {
     "en": "anticipate",
     "uz": "oldindan kutmoq"
    },
    {
     "en": "assess",
     "uz": "baholamoq"
    },
    {
     "en": "clarify",
     "uz": "oydinlashtirmoq"
    },
    {
     "en": "complement",
     "uz": "to'ldirmoq"
    },
    {
     "en": "demonstrate",
     "uz": "namoyish qilmoq"
    },
    {
     "en": "enhance",
     "uz": "yaxshilab bermoq"
    },
    {
     "en": "implement",
     "uz": "amalga oshirmoq"
    },
    {
     "en": "maintain",
     "uz": "saqlab turmoq"
    }
   ]
  },
  {
   "theme": "Rasmiy fe'llar 2",
   "words": [
    {
     "en": "acknowledge",
     "uz": "e'tirof etmoq"
    },
    {
     "en": "adapt",
     "uz": "moslashmoq"
    },
    {
     "en": "contribute",
     "uz": "hissa qo'shmoq"
    },
    {
     "en": "distinguish",
     "uz": "farqlamoq"
    },
    {
     "en": "eliminate",
     "uz": "bartaraf etmoq"
    },
    {
     "en": "establish",
     "uz": "asos solmoq"
    },
    {
     "en": "generate",
     "uz": "yaratmoq"
    },
    {
     "en": "interpret",
     "uz": "talqin qilmoq"
    },
    {
     "en": "participate",
     "uz": "ishtirok etmoq"
    },
    {
     "en": "undergo",
     "uz": "boshdan kechirmoq"
    }
   ]
  },
  {
   "theme": "Nozik sifatlar",
   "words": [
    {
     "en": "reluctant",
     "uz": "istaksiz"
    },
    {
     "en": "vulnerable",
     "uz": "himoyasiz"
    },
    {
     "en": "ambiguous",
     "uz": "noaniq"
    },
    {
     "en": "apparent",
     "uz": "ayon"
    },
    {
     "en": "significant",
     "uz": "sezilarli"
    },
    {
     "en": "substantial",
     "uz": "katta miqdordagi"
    },
    {
     "en": "inevitable",
     "uz": "muqarrar"
    },
    {
     "en": "genuine",
     "uz": "chin"
    },
    {
     "en": "subtle",
     "uz": "nozik"
    },
    {
     "en": "superficial",
     "uz": "yuzaki"
    }
   ]
  },
  {
   "theme": "Bog'lovchi va ravishlar",
   "words": [
    {
     "en": "nevertheless",
     "uz": "shunga qaramay"
    },
    {
     "en": "furthermore",
     "uz": "shuningdek"
    },
    {
     "en": "consequently",
     "uz": "natijada"
    },
    {
     "en": "whereas",
     "uz": "holbuki"
    },
    {
     "en": "hence",
     "uz": "shu sababli"
    },
    {
     "en": "moreover",
     "uz": "bundan tashqari"
    },
    {
     "en": "notably",
     "uz": "ayniqsa"
    },
    {
     "en": "thoroughly",
     "uz": "puxta"
    },
    {
     "en": "merely",
     "uz": "shunchaki"
    },
    {
     "en": "predominantly",
     "uz": "asosan"
    }
   ]
  },
  {
   "theme": "Qiyinchilikka chidash",
   "words": [
    {
     "en": "cope",
     "uz": "uddalamoq"
    },
    {
     "en": "overwhelm",
     "uz": "ezib tashlamoq"
    },
    {
     "en": "struggle",
     "uz": "kurashmoq"
    },
    {
     "en": "rely",
     "uz": "tayanmoq"
    },
    {
     "en": "resent",
     "uz": "ranjimoq"
    },
    {
     "en": "hesitate",
     "uz": "ikkilanmoq"
    },
    {
     "en": "neglect",
     "uz": "e'tiborsiz qoldirmoq"
    },
    {
     "en": "rush",
     "uz": "shoshilmoq"
    },
    {
     "en": "tolerate",
     "uz": "chidab turmoq"
    },
    {
     "en": "withdraw",
     "uz": "chekinmoq"
    }
   ]
  },
  {
   "theme": "Shaxslar",
   "words": [
    {
     "en": "sibling",
     "uz": "aka-uka yoki opa-singil"
    },
    {
     "en": "acquaintance",
     "uz": "tanish"
    },
    {
     "en": "mentor",
     "uz": "ustoz"
    },
    {
     "en": "rival",
     "uz": "raqib"
    },
    {
     "en": "spouse",
     "uz": "turmush o'rtog'i"
    },
    {
     "en": "guardian",
     "uz": "vasiy"
    },
    {
     "en": "peer",
     "uz": "tengdosh"
    },
    {
     "en": "ally",
     "uz": "ittifoqchi"
    },
    {
     "en": "companion",
     "uz": "hamroh"
    },
    {
     "en": "newcomer",
     "uz": "yangi kelgan"
    }
   ]
  },
  {
   "theme": "Iqtisodiyot",
   "words": [
    {
     "en": "inflation",
     "uz": "inflyatsiya"
    },
    {
     "en": "mortgage",
     "uz": "ipoteka"
    },
    {
     "en": "investment",
     "uz": "investitsiya"
    },
    {
     "en": "asset",
     "uz": "mol-mulk"
    },
    {
     "en": "liability",
     "uz": "majburiyat"
    },
    {
     "en": "bankruptcy",
     "uz": "bankrotlik"
    },
    {
     "en": "economy",
     "uz": "iqtisodiyot"
    },
    {
     "en": "recession",
     "uz": "iqtisodiy tushkunlik"
    },
    {
     "en": "wealth",
     "uz": "boylik"
    },
    {
     "en": "subsidy",
     "uz": "subsidiya"
    }
   ]
  },
  {
   "theme": "Oliy ta'lim",
   "words": [
    {
     "en": "curriculum",
     "uz": "o'quv dasturi"
    },
    {
     "en": "lecture",
     "uz": "ma'ruza"
    },
    {
     "en": "thesis",
     "uz": "dissertatsiya"
    },
    {
     "en": "internship",
     "uz": "amaliyot"
    },
    {
     "en": "tuition",
     "uz": "o'qish haqi"
    },
    {
     "en": "assignment",
     "uz": "topshiriq"
    },
    {
     "en": "academic",
     "uz": "akademik"
    },
    {
     "en": "vocational",
     "uz": "kasbiy"
    },
    {
     "en": "seminar",
     "uz": "seminar"
    },
    {
     "en": "dropout",
     "uz": "o'qishni tashlagan kishi"
    }
   ]
  },
  {
   "theme": "Mavhum tushunchalar",
   "words": [
    {
     "en": "concept",
     "uz": "tushuncha"
    },
    {
     "en": "principle",
     "uz": "tamoyil"
    },
    {
     "en": "phenomenon",
     "uz": "hodisa"
    },
    {
     "en": "trend",
     "uz": "yo'nalish (tendensiya)"
    },
    {
     "en": "aspect",
     "uz": "jihat"
    },
    {
     "en": "context",
     "uz": "kontekst"
    },
    {
     "en": "criteria",
     "uz": "mezonlar"
    },
    {
     "en": "approach",
     "uz": "yondashuv"
    },
    {
     "en": "framework",
     "uz": "asos (tizim)"
    },
    {
     "en": "consensus",
     "uz": "umumiy kelishuv"
    }
   ]
  }
 ],
 "C1": [
  {
   "theme": "Tahlil va fikrlash",
   "words": [
    {
     "en": "scrutinize",
     "uz": "sinchiklab o'rganmoq"
    },
    {
     "en": "speculate",
     "uz": "taxmin qilmoq"
    },
    {
     "en": "deduce",
     "uz": "xulosa chiqarmoq"
    },
    {
     "en": "infer",
     "uz": "anglab olmoq"
    },
    {
     "en": "contemplate",
     "uz": "chuqur o'ylamoq"
    },
    {
     "en": "discern",
     "uz": "ajrata bilmoq"
    },
    {
     "en": "ascertain",
     "uz": "aniq bilib olmoq"
    },
    {
     "en": "presume",
     "uz": "gumon qilmoq"
    },
    {
     "en": "reconcile",
     "uz": "muvofiqlashtirmoq"
    },
    {
     "en": "underpin",
     "uz": "asos bo'lmoq"
    }
   ]
  },
  {
   "theme": "Baho berish",
   "words": [
    {
     "en": "commend",
     "uz": "maqtamoq"
    },
    {
     "en": "condemn",
     "uz": "qoralamoq"
    },
    {
     "en": "denounce",
     "uz": "fosh etib qoralamoq"
    },
    {
     "en": "endorse",
     "uz": "ma'qullamoq"
    },
    {
     "en": "rebuke",
     "uz": "koyimoq"
    },
    {
     "en": "applaud",
     "uz": "olqishlamoq"
    },
    {
     "en": "scorn",
     "uz": "mensimaslik"
    },
    {
     "en": "revere",
     "uz": "hurmat qilmoq"
    },
    {
     "en": "mock",
     "uz": "masxara qilmoq"
    },
    {
     "en": "flatter",
     "uz": "xushomad qilmoq"
    }
   ]
  },
  {
   "theme": "Ta'sir va oqibat",
   "words": [
    {
     "en": "undermine",
     "uz": "zaiflashtirmoq"
    },
    {
     "en": "exacerbate",
     "uz": "og'irlashtirmoq"
    },
    {
     "en": "alleviate",
     "uz": "yengillashtirmoq"
    },
    {
     "en": "mitigate",
     "uz": "yumshatmoq"
    },
    {
     "en": "hinder",
     "uz": "to'sqinlik qilmoq"
    },
    {
     "en": "foster",
     "uz": "qo'llab o'stirmoq"
    },
    {
     "en": "trigger",
     "uz": "sabab bo'lmoq"
    },
    {
     "en": "precipitate",
     "uz": "tezlashtirmoq"
    },
    {
     "en": "curb",
     "uz": "jilovlamoq"
    },
    {
     "en": "amplify",
     "uz": "kuchaytirmoq"
    }
   ]
  },
  {
   "theme": "Shaxs xususiyatlari",
   "words": [
    {
     "en": "meticulous",
     "uz": "o'ta puxta"
    },
    {
     "en": "resilient",
     "uz": "chidamli"
    },
    {
     "en": "pragmatic",
     "uz": "amaliy fikrlovchi"
    },
    {
     "en": "arrogant",
     "uz": "takabbur"
    },
    {
     "en": "humble",
     "uz": "kamtar"
    },
    {
     "en": "ruthless",
     "uz": "shafqatsiz"
    },
    {
     "en": "gullible",
     "uz": "laqma"
    },
    {
     "en": "candid",
     "uz": "ochiqko'ngil"
    },
    {
     "en": "reserved",
     "uz": "ichiga yopiq"
    },
    {
     "en": "witty",
     "uz": "hozirjavob"
    }
   ]
  },
  {
   "theme": "Gapirish va ifodalash",
   "words": [
    {
     "en": "articulate",
     "uz": "aniq ifodalamoq"
    },
    {
     "en": "elaborate",
     "uz": "batafsil izohlamoq"
    },
    {
     "en": "allude",
     "uz": "ishora qilmoq"
    },
    {
     "en": "imply",
     "uz": "nazarda tutmoq"
    },
    {
     "en": "assert",
     "uz": "qat'iy ta'kidlamoq"
    },
    {
     "en": "concede",
     "uz": "yon bermoq"
    },
    {
     "en": "retort",
     "uz": "keskin javob qaytarmoq"
    },
    {
     "en": "insinuate",
     "uz": "piching qilmoq"
    },
    {
     "en": "rhetoric",
     "uz": "notiqlik san'ati"
    },
    {
     "en": "eloquent",
     "uz": "notiq"
    }
   ]
  },
  {
   "theme": "Siyosat va boshqaruv",
   "words": [
    {
     "en": "legitimate",
     "uz": "qonuniy"
    },
    {
     "en": "sanction",
     "uz": "sanksiya"
    },
    {
     "en": "merger",
     "uz": "qo'shilish"
    },
    {
     "en": "lobby",
     "uz": "lobbi qilmoq"
    },
    {
     "en": "mandate",
     "uz": "vakolat"
    },
    {
     "en": "leverage",
     "uz": "ta'sir vositasi"
    },
    {
     "en": "autonomy",
     "uz": "mustaqillik"
    },
    {
     "en": "coalition",
     "uz": "koalitsiya"
    },
    {
     "en": "hierarchy",
     "uz": "ierarxiya"
    },
    {
     "en": "bureaucracy",
     "uz": "byurokratiya"
    }
   ]
  },
  {
   "theme": "Vaqt va o'zgarish",
   "words": [
    {
     "en": "imminent",
     "uz": "yaqinlashib kelayotgan"
    },
    {
     "en": "transient",
     "uz": "o'tkinchi"
    },
    {
     "en": "obsolete",
     "uz": "eskirgan"
    },
    {
     "en": "sporadic",
     "uz": "vaqti-vaqti bilan"
    },
    {
     "en": "perpetual",
     "uz": "abadiy"
    },
    {
     "en": "gradual",
     "uz": "asta-sekin"
    },
    {
     "en": "abrupt",
     "uz": "keskin"
    },
    {
     "en": "dormant",
     "uz": "uyquda"
    },
    {
     "en": "prevalent",
     "uz": "keng tarqalgan"
    },
    {
     "en": "volatile",
     "uz": "o'zgaruvchan"
    }
   ]
  },
  {
   "theme": "Miqdor va daraja",
   "words": [
    {
     "en": "abundant",
     "uz": "mo'l-ko'l"
    },
    {
     "en": "scarce",
     "uz": "kamyob"
    },
    {
     "en": "negligible",
     "uz": "e'tiborga loyiq bo'lmagan"
    },
    {
     "en": "marginal",
     "uz": "ahamiyatsiz darajada"
    },
    {
     "en": "sufficient",
     "uz": "yetarli"
    },
    {
     "en": "excessive",
     "uz": "haddan tashqari"
    },
    {
     "en": "paramount",
     "uz": "eng muhim"
    },
    {
     "en": "trivial",
     "uz": "arzimas"
    },
    {
     "en": "formidable",
     "uz": "qo'rqinchli"
    },
    {
     "en": "adequate",
     "uz": "muvofiq"
    }
   ]
  },
  {
   "theme": "Chuqur his-tuyg'ular",
   "words": [
    {
     "en": "nostalgic",
     "uz": "sog'inchli"
    },
    {
     "en": "apprehensive",
     "uz": "xavotirga tushgan"
    },
    {
     "en": "indifferent",
     "uz": "befarq"
    },
    {
     "en": "euphoric",
     "uz": "xursandchilikdan sarmast"
    },
    {
     "en": "melancholy",
     "uz": "g'amgin"
    },
    {
     "en": "bitter",
     "uz": "alamli"
    },
    {
     "en": "content",
     "uz": "mamnun"
    },
    {
     "en": "resentful",
     "uz": "ranjigan"
    },
    {
     "en": "yearn",
     "uz": "jonu dil bilan istamoq"
    },
    {
     "en": "remorse",
     "uz": "pushaymonlik"
    }
   ]
  },
  {
   "theme": "Murakkab fe'llar 1",
   "words": [
    {
     "en": "adhere",
     "uz": "rioya qilmoq"
    },
    {
     "en": "bolster",
     "uz": "mustahkamlamoq"
    },
    {
     "en": "circumvent",
     "uz": "chetlab o'tmoq"
    },
    {
     "en": "compile",
     "uz": "to'plab tuzmoq"
    },
    {
     "en": "deter",
     "uz": "qaytarmoq"
    },
    {
     "en": "deplete",
     "uz": "tugatmoq"
    },
    {
     "en": "diminish",
     "uz": "kamaymoq"
    },
    {
     "en": "embark",
     "uz": "kirishmoq"
    },
    {
     "en": "evoke",
     "uz": "uyg'otmoq"
    },
    {
     "en": "refrain",
     "uz": "o'zini tiymoq"
    }
   ]
  },
  {
   "theme": "Murakkab fe'llar 2",
   "words": [
    {
     "en": "advocate",
     "uz": "targ'ib qilmoq"
    },
    {
     "en": "aspire",
     "uz": "orzu qilmoq"
    },
    {
     "en": "coincide",
     "uz": "to'g'ri kelmoq"
    },
    {
     "en": "compel",
     "uz": "majburlamoq"
    },
    {
     "en": "confer",
     "uz": "taqdim etmoq"
    },
    {
     "en": "consolidate",
     "uz": "birlashtirmoq"
    },
    {
     "en": "contend",
     "uz": "bahslashmoq"
    },
    {
     "en": "disseminate",
     "uz": "keng tarqatmoq"
    },
    {
     "en": "endeavor",
     "uz": "intilmoq"
    },
    {
     "en": "enumerate",
     "uz": "sanab chiqmoq"
    }
   ]
  },
  {
   "theme": "Ilmiy tilda",
   "words": [
    {
     "en": "empirical",
     "uz": "tajribaga asoslangan"
    },
    {
     "en": "paradigm",
     "uz": "paradigma"
    },
    {
     "en": "correlation",
     "uz": "o'zaro bog'liqlik"
    },
    {
     "en": "anomaly",
     "uz": "g'ayritabiiy holat"
    },
    {
     "en": "methodology",
     "uz": "metodologiya"
    },
    {
     "en": "replicate",
     "uz": "takrorlab ko'rmoq"
    },
    {
     "en": "rigorous",
     "uz": "qat'iy"
    },
    {
     "en": "validity",
     "uz": "haqqoniylik"
    },
    {
     "en": "variable",
     "uz": "o'zgaruvchi"
    },
    {
     "en": "axiom",
     "uz": "aksioma"
    }
   ]
  },
  {
   "theme": "Axloq va adolat",
   "words": [
    {
     "en": "ethical",
     "uz": "axloqiy"
    },
    {
     "en": "integrity",
     "uz": "halollik"
    },
    {
     "en": "accountable",
     "uz": "javobgar"
    },
    {
     "en": "fairness",
     "uz": "insof"
    },
    {
     "en": "hypocrisy",
     "uz": "ikkiyuzlamachilik"
    },
    {
     "en": "dilemma",
     "uz": "ikkilanish"
    },
    {
     "en": "justice",
     "uz": "odillik"
    },
    {
     "en": "impartial",
     "uz": "xolis"
    },
    {
     "en": "allegation",
     "uz": "ayblov"
    },
    {
     "en": "exploit",
     "uz": "suiiste'mol qilmoq"
    }
   ]
  },
  {
   "theme": "Jamiyat va madaniyat",
   "words": [
    {
     "en": "affluent",
     "uz": "badavlat"
    },
    {
     "en": "marginalized",
     "uz": "chetga surilgan"
    },
    {
     "en": "prejudice",
     "uz": "xurofot"
    },
    {
     "en": "stereotype",
     "uz": "qolip fikr"
    },
    {
     "en": "heritage",
     "uz": "meros"
    },
    {
     "en": "norm",
     "uz": "me'yor"
    },
    {
     "en": "coexist",
     "uz": "birga yashamoq"
    },
    {
     "en": "conformity",
     "uz": "moslashuvchanlik"
    },
    {
     "en": "elite",
     "uz": "saralar"
    },
    {
     "en": "solidarity",
     "uz": "hamjihatlik"
    }
   ]
  },
  {
   "theme": "Til nozikliklari",
   "words": [
    {
     "en": "connotation",
     "uz": "qo'shimcha ma'no"
    },
    {
     "en": "jargon",
     "uz": "jargon"
    },
    {
     "en": "idiom",
     "uz": "ibora"
    },
    {
     "en": "paraphrase",
     "uz": "boshqacha ifodalamoq"
    },
    {
     "en": "ambiguity",
     "uz": "noaniqlik"
    },
    {
     "en": "colloquial",
     "uz": "so'zlashuv tiliga oid"
    },
    {
     "en": "euphemism",
     "uz": "yumshatilgan ibora"
    },
    {
     "en": "nuance",
     "uz": "nozik farq"
    },
    {
     "en": "vernacular",
     "uz": "jonli xalq tili"
    },
    {
     "en": "terminology",
     "uz": "terminologiya"
    }
   ]
  },
  {
   "theme": "Qarama-qarshilik",
   "words": [
    {
     "en": "contradict",
     "uz": "zid bo'lmoq"
    },
    {
     "en": "paradox",
     "uz": "paradoks"
    },
    {
     "en": "ironic",
     "uz": "istehzoli"
    },
    {
     "en": "discrepancy",
     "uz": "nomuvofiqlik"
    },
    {
     "en": "contrast",
     "uz": "qarama-qarshi qo'ymoq"
    },
    {
     "en": "dichotomy",
     "uz": "ikkiga bo'linish"
    },
    {
     "en": "ambivalent",
     "uz": "ikkilangan"
    },
    {
     "en": "counterpart",
     "uz": "mos juft"
    },
    {
     "en": "divergent",
     "uz": "turlicha"
    },
    {
     "en": "converge",
     "uz": "yaqinlashmoq"
    }
   ]
  },
  {
   "theme": "Harakat uslubi",
   "words": [
    {
     "en": "deliberate",
     "uz": "o'ylangan"
    },
    {
     "en": "impulsive",
     "uz": "shoshma"
    },
    {
     "en": "cautious",
     "uz": "ehtiyotkor"
    },
    {
     "en": "reckless",
     "uz": "beparvo"
    },
    {
     "en": "prudent",
     "uz": "oqilona"
    },
    {
     "en": "decisive",
     "uz": "qat'iyatli"
    },
    {
     "en": "hesitant",
     "uz": "ikkilanuvchan"
    },
    {
     "en": "proactive",
     "uz": "tashabbuskor"
    },
    {
     "en": "persistent",
     "uz": "sabot bilan"
    },
    {
     "en": "thorough",
     "uz": "sinchkov"
    }
   ]
  },
  {
   "theme": "Muammo va yechim",
   "words": [
    {
     "en": "obstacle",
     "uz": "to'siq"
    },
    {
     "en": "setback",
     "uz": "orqaga ketish"
    },
    {
     "en": "predicament",
     "uz": "og'ir ahvol"
    },
    {
     "en": "remedy",
     "uz": "chora"
    },
    {
     "en": "resolve",
     "uz": "hal etmoq"
    },
    {
     "en": "contingency",
     "uz": "kutilmagan holat"
    },
    {
     "en": "pitfall",
     "uz": "yashirin xavf"
    },
    {
     "en": "bottleneck",
     "uz": "tiqilinch"
    },
    {
     "en": "workaround",
     "uz": "aylanma yechim"
    },
    {
     "en": "turning point",
     "uz": "burilish nuqtasi"
    }
   ]
  },
  {
   "theme": "Murakkab ravish va bog'lovchilar",
   "words": [
    {
     "en": "albeit",
     "uz": "garchi"
    },
    {
     "en": "notwithstanding",
     "uz": "qaramasdan"
    },
    {
     "en": "thereby",
     "uz": "shu orqali"
    },
    {
     "en": "henceforth",
     "uz": "bundan buyon"
    },
    {
     "en": "ultimately",
     "uz": "oxir-oqibat"
    },
    {
     "en": "arguably",
     "uz": "bahsli bo'lsa-da"
    },
    {
     "en": "presumably",
     "uz": "ehtimol"
    },
    {
     "en": "allegedly",
     "uz": "go'yoki"
    },
    {
     "en": "undoubtedly",
     "uz": "shubhasiz"
    },
    {
     "en": "seemingly",
     "uz": "ko'rinishidan"
    }
   ]
  },
  {
   "theme": "Boy lug'at",
   "words": [
    {
     "en": "tedious",
     "uz": "zerikarli"
    },
    {
     "en": "vivid",
     "uz": "yorqin"
    },
    {
     "en": "mundane",
     "uz": "kundalik"
    },
    {
     "en": "peculiar",
     "uz": "g'alati"
    },
    {
     "en": "bizarre",
     "uz": "g'ayrioddiy"
    },
    {
     "en": "flawless",
     "uz": "benuqson"
    },
    {
     "en": "lavish",
     "uz": "dabdabali"
    },
    {
     "en": "frail",
     "uz": "nimjon"
    },
    {
     "en": "sturdy",
     "uz": "mustahkam"
    },
    {
     "en": "versatile",
     "uz": "ko'p qirrali"
    }
   ]
  }
 ],
 "C2": [
  {
   "theme": "Yuksak darajadagi so'zlar",
   "words": [
    {
     "en": "ubiquitous",
     "uz": "hamma joyda uchraydigan"
    },
    {
     "en": "ephemeral",
     "uz": "o'tkinchi"
    },
    {
     "en": "serendipity",
     "uz": "kutilmagan omad"
    },
    {
     "en": "quintessential",
     "uz": "eng xarakterli"
    },
    {
     "en": "juxtapose",
     "uz": "yonma-yon qo'ymoq"
    },
    {
     "en": "plethora",
     "uz": "mo'llik"
    },
    {
     "en": "esoteric",
     "uz": "tor doiraga tushunarli"
    },
    {
     "en": "nebulous",
     "uz": "tumanli"
    },
    {
     "en": "pervasive",
     "uz": "har yerga singib ketgan"
    },
    {
     "en": "tenuous",
     "uz": "bo'sh"
    }
   ]
  },
  {
   "theme": "Aql va bilim",
   "words": [
    {
     "en": "astute",
     "uz": "zukko"
    },
    {
     "en": "erudite",
     "uz": "bilimdon"
    },
    {
     "en": "lucid",
     "uz": "ravshan"
    },
    {
     "en": "cogent",
     "uz": "ishonarli"
    },
    {
     "en": "fallacy",
     "uz": "xato xulosa"
    },
    {
     "en": "skeptical",
     "uz": "shubhali"
    },
    {
     "en": "discerning",
     "uz": "sinchkov"
    },
    {
     "en": "judicious",
     "uz": "ehtiyotkorona"
    },
    {
     "en": "perceptive",
     "uz": "sezgir"
    },
    {
     "en": "insightful",
     "uz": "teran"
    }
   ]
  },
  {
   "theme": "Nozik fe'llar 1",
   "words": [
    {
     "en": "assuage",
     "uz": "tinchitmoq"
    },
    {
     "en": "eschew",
     "uz": "chetlanmoq"
    },
    {
     "en": "extol",
     "uz": "ulug'lamoq"
    },
    {
     "en": "fathom",
     "uz": "anglab yetmoq"
    },
    {
     "en": "garner",
     "uz": "to'plamoq"
    },
    {
     "en": "inundate",
     "uz": "bosib ketmoq"
    },
    {
     "en": "lament",
     "uz": "nolimoq"
    },
    {
     "en": "mollify",
     "uz": "ko'nglini olmoq"
    },
    {
     "en": "permeate",
     "uz": "singib ketmoq"
    },
    {
     "en": "thwart",
     "uz": "barbod qilmoq"
    }
   ]
  },
  {
   "theme": "Kuchli sifatlar",
   "words": [
    {
     "en": "acrimonious",
     "uz": "zahrli"
    },
    {
     "en": "ardent",
     "uz": "ehtirosli"
    },
    {
     "en": "benign",
     "uz": "zararsiz"
    },
    {
     "en": "capricious",
     "uz": "injiq"
    },
    {
     "en": "cursory",
     "uz": "yuzaki"
    },
    {
     "en": "dauntless",
     "uz": "qo'rqmas"
    },
    {
     "en": "diligent",
     "uz": "tirishqoq"
    },
    {
     "en": "frugal",
     "uz": "tejamkor"
    },
    {
     "en": "garrulous",
     "uz": "gapdon"
    },
    {
     "en": "lenient",
     "uz": "yumshoq"
    }
   ]
  },
  {
   "theme": "Xarakter va tabiat",
   "words": [
    {
     "en": "pedantic",
     "uz": "mayda-chuyda"
    },
    {
     "en": "austere",
     "uz": "oddiy va qattiq"
    },
    {
     "en": "eccentric",
     "uz": "g'alati"
    },
    {
     "en": "magnanimous",
     "uz": "olijanob"
    },
    {
     "en": "stoic",
     "uz": "sabr-toqatli"
    },
    {
     "en": "whimsical",
     "uz": "injiq"
    },
    {
     "en": "zealous",
     "uz": "g'ayratli"
    },
    {
     "en": "cynical",
     "uz": "kinoyali"
    },
    {
     "en": "sardonic",
     "uz": "achchiq istehzoli"
    },
    {
     "en": "gregarious",
     "uz": "odamshavanda"
    }
   ]
  },
  {
   "theme": "Adabiyot",
   "words": [
    {
     "en": "allegory",
     "uz": "ramziy hikoya"
    },
    {
     "en": "anecdote",
     "uz": "latifa"
    },
    {
     "en": "satire",
     "uz": "hajviya"
    },
    {
     "en": "metaphor",
     "uz": "metafora"
    },
    {
     "en": "narrative",
     "uz": "hikoya"
    },
    {
     "en": "prose",
     "uz": "nasr"
    },
    {
     "en": "motif",
     "uz": "asosiy g'oya"
    },
    {
     "en": "protagonist",
     "uz": "bosh qahramon"
    },
    {
     "en": "epitome",
     "uz": "timsol"
    },
    {
     "en": "irony",
     "uz": "istehzo"
    }
   ]
  },
  {
   "theme": "Huquq",
   "words": [
    {
     "en": "jurisdiction",
     "uz": "yurisdiksiya"
    },
    {
     "en": "precedent",
     "uz": "pretsedent"
    },
    {
     "en": "testimony",
     "uz": "guvohlik"
    },
    {
     "en": "litigation",
     "uz": "sud jarayoni"
    },
    {
     "en": "statute",
     "uz": "nizom"
    },
    {
     "en": "clemency",
     "uz": "shafqat"
    },
    {
     "en": "repeal",
     "uz": "bekor qilmoq"
    },
    {
     "en": "dissent",
     "uz": "norozilik"
    },
    {
     "en": "veto",
     "uz": "veto"
    },
    {
     "en": "tribunal",
     "uz": "tribunal"
    }
   ]
  },
  {
   "theme": "Iqtisod va moliya",
   "words": [
    {
     "en": "austerity",
     "uz": "qattiq tejamkorlik"
    },
    {
     "en": "monopoly",
     "uz": "monopoliya"
    },
    {
     "en": "fiscal",
     "uz": "fiskal"
    },
    {
     "en": "surplus",
     "uz": "ortiqcha"
    },
    {
     "en": "deficit",
     "uz": "kamomad"
    },
    {
     "en": "liquidity",
     "uz": "likvidlik"
    },
    {
     "en": "speculation",
     "uz": "chayqovchilik"
    },
    {
     "en": "equity",
     "uz": "ulush kapitali"
    },
    {
     "en": "commodity",
     "uz": "xomashyo"
    },
    {
     "en": "prosperity",
     "uz": "gullab-yashnash"
    }
   ]
  },
  {
   "theme": "Nozik fe'llar 2",
   "words": [
    {
     "en": "ameliorate",
     "uz": "yaxshilamoq"
    },
    {
     "en": "augment",
     "uz": "ko'paytirmoq"
    },
    {
     "en": "castigate",
     "uz": "qattiq koyimoq"
    },
    {
     "en": "corroborate",
     "uz": "tasdiqlamoq"
    },
    {
     "en": "delineate",
     "uz": "aniq tasvirlamoq"
    },
    {
     "en": "dispel",
     "uz": "tarqatib yubormoq"
    },
    {
     "en": "epitomize",
     "uz": "timsoli bo'lmoq"
    },
    {
     "en": "expedite",
     "uz": "tezlashtirmoq"
    },
    {
     "en": "rectify",
     "uz": "to'g'rilamoq"
    },
    {
     "en": "reiterate",
     "uz": "takrorlamoq"
    }
   ]
  },
  {
   "theme": "Murakkab sifatlar",
   "words": [
    {
     "en": "arduous",
     "uz": "mashaqqatli"
    },
    {
     "en": "grueling",
     "uz": "toliqtiruvchi"
    },
    {
     "en": "impeccable",
     "uz": "beayb"
    },
    {
     "en": "intricate",
     "uz": "chigal"
    },
    {
     "en": "meager",
     "uz": "kam"
    },
    {
     "en": "opulent",
     "uz": "hashamatli"
    },
    {
     "en": "poignant",
     "uz": "ta'sirli"
    },
    {
     "en": "profound",
     "uz": "chuqur"
    },
    {
     "en": "lucrative",
     "uz": "daromadli"
    },
    {
     "en": "tangible",
     "uz": "sezilarli"
    }
   ]
  },
  {
   "theme": "Ravishlar",
   "words": [
    {
     "en": "inexorably",
     "uz": "to'xtovsiz"
    },
    {
     "en": "ostensibly",
     "uz": "ko'rinishda"
    },
    {
     "en": "scrupulously",
     "uz": "vijdonan"
    },
    {
     "en": "staunchly",
     "uz": "qat'iy"
    },
    {
     "en": "fleetingly",
     "uz": "lahzalik"
    },
    {
     "en": "inadvertently",
     "uz": "bexosdan"
    },
    {
     "en": "adamantly",
     "uz": "qat'iy turib"
    },
    {
     "en": "relentlessly",
     "uz": "ayovsiz"
    },
    {
     "en": "profoundly",
     "uz": "chuqur"
    },
    {
     "en": "decidedly",
     "uz": "shubhasiz"
    }
   ]
  },
  {
   "theme": "Tabiat tasviri",
   "words": [
    {
     "en": "serene",
     "uz": "sokin"
    },
    {
     "en": "tranquil",
     "uz": "osoyishta"
    },
    {
     "en": "desolate",
     "uz": "huvillagan"
    },
    {
     "en": "lush",
     "uz": "yam-yashil"
    },
    {
     "en": "barren",
     "uz": "cho'l-biyobon"
    },
    {
     "en": "tempestuous",
     "uz": "bo'ronli"
    },
    {
     "en": "luminous",
     "uz": "nurli"
    },
    {
     "en": "murky",
     "uz": "loyqa"
    },
    {
     "en": "verdant",
     "uz": "ko'm-ko'k"
    },
    {
     "en": "ethereal",
     "uz": "havodek yengil"
    }
   ]
  },
  {
   "theme": "Qiyin vaziyatlar",
   "words": [
    {
     "en": "adversity",
     "uz": "qiyinchilik"
    },
    {
     "en": "tribulation",
     "uz": "sinov"
    },
    {
     "en": "ordeal",
     "uz": "og'ir sinov"
    },
    {
     "en": "peril",
     "uz": "xavf-xatar"
    },
    {
     "en": "plight",
     "uz": "og'ir ahvol"
    },
    {
     "en": "havoc",
     "uz": "vayronagarchilik"
    },
    {
     "en": "turmoil",
     "uz": "tartibsizlik"
    },
    {
     "en": "upheaval",
     "uz": "katta ag'darilish"
    },
    {
     "en": "calamity",
     "uz": "ofat"
    },
    {
     "en": "solace",
     "uz": "taskin"
    }
   ]
  },
  {
   "theme": "Kayfiyat va munosabat",
   "words": [
    {
     "en": "aloof",
     "uz": "sovuqqon"
    },
    {
     "en": "sullen",
     "uz": "tund"
    },
    {
     "en": "jovial",
     "uz": "quvnoq"
    },
    {
     "en": "morose",
     "uz": "g'amgin"
    },
    {
     "en": "wistful",
     "uz": "armonli"
    },
    {
     "en": "elated",
     "uz": "ko'tarinki"
    },
    {
     "en": "disheartened",
     "uz": "ruhi tushgan"
    },
    {
     "en": "complacent",
     "uz": "o'zidan mamnun"
    },
    {
     "en": "wary",
     "uz": "hushyor"
    },
    {
     "en": "detached",
     "uz": "beparvo"
    }
   ]
  },
  {
   "theme": "Nutq va yozuv uslubi",
   "words": [
    {
     "en": "verbose",
     "uz": "so'zga cho'zilgan"
    },
    {
     "en": "succinct",
     "uz": "lo'nda"
    },
    {
     "en": "terse",
     "uz": "qisqa va keskin"
    },
    {
     "en": "florid",
     "uz": "bezakdor"
    },
    {
     "en": "laconic",
     "uz": "kamgap"
    },
    {
     "en": "rhetorical",
     "uz": "ritorik"
    },
    {
     "en": "prolific",
     "uz": "serunum"
    },
    {
     "en": "eloquence",
     "uz": "notiqlik"
    },
    {
     "en": "digress",
     "uz": "mavzudan chetga chiqmoq"
    },
    {
     "en": "discourse",
     "uz": "nutq"
    }
   ]
  },
  {
   "theme": "Munosabatlar va his",
   "words": [
    {
     "en": "allegiance",
     "uz": "sadoqat"
    },
    {
     "en": "animosity",
     "uz": "adovat"
    },
    {
     "en": "rapport",
     "uz": "o'zaro hamfikrlik"
    },
    {
     "en": "camaraderie",
     "uz": "o'rtoqlik"
    },
    {
     "en": "amicable",
     "uz": "do'stona"
    },
    {
     "en": "hostile",
     "uz": "dushmanona"
    },
    {
     "en": "aversion",
     "uz": "jirkanish"
    },
    {
     "en": "reciprocate",
     "uz": "javob qaytarmoq"
    },
    {
     "en": "empathy",
     "uz": "hamdardlik"
    },
    {
     "en": "resentment",
     "uz": "ranjish"
    }
   ]
  },
  {
   "theme": "Falsafa va g'oyalar",
   "words": [
    {
     "en": "dogma",
     "uz": "aqida"
    },
    {
     "en": "ideology",
     "uz": "mafkura"
    },
    {
     "en": "utopia",
     "uz": "utopiya"
    },
    {
     "en": "ethos",
     "uz": "ruh"
    },
    {
     "en": "rationale",
     "uz": "asoslash"
    },
    {
     "en": "skepticism",
     "uz": "shubhachilik"
    },
    {
     "en": "doctrine",
     "uz": "ta'limot"
    },
    {
     "en": "hedonism",
     "uz": "hazchilik"
    },
    {
     "en": "altruism",
     "uz": "fidoyilik"
    },
    {
     "en": "pragmatism",
     "uz": "pragmatizm"
    }
   ]
  },
  {
   "theme": "Harakat va o'zgarish",
   "words": [
    {
     "en": "meander",
     "uz": "burilib oqmoq"
    },
    {
     "en": "gravitate",
     "uz": "tortilmoq"
    },
    {
     "en": "vacillate",
     "uz": "ikkilanib turmoq"
    },
    {
     "en": "capitulate",
     "uz": "taslim bo'lmoq"
    },
    {
     "en": "abdicate",
     "uz": "voz kechmoq"
    },
    {
     "en": "proliferate",
     "uz": "ko'paymoq"
    },
    {
     "en": "dwindle",
     "uz": "kamayib bormoq"
    },
    {
     "en": "burgeon",
     "uz": "gullab-yashnamoq"
    },
    {
     "en": "wane",
     "uz": "susaymoq"
    },
    {
     "en": "culminate",
     "uz": "avjiga chiqmoq"
    }
   ]
  },
  {
   "theme": "Muloqot va ovoz",
   "words": [
    {
     "en": "banter",
     "uz": "hazil-mutoyiba"
    },
    {
     "en": "innuendo",
     "uz": "ishora"
    },
    {
     "en": "quip",
     "uz": "o'tkir hazil"
    },
    {
     "en": "ramble",
     "uz": "cho'zib gapirmoq"
    },
    {
     "en": "stammer",
     "uz": "duduqlanmoq"
    },
    {
     "en": "murmur",
     "uz": "shivirlamoq"
    },
    {
     "en": "clamor",
     "uz": "hayqiriq"
    },
    {
     "en": "exclaim",
     "uz": "hayqirib yubormoq"
    },
    {
     "en": "rebuttal",
     "uz": "raddiya"
    },
    {
     "en": "reprimand",
     "uz": "tanbeh bermoq"
    }
   ]
  },
  {
   "theme": "Cho'qqi va meros",
   "words": [
    {
     "en": "zenith",
     "uz": "cho'qqi"
    },
    {
     "en": "nadir",
     "uz": "eng quyi nuqta"
    },
    {
     "en": "legacy",
     "uz": "meros"
    },
    {
     "en": "milestone",
     "uz": "muhim bosqich"
    },
    {
     "en": "epoch",
     "uz": "davr"
    },
    {
     "en": "catalyst",
     "uz": "katalizator"
    },
    {
     "en": "harbinger",
     "uz": "xabarchi"
    },
    {
     "en": "pinnacle",
     "uz": "eng yuqori nuqta"
    },
    {
     "en": "vestige",
     "uz": "iz"
    },
    {
     "en": "anachronism",
     "uz": "zamonga to'g'ri kelmaslik"
    }
   ]
  }
 ]
};

const WORD_BANK = {};
for (const lvl of Object.keys(WORD_THEMES)) WORD_BANK[lvl] = WORD_THEMES[lvl].map(l => l.words);
const LESSON_THEMES = {};
for (const lvl of Object.keys(WORD_THEMES)) LESSON_THEMES[lvl] = WORD_THEMES[lvl].map(l => l.theme);
