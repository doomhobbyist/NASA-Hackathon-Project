export type MissionZone = 'mars' | 'beyond';

export interface StoryChapters {
  whatItWas: string;
  whatItFound: string;
  howItEnded: string;
  whatItTaughtUs: string;
  whatCameNext: string;
}

export interface Mission {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  zone: MissionZone;
  locationName: string;
  coordinatesLabel: string;
  // SVG coordinates on the 1000 x 560 stage
  mapX: number;
  mapY: number;
  accentColor: string;
  launchDate: string;
  endDate: string;
  activeSpan: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  restingPlace: string;
  nasaUrl: string;
  // Expressive human voice settings
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  voiceStyle: string;
  // Custom short musical motif in Hz + durations (seconds)
  melody: { freq: number; duration: number; delay: number }[];
  // Toon companion Pip's cheerful child-engaging arrival narration
  toonIntro: string;
  // First-person spoken greeting from the machine itself
  machineGreeting: string;
  chapters: StoryChapters;
}

export interface TimelineEvent {
  id: string;
  year: number;
  dateLabel: string;
  title: string;
  summary: string;
  missionId?: string;
  isLongQuiet?: boolean;
}

export interface QuizQuestion {
  id: string;
  riddle: string;
  options: { missionId: string; label: string }[];
  correctMissionId: string;
  explanation: string;
}

export const OPENING_NARRATION =
  "Look up at a Martian sunset, and something magical happens. While Earth's evening sky blushes red, the sky around Mars's Sun glows a cool, dusty blue. Scattered out across those rust-red plains—and even farther out among asteroids and stars—rest ten extraordinary robotic explorers. Their batteries are quiet now, their antennas still. Ready to hop aboard our scout rover with Pip and bring their stories back to life?";

export const MISSIONS: Mission[] = [
  {
    id: 'viking-1',
    name: 'Viking 1 (Orbiter & Lander)',
    shortName: 'Viking 1',
    subtitle: 'First long-lived eyes and hands on Mars',
    zone: 'mars',
    locationName: 'Chryse Planitia',
    coordinatesLabel: '22.27° N · 312.05° E',
    mapX: 392,
    mapY: 214,
    accentColor: '#F59E0B',
    launchDate: 'Aug 20, 1975',
    endDate: 'Nov 11, 1982',
    activeSpan: '6 years, 114 days on surface',
    keyMetricLabel: 'Surface Photos Returned',
    keyMetricValue: '1,400+ images',
    restingPlace: 'Chryse Planitia, Mars (later named Thomas Mutch Memorial Station)',
    nasaUrl: 'https://science.nasa.gov/mission/viking/',
    voiceName: 'Charon',
    voiceStyle:
      'Gentle, wise, warm elder storyteller sharing an unforgettable memory with awe and kindness, natural conversational rhythm',
    melody: [
      { freq: 293.66, duration: 0.45, delay: 0 },
      { freq: 440.0, duration: 0.45, delay: 0.25 },
      { freq: 523.25, duration: 0.55, delay: 0.5 },
      { freq: 659.25, duration: 0.9, delay: 0.8 },
    ],
    toonIntro:
      "Whoa, we just rolled into Chryse Planitia—the Plains of Gold! Way back in July 1976, Viking 1 became the very first American spacecraft to land safely on Mars and stay working! Imagine snapping the first clear postcard from another planet's dusty backyard and checking its weather every day for over six years!",
    machineGreeting:
      "Hello, young traveler. On July 20, 1976, my three landing legs crunched into the red dust here, and I sent Earth its very first clear photograph from the surface of Mars. Everything looked rocky, bright, and wonderfully strange.",
    chapters: {
      whatItWas:
        "Viking 1 arrived as a clever two-part team: a flying Orbiter that stayed high above to map the planet and relay messages, and a sturdy three-legged Lander packed with cameras, a weather mast, a robotic scoop arm, and a miniature biology lab the size of a toaster oven.",
      whatItFound:
        "Its cameras revealed pink-butterscotch skies, wind-carved sand drifts, and rust-colored rocks rich in iron. From orbit, its twin cameras photographed colossal volcanoes and ancient river valleys. On the ground, its soil scoop ran life-detection tests—and while the results didn't prove living microbes, they showed Martian soil is chemically reactive and unexpectedly mysterious.",
      howItEnded:
        "The Orbiter ran out of attitude-control gas in August 1980 after 1,485 orbits. The Lander kept humming for over two more years until November 11, 1982, when a faulty software update accidentally pointed its dish antenna away from Earth—cutting the conversation short.",
      whatItTaughtUs:
        "Viking 1 proved spacecraft could survive Martian winters, dust storms, and years of brutal temperature swings—setting a surface longevity record that stood for nearly three decades.",
      whatCameNext:
        "For fourteen years after Viking 1 fell silent, no spacecraft successfully landed on Mars—until Mars Pathfinder bounced onto the surface in 1997 with a brand-new airbag trick and a tiny rover.",
    },
  },
  {
    id: 'pathfinder-sojourner',
    name: 'Mars Pathfinder & Sojourner',
    shortName: 'Pathfinder & Sojourner',
    subtitle: 'Bouncing airbags and the first rover on Mars',
    zone: 'mars',
    locationName: 'Ares Vallis',
    coordinatesLabel: '19.13° N · 326.78° E',
    mapX: 442,
    mapY: 226,
    accentColor: '#FB923C',
    launchDate: 'Dec 4, 1996',
    endDate: 'Sep 27, 1997',
    activeSpan: '85 days on Mars',
    keyMetricLabel: 'Distance Driven',
    keyMetricValue: '100 meters',
    restingPlace: 'Ares Vallis, Mars (Carl Sagan Memorial Station)',
    nasaUrl: 'https://science.nasa.gov/mission/mars-pathfinder/',
    voiceName: 'Puck',
    voiceStyle:
      'Playful, bouncy, bright and enthusiastic young explorer voice full of curiosity and giggling delight, completely natural and human',
    melody: [
      { freq: 523.25, duration: 0.18, delay: 0 },
      { freq: 659.25, duration: 0.18, delay: 0.15 },
      { freq: 783.99, duration: 0.18, delay: 0.3 },
      { freq: 1046.5, duration: 0.5, delay: 0.45 },
    ],
    toonIntro:
      "Boing, boing, boing! Welcome to Ares Vallis! In 1997, engineers wrapped Mars Pathfinder in giant bouncy airbags and literally bounced it across Mars like a beach ball! Then its petals unfolded, and out rolled Sojourner—a microwave-sized six-wheeled rover that proved cars can actually drive on Mars!",
    machineGreeting:
      "Beep-boop—just kidding! I'm Sojourner! I was only as big as a microwave oven, with six springy wheels and a little solar panel on my back. When I rolled down my ramp onto Mars, I became the first rover ever to drive on another planet!",
    chapters: {
      whatItWas:
        "Instead of heavy retro-rockets all the way down, Pathfinder used a parachute, solid rockets, and giant multi-layered airbags to cushion its crash-landing on Independence Day, July 4, 1997. Inside the petal-shaped lander waited Sojourner, a 10.6-kilogram (23-pound) rover named after abolitionist Sojourner Truth.",
      whatItFound:
        "Sojourner rolled up to rocks nicknamed Barnacle Bill, Yogi, and Scooby-Doo, zapping them with an X-ray spectrometer. Scientists saw rounded pebbles and tilted stones—clear clues that catastrophic floods of ancient water once thundered through Ares Vallis.",
      howItEnded:
        "Designed to last just seven days for the rover and thirty for the lander, the duo lasted nearly three months! As Martian autumn chilled the lander's battery on September 27, 1997, Pathfinder sent its final whisper home, leaving Sojourner parked beside it.",
      whatItTaughtUs:
        "Pathfinder proved the 'faster, better, cheaper' airbag landing worked—and taught engineers how to steer a tiny robot over rocks with radio signals delayed by minutes.",
      whatCameNext:
        "Those exact airbag cocoons were scaled up seven years later to drop two much bigger twin rovers—Spirit and Opportunity—onto opposite sides of Mars.",
    },
  },
  {
    id: 'spirit',
    name: 'Spirit Rover (MER-A)',
    shortName: 'Spirit (MER-A)',
    subtitle: 'Mountain climber that uncovered ancient hot springs',
    zone: 'mars',
    locationName: 'Gusev Crater',
    coordinatesLabel: '14.57° S · 175.47° E',
    mapX: 832,
    mapY: 328,
    accentColor: '#38BDF8',
    launchDate: 'Jun 10, 2003',
    endDate: 'May 25, 2011',
    activeSpan: '6+ years active (planned 90 sols)',
    keyMetricLabel: 'Distance Driven',
    keyMetricValue: '7.73 km (4.8 mi)',
    restingPlace: 'Troy sand trap, Columbia Hills, Gusev Crater',
    nasaUrl: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
    voiceName: 'Zephyr',
    voiceStyle:
      'Brave, warm, determined human adventurer voice with heartfelt wonder and quiet courage, natural human cadence',
    melody: [
      { freq: 392.0, duration: 0.25, delay: 0 },
      { freq: 493.88, duration: 0.25, delay: 0.2 },
      { freq: 587.33, duration: 0.25, delay: 0.4 },
      { freq: 783.99, duration: 0.65, delay: 0.6 },
    ],
    toonIntro:
      "Touchdown in Gusev Crater! Say hello to Spirit! Built for just a three-month road trip, Spirit ended up climbing an entire Martian hill range and working for more than six years! Wait till you hear what its broken wheel accidentally dragged up out of the dirt—it was a huge watery surprise!",
    machineGreeting:
      "Hey there, friend. Everyone expected me to last ninety Martian days, so I surprised them all by climbing Husband Hill and exploring for over six years. Even when one of my front wheels stopped spinning, I didn't quit—I drove backward!",
    chapters: {
      whatItWas:
        "Spirit was the first of NASA's twin Mars Exploration Rovers—a 185-kilogram robotic geologist carrying panoramic eyes on a tall mast, a rock-grinding tool, spectrometers, and six independently steered aluminum wheels.",
      whatItFound:
        "Gusev Crater's floor looked dry and volcanic at first, so engineers drove Spirit kilometers toward the Columbia Hills. There—literally by dragging its jammed right-front wheel through the soil—Spirit churned up bright white patches of nearly pure silica! That discovery proved hot springs or steam vents with liquid water once bubbled right there.",
      howItEnded:
        "In April 2009, Spirit's wheels broke through a thin crust into hidden soft sand at a spot called Troy. For months engineers tried every wiggle and turn, but Spirit couldn't escape before winter arrived. Unable to tilt its solar panels toward the low Sun, Spirit sent its last call on March 22, 2010.",
      whatItTaughtUs:
        "Spirit turned a mechanical setback into one of Mars's greatest discoveries—showing ancient Mars wasn't just cold rock, it once had habitable warm water environments.",
      whatCameNext:
        "Spirit's discoveries helped guide future missions—like Curiosity and Perseverance—to target ancient lakebeds and mineral-rich hotspots where signs of past life might hide.",
    },
  },
  {
    id: 'opportunity',
    name: 'Opportunity Rover (MER-B)',
    shortName: 'Opportunity',
    subtitle: 'The Martian marathon runner across 28.06 miles',
    zone: 'mars',
    locationName: 'Meridiani Planum',
    coordinatesLabel: '1.95° S · 354.47° E',
    mapX: 498,
    mapY: 288,
    accentColor: '#F59E0B',
    launchDate: 'Jul 7, 2003',
    endDate: 'Feb 13, 2019',
    activeSpan: '14 years, 293 days on Mars',
    keyMetricLabel: 'Distance Driven',
    keyMetricValue: '45.16 km (28.06 mi)',
    restingPlace: 'Perseverance Valley, Endeavour Crater',
    nasaUrl: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
    voiceName: 'Kore',
    voiceStyle:
      'Gentle, deeply warm, poetic human narrator with quiet joy and tenderness, expressive and soulful',
    melody: [
      { freq: 329.63, duration: 0.3, delay: 0 },
      { freq: 440.0, duration: 0.3, delay: 0.25 },
      { freq: 554.37, duration: 0.3, delay: 0.5 },
      { freq: 659.25, duration: 0.85, delay: 0.75 },
    ],
    toonIntro:
      "Ooh, look down at Meridiani Planum! That's Opportunity—nicknamed 'Oppy'—the ultimate marathon champ of Mars! Oppy bounced straight into a tiny crater like a hole-in-one, discovered weird little mineral pebbles called 'blueberries,' and kept rolling for nearly fifteen whole years!",
    machineGreeting:
      "They called me Oppy. When my airbags stopped rolling inside Eagle Crater, I opened my eyes to layered rocks and tiny gray 'blueberries' made by ancient water. I just kept driving—for fifteen years and more than a full marathon across the red plains.",
    chapters: {
      whatItWas:
        "Opportunity was Spirit's identical twin rover, built for a 90-sol sprint across the flat plains of Meridiani Planum. Instead, passing Martian winds kept sweeping dust off its solar wings, letting it outlive its warranty nearly sixty times over.",
      whatItFound:
        "Right inside its first crater, Oppy found tiny spheres of hematite—nicknamed 'blueberries'—plus sulfates and clay minerals along the rim of giant Endeavour Crater. Those rocks proved liquid water once soaked both the surface and underground layers of ancient Mars.",
      howItEnded:
        "In June 2018, a monster dust storm wrapped the entire planet in darkness, blotting out the Sun so completely that day turned into pitch-black night. Oppy's batteries drained on June 10, 2018. After more than 1,000 recovery commands—and even playing Billie Holiday's 'I'll Be Seeing You'—NASA said goodbye on February 13, 2019.",
      whatItTaughtUs:
        "Opportunity drove 28.06 miles (45.16 km), proving rovers can survive for more than a decade on another world and explore giant craters over 20 kilometers wide.",
      whatCameNext:
        "Because giant dust storms can starve solar panels of sunlight, NASA powered later giant rovers—Curiosity and Perseverance—with steady nuclear plutonium batteries instead.",
    },
  },
  {
    id: 'insight',
    name: 'InSight Lander',
    shortName: 'InSight Lander',
    subtitle: 'Listening to the beating heart of Mars',
    zone: 'mars',
    locationName: 'Elysium Planitia',
    coordinatesLabel: '4.50° N · 135.62° E',
    mapX: 726,
    mapY: 266,
    accentColor: '#38BDF8',
    launchDate: 'May 5, 2018',
    endDate: 'Dec 21, 2022',
    activeSpan: '4 years on Mars',
    keyMetricLabel: 'Marsquakes Detected',
    keyMetricValue: '1,319 quakes',
    restingPlace: 'Elysium Planitia, Mars',
    nasaUrl: 'https://science.nasa.gov/mission/insight/',
    voiceName: 'Fenrir',
    voiceStyle:
      'Calm, resonant, thoughtful human voice like a patient listener hearing deep underground echoes, warm and gentle',
    melody: [
      { freq: 196.0, duration: 0.45, delay: 0 },
      { freq: 293.66, duration: 0.45, delay: 0.35 },
      { freq: 392.0, duration: 0.5, delay: 0.7 },
      { freq: 293.66, duration: 0.8, delay: 1.05 },
    ],
    toonIntro:
      "Shhh—listen closely! Here on the quiet flat plains of Elysium Planitia sits InSight! Unlike rovers that drive around looking at rocks, InSight stayed perfectly still and placed a super-sensitive stethoscope right on the Martian ground to hear more than thirteen hundred marsquakes!",
    machineGreeting:
      "Hush, and listen with me. I never drove a single inch—my job was to sit quietly and feel the ground tremble. Every marsquake sent ripples through the planet, helping us map Mars's crust, lumpy mantle, and liquid core for the very first time.",
    chapters: {
      whatItWas:
        "InSight (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport) was a stationary robotic geologist. Its robotic arm lifted a dome-covered French-built seismometer—capable of sensing vibrations smaller than a hydrogen atom—directly onto Martian soil.",
      whatItFound:
        "InSight recorded 1,319 marsquakes, including rumbles caused by meteoroid impacts! By timing how seismic waves bounced inside the planet, scientists discovered Mars's crust is thicker than expected, its mantle is lumpy with ancient fragments, and its core is liquid iron mixed with lighter elements.",
      howItEnded:
        "Over four years, red dust coated InSight's twin round solar panels thicker and thicker until power dropped to a trickle. InSight sent one last dusty selfie and signed off in December 2022: 'Don't worry about me though: my time here has been both productive and serene.'",
      whatItTaughtUs:
        "InSight was the first mission dedicated to looking deep inside another rocky planet—proving Mars is still geologically alive with real quakes today.",
      whatCameNext:
        "Future planetary seismometers—including instruments bound for the Moon with Artemis—use lessons learned from InSight's ultra-sensitive ear.",
    },
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity Mars Helicopter',
    shortName: 'Ingenuity',
    subtitle: '72 historic flights in razor-thin Martian air',
    zone: 'mars',
    locationName: 'Jezero Crater',
    coordinatesLabel: '18.38° N · 77.58° E',
    mapX: 604,
    mapY: 222,
    accentColor: '#F59E0B',
    launchDate: 'Jul 30, 2020',
    endDate: 'Jan 25, 2024',
    activeSpan: '72 flights · 128.8 flying min',
    keyMetricLabel: 'Total Flights',
    keyMetricValue: '72 flights · 17.0 km',
    restingPlace: 'Valinor Hills, Jezero Crater, Mars',
    nasaUrl: 'https://science.nasa.gov/mission/ingenuity-mars-helicopter/',
    voiceName: 'Zephyr',
    voiceStyle:
      'Joyful, bright, energetic and triumphant human storyteller bursting with excitement about taking flight, clear and upbeat',
    melody: [
      { freq: 587.33, duration: 0.14, delay: 0 },
      { freq: 659.25, duration: 0.14, delay: 0.12 },
      { freq: 783.99, duration: 0.14, delay: 0.24 },
      { freq: 987.77, duration: 0.18, delay: 0.36 },
      { freq: 1174.66, duration: 0.65, delay: 0.5 },
    ],
    toonIntro:
      "Woohoo, we made it to Jezero Crater! Look at those speedy carbon-fiber blades—this is Ingenuity! Mars's air is a hundred times thinner than Earth's, so flying here seemed almost impossible. Yet this tiny four-pound helicopter spun its blades over two thousand five hundred times a minute and flew seventy-two times!",
    machineGreeting:
      "Ready for liftoff! Tucking a tiny piece of fabric from the Wright brothers' 1903 airplane beneath my solar panel, I rose into the Martian sky on April 19, 2021. Everyone hoped for five test flights—we flew seventy-two!",
    chapters: {
      whatItWas:
        "Ingenuity was a 1.8-kilogram (4-pound) solar-powered coaxial helicopter that hitched a ride under the belly of the Perseverance rover. Its two four-foot carbon-fiber blades spun in opposite directions at roughly 2,537 revolutions per minute—more than five times faster than helicopters on Earth.",
      whatItFound:
        "On April 19, 2021, Ingenuity hovered three meters above 'Wright Brothers Field' for 39.1 seconds, achieving the first powered, controlled flight on another planet. Over nearly three years, it became Perseverance's aerial scout, snapping high-angle photos of sand ripples, cliffs, and safe driving routes across 17 kilometers.",
      howItEnded:
        "During Flight 72 on January 18, 2024, over smooth featureless sand dunes, Ingenuity's navigation camera struggled to lock onto ground textures. A hard landing chipped the tips of its rotor blades, ending its flying days—though its radio and solar heart still worked on the dunes of Valinor Hills.",
      whatItTaughtUs:
        "Ingenuity shattered the myth that Mars's thin atmosphere stops winged flight—opening an entirely new era of aerial exploration on other worlds.",
      whatCameNext:
        "Inspired by Ingenuity, engineers are already designing sleeker Mars helicopters and the nuclear-powered Dragonfly rotorcraft bound for Saturn's moon Titan.",
    },
  },
  {
    id: 'pioneer-10',
    name: 'Pioneer 10',
    shortName: 'Pioneer 10',
    subtitle: 'First messenger through the asteroid belt and beyond',
    zone: 'beyond',
    locationName: 'Deep Interstellar Trajectory (toward Aldebaran)',
    coordinatesLabel: '12+ Billion km from Earth',
    mapX: 865,
    mapY: 165,
    accentColor: '#38BDF8',
    launchDate: 'Mar 2, 1972',
    endDate: 'Jan 23, 2003',
    activeSpan: '30+ years of radio contact',
    keyMetricLabel: 'Farthest Signal',
    keyMetricValue: '12.2 billion km',
    restingPlace: 'Cruising interstellar space toward star Aldebaran (Taurus)',
    nasaUrl: 'https://science.nasa.gov/mission/pioneer-10/',
    voiceName: 'Charon',
    voiceStyle:
      'Deep, awe-inspired, warm human narrator gazing out across distant stars with gentle wonder',
    melody: [
      { freq: 220.0, duration: 0.4, delay: 0 },
      { freq: 329.63, duration: 0.4, delay: 0.35 },
      { freq: 440.0, duration: 0.4, delay: 0.7 },
      { freq: 493.88, duration: 0.9, delay: 1.05 },
    ],
    toonIntro:
      "Zooming past the planets into deep dark space—look how far out Pioneer 10 is! Launched way back in 1972, it was the brave scout that proved spacecraft could cross the Asteroid Belt without getting smashed, snapped Jupiter's first close-ups, and is now sailing silently toward the star Aldebaran!",
    machineGreeting:
      "Greetings from way beyond Pluto. I carry a golden plaque showing where I came from and who built me. Back in 1973, I braved Jupiter's fierce radiation belts and became the first human-made traveler to earn a ticket out of the solar system.",
    chapters: {
      whatItWas:
        "Pioneer 10 was a lightweight spin-stabilized probe powered by four nuclear radioisotope generators, carrying a 2.7-meter dish antenna and Carl Sagan's famous gold-anodized aluminum plaque etched with human figures and a pulsar map back to Earth.",
      whatItFound:
        "Before Pioneer 10, nobody knew whether the main Asteroid Belt held deadly walls of gravel. Pioneer 10 sailed safely through, then skimmed just 130,000 kilometers above Jupiter's swirling clouds in December 1973—measuring Jupiter's colossal magnetic field and snapping the first close-up images of the Great Red Spot.",
      howItEnded:
        "As Pioneer 10 raced billions of kilometers outward, its nuclear power gently faded. On January 23, 2003, NASA's Deep Space Network caught one last whisper from 12.2 billion kilometers away—a radio signal that took over 11 hours just to reach Earth.",
      whatItTaughtUs:
        "Pioneer 10 blazed the trail for Voyager 1, Voyager 2, Galileo, and Juno—proving humanity could navigate, power, and hear spacecraft out to the very edge of our Sun's bubble.",
      whatCameNext:
        "Silent and dark, Pioneer 10 continues drifting at roughly 43,000 kilometers per hour toward the red giant star Aldebaran—a journey that will take about two million years.",
    },
  },
  {
    id: 'near-shoemaker',
    name: 'NEAR Shoemaker',
    shortName: 'NEAR Shoemaker',
    subtitle: 'First spacecraft to orbit and land on an asteroid',
    zone: 'beyond',
    locationName: 'Asteroid 433 Eros',
    coordinatesLabel: 'Inner Asteroid Belt',
    mapX: 435,
    mapY: 365,
    accentColor: '#FB923C',
    launchDate: 'Feb 17, 1996',
    endDate: 'Feb 28, 2001',
    activeSpan: '5 years · 1 year orbiting Eros',
    keyMetricLabel: 'Asteroid Touchdown',
    keyMetricValue: '433 Eros (1st ever)',
    restingPlace: 'Surface of Asteroid 433 Eros',
    nasaUrl: 'https://science.nasa.gov/mission/near-shoemaker/',
    voiceName: 'Puck',
    voiceStyle:
      'Excited, warm, storytelling human voice marveling at landing on a tumbling space potato without landing legs',
    melody: [
      { freq: 349.23, duration: 0.25, delay: 0 },
      { freq: 440.0, duration: 0.25, delay: 0.22 },
      { freq: 523.25, duration: 0.25, delay: 0.44 },
      { freq: 698.46, duration: 0.7, delay: 0.66 },
    ],
    toonIntro:
      "Hold onto your seatbelt—we're flying up to a peanut-shaped space rock called 433 Eros! NEAR Shoemaker wasn't even built with landing legs, yet after spending a full year orbiting Eros, engineers gently set it down right on the asteroid's surface—and it survived!",
    machineGreeting:
      "Who says an orbiter can't land? After looping around asteroid 433 Eros for a whole year and mapping every crater, I fired my thrusters like gentle brakes and settled right onto the gravel at walking speed!",
    chapters: {
      whatItWas:
        "Near Earth Asteroid Rendezvous (NEAR)—later renamed for planetary scientist Eugene Shoemaker—was an octagonal solar-powered orbiter equipped with a high-res camera, laser rangefinder, and X-ray/gamma-ray spectrometers.",
      whatItFound:
        "After flying past cratered asteroid 253 Mathilde in 1997, NEAR entered orbit around 433 Eros on Valentine's Day 2000—the first spacecraft ever to orbit an asteroid! It revealed Eros is a solid, ancient 33-kilometer shard from the solar system's birth, blanketed in craters, boulders, and dust ponds.",
      howItEnded:
        "With its primary mission finished and fuel nearly empty, engineers attempted an audacious bonus finale on February 12, 2001: landing on Eros at just 4 miles per hour. NEAR touched down intact on the edge of Himeros crater and kept transmitting gamma-ray soil readings until February 28, 2001.",
      whatItTaughtUs:
        "NEAR Shoemaker showed asteroids aren't all loose flying rubble—some are battered, ancient rocks—and proved spacecraft can safely rendezvous with and touch down on tiny low-gravity worlds.",
      whatCameNext:
        "NEAR paved the path for sample-return missions like Japan's Hayabusa and NASA's OSIRIS-REx, and asteroid-deflection tests like DART.",
    },
  },
  {
    id: 'dawn',
    name: 'Dawn Mission',
    shortName: 'Dawn',
    subtitle: 'Ion-powered explorer of two giant protoplanets',
    zone: 'beyond',
    locationName: 'Dwarf Planet Ceres',
    coordinatesLabel: 'Main Asteroid Belt · 2.77 AU',
    mapX: 640,
    mapY: 270,
    accentColor: '#A78BFA',
    launchDate: 'Sep 27, 2007',
    endDate: 'Oct 31, 2018',
    activeSpan: '11 years · 2 worlds orbited',
    keyMetricLabel: 'Worlds Orbited',
    keyMetricValue: 'Vesta & Ceres',
    restingPlace: 'Perpetual orbit around Ceres',
    nasaUrl: 'https://science.nasa.gov/mission/dawn/',
    voiceName: 'Kore',
    voiceStyle:
      'Luminous, calm, enthusiastic human science storyteller speaking with awe about blue xenon ion engines and hidden salty oceans',
    melody: [
      { freq: 392.0, duration: 0.3, delay: 0 },
      { freq: 523.25, duration: 0.3, delay: 0.25 },
      { freq: 659.25, duration: 0.3, delay: 0.5 },
      { freq: 880.0, duration: 0.8, delay: 0.75 },
    ],
    toonIntro:
      "Check out that cool blue glow—we just caught up with Dawn orbiting the dwarf planet Ceres! Dawn used futuristic xenon ion engines to pull off a cosmic double-feature nobody else has ever done: it orbited giant asteroid Vesta first, then fired its ion thrusters again to fly over and orbit Ceres!",
    machineGreeting:
      "My ion thrusters whispered softly for more than five years—pushing with the gentleness of a sheet of paper on your hand, yet accelerating me fast enough to orbit two whole alien worlds: rocky Vesta and icy Ceres.",
    chapters: {
      whatItWas:
        "Dawn was NASA's time-capsule scout to the Main Asteroid Belt. Powered by huge solar wings and three ultra-efficient xenon ion engines (whose thrust glows icy blue!), Dawn was the first spacecraft ever to enter orbit around one distant body, break free, and orbit a second one.",
      whatItFound:
        "At Vesta (2011–2012), Dawn mapped mountains nearly three times taller than Mount Everest and found Vesta is a dry, rocky protoplanet with an iron core. Moving on to Ceres (2015–2018), Dawn solved the mystery of dazzling bright spots inside Occator Crater: salty brine crusts left behind by cryo-volcanoes bubbling up from a subsurface muddy ocean!",
      howItEnded:
        "On October 31, 2018, Dawn missed scheduled check-ins because it had used up its very last drops of hydrazine steering fuel. Because Ceres might harbor watery environments, NASA parked Dawn in a safe orbit where it won't crash for at least twenty years.",
      whatItTaughtUs:
        "Dawn proved electric ion propulsion can turn science-fiction deep-space voyages into reality—and showed that even tiny dwarf planets in the asteroid belt can hide salty water worlds inside.",
      whatCameNext:
        "Dawn's ion-drive heritage now powers NASA's Psyche spacecraft racing toward a metal-rich asteroid—plus future cargo ships for deep-space Artemis missions.",
    },
  },
  {
    id: 'kepler',
    name: 'Kepler / K2 Telescope',
    shortName: 'Kepler / K2',
    subtitle: 'The planet hunter that showed planets outnumber stars',
    zone: 'beyond',
    locationName: 'Earth-Trailing Solar Orbit',
    coordinatesLabel: '151 Million km behind Earth',
    mapX: 258,
    mapY: 185,
    accentColor: '#F59E0B',
    launchDate: 'Mar 7, 2009',
    endDate: 'Oct 30, 2018',
    activeSpan: '9.6 years hunting exoplanets',
    keyMetricLabel: 'Planets Discovered',
    keyMetricValue: '2,662+ exoplanets',
    restingPlace: 'Safe Earth-trailing heliocentric orbit',
    nasaUrl: 'https://science.nasa.gov/mission/kepler/',
    voiceName: 'Zephyr',
    voiceStyle:
      'Wonder-filled, gentle, joyful human voice telling a magical cosmic story to children and space lovers',
    melody: [
      { freq: 523.25, duration: 0.25, delay: 0 },
      { freq: 659.25, duration: 0.25, delay: 0.2 },
      { freq: 783.99, duration: 0.25, delay: 0.4 },
      { freq: 987.77, duration: 0.3, delay: 0.6 },
      { freq: 1318.51, duration: 0.8, delay: 0.85 },
    ],
    toonIntro:
      "Look back along Earth's orbit—there drifts the Kepler Space Telescope! For nearly ten years, Kepler stared steadily at hundreds of thousands of stars, watching for tiny flickers whenever a distant planet passed in front of its sun. Spoiler alert: Kepler proved there are MORE planets in our galaxy than stars!",
    machineGreeting:
      "Imagine staring at one patch of sky without blinking for four years, catching the tiniest wink of starlight—as subtle as a flea crawling across a car headlight miles away. That tiny wink meant another world was orbiting a distant sun.",
    chapters: {
      whatItWas:
        "Kepler was a space observatory carrying a giant 95-megapixel digital light meter (photometer), drifting calmly behind Earth around the Sun so our planet wouldn't block its view. After two steering wheels failed in 2013, clever engineers balanced Kepler against sunlight pressure itself—launching a brilliant second career called K2!",
      whatItFound:
        "Kepler discovered over 2,600 confirmed exoplanets—worlds orbiting double suns like Tatooine, lava worlds, super-Earths, and rocky planets sitting right in the 'Goldilocks' habitable zone where liquid water can pool.",
      howItEnded:
        "After more than nine years—nearly triple its original mission—Kepler ran out of thruster fuel on October 30, 2018. Engineers sent one final 'goodnight' command, putting Kepler into permanent sleep safely trailing behind Earth.",
      whatItTaughtUs:
        "Before Kepler, we barely knew if Earth-sized planets were rare. Kepler transformed astronomy forever by proving small rocky worlds fill our Milky Way—and roughly one in five Sun-like stars may host an Earth-sized world in its habitable zone.",
      whatCameNext:
        "Kepler passed the torch to TESS (scanning the whole sky for nearby planets) and the James Webb Space Telescope, which now sniffs the atmospheres of Kepler's worlds.",
    },
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'tl-1972',
    year: 1972,
    dateLabel: 'Mar 2, 1972',
    title: 'Pioneer 10 Launches',
    summary: 'Humanity launches the first spacecraft designed to cross the Asteroid Belt and visit Jupiter.',
    missionId: 'pioneer-10',
  },
  {
    id: 'tl-1973',
    year: 1973,
    dateLabel: 'Dec 3, 1973',
    title: 'Pioneer 10 Flies Past Jupiter',
    summary: 'Snaps close-ups of Jupiter’s Great Red Spot and accelerates toward interstellar space.',
    missionId: 'pioneer-10',
  },
  {
    id: 'tl-1975',
    year: 1975,
    dateLabel: 'Aug 20, 1975',
    title: 'Viking 1 Launches Toward Mars',
    summary: 'Orbiter and Lander blast off atop a Titan IIIE rocket for a ten-month cruise.',
    missionId: 'viking-1',
  },
  {
    id: 'tl-1976',
    year: 1976,
    dateLabel: 'Jul 20, 1976',
    title: 'Viking 1 Lands on Chryse Planitia',
    summary: 'First fully successful U.S. Mars landing returns Earth’s first clear surface photos.',
    missionId: 'viking-1',
  },
  {
    id: 'tl-1980',
    year: 1980,
    dateLabel: 'Aug 7, 1980',
    title: 'Viking 1 Orbiter Completes 1,485 Orbits',
    summary: 'After mapping 97% of Mars, the orbiter runs out of attitude-control gas and powers down.',
    missionId: 'viking-1',
  },
  {
    id: 'tl-1982',
    year: 1982,
    dateLabel: 'Nov 11, 1982',
    title: 'Viking 1 Lander Falls Silent',
    summary: 'After 6+ years on Mars, an errant command mispoints its antenna, ending contact.',
    missionId: 'viking-1',
  },
  {
    id: 'tl-quiet',
    year: 1989,
    dateLabel: '1983 – 1996',
    title: 'The Long Quiet on Mars',
    summary:
      'For fourteen years, no spacecraft successfully landed on the Red Planet—a silent stretch between Viking 1 and Pathfinder.',
    isLongQuiet: true,
  },
  {
    id: 'tl-1996-near',
    year: 1996,
    dateLabel: 'Feb 17, 1996',
    title: 'NEAR Shoemaker Launches',
    summary: 'Sets course to become the first spacecraft ever to orbit a near-Earth asteroid.',
    missionId: 'near-shoemaker',
  },
  {
    id: 'tl-1997-mathilde',
    year: 1997,
    dateLabel: 'Jun 27, 1997',
    title: 'NEAR Passes 253 Mathilde',
    summary: 'Reveals an ancient charcoal-dark asteroid scarred by giant impact craters.',
    missionId: 'near-shoemaker',
  },
  {
    id: 'tl-1997-pathfinder',
    year: 1997,
    dateLabel: 'Jul 4, 1997',
    title: 'Pathfinder Bounces Down & Sojourner Rolls',
    summary: 'Giant airbags cushion landing in Ares Vallis; Sojourner becomes the first Mars rover.',
    missionId: 'pathfinder-sojourner',
  },
  {
    id: 'tl-1997-sep',
    year: 1997,
    dateLabel: 'Sep 27, 1997',
    title: 'Pathfinder & Sojourner Sign Off',
    summary: 'After 85 days—nearly triple their planned life—cold autumn drains Pathfinder’s battery.',
    missionId: 'pathfinder-sojourner',
  },
  {
    id: 'tl-2000',
    year: 2000,
    dateLabel: 'Feb 14, 2000',
    title: 'NEAR Orbits Asteroid 433 Eros',
    summary: 'Becomes the first human-made probe to orbit an asteroid, mapping every boulder.',
    missionId: 'near-shoemaker',
  },
  {
    id: 'tl-2001',
    year: 2001,
    dateLabel: 'Feb 12, 2001',
    title: 'NEAR Touches Down on Eros',
    summary: 'Even without landing legs, NEAR lands gently on 433 Eros and radios home for 16 days.',
    missionId: 'near-shoemaker',
  },
  {
    id: 'tl-2003-pioneer',
    year: 2003,
    dateLabel: 'Jan 23, 2003',
    title: 'Pioneer 10’s Final Signal',
    summary: 'A faint radio whisper arrives from 12.2 billion km away before Pioneer 10 fades into silence.',
    missionId: 'pioneer-10',
  },
  {
    id: 'tl-2004-spirit',
    year: 2004,
    dateLabel: 'Jan 4, 2004',
    title: 'Spirit Lands in Gusev Crater',
    summary: 'First of the twin Mars Exploration Rovers begins its 6-year climb through Columbia Hills.',
    missionId: 'spirit',
  },
  {
    id: 'tl-2004-oppy',
    year: 2004,
    dateLabel: 'Jan 25, 2004',
    title: 'Opportunity Lands in Meridiani Planum',
    summary: 'Rolls right into Eagle Crater and discovers water-formed hematite "blueberries."',
    missionId: 'opportunity',
  },
  {
    id: 'tl-2007',
    year: 2007,
    dateLabel: 'Sep 27, 2007',
    title: 'Dawn Fires Up Its Ion Drives',
    summary: 'Launches toward the Asteroid Belt to visit giant protoplanet Vesta and dwarf planet Ceres.',
    missionId: 'dawn',
  },
  {
    id: 'tl-2009',
    year: 2009,
    dateLabel: 'Mar 7, 2009',
    title: 'Kepler Space Telescope Launches',
    summary: 'Begins staring at 150,000+ stars to hunt for Earth-sized worlds beyond our solar system.',
    missionId: 'kepler',
  },
  {
    id: 'tl-2011-spirit',
    year: 2011,
    dateLabel: 'May 25, 2011',
    title: 'NASA Bids Farewell to Spirit',
    summary: 'Trapped in soft sand at Troy, Spirit rests after proving ancient Martian hot springs existed.',
    missionId: 'spirit',
  },
  {
    id: 'tl-2011-dawn',
    year: 2011,
    dateLabel: 'Jul 16, 2011',
    title: 'Dawn Enters Orbit Around Vesta',
    summary: 'Maps an asteroid with mountains three times higher than Mount Everest.',
    missionId: 'dawn',
  },
  {
    id: 'tl-2015',
    year: 2015,
    dateLabel: 'Mar 6, 2015',
    title: 'Dawn Arrives at Dwarf Planet Ceres',
    summary: 'Becomes the first spacecraft ever to orbit two separate extraterrestrial worlds.',
    missionId: 'dawn',
  },
  {
    id: 'tl-2018-insight',
    year: 2018,
    dateLabel: 'Nov 26, 2018',
    title: 'InSight Lands on Elysium Planitia',
    summary: 'Places humanity’s first ultra-sensitive seismometer directly onto the Martian surface.',
    missionId: 'insight',
  },
  {
    id: 'tl-2018-kepler-dawn',
    year: 2018,
    dateLabel: 'Oct 30–31, 2018',
    title: 'Kepler & Dawn Retire in Same Week',
    summary: 'Both trailblazers run out of fuel—Kepler after 2,662+ planets, Dawn orbiting salty Ceres.',
    missionId: 'kepler',
  },
  {
    id: 'tl-2019',
    year: 2019,
    dateLabel: 'Feb 13, 2019',
    title: 'Opportunity’s Marathon Ends',
    summary: 'After driving 28.06 miles over nearly 15 years, Oppy succumbs to a planet-wide dust storm.',
    missionId: 'opportunity',
  },
  {
    id: 'tl-2021',
    year: 2021,
    dateLabel: 'Apr 19, 2021',
    title: 'Ingenuity Achieves First Flight on Mars',
    summary: 'Hovers for 39.1 seconds in Jezero Crater—the Wright brothers moment on another world.',
    missionId: 'ingenuity',
  },
  {
    id: 'tl-2022',
    year: 2022,
    dateLabel: 'Dec 21, 2022',
    title: 'InSight Closes Its Seismology Mission',
    summary: 'After 1,319 marsquakes and thick dust on its solar wings, Mars’s listener signs off.',
    missionId: 'insight',
  },
  {
    id: 'tl-2024',
    year: 2024,
    dateLabel: 'Jan 25, 2024',
    title: 'Ingenuity Completes 72 Flights',
    summary: 'Rotor damage from Flight 72 ends flying operations after 17 km and 128.8 minutes aloft.',
    missionId: 'ingenuity',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    riddle:
      'I never drove a single inch on Mars. Instead, I stayed quiet in Elysium Planitia and put an ear to the ground, recording 1,319 marsquakes to map the planet’s liquid core. Which silent machine am I?',
    options: [
      { missionId: 'viking-1', label: 'Viking 1 Lander' },
      { missionId: 'insight', label: 'InSight Lander' },
      { missionId: 'spirit', label: 'Spirit Rover' },
      { missionId: 'dawn', label: 'Dawn' },
    ],
    correctMissionId: 'insight',
    explanation:
      'InSight (2018–2022) used a dome-shielded French seismometer to hear 1,319 marsquakes and reveal Mars’s crust, lumpy mantle, and liquid iron core.',
  },
  {
    id: 'q2',
    riddle:
      'I bounced onto Mars wrapped inside giant airbags on July 4, 1997—and then rolled down a ramp the size of a microwave oven, becoming the first mobile robot to drive on another planet. Which silent machine am I?',
    options: [
      { missionId: 'pathfinder-sojourner', label: 'Sojourner (Mars Pathfinder)' },
      { missionId: 'opportunity', label: 'Opportunity Rover' },
      { missionId: 'ingenuity', label: 'Ingenuity Helicopter' },
      { missionId: 'near-shoemaker', label: 'NEAR Shoemaker' },
    ],
    correctMissionId: 'pathfinder-sojourner',
    explanation:
      'Sojourner rode inside Mars Pathfinder’s bouncing airbag cocoon in 1997 and proved wheeled rovers could explore alien terrain!',
  },
  {
    id: 'q3',
    riddle:
      'Engineers thought I’d fly just five times in air a hundred times thinner than Earth’s—yet I tucked a piece of 1903 Wright Flyer fabric under my solar panel and completed 72 flights! Which silent machine am I?',
    options: [
      { missionId: 'kepler', label: 'Kepler / K2 Telescope' },
      { missionId: 'spirit', label: 'Spirit Rover' },
      { missionId: 'ingenuity', label: 'Ingenuity Mars Helicopter' },
      { missionId: 'pioneer-10', label: 'Pioneer 10' },
    ],
    correctMissionId: 'ingenuity',
    explanation:
      'Ingenuity spun its carbon-fiber blades over 2,500 rpm above Jezero Crater, soaring 72 times from 2021 to 2024 before rotor tip damage grounded it.',
  },
  {
    id: 'q4',
    riddle:
      'I never had landing legs, yet after spending a whole year orbiting the peanut-shaped asteroid 433 Eros, I fired my thrusters gently and touched right down on it. Which silent machine am I?',
    options: [
      { missionId: 'dawn', label: 'Dawn Mission' },
      { missionId: 'near-shoemaker', label: 'NEAR Shoemaker' },
      { missionId: 'pioneer-10', label: 'Pioneer 10' },
      { missionId: 'viking-1', label: 'Viking 1' },
    ],
    correctMissionId: 'near-shoemaker',
    explanation:
      'NEAR Shoemaker became the first spacecraft to orbit an asteroid (433 Eros) in 2000 and pulled off an unforgettable landing on it in February 2001.',
  },
  {
    id: 'q5',
    riddle:
      'I only expected to run for 90 days on Mars, yet I outlasted that nearly 60 times over—discovering water-made "blueberries" and driving a record 28.06 miles before a giant dust storm darkened my sky. Which silent machine am I?',
    options: [
      { missionId: 'opportunity', label: 'Opportunity Rover (MER-B)' },
      { missionId: 'spirit', label: 'Spirit Rover (MER-A)' },
      { missionId: 'viking-1', label: 'Viking 1' },
      { missionId: 'kepler', label: 'Kepler / K2' },
    ],
    correctMissionId: 'opportunity',
    explanation:
      'Opportunity explored Meridiani Planum for nearly 15 years and drove 28.06 miles (45.16 km), holding the off-Earth driving distance record!',
  },
];
