/**
 * Post copy — Phase 2 of the skill, held as data.
 *
 * The skill's Plan phase asks for a core message, an audience, and three to
 * five key points before anything is drafted. That is exactly what each entry
 * here is. The composer in src/social/compose.js turns them into a LinkedIn
 * post, an Instagram caption and carousel, and an X tweet and thread — the
 * arrangement is per platform, the substance is here, written once.
 *
 * Figures: every number in this file is either already in the `specs` block of
 * the matching car in cars.js, or arithmetic on those numbers (specific output
 * per litre, for instance). Nothing new is claimed — see NOTICE.md.
 *
 *   angle     the core message, one sentence
 *   audience  who the post is for
 *   points    3–5 key points; the body of every platform draws on these
 *   slideTitles  one short carousel heading per point (<= 34 characters)
 *   verdict   the line a high-opinionated tone earns
 *   neutral   what replaces the verdict when the tone is low
 *   hero      spec key the platform card leads with; defaults to the first spec,
 *             which is Power on every car and made ten identical-looking cards
 *   question  the CTA — answerable in a comment without clicking anything
 *   tags      car-specific hashtag stems; house tags come from author.js
 *   slides    optional carousel overrides; by default slides come from specs
 */
export const COPY = {
  '01': {
    en: {
      angle: 'Toyota built a rally car for the road, then refused to sell it with an automatic.',
      audience: 'Enthusiasts who still specify a manual, and engineers who enjoy an odd cylinder count.',
      points: [
        '300 hp from 1.6 litres is 187 hp per litre — specific output usually reserved for engines with twice the cylinder count.',
        'The centre exhaust is a working outlet, not a trim panel with a hole in it.',
        'GR-FOUR all-wheel drive comes from the same programme Toyota goes rallying with.',
        'Six-speed manual, and no automatic offered at any price.',
      ],
      slideTitles: [
        '300 hp from 1.6 litres',
        'Three pipes, all real',
        'Rally hardware, road plates',
        'No automatic. At all.',
      ],
      verdict: 'It is the most interesting car Toyota sells, and the one nobody cross-shops.',
      neutral: 'It occupies a narrow segment: rally-derived all-wheel drive with a manual gearbox.',
      question: 'Would you take 300 hp from three cylinders over 300 hp from four?',
      tags: ['GRCorolla', 'HotHatch', 'ManualGearbox'],
    },
  },

  '02': {
    en: {
      angle: 'Jeep dropped a 6.4-litre V8 into a Wrangler and left every off-road part in place.',
      audience: 'Off-roaders, V8 holdouts, and anyone keeping count of what is left of the breed.',
      points: [
        '470 hp and 470 lb-ft — an unusually square power and torque figure — under a removable roof.',
        '4.5 seconds to 60 mph, in a vehicle with a live axle at each end.',
        'Sway-bar disconnect and lockers front and rear survive the V8 intact.',
        '32.5 inches of fording depth and 10.3 inches of clearance: the trail hardware was never traded away for the engine.',
      ],
      slideTitles: [
        '470 and 470',
        '4.5 seconds, in a brick',
        'Nothing was traded away',
        '32.5 inches of water',
      ],
      verdict: 'Efficiency was never the brief. A Wrangler that runs 4.5 to 60 is the brief.',
      neutral: 'The result is the quickest Wrangler built, with its off-road specification unchanged.',
      question: 'Last of the V8 Wranglers, or the one they should have started with?',
      tags: ['Wrangler', 'V8', 'OffRoad'],
    },
  },

  '03': {
    en: {
      angle: 'Hyundai gave an electric crossover a gearbox that is not there, and it changed how it drives.',
      audience: 'EV sceptics, track-day drivers, and anyone arguing about what feedback is for.',
      points: [
        '641 hp and 568 lb-ft, which is 3.25 seconds to 60 mph in a family-shaped crossover.',
        'N e-Shift simulates eight ratios: torque is cut and restored so a shift you can feel arrives where a shift never happens.',
        '84 kWh and 350 kW peak charging, with thermal management aimed at consecutive laps rather than a single quick one.',
        '221 miles EPA — the number that pays for all of the above, quoted rather than buried.',
      ],
      slideTitles: [
        '641 hp, 3.25 seconds',
        'Eight gears that are not there',
        '350 kW, lap after lap',
        '221 miles, stated plainly',
      ],
      verdict: 'Simulated shifts read as a gimmick until you notice every car already simulates its feedback.',
      neutral: 'Simulated shifts are a design choice about feedback, not a performance claim.',
      question: 'Fake gears in an EV: engineering, or theatre?',
      tags: ['IONIQ5N', 'EV', 'HyundaiN'],
    },
  },

  '04': {
    en: {
      angle: 'Every rival answered more power with all-wheel drive. Honda kept solving the harder problem.',
      audience: 'Front-drive sceptics, and drivers who still care what the steering tells them.',
      points: [
        '315 hp through the front axle alone, held by a helical limited-slip differential.',
        'Dual-axis front struts separate steering from suspension load, which is why the power does not tug at the wheel.',
        '169 mph and 5.0 seconds to 60 mph, with three pedals and no automatic offered.',
        'Damping developed at the Nürburgring, and a rev-match you are allowed to switch off.',
      ],
      slideTitles: [
        '315 hp, front wheels only',
        'Steering, kept separate',
        '169 mph, three pedals',
        'Tuned at the Nürburgring',
      ],
      verdict: 'The front-wheel-drive ceiling keeps moving, and it is Honda that keeps moving it.',
      neutral: 'It remains the reference point for front-wheel-drive chassis engineering.',
      question: 'Has front-wheel drive hit its ceiling, or has Honda just raised it again?',
      tags: ['CivicTypeR', 'FWD', 'VTEC'],
    },
  },

  '05': {
    en: {
      angle: 'The GT3 RS is a road car arranged around its aerodynamics rather than the other way round.',
      audience: 'Aero nerds, trackday regulars, and anyone who reads a spec sheet bottom-up.',
      points: [
        '1,895 lb of downforce at 177 mph — the reason the rear wing sits above the roofline, in clean air.',
        'The drag reduction system stalls the wing down the straight, then hands the downforce\n        back for the corner.',
        '518 hp at 8,500 rpm from 4.0 naturally aspirated litres, spinning to 9,000 rpm.',
        '2.9 seconds to 60 mph is almost incidental: this car is built for the corner, not the traffic light.',
      ],
      slideTitles: [
        '1,895 lb of downforce',
        'DRS, with number plates',
        '9,000 rpm, no turbos',
        'Built for the corner',
      ],
      hero: 'Downforce',
      verdict: 'It is the rare road car where the bodywork is the engineering, not the wrapper around it.',
      neutral: 'Aerodynamic development, rather than power, defines this generation of the car.',
      question: 'Would you daily a road car with DRS?',
      tags: ['911GT3RS', 'Porsche', 'Aerodynamics'],
    },
  },

  '06': {
    en: {
      angle: 'BMW answered 717 horsepower with an electric motor inside the gearbox.',
      audience: 'Saloon buyers, hybrid sceptics, and people who read the kerb weight before the power figure.',
      points: [
        '717 hp combined and 738 lb-ft — a figure that needs both the V8 and the motor to reach it.',
        '3.4 seconds to 60 mph, and 190 mph with the M Driver’s Package.',
        '25 miles of electric range: the school run and the commute, without the V8 waking up.',
        'M xDrive sends it to all four wheels, and still lets you take the front axle out of the equation.',
      ],
      slideTitles: [
        '717 hp combined',
        '3.4 seconds, 190 mph',
        '25 silent miles',
        'All four wheels, when asked',
      ],
      verdict: 'The hybrid is not the compromise here. It is the part that makes 717 hp liveable.',
      neutral: 'The hybrid system serves two roles: silent short-range running, and filling torque below the turbos.',
      question: 'Is a 717 hp plug-in hybrid still an M5 to you?',
      tags: ['BMWM5', 'Hybrid', 'PerformanceSedan'],
    },
  },

  '07': {
    en: {
      angle: 'AMG added rear-axle steering and two rear seats, then made the tourer harder-edged rather than softer.',
      audience: 'GT buyers weighing a second car, and anyone tracking what AMG is becoming.',
      points: [
        '577 hp and 590 lb-ft from a hand-assembled 4.0-litre biturbo V8.',
        '3.1 seconds to 60 mph and 196 mph, through 4MATIC+ all-wheel drive.',
        'Rear-axle steering and active roll stabilisation, on a car sold as a tourer.',
        'Two seats in the back this time, which nobody expected and everybody uses.',
      ],
      slideTitles: [
        '577 hp, built by hand',
        '3.1 seconds, 196 mph',
        'Rear steering on a tourer',
        'Two seats nobody expected',
      ],
      verdict: 'Two natures, and AMG refused to pick one. That is the whole appeal.',
      neutral: 'It is positioned between grand tourer and sports car, and specified for both.',
      question: 'Grand tourer or sports car — which one did they actually build?',
      tags: ['AMGGT', 'Mercedes', 'GrandTourer'],
    },
  },

  '08': {
    en: {
      angle: 'Ford kept the atmospheric V8 and the manual gearbox almost every rival has dropped.',
      audience: 'V8 loyalists, and anyone counting how many naturally aspirated engines are left on sale.',
      points: [
        '500 hp at 7,250 rpm, naturally aspirated — the most powerful non-supercharged Mustang sold.',
        'A Tremec six-speed manual, in a market that has quietly stopped offering them.',
        'Forged connecting rods carried over from the GT500, because 7,250 rpm asks for them.',
        '4.1 seconds to 60 mph and 166 mph, with nothing between your right foot and the intake.',
      ],
      slideTitles: [
        '500 hp, no turbochargers',
        'A manual, still',
        'GT500 connecting rods',
        '4.1 seconds, unfiltered',
      ],
      verdict: 'Naturally aspirated V8s are on a clock. This one is worth hearing before it runs out.',
      neutral: 'It is among the last naturally aspirated V8s offered with a manual gearbox.',
      question: 'Turbocharged and quicker, or naturally aspirated and this?',
      tags: ['Mustang', 'DarkHorse', 'V8'],
    },
  },

  '09': {
    en: {
      angle: 'Land Rover put a supercharged V8 in the Defender without giving up anything that makes it one.',
      audience: 'Overlanders, rural drivers, and anyone whose route occasionally includes a flooded lane.',
      points: [
        '35.4 inches of wading depth — deeper than most cars are tall at the sill.',
        'Air suspension lifts ground clearance to 11.5 inches when the surface stops cooperating.',
        '518 hp from a supercharged 5.0-litre V8, and 4.9 seconds to 60 mph.',
        'The party trick is not the speed. It is arriving dry, having taken the direct route.',
      ],
      slideTitles: [
        '35.4 inches of wading',
        '11.5 inches, on demand',
        '518 supercharged horsepower',
        'Arriving dry',
      ],
      hero: 'Wading',
      verdict: 'A V8 in a Defender should be excessive. Given where it can take you, it reads as specification.',
      neutral: 'The V8 sits alongside, rather than in place of, the vehicle’s off-road hardware.',
      question: 'Ground clearance or wading depth — which number would you actually use?',
      tags: ['Defender', 'LandRover', 'Overland'],
    },
  },

  '10': {
    en: {
      angle: 'A saloon that runs the quarter mile in the nines and still takes four adults and the luggage.',
      audience: 'Drag-strip readers, EV owners, and anyone who argues about rollout.',
      points: [
        '1,020 hp from three motors, and a quarter mile in 9.23 seconds.',
        '1.99 seconds to 60 mph — with rollout subtracted, which is the footnote that starts every argument.',
        '359 miles EPA range, from the same car that will run a nine-second pass.',
        '200 mph, in something with a boot at each end.',
      ],
      slideTitles: [
        '1,020 hp, three motors',
        '1.99 seconds*',
        '359 miles, the same car',
        '200 mph, with a boot',
      ],
      hero: '1/4 mile',
      verdict: 'The asterisk is fair game. The nine-second quarter mile, from a five-seat saloon, is not.',
      neutral: 'Both figures are quoted as published, including the rollout convention behind the 1.99.',
      question: 'Does rollout belong in a 0–60 time?',
      tags: ['ModelS', 'Plaid', 'EV'],
    },
  },
};

/** Copy for one car in one language, or null when it has not been written. */
export const copyOf = (id, lang) => COPY[id]?.[lang] || null;

/** Which languages a car has copy for — the translate phase reads this. */
export const languagesOf = (id) => Object.keys(COPY[id] || {});
