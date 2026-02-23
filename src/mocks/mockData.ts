import { Image } from "react-native";
import { Locale, supportedLocales } from "../localization";

export type MockMilestone = {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  imageUrl: string;
};

export type MockTimelineItem = {
  id: string;
  title: string;
  details: string;
  date: string;
  tags: string[];
  imageUrl: string;
};

export type LocaleMockData = {
  locale: Locale;
  milestones: MockMilestone[];
  timeline: MockTimelineItem[];
  pregnancyMilestones: MockMilestone[];
  pregnancyTimeline: MockTimelineItem[];
};

// ========================================
// PREGNANCY MODE MOCK DATA
// ========================================

const pregnancyMilestoneDates = [
  "2025-01-15", // Week 8 - First ultrasound
  "2025-02-20", // Week 12 - First trimester complete
  "2025-03-25", // Week 20 - Anatomy scan
  "2025-05-10", // Week 28 - Third trimester
  "2025-06-20", // Week 36 - Almost there
];

const pregnancyTimelineDates = [
  "2025-01-08",
  "2025-02-14",
  "2025-03-18",
  "2025-04-22",
  "2025-05-30",
];

const pregnancyMilestoneIcons = ["💗", "🤰", "👶", "🎀", "✨"];

// Local pregnancy photos: 19weeks (couple+ultrasound), 20weeks (tally marks), 21weeks (belly hold)
const _p19 = Image.resolveAssetSource(require("../../assets/mocks/pregnant/19weeks.jpg")).uri;
const _p20 = Image.resolveAssetSource(require("../../assets/mocks/pregnant/20weeks.jpg")).uri;
const _p21 = Image.resolveAssetSource(require("../../assets/mocks/pregnant/21weeks.jpg")).uri;

const pregnancyMilestoneImages = [
  _p19, // Week 8 - First Heartbeat: couple with ultrasound photo
  _p21, // Week 12 - First Trimester: belly hold
  _p19, // Week 20 - Anatomy Scan: couple/ultrasound moment
  _p20, // Week 28 - Third Trimester: counting the weeks
  _p21, // Week 36 - Full Term: beautiful belly
];

const pregnancyTimelineImages = [
  _p21, // Positive Test Day: belly hold
  _p19, // Valentine's Announcement: couple together
  _p21, // First Kicks Felt: belly
  _p20, // Nursery Shopping: counting down
  _p19, // Baby Shower: couple moment
];

// ========================================
// BABY BORN MODE MOCK DATA
// ========================================

const babyMilestoneDates = [
  "2025-07-15", // 2 weeks - Coming home
  "2025-08-01", // 1 month - First smile
  "2025-09-15", // 2 months - Tracking objects
  "2025-10-20", // 3 months - First laugh
  "2025-11-30", // 4 months - Rolling over
];

const babyTimelineDates = [
  "2025-07-10",
  "2025-07-25",
  "2025-08-20",
  "2025-09-30",
  "2025-11-15",
];

const babyMilestoneIcons = ["🍼", "😊", "👀", "😄", "🎉"];

// Local baby photos: 1/1.1/1.2 (first month memories), 2 (alert baby in blue), 3 (tummy time)
const _b1 = Image.resolveAssetSource(require("../../assets/mocks/baby/1.jpg")).uri;
const _b11 = Image.resolveAssetSource(require("../../assets/mocks/baby/1.1.jpg")).uri;
const _b12 = Image.resolveAssetSource(require("../../assets/mocks/baby/1.2.jpg")).uri;
const _b2 = Image.resolveAssetSource(require("../../assets/mocks/baby/2.jpg")).uri;
const _b3 = Image.resolveAssetSource(require("../../assets/mocks/baby/3.jpg")).uri;

const babyMilestoneImages = [
  _b11, // Month 1: Welcome Home — first month memory
  _b2,  // Month 2: First Real Smile — alert baby looking at camera
  _b3,  // Month 3: Tracking & Cooing — tummy time, engaged
  _b2,  // Month 4: First Laugh — happy alert face
  _b3,  // Month 5: Rolling Over — active physical milestone
];

const babyTimelineImages = [
  _b1,  // First Night Home — newborn
  _b12, // Meeting Grandparents — first month memory
  _b11, // First Pediatrician Visit — first month memory
  _b2,  // Bedtime Routine Established — calm baby
  _b3,  // Trying Tummy Time — perfect match
];

// ========================================
// TRANSLATIONS FOR MOCK DATA
// ========================================

type MockTranslations = {
  pregnancyMilestones: {
    labels: string[];
    descriptions: string[];
  };
  pregnancyTimeline: {
    titles: string[];
    details: string[];
    tags: { first: string; second: string; third: string };
  };
  babyMilestones: {
    labels: string[];
    descriptions: string[];
  };
  babyTimeline: {
    titles: string[];
    details: string[];
    tags: { newborn: string; family: string; grandparents: string; health: string; checkup: string; sleep: string; routine: string; development: string; milestones: string };
  };
};

const mockTranslations: Record<Locale, MockTranslations> = {
  en: {
    pregnancyMilestones: {
      labels: [
        "First Heartbeat",
        "First Trimester Complete",
        "Anatomy Scan",
        "Third Trimester Begins",
        "Full Term Baby",
      ],
      descriptions: [
        "Heard our baby's heartbeat for the first time. It was the most beautiful sound.",
        "Made it through the first trimester! Feeling more energetic and excited.",
        "Found out we're having a beautiful baby. Gender reveal was perfect.",
        "Final stretch! Getting the nursery ready and feeling those strong kicks.",
        "Baby is full term and ready to meet us. Can't wait for this journey.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Positive Test Day",
        "Valentine's Baby Announcement",
        "First Kicks Felt",
        "Nursery Shopping",
        "Baby Shower",
      ],
      details: [
        "Two lines appeared and our world changed forever. So much joy and anticipation.",
        "Told our families today. Their reactions were priceless - tears of happiness everywhere.",
        "Felt the first little flutter today while reading. Such a magical moment.",
        "Started picking out furniture for the nursery. Everything is becoming so real now.",
        "Surrounded by love from friends and family. Feeling so blessed and supported.",
      ],
      tags: {
        first: "First Trimester",
        second: "Second Trimester",
        third: "Third Trimester",
      },
    },
    babyMilestones: {
      labels: [
        "Month 1: Welcome Home",
        "Month 2: First Real Smile",
        "Month 3: Tracking & Cooing",
        "Month 4: First Laugh",
        "Month 5: Rolling Over",
      ],
      descriptions: [
        "Brought our precious baby home today. Those tiny fingers, that sweet smell. Life will never be the same - in the best way.",
        "At 6 weeks, we got the first real intentional smile! Not gas, the real thing. Pure magic seeing that little face light up.",
        "Baby started following my face with those beautiful eyes and making the sweetest cooing sounds. The connection grows stronger every day.",
        "The first real belly laugh today at 14 weeks! Daddy made funny faces and baby just cracked up. The most beautiful sound we've ever heard.",
        "At 4.5 months, rolled from tummy to back for the first time! Getting so strong and mobile. Can't believe how fast time flies.",
      ],
    },
    babyTimeline: {
      titles: [
        "First Night Home",
        "Meeting Grandparents",
        "First Pediatrician Visit",
        "Bedtime Routine Established",
        "Trying Tummy Time",
      ],
      details: [
        "First night with our baby at home. Barely slept but couldn't stop watching those tiny movements and listening to every breath. So much love.",
        "Grandparents met their grandchild for the first time today. Tears of joy everywhere. Four generations together - what a precious moment.",
        "Two-week checkup went great! Baby is healthy, gaining weight, and growing perfectly. The pediatrician says everything looks wonderful.",
        "Finally found a bedtime routine that works: bath, feeding, white noise, and cuddles. Baby is sleeping in 2-3 hour stretches now!",
        "Started tummy time sessions today. Baby held their head up for almost 10 seconds! Those little neck muscles are getting so strong.",
      ],
      tags: {
        newborn: "Newborn",
        family: "Family",
        grandparents: "Grandparents",
        health: "Health",
        checkup: "Checkup",
        sleep: "Sleep",
        routine: "Routine",
        development: "Development",
        milestones: "Milestones",
      },
    },
  },
  de: {
    pregnancyMilestones: {
      labels: [
        "Erstes Herzschlag",
        "Erstes Trimester Abgeschlossen",
        "Ultraschalluntersuchung",
        "Drittes Trimester Beginnt",
        "Baby ist Reif",
      ],
      descriptions: [
        "Hörte das Herzschlag unseres Babys zum ersten Mal. Es war der schönste Klang.",
        "Das erste Trimester geschafft! Fühle mich energischer und aufgeregter.",
        "Fanden heraus, dass wir ein wundervolles Baby bekommen. Die Geschlechtsoffenbarung war perfekt.",
        "Die letzte Runde! Bereiten wir das Kinderzimmer vor und spüren diese starken Tritte.",
        "Baby ist reif und bereit, uns zu treffen. Kann es kaum erwarten, diese Reise zu beginnen.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Tag des Positiven Tests",
        "Valentinstags-Babyankündigung",
        "Erste Tritte Gespürt",
        "Kinderzimmer-Einkaufen",
        "Baby-Dusche",
      ],
      details: [
        "Zwei Striche erschienen und unsere Welt veränderte sich für immer. So viel Freude und Vorfreude.",
        "Heute unseren Familien erzählt. Ihre Reaktionen waren unbezahlbar - Freudentränen überall.",
        "Heute beim Lesen die ersten zarten Bewegungen gespürt. Ein magischer Moment.",
        "Anfangen, Möbel für das Kinderzimmer auszuwählen. Alles wird jetzt immer realer.",
        "Umgeben von Liebe von Freunden und Familie. Fühle mich so gesegnet und unterstützt.",
      ],
      tags: {
        first: "Erstes Trimester",
        second: "Zweites Trimester",
        third: "Drittes Trimester",
      },
    },
    babyMilestones: {
      labels: [
        "Monat 1: Willkommen Zuhause",
        "Monat 2: Erstes Echtes Lächeln",
        "Monat 3: Blickverfolgung & Gurren",
        "Monat 4: Erstes Lachen",
        "Monat 5: Drehen",
      ],
      descriptions: [
        "Brachten unser kostbares Baby heute nach Hause. Diese winzigen Finger, dieser süßliche Geruch. Das Leben wird sich nie mehr ändern - auf die beste Weise.",
        "Mit 6 Wochen bekamen wir das erste echte absichtliche Lächeln! Nicht nur Luft, die echte Sache. Reiner Zauber, dieses kleine Gesicht leuchten zu sehen.",
        "Das Baby folgte meinem Gesicht mit diesen wunderschönen Augen und machte die süßesten Gurrgeräusche. Die Verbindung wird jeden Tag stärker.",
        "Das erste echte Bauch-Lachen heute mit 14 Wochen! Papa machte komische Gesichter und das Baby lachte nur los. Der schönste Klang, den wir je gehört haben.",
        "Mit 4,5 Monaten zum ersten Mal von Bauch auf Rücken gerollt! Wird so stark und mobil. Kann kaum glauben, wie schnell die Zeit vergeht.",
      ],
    },
    babyTimeline: {
      titles: [
        "Erste Nacht Zuhause",
        "Treffen mit Großeltern",
        "Erster Kinderarztbesuch",
        "Schlafenszeit-Routine Etabliert",
        "Bauchzeit Ausprobieren",
      ],
      details: [
        "Erste Nacht mit unserem Baby zuhause. Kaum geschlafen, aber konnte nicht aufhören, diese winzigen Bewegungen zu beobachten und jeden Atemzug zu hören. So viel Liebe.",
        "Großeltern trafen ihr Enkelkind heute zum ersten Mal. Freudentränen überall. Vier Generationen zusammen - was für einen kostbaren Moment.",
        "Die Zweiwochenuntersuchung verlief wunderbar! Das Baby ist gesund, nimmt an Gewicht zu und wächst perfekt. Der Kinderarzt sagt, alles sieht wunderbar aus.",
        "Endlich eine Schlafenszeit-Routine gefunden, die funktioniert: Baden, Füttern, Weißes Rauschen und Kuscheln. Das Baby schläft jetzt in 2-3 Stunden Etappen!",
        "Heute Bauchzeit-Sitzungen gestartet. Das Baby hielt seinen Kopf für fast 10 Sekunden hoch! Diese kleinen Nackenmuskeln werden so stark.",
      ],
      tags: {
        newborn: "Neugeborenes",
        family: "Familie",
        grandparents: "Großeltern",
        health: "Gesundheit",
        checkup: "Untersuchung",
        sleep: "Schlaf",
        routine: "Routine",
        development: "Entwicklung",
        milestones: "Meilensteine",
      },
    },
  },
  it: {
    pregnancyMilestones: {
      labels: [
        "Primo Battito Cardiaco",
        "Primo Trimestre Completato",
        "Ecografia Anatomica",
        "Inizio Terzo Trimestre",
        "Baby a Termine",
      ],
      descriptions: [
        "Ho ascoltato il battito cardiaco del nostro bambino per la prima volta. È stato il suono più bellissimo.",
        "Abbiamo superato il primo trimestre! Mi sento più energica e entusiasta.",
        "Abbiamo scoperto che avremo un bambino bellissimo. La rivelazione del sesso è stata perfetta.",
        "L'ultimo tratto! Preparando la cameretta e sentendo questi forti calci.",
        "Il bambino è a termine e pronto a incontrarci. Non vedo l'ora di iniziare questo viaggio.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Giorno del Test Positivo",
        "Annuncio del Bambino di San Valentino",
        "Primi Calci Sentiti",
        "Shopping per la Cameretta",
        "Baby Shower",
      ],
      details: [
        "Due linee sono apparse e il nostro mondo è cambiato per sempre. Tanta gioia e anticipazione.",
        "Abbiamo detto alle nostre famiglie oggi. Le loro reazioni erano preziose - lacrime di felicità ovunque.",
        "Ho sentito i primi leggeri movimenti oggi mentre leggevo. Un momento magico.",
        "Ho iniziato a scegliere i mobili per la cameretta. Tutto sta diventando sempre più reale.",
        "Circondati dall'amore di amici e familiari. Mi sento così benedetta e supportata.",
      ],
      tags: {
        first: "Primo Trimestre",
        second: "Secondo Trimestre",
        third: "Terzo Trimestre",
      },
    },
    babyMilestones: {
      labels: [
        "Mese 1: Benvenuti a Casa",
        "Mese 2: Primo Vero Sorriso",
        "Mese 3: Inseguimento dello Sguardo e Gorgoglio",
        "Mese 4: Primo Sorriso",
        "Mese 5: Capovolta",
      ],
      descriptions: [
        "Abbiamo portato il nostro caro bambino a casa oggi. Queste piccole dita, questo profumo dolce. La vita non sarà mai più la stessa - nel modo migliore.",
        "A 6 settimane, abbiamo avuto il primo vero sorriso intenzionale! Non solo aria, la cosa vera. Pura magia vedere quel piccolo viso brillare.",
        "Il bambino ha iniziato a seguire il mio viso con questi bellissimi occhi e ha fatto i più dolci suoni di gorgoglio. La connessione diventa più forte ogni giorno.",
        "Il primo vero sorriso alla pancia oggi a 14 settimane! Papà ha fatto facce buffe e il bambino ha semplicemente scoppiato a ridere. Il suono più bellissimo che abbiamo mai sentito.",
        "A 4,5 mesi, ha girato dalla pancia alla schiena per la prima volta! Sempre più forte e mobile. Non posso credere quanto velocemente passa il tempo.",
      ],
    },
    babyTimeline: {
      titles: [
        "Prima Notte a Casa",
        "Incontro con i Nonni",
        "Prima Visita dal Pediatra",
        "Routine della Nanna Stabilita",
        "Prova della Pancia",
      ],
      details: [
        "Prima notte con il nostro bambino a casa. Ho dormito a malapena, ma non potevo smettere di osservare questi piccoli movimenti e ascoltare ogni respiro. Tanto amore.",
        "I nonni hanno incontrato il loro nipote per la prima volta oggi. Lacrime di gioia ovunque. Quattro generazioni insieme - che momento prezioso.",
        "Il controllo di due settimane è andato benissimo! Il bambino è sano, sta guadagnando peso e sta crescendo perfettamente. Il pediatra dice che tutto sembra meraviglioso.",
        "Finalmente trovato una routine per la nanna che funziona: bagno, alimentazione, rumore bianco e coccole. Il bambino ora dorme in tratti di 2-3 ore!",
        "Abbiamo iniziato le sessioni di pancia oggi. Il bambino ha tenuto la testa alta per quasi 10 secondi! Questi piccoli muscoli del collo stanno diventando così forti.",
      ],
      tags: {
        newborn: "Neonato",
        family: "Famiglia",
        grandparents: "Nonni",
        health: "Salute",
        checkup: "Controllo",
        sleep: "Sonno",
        routine: "Routine",
        development: "Sviluppo",
        milestones: "Tappe Importanti",
      },
    },
  },
  fr: {
    pregnancyMilestones: {
      labels: [
        "Premier Battement de Cœur",
        "Premier Trimestre Terminé",
        "Échographie Anatomique",
        "Début du Troisième Trimestre",
        "Bébé à Terme",
      ],
      descriptions: [
        "Nous avons entendu le battement de cœur de notre bébé pour la première fois. C'était le son le plus beau.",
        "Nous avons passé le premier trimestre ! Je me sens plus énergique et excitée.",
        "Nous avons découvert que nous allons avoir un magnifique bébé. La révélation du sexe était parfaite.",
        "La dernière ligne droite ! Préparation de la chambre de bébé et sensation de ces coups puissants.",
        "Le bébé est à terme et prêt à nous rencontrer. J'ai hâte de commencer ce voyage.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Jour du Test Positif",
        "Annonce du Bébé de la Saint-Valentin",
        "Premiers Coups Ressentis",
        "Shopping pour la Chambre de Bébé",
        "Baby Shower",
      ],
      details: [
        "Deux lignes sont apparues et notre monde a changé pour toujours. Tant de joie et d'anticipation.",
        "Nous l'avons dit à nos familles aujourd'hui. Leurs réactions étaient inestimables - des larmes de bonheur partout.",
        "J'ai ressenti les premiers petits mouvements aujourd'hui en lisant. Un moment magique.",
        "J'ai commencé à choisir des meubles pour la chambre de bébé. Tout devient de plus en plus réel.",
        "Entouré de l'amour des amis et de la famille. Je me sens tellement bénie et soutenue.",
      ],
      tags: {
        first: "Premier Trimestre",
        second: "Deuxième Trimestre",
        third: "Troisième Trimestre",
      },
    },
    babyMilestones: {
      labels: [
        "Mois 1: Bienvenue à la Maison",
        "Mois 2: Premier Vrai Sourire",
        "Mois 3: Suivi du Regard et Cooing",
        "Mois 4: Premier Rire",
        "Mois 5: Roulement",
      ],
      descriptions: [
        "Nous avons ramené notre précieux bébé à la maison aujourd'hui. Ces petits doigts, cette douce odeur. La vie ne sera jamais plus la même - de la meilleure façon.",
        "À 6 semaines, nous avons eu le premier vrai sourire intentionnel ! Pas seulement de l'air, la vraie affaire. Pure magie de voir ce petit visage s'illuminer.",
        "Le bébé a commencé à suivre mon visage avec ces beaux yeux et a fait les plus doux sons de cooing. La connexion se renforce chaque jour.",
        "Le premier vrai rire au ventre aujourd'hui à 14 semaines ! Papa a fait des grimaces et le bébé a éclaté de rire. Le plus beau son que nous ayons jamais entendu.",
        "À 4,5 mois, a roulé du ventre au dos pour la première fois ! De plus en plus fort et mobile. Je n'arrive pas à croire à la vitesse du temps.",
      ],
    },
    babyTimeline: {
      titles: [
        "Première Nuit à la Maison",
        "Rencontre avec les Grands-parents",
        "Première Visite Chez le Pédiatre",
        "Routine du Coucher Établie",
        "Essai du Tummy Time",
      ],
      details: [
        "Première nuit avec notre bébé à la maison. Nous avons à peine dormi, mais nous n'avons pas pu arrêter de regarder ces petits mouvements et d'écouter chaque respiration. Tant d'amour.",
        "Les grands-parents ont rencontré leur petit-enfant pour la première fois aujourd'hui. Des larmes de joie partout. Quatre générations ensemble - quel moment précieux.",
        "Le contrôle de deux semaines s'est très bien passé ! Le bébé est en bonne santé, gagne du poids et grandit parfaitement. Le pédiatre dit que tout semble merveilleux.",
        "Finalement trouvé une routine du coucher qui fonctionne : bain, alimentation, bruit blanc et câlins. Le bébé dort maintenant en tranches de 2-3 heures !",
        "Nous avons commencé les séances de tummy time aujourd'hui. Le bébé a tenu sa tête pendant presque 10 secondes ! Ces petits muscles du cou deviennent si forts.",
      ],
      tags: {
        newborn: "Nouveau-né",
        family: "Famille",
        grandparents: "Grands-parents",
        health: "Santé",
        checkup: "Contrôle",
        sleep: "Sommeil",
        routine: "Routine",
        development: "Développement",
        milestones: "Étapes Importantes",
      },
    },
  },
  es: {
    pregnancyMilestones: {
      labels: [
        "Primer Latido del Corazón",
        "Primer Trimestre Completado",
        "Ecografía Anatómica",
        "Comienza el Tercer Trimestre",
        "Bebé a Término",
      ],
      descriptions: [
        "Escuchamos el latido del corazón de nuestro bebé por primera vez. Fue el sonido más hermoso.",
        "¡Pasamos el primer trimestre! Me siento más energética y emocionada.",
        "Descubrimos que tendremos un bebé hermoso. La revelación del sexo fue perfecta.",
        "¡La recta final! Preparando la habitación del bebé y sintiendo esas patadas fuertes.",
        "El bebé está a término y listo para conocernos. No puedo esperar a comenzar este viaje.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Día de la Prueba Positiva",
        "Anuncio del Bebé del Día de San Valentín",
        "Primeras Patadas Sentidas",
        "Compras para la Habitación del Bebé",
        "Baby Shower",
      ],
      details: [
        "Aparecieron dos líneas y nuestro mundo cambió para siempre. Tanta alegría y anticipación.",
        "Se lo dijimos a nuestras familias hoy. Sus reacciones fueron invaluables - lágrimas de felicidad en todas partes.",
        "Sentí los primeros movimientos suaves hoy mientras leía. Un momento mágico.",
        "Comencé a elegir muebles para la habitación del bebé. Todo se está volviendo cada vez más real.",
        "Rodeados del amor de amigos y familia. Me siento tan bendecida y apoyada.",
      ],
      tags: {
        first: "Primer Trimestre",
        second: "Segundo Trimestre",
        third: "Tercer Trimestre",
      },
    },
    babyMilestones: {
      labels: [
        "Mes 1: Bienvenido a Casa",
        "Mes 2: Primer Sonrisa Real",
        "Mes 3: Seguimiento de la Mirada y Arrullo",
        "Mes 4: Primer Risa",
        "Mes 5: Volteo",
      ],
      descriptions: [
        "Trajimos a nuestro precioso bebé a casa hoy. Esos deditos pequeños, ese olor dulce. La vida nunca será la misma - de la mejor manera.",
        "A las 6 semanas, ¡obtuvimos la primera sonrisa real intencional! No solo aire, la cosa real. Pura magia ver ese pequeño rostro iluminarse.",
        "El bebé comenzó a seguir mi rostro con esos ojos hermosos e hizo los sonidos de arrullo más dulces. La conexión se fortalece cada día.",
        "La primera risa de panza hoy a las 14 semanas! Papá hizo caras tontas y el bebé simplemente estalló en carcajadas. El sonido más hermoso que jamás hemos escuchado.",
        "A los 4,5 meses, ¡rodó de barriga a espalda por primera vez! Se está volviendo muy fuerte y móvil. No puedo creer lo rápido que pasa el tiempo.",
      ],
    },
    babyTimeline: {
      titles: [
        "Primera Noche en Casa",
        "Conociendo a los Abuelos",
        "Primera Visita al Pediatra",
        "Rutina de Dormir Establecida",
        "Probando Tiempo Boca Abajo",
      ],
      details: [
        "Primera noche con nuestro bebé en casa. Apenas dormimos, pero no pudimos dejar de observar esos pequeños movimientos y escuchar cada respiración. Tanto amor.",
        "Los abuelos conocieron a su nieto por primera vez hoy. Lágrimas de alegría en todas partes. Cuatro generaciones juntas - qué momento tan preciado.",
        "¡El chequeo de dos semanas salió genial! El bebé está sano, está ganando peso y creciendo perfectamente. El pediatra dice que todo se ve maravilloso.",
        "¡Finalmente encontramos una rutina de dormir que funciona: baño, alimentación, ruido blanco y abrazos. ¡El bebé ahora duerme en tramos de 2-3 horas!",
        "Comenzamos las sesiones de tiempo boca abajo hoy. ¡El bebé levantó su cabeza durante casi 10 segundos! Esos pequeños músculos del cuello se están poniendo tan fuertes.",
      ],
      tags: {
        newborn: "Recién Nacido",
        family: "Familia",
        grandparents: "Abuelos",
        health: "Salud",
        checkup: "Revisión",
        sleep: "Sueño",
        routine: "Rutina",
        development: "Desarrollo",
        milestones: "Hitos",
      },
    },
  },
  tr: {
    pregnancyMilestones: {
      labels: [
        "İlk Kalp Atışı",
        "İlk Trimester Tamamlandı",
        "Anatomi Ultrasonu",
        "Üçüncü Trimester Başlıyor",
        "Bebek Tam Terimde",
      ],
      descriptions: [
        "Bebeğimizin kalp atışını ilk kez duyduk. En güzel ses oldu.",
        "İlk trimestri geçtik! Daha enerjik ve heyecanlı hissediyorum.",
        "Güzel bir bebeğimiz olacağını öğrendik. Cinsiyetin ortaya çıkması mükemmeldi.",
        "Son düzlük! Çocuk odasını hazırlıyor ve güçlü temeleri hissediyorum.",
        "Bebek tam terimde ve bizi tanımaya hazır. Bu yolculuğa başlamak için sabırsız.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Pozitif Test Günü",
        "Sevgililer Günü Bebek Açıklaması",
        "İlk Tekmeleri Hissettim",
        "Çocuk Odası Alışverişi",
        "Bebek Partisi",
      ],
      details: [
        "İki çizgi belirdi ve dünyamız sonsuza dek değişti. Çok fazla sevinç ve heyecan.",
        "Bugün ailelerimize söyledik. Tepkileri çok değerliydi - her yerde sevinç gözyaşları.",
        "Bugün okurken ilk hafif hareketleri hissettim. Sihirli bir an.",
        "Çocuk odası için mobilya seçmeye başladım. Herşey gittikçe daha gerçek oluyor.",
        "Arkadaş ve ailenin sevgisi ile çevriliyim. Kendimi çok mübarek ve destekli hissediyorum.",
      ],
      tags: {
        first: "İlk Trimester",
        second: "İkinci Trimester",
        third: "Üçüncü Trimester",
      },
    },
    babyMilestones: {
      labels: [
        "Ay 1: Evde Hoş Geldiniz",
        "Ay 2: İlk Gerçek Gülümseme",
        "Ay 3: Bakış Takibi ve Mırıltı",
        "Ay 4: İlk Kahkaha",
        "Ay 5: Dönüş",
      ],
      descriptions: [
        "Değerli bebeğimizi bugün eve aldık. O küçük parmaklar, o tatlı koku. Hayat asla aynı olmayacak - en iyi şekilde.",
        "6 haftada, ilk gerçek kasıtlı gülümsemeyi aldık! Sadece hava değil, gerçek şey. Saf büyü o küçük yüzü aydınlanmış görmek.",
        "Bebek benim yüzümü takip etmeye başladı ve en tatlı mırıltı seslerini çıkardı. Bağlantı her gün güçleniyor.",
        "14 haftada ilk gerçek karın kahkahası bugün! Baba komik yüzler yaptı ve bebek sadece gülmeyi patlattı. Hiç duymadığımız en güzel ses.",
        "4,5 ayda, ilk kez karnından sırtına döndü! Gittikçe daha güçlü ve hareketli oluyor. Zamanın ne kadar hızlı geçtiğine inanamıyorum.",
      ],
    },
    babyTimeline: {
      titles: [
        "Evde İlk Gece",
        "Büyükanalarla Tanışma",
        "İlk Çocuk Doktoru Ziyareti",
        "Uyku Rutini Kuruldu",
        "Karın Zamanını Deneme",
      ],
      details: [
        "Bebeğimizle evde ilk gece. Neredeyse hiç uyumadık ama o küçük hareketleri izlemeyi ve her nefesi dinlemeyi bırakamıyorum. Çok fazla sevgi.",
        "Büyükanalar bugün ilk kez torunlarını tanıdılar. Her yerde sevinç gözyaşları. Dört nesil birlikte - ne kadar kıymetli an.",
        "İki haftalık kontrol harika gitti! Bebek sağlıklı, kilo alıyor ve mükemmel büyüyor. Çocuk doktoru her şeyin harika göründüğünü söylüyor.",
        "Sonunda işe yarayan bir uyku rutini bulduk: banyo, beslenme, beyaz gürültü ve kucaklamak. Bebek şimdi 2-3 saatlik uyku düzeni uyuyor!",
        "Bugün karın zamanı oturumlarına başladık. Bebek kafasını neredeyse 10 saniye boyunca tuttu! O küçük boyun kasları çok güçleniyor.",
      ],
      tags: {
        newborn: "Yenidoğan",
        family: "Aile",
        grandparents: "Büyükanalar",
        health: "Sağlık",
        checkup: "Kontrol",
        sleep: "Uyku",
        routine: "Rutin",
        development: "Gelişim",
        milestones: "Dönüm Noktaları",
      },
    },
  },
  ja: {
    pregnancyMilestones: {
      labels: [
        "初めての心拍",
        "第一妊娠三か月期終了",
        "解剖学的超音波",
        "第三妊娠三か月期開始",
        "満期の赤ちゃん",
      ],
      descriptions: [
        "私たちの赤ちゃんの心拍を初めて聞きました。それは最も美しい音でした。",
        "妊娠初期を乗り越えました！より元気で興奮を感じています。",
        "美しい赤ちゃんを迎えることになりました。性別の発表は完璧でした。",
        "ラストスパート！育児室を準備し、強い蹴りを感じています。",
        "赤ちゃんは満期で、私たちに会う準備ができています。この旅を始めるのが待ちきれません。",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "陽性判定日",
        "バレンタイン赤ちゃん発表",
        "初めての蹴りを感じた",
        "育児室ショッピング",
        "ベビーシャワー",
      ],
      details: [
        "2本の線が現れ、私たちの世界は永遠に変わりました。喜びと期待がいっぱいです。",
        "今日、家族に話しました。彼らの反応は貴重でした - 至る所で喜びの涙。",
        "今日、読書中に初めての小さな動きを感じました。魔法の瞬間です。",
        "育児室の家具を選び始めました。すべてがますます現実になってきています。",
        "友人と家族の愛に囲まれています。祝福され、サポートされていると感じています。",
      ],
      tags: {
        first: "第一妊娠三か月期",
        second: "第二妊娠三か月期",
        third: "第三妊娠三か月期",
      },
    },
    babyMilestones: {
      labels: [
        "1か月：おかえりなさい",
        "2か月：初めての本当の笑顔",
        "3か月：視線の追跡と喃語",
        "4か月：初めての笑い",
        "5か月：寝返り",
      ],
      descriptions: [
        "大切な赤ちゃんを今日家に連れて来ました。その小さな指、その甘い匂い。人生は決して同じではありません - 最高の方法で。",
        "6週間で、初めての本当の意図的な笑顔を得ました！単なる空気ではなく、本物です。その小さな顔が明るくなるのを見るのは純粋な魔法です。",
        "赤ちゃんは私の顔を追い始め、最も甘い喃語の音を出しました。つながりは日に日に強くなります。",
        "生後14週間で初めての本当のお腹の笑い！パパが面白い顔をしたら、赤ちゃんはただ笑い始めました。私たちが聞いたことのある最も美しい音。",
        "生後4.5か月で、初めてうつ伏せから仰向けに寝返りをしました！どんどん強くなり、動きが活発になります。時間がこんなに早く経つなんて信じられません。",
      ],
    },
    babyTimeline: {
      titles: [
        "家での初夜",
        "祖父母との対面",
        "初めての小児科医の診察",
        "就寝時間ルーティン確立",
        "腹ばいの時間を試す",
      ],
      details: [
        "赤ちゃんと一緒に家での初夜。ほぼ眠れませんでしたが、その小さな動きを観察し、毎回の呼吸を聞くことを止められませんでした。それは多くの愛です。",
        "祖父母は今日初めて孫に会いました。至る所で喜びの涙。4つの世代が一緒に - それは何と貴重な瞬間でしょう。",
        "2週間のチェックアップは素晴らしかったです！赤ちゃんは健康で、体重が増えており、完璧に成長しています。小児科医はすべてが素晴らしく見えると言っています。",
        "最後に機能する就寝時間ルーティンを見つけました：入浴、授乳、ホワイトノイズ、抱擁。赤ちゃんは2〜3時間の間隔で眠っています！",
        "今日から腹ばいの時間のセッションを開始しました。赤ちゃんはほぼ10秒間頭を上げていました！その小さな首の筋肉がとても強くなっています。",
      ],
      tags: {
        newborn: "新生児",
        family: "家族",
        grandparents: "祖父母",
        health: "健康",
        checkup: "検査",
        sleep: "睡眠",
        routine: "ルーティン",
        development: "発達",
        milestones: "マイルストーン",
      },
    },
  },
  ko: {
    pregnancyMilestones: {
      labels: [
        "첫 심장 박동",
        "첫 삼 개월 완료",
        "해부학적 초음파",
        "삼 개월째 시작",
        "만기 아기",
      ],
      descriptions: [
        "우리 아기의 심장 박동을 처음 들었습니다. 그것은 가장 아름다운 소리였습니다.",
        "임신 초기 3개월을 극복했습니다! 더 활기차고 설레입니다.",
        "아름다운 아기를 가질 것임을 알았습니다. 성별 공개가 완벽했습니다.",
        "마지막 스트레칭입니다! 아이 방을 준비하고 강한 발차기를 느끼고 있습니다.",
        "아기는 만기이고 우리를 만날 준비가 되어 있습니다. 이 여정을 시작하기를 고대합니다.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "양성 판정일",
        "발렌타인 데이 아기 공개",
        "첫 발차기 느낌",
        "아이 방 쇼핑",
        "베이비 샤워",
      ],
      details: [
        "두 줄이 나타났고 우리 세상이 영원히 변했습니다. 많은 기쁨과 기대감.",
        "오늘 가족에게 말했습니다. 그들의 반응은 귀중했습니다 - 어디서나 기쁨의 눈물.",
        "오늘 읽는 중에 첫 부드러운 움직임을 느꼈습니다. 마법의 순간입니다.",
        "아이 방 가구를 선택하기 시작했습니다. 모든 것이 점점 더 현실이 되고 있습니다.",
        "친구와 가족의 사랑으로 둘러싸여 있습니다. 축복받고 지지받는 기분입니다.",
      ],
      tags: {
        first: "첫 삼 개월",
        second: "두 번째 삼 개월",
        third: "세 번째 삼 개월",
      },
    },
    babyMilestones: {
      labels: [
        "1개월: 집에 오신 것을 환영합니다",
        "2개월: 첫 진짜 웃음",
        "3개월: 시선 추적 및 옹알이",
        "4개월: 첫 웃음",
        "5개월: 뒹굴기",
      ],
      descriptions: [
        "우리의 소중한 아기를 오늘 집으로 데려왔습니다. 그 작은 손가락들, 그 달콤한 냄새. 인생은 절대로 같지 않을 것입니다 - 최고의 방식으로.",
        "6주에 첫 진정한 의도적인 미소를 얻었습니다! 단순히 공기가 아닙니다. 그 작은 얼굴이 밝아지는 것을 보는 것은 순수한 마법입니다.",
        "아기는 내 얼굴을 따라다니기 시작했고 가장 달콤한 옹알이 소리를 냈습니다. 연결이 매일 강해집니다.",
        "생후 14주에 첫 진정한 배 웃음! 아빠가 재미있는 얼굴을 하니 아기가 웃음을 터뜨렸습니다. 우리가 들은 가장 아름다운 소리.",
        "생후 4.5개월에 처음으로 배에서 등으로 뒹굴었습니다! 점점 강해지고 움직임이 활발해집니다. 시간이 이렇게 빨리 지나갈 줄 몰랐습니다.",
      ],
    },
    babyTimeline: {
      titles: [
        "집에서의 첫 밤",
        "할아버지, 할머니 만남",
        "첫 소아과 방문",
        "취침 시간 루틴 확립",
        "배로 시간 보내기 시도",
      ],
      details: [
        "우리 아기와 함께 집에서의 첫 밤. 거의 잠을 자지 못했지만 그 작은 움직임을 관찰하고 모든 호흡을 들을 수 없었습니다. 많은 사랑.",
        "할아버지, 할머니가 오늘 처음으로 손자를 만났습니다. 어디서나 기쁨의 눈물. 4세대가 함께 - 얼마나 소중한 순간입니다.",
        "2주 검진이 잘 되었습니다! 아기는 건강하고 체중이 늘어나며 완벽하게 자라고 있습니다. 소아과 의사는 모든 것이 훌륭해 보인다고 말합니다.",
        "마침내 효과가 있는 취침 루틴을 찾았습니다: 목욕, 수유, 백색 소음, 껴안기. 아기는 이제 2~3시간 간격으로 자고 있습니다!",
        "오늘부터 배로 시간 보내기 세션을 시작했습니다. 아기는 거의 10초 동안 머리를 들었습니다! 그 작은 목 근육이 매우 강해지고 있습니다.",
      ],
      tags: {
        newborn: "신생아",
        family: "가족",
        grandparents: "할아버지, 할머니",
        health: "건강",
        checkup: "검진",
        sleep: "수면",
        routine: "루틴",
        development: "발달",
        milestones: "이정표",
      },
    },
  },
  nl: {
    pregnancyMilestones: {
      labels: [
        "Eerste Hartslag",
        "Eerste Trimester Voltooid",
        "Anatomische Scan",
        "Derde Trimester Begint",
        "Baby op Uitkijkpost",
      ],
      descriptions: [
        "We hoorden de hartslag van onze baby voor het eerst. Het was het mooiste geluid.",
        "We zijn door het eerste trimester heen! Ik voel me energieker en opgewondener.",
        "We ontdekten dat we een prachtige baby krijgen. De geslachtsopenbaring was perfect.",
        "De laatste loodjes! We bereiden de babykamer voor en voelen die sterke schopjes.",
        "Baby is volgroeid en klaar om ons te ontmoeten. Ik kan niet wachten om deze reis te beginnen.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Dag van de Positieve Test",
        "Aankondiging van de Valentijnsbaby",
        "Eerste Schoppen Gevoeld",
        "Winkelen voor de Babykamer",
        "Baby Shower",
      ],
      details: [
        "Twee lijnen verschenen en onze wereld veranderde voor altijd. Zoveel vreugde en verwachting.",
        "We vertelden het vandaag aan onze families. Hun reacties waren van onschatbare waarde - vreugdetranen overal.",
        "Ik voelde vandaag de eerste zachte bewegingen terwijl ik las. Een magisch moment.",
        "Ik begon meubels voor de babykamer uit te kiezen. Alles wordt steeds meer werkelijkheid.",
        "Omgeven door liefde van vrienden en familie. Ik voel me gezegend en ondersteund.",
      ],
      tags: {
        first: "Eerste Trimester",
        second: "Tweede Trimester",
        third: "Derde Trimester",
      },
    },
    babyMilestones: {
      labels: [
        "Maand 1: Welkom Thuis",
        "Maand 2: Eerste Echte Glimlach",
        "Maand 3: Blikvolging en Gorgelen",
        "Maand 4: Eerste Lach",
        "Maand 5: Omrollen",
      ],
      descriptions: [
        "We brachten onze dierbare baby vandaag naar huis. Die piepkleine vingetjes, die zoete geur. Het leven zal nooit meer hetzelfde zijn - op de beste manier.",
        "Op 6 weken kreeg we de eerste echte opzettelijke glimlach! Niet alleen lucht, het echte geval. Zuivere magie om dat kleine gezichtje zien oplichten.",
        "Baby begon mijn gezicht te volgen met die mooie ogen en maakte de liefste gorgelgeluiden. De verbinding wordt elke dag sterker.",
        "De eerste echte lach in de buik vandaag op 14 weken! Papa maakte grappige gezichten en baby barstte gewoon in lachen uit. Het mooiste geluid dat we ooit hebben gehoord.",
        "Op 4,5 maanden rollen van buik naar rug voor het eerst! Sterker en actiever worden. Ik kan niet geloven hoe snel de tijd vliegt.",
      ],
    },
    babyTimeline: {
      titles: [
        "Eerste Nacht Thuis",
        "Ontmoeting met Grootouders",
        "Eerste Bezoek aan Kinderartsenpraktijk",
        "Slaaptijdroutine Ingesteld",
        "Buiktijd Proberen",
      ],
      details: [
        "Eerste nacht met onze baby thuis. Ik kon bijna niet slapen, maar kon niet ophouden met het observeren van die piepkleine bewegingen en het luisteren naar elke ademhaling. Zoveel liefde.",
        "Grootouders ontmoetten vandaag voor het eerst hun kleinkind. Vreugdetranen overal. Vier generaties bij elkaar - wat een kostbaar moment.",
        "De controle van twee weken ging prima! Baby is gezond, groeit goed en ontwikkelt zich perfect. De kinderarts zegt dat alles er prachtig uitziet.",
        "Eindelijk een slaaptijdroutine gevonden die werkt: baden, voeding, wit rumoer en knuffels. Baby slaapt nu in 2-3 uurs blokken!",
        "Vandaag buiktijdsessies gestart. Baby hield zijn hoofd bijna 10 seconden omhoog! Die piepkleine nekspieren worden zo sterk.",
      ],
      tags: {
        newborn: "Pasgeborene",
        family: "Familie",
        grandparents: "Grootouders",
        health: "Gezondheid",
        checkup: "Controle",
        sleep: "Slaap",
        routine: "Routine",
        development: "Ontwikkeling",
        milestones: "Mijlpalen",
      },
    },
  },
  pl: {
    pregnancyMilestones: {
      labels: [
        "Pierwsze Bicie Serca",
        "Pierwszy Trymestr Zakończony",
        "Badanie Anatomiczne",
        "Trzeci Trymestr Się Rozpoczyna",
        "Pełnowymiarowy Maluch",
      ],
      descriptions: [
        "Usłyszeliśmy bicie serca naszego dziecka po raz pierwszy. Był to najpiękniejszy dźwięk.",
        "Przetrwaliśmy pierwszy trymestr! Czuję się bardziej energicznie i podekscytowana.",
        "Odkryliśmy, że będziemy mieć piękne dziecko. Odkrycie płci było idealne.",
        "Ostatnia prosta! Przygotowujemy pokój dziecka i czujemy silne kopniaki.",
        "Dziecko jest dojrzałe i gotowe nas poznać. Nie mogę się doczekać, aby rozpocząć tę podróż.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Dzień Pozytywnego Testu",
        "Ogłoszenie Dziecka Walentynkowego",
        "Pierwsze Kopniaki Wyczute",
        "Zakupy na Pokój Dziecka",
        "Baby Shower",
      ],
      details: [
        "Pojawiły się dwie linie i nasz świat zmienił się na zawsze. Tyle radości i oczekiwania.",
        "Powiedzieliśmy to dzisiaj naszym rodzinom. Ich reaktywacje były bezcenne - wszędzie łzy radości.",
        "Czułam dzisiaj pierwsze delikatne ruchy, czytając. Magiczny moment.",
        "Zaczęłam wybierać meble do pokoju dziecka. Wszystko staje się coraz bardziej rzeczywiste.",
        "Otoczona miłością od przyjaciół i rodziny. Czuję się błogosławiona i wspierana.",
      ],
      tags: {
        first: "Pierwszy Trymestr",
        second: "Drugi Trymestr",
        third: "Trzeci Trymestr",
      },
    },
    babyMilestones: {
      labels: [
        "Miesiąc 1: Witaj w Domu",
        "Miesiąc 2: Pierwszy Prawdziwy Uśmiech",
        "Miesiąc 3: Śledzenie Wzroku i Gulgotanie",
        "Miesiąc 4: Pierwszy Śmiech",
        "Miesiąc 5: Przewracanie",
      ],
      descriptions: [
        "Dzisiaj przynieśliśmy nasze drogie dziecko do domu. Te malutkie paluszki, ten słodki zapach. Życie nigdy nie będzie takie samo - na najlepszy sposób.",
        "W 6 tygodni dostaliśmy pierwszy prawdziwy, celowy uśmiech! Nie tylko powietrze, prawdziwa rzecz. Czysta magia widząc to malutkie buźkę się świetlić.",
        "Dziecko zaczęło podążać za moją twarzą tymi pięknymi oczami i wydawało najsłodsze dźwięki gulgotania. Połączenie staje się silniejsze każdego dnia.",
        "Pierwszy naprawdę brzuszny śmiech dzisiaj w 14 tygodniu! Tata robił głupie miny, a dziecko po prostu wybuchało śmiechem. Najpiękniejszy dźwięk, jaki kiedykolwiek słyszeliśmy.",
        "W 4,5 miesiąca przewróciło się po raz pierwszy z brzuszka na plecuszki! Coraz silniejsze i ruchliwsze. Nie mogę uwierzyć, jak szybko mija czas.",
      ],
    },
    babyTimeline: {
      titles: [
        "Pierwsza Noc w Domu",
        "Spotkanie z Babciami i Dziadkami",
        "Pierwsza Wizyta u Pediatry",
        "Ustalona Rutyna Snu",
        "Spróbowanie Czasu na Brzuszku",
      ],
      details: [
        "Pierwsza noc z naszym dzieckiem w domu. Prawie nie spaliśmy, ale nie mogliśmy przestać obserwować te malutkie ruchy i słuchać każdego oddechu. Tyle miłości.",
        "Babcie i dziadkowie spotkali dziś po raz pierwszy swoje wnuczątko. Łzy radości wszędzie. Cztery pokolenia razem - co za cenny moment.",
        "Dwutygodniowa kontrola przebiegła świetnie! Dziecko jest zdrowe, przybiera na wadze i rośnie idealnie. Pediatra mówi, że wszystko wygląda wspaniale.",
        "Wreszcie znaleźliśmy rutynę snu, która działa: kąpiel, karmienie, biały szum i przytulanie. Dziecko teraz śpi w blokach 2-3 godzin!",
        "Dzisiaj zaczęliśmy sesje czasu na brzuszku. Dziecko trzymało główkę przez prawie 10 sekund! Te malutkie mięśnie szyi robią się takie silne.",
      ],
      tags: {
        newborn: "Noworodek",
        family: "Rodzina",
        grandparents: "Babcie i Dziadkowie",
        health: "Zdrowie",
        checkup: "Kontrola",
        sleep: "Sen",
        routine: "Rutyna",
        development: "Rozwój",
        milestones: "Kamienie Milowe",
      },
    },
  },
  pt: {
    pregnancyMilestones: {
      labels: [
        "Primeiro Batimento Cardíaco",
        "Primeiro Trimestre Concluído",
        "Ultra-som Anatômico",
        "Terceiro Trimestre Começa",
        "Bebê a Termo",
      ],
      descriptions: [
        "Ouvimos o batimento cardíaco do nosso bebê pela primeira vez. Foi o som mais lindo.",
        "Passamos pelo primeiro trimestre! Me sinto mais energética e animada.",
        "Descobrimos que teremos um bebê lindo. A revelação de gênero foi perfeita.",
        "A reta final! Preparando o quarto do bebê e sentindo esses fortes chutes.",
        "O bebê está a termo e pronto para nos conhecer. Mal posso esperar para começar esta jornada.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "Dia do Teste Positivo",
        "Anúncio do Bebê de São Valentim",
        "Primeiros Chutes Sentidos",
        "Compras para o Quarto do Bebê",
        "Chá de Bebê",
      ],
      details: [
        "Apareceram duas linhas e nosso mundo mudou para sempre. Tanta alegria e antecipação.",
        "Contamos para nossas famílias hoje. Suas reações foram inestimáveis - lágrimas de felicidade por toda parte.",
        "Senti os primeiros movimentos delicados hoje enquanto lia. Um momento mágico.",
        "Comecei a escolher móveis para o quarto do bebê. Tudo está se tornando cada vez mais real.",
        "Cercada pelo amor de amigos e família. Me sinto tão abençoada e apoiada.",
      ],
      tags: {
        first: "Primeiro Trimestre",
        second: "Segundo Trimestre",
        third: "Terceiro Trimestre",
      },
    },
    babyMilestones: {
      labels: [
        "Mês 1: Bem-vindo a Casa",
        "Mês 2: Primeiro Sorriso Real",
        "Mês 3: Rastreamento de Olhar e Balbucie",
        "Mês 4: Primeira Risada",
        "Mês 5: Rolar",
      ],
      descriptions: [
        "Trouxemos nosso precioso bebê para casa hoje. Aqueles pequenos dedos, aquele cheiro doce. A vida nunca mais será a mesma - da melhor forma.",
        "Com 6 semanas, conseguimos o primeiro sorriso intencionalmente real! Não apenas ar, a coisa real. Pura magia ver aquele pequeno rosto brilhar.",
        "O bebê começou a seguir meu rosto com aqueles olhos lindos e fez os sons de balbucie mais doces. A conexão fica mais forte a cada dia.",
        "A primeira risada real na barriga hoje com 14 semanas! Papai fez caras engraçadas e o bebê simplesmente explodiu em gargalhada. O som mais lindo que já ouvimos.",
        "Com 4,5 meses, virou da barriga para as costas pela primeira vez! Ficando cada vez mais forte e móvel. Não posso acreditar em como o tempo voa.",
      ],
    },
    babyTimeline: {
      titles: [
        "Primeira Noite em Casa",
        "Conhecendo os Avós",
        "Primeira Visita ao Pediatra",
        "Rotina de Dormir Estabelecida",
        "Tentando Tempo de Barriga",
      ],
      details: [
        "Primeira noite com nosso bebê em casa. Mal dormi, mas não consegui parar de observar aqueles movimentos minúsculos e ouvir cada respiração. Tanto amor.",
        "Os avós conheceram seu neto pela primeira vez hoje. Lágrimas de alegria em todos os lugares. Quatro gerações juntas - que momento precioso.",
        "O check-up de duas semanas correu muito bem! O bebê está saudável, ganhando peso e crescendo perfeitamente. O pediatra diz que tudo parece maravilhoso.",
        "Finalmente encontrei uma rotina de dormir que funciona: banho, alimentação, ruído branco e abraços. O bebê agora dorme em intervalos de 2-3 horas!",
        "Começamos as sessões de tempo de barriga hoje. O bebê levantou a cabeça por quase 10 segundos! Aqueles pequenos músculos do pescoço estão ficando tão fortes.",
      ],
      tags: {
        newborn: "Recém-nascido",
        family: "Família",
        grandparents: "Avós",
        health: "Saúde",
        checkup: "Verificação",
        sleep: "Sono",
        routine: "Rotina",
        development: "Desenvolvimento",
        milestones: "Marcos",
      },
    },
  },
  ru: {
    pregnancyMilestones: {
      labels: [
        "Первое сердцебиение",
        "Первый триместр завершен",
        "Анатомическое УЗИ",
        "Начало третьего триместра",
        "Малыш готов к рождению",
      ],
      descriptions: [
        "Мы услышали сердцебиение нашего малыша впервые. Это был самый прекрасный звук.",
        "Мы прошли через первый триместр! Чувствую себя бодрее и взволнованнее.",
        "Мы узнали, что у нас будет прекрасный малыш. Раскрытие пола прошло идеально.",
        "Финишная прямая! Готовим детскую комнату и чувствуем сильные толчки.",
        "Малыш готов к рождению и готов встретить нас. Не могу дождаться начала этого пути.",
      ],
    },
    pregnancyTimeline: {
      titles: [
        "День Положительного Теста",
        "Объявление о Малыше на День Святого Валентина",
        "Первые Толчки",
        "Покупки для Детской Комнаты",
        "Детский Душ",
      ],
      details: [
        "Появились две полоски, и наш мир изменился навсегда. Столько радости и предчувствия.",
        "Сегодня рассказали нашим семьям. Их реакции были бесценны - слезы радости везде.",
        "Сегодня почувствовала первые нежные движения, читая. Волшебный момент.",
        "Начала выбирать мебель для детской комнаты. Все становится все более реальным.",
        "Окружена любовью друзей и семьи. Чувствую себя благословенной и поддерживаемой.",
      ],
      tags: {
        first: "Первый Триместр",
        second: "Второй Триместр",
        third: "Третий Триместр",
      },
    },
    babyMilestones: {
      labels: [
        "Месяц 1: Добро Пожаловать Домой",
        "Месяц 2: Первая Настоящая Улыбка",
        "Месяц 3: Отслеживание Взгляда и Воркование",
        "Месяц 4: Первый Смех",
        "Месяц 5: Переворот",
      ],
      descriptions: [
        "Сегодня мы привезли нашего драгоценного малыша домой. Эти крошечные пальчики, этот сладкий аромат. Жизнь никогда не будет прежней - в лучшую сторону.",
        "В 6 недель мы получили первую настоящую намеренную улыбку! Не просто воздух, реальное дело. Чистая магия видеть, как светлеет то маленькое лицо.",
        "Малыш начал следить за моим лицом этими прекрасными глазками и издавал самые милые звуки воркования. Связь становится сильнее с каждым днем.",
        "Первый настоящий животный смех в 14 недель! Папа корчил смешные рожи, и малыш просто расхохотался. Самый прекрасный звук, который мы когда-либо слышали.",
        "В 4,5 месяца впервые перевернулся со спины на животик! Становится все сильнее и активнее. Не могу поверить, как быстро летит время.",
      ],
    },
    babyTimeline: {
      titles: [
        "Первая Ночь Дома",
        "Встреча с Бабушками и Дедушками",
        "Первый Визит к Педиатру",
        "Установлена Режим Сна",
        "Пробуем Время на Животике",
      ],
      details: [
        "Первая ночь с нашим малышом дома. Почти не спали, но не могли перестать наблюдать эти крошечные движения и слушать каждое дыхание. Столько любви.",
        "Бабушки и дедушки встретили своего внука впервые сегодня. Слезы радости везде. Четыре поколения вместе - какой бесценный момент.",
        "Двухнедельный осмотр прошел отлично! Малыш здоров, хорошо набирает вес и развивается идеально. Педиатр говорит, что все выглядит замечательно.",
        "Наконец-то нашли режим сна, который работает: ванна, кормление, белый шум и объятия. Малыш теперь спит блоками по 2-3 часа!",
        "Сегодня начали сеансы времени на животике. Малыш держал голову почти 10 секунд! Эти крошечные мышцы шеи становятся такими сильными.",
      ],
      tags: {
        newborn: "Новорожденный",
        family: "Семья",
        grandparents: "Бабушки и Дедушки",
        health: "Здоровье",
        checkup: "Осмотр",
        sleep: "Сон",
        routine: "Режим",
        development: "Развитие",
        milestones: "Вехи",
      },
    },
  },
};

// ========================================
// BUILD FUNCTIONS
// ========================================

function buildPregnancyMilestones(locale: Locale): MockMilestone[] {
  const translations = mockTranslations[locale];

  return pregnancyMilestoneDates.map((date, index) => ({
    id: `pregnancy-milestone-${locale}-${index + 1}`,
    title: translations.pregnancyMilestones.labels[index],
    description: translations.pregnancyMilestones.descriptions[index],
    date,
    icon: pregnancyMilestoneIcons[index],
    imageUrl: pregnancyMilestoneImages[index],
  }));
}

function buildPregnancyTimeline(locale: Locale): MockTimelineItem[] {
  const translations = mockTranslations[locale];
  const tags = translations.pregnancyTimeline.tags;

  return pregnancyTimelineDates.map((date, index) => {
    let tagList = [tags.first, "Memories"];
    if (index >= 2) tagList[0] = tags.second;
    if (index >= 4) tagList[0] = tags.third;

    return {
      id: `pregnancy-timeline-${locale}-${index + 1}`,
      title: translations.pregnancyTimeline.titles[index],
      details: translations.pregnancyTimeline.details[index],
      date,
      tags: tagList,
      imageUrl: pregnancyTimelineImages[index],
    };
  });
}

function buildBabyMilestones(locale: Locale): MockMilestone[] {
  const translations = mockTranslations[locale];

  return babyMilestoneDates.map((date, index) => ({
    id: `baby-milestone-${locale}-${index + 1}`,
    title: translations.babyMilestones.labels[index],
    description: translations.babyMilestones.descriptions[index],
    date,
    icon: babyMilestoneIcons[index],
    imageUrl: babyMilestoneImages[index],
  }));
}

function buildBabyTimeline(locale: Locale): MockTimelineItem[] {
  const translations = mockTranslations[locale];
  const tags = translations.babyTimeline.tags;

  return babyTimelineDates.map((date, index) => {
    let tagList = [tags.newborn, tags.family];
    if (index === 1) tagList = [tags.family, tags.grandparents];
    if (index === 2) tagList = [tags.health, tags.checkup];
    if (index === 3) tagList = [tags.sleep, tags.routine];
    if (index === 4) tagList = [tags.development, tags.milestones];

    return {
      id: `baby-timeline-${locale}-${index + 1}`,
      title: translations.babyTimeline.titles[index],
      details: translations.babyTimeline.details[index],
      date,
      tags: tagList,
      imageUrl: babyTimelineImages[index],
    };
  });
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

const localeMocks: Record<Locale, LocaleMockData> = supportedLocales.reduce(
  (acc, locale) => {
    acc[locale] = {
      locale,
      milestones: buildBabyMilestones(locale), // Default to baby mode
      timeline: buildBabyTimeline(locale),
      pregnancyMilestones: buildPregnancyMilestones(locale),
      pregnancyTimeline: buildPregnancyTimeline(locale),
    };
    return acc;
  },
  {} as Record<Locale, LocaleMockData>,
);

export function getLocaleMockData(
  locale: Locale,
  mode: "pregnancy" | "baby" = "baby",
): LocaleMockData {
  const data = localeMocks[locale];

  if (mode === "pregnancy") {
    return {
      ...data,
      milestones: data.pregnancyMilestones,
      timeline: data.pregnancyTimeline,
    };
  }

  return data;
}

export function getAllLocaleMocks(): Record<Locale, LocaleMockData> {
  return localeMocks;
}
