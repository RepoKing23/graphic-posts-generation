/**
 * The ten posts.
 *
 * Specifications are published manufacturer figures (US-market, model years
 * as noted). Nothing here is invented — see NOTICE.md on verifying before use.
 *
 *   layout      which module in src/layouts renders it
 *   profile     archetype fallback if a car has no drawing in theme/carart.js
 *   photoQuery  search terms for scripts/fetch-photos.mjs
 *   accent      the ONE saturated colour the poster is allowed
 */
export const CARS = [
  {
    id: '01', slug: 'toyota-gr-corolla', layout: 'triptych',
    brand: 'toyota', model: 'GR Corolla', trim: 'Circuit Edition', year: '2024',
    profile: 'hatch', accent: '#EB0A1E', photoQuery: 'toyota gr corolla hot hatch',
    kicker: 'Rally-bred, road-legal',
    line: 'Three cylinders. Three exhausts. One very serious hatchback.',
    body: 'Built on the same GR-FOUR all-wheel-drive philosophy as the cars Toyota '
        + 'sends rallying, then handed a six-speed manual and no automatic option at all.',
    specs: [
      { k: 'Power',        v: '300',   u: 'hp @ 6500 rpm' },
      { k: 'Torque',       v: '273',   u: 'lb-ft' },
      { k: 'Engine',       v: '1.6',   u: 'L turbo I3' },
      { k: '0–60 mph',     v: '4.9',   u: 'sec' },
      { k: 'Drivetrain',   v: 'AWD', u: 'GR-FOUR' },
      { k: 'Transmission', v: '6',     u: 'spd manual' },
    ],
  },
  {
    id: '02', slug: 'jeep-wrangler-392', layout: 'concentric',
    brand: 'jeep', model: 'Wrangler', trim: 'Rubicon 392', year: '2024',
    profile: 'offroad', accent: '#E01A2B', photoQuery: 'jeep wrangler rubicon off road',
    kicker: "There's only one",
    line: 'A 6.4-litre V8 where the four-cylinder used to be.',
    body: 'Full-time four-wheel drive, electronic sway-bar disconnect, and lockers front '
        + 'and rear. The quickest Wrangler ever built is also still a Wrangler.',
    specs: [
      { k: 'Power',      v: '470',  u: 'hp' },
      { k: 'Torque',     v: '470',  u: 'lb-ft' },
      { k: 'Engine',     v: '6.4',  u: 'L HEMI V8' },
      { k: '0–60 mph',   v: '4.5',  u: 'sec' },
      { k: 'Clearance',  v: '10.3', u: 'in' },
      { k: 'Fording',    v: '32.5', u: 'in' },
    ],
  },
  {
    id: '03', slug: 'hyundai-ioniq-5-n', layout: 'spotlight',
    brand: 'hyundai', model: 'IONIQ 5 N', trim: 'Dual Motor AWD', year: '2025',
    profile: 'suv', accent: '#2F7BFF', photoQuery: 'hyundai ioniq 5 electric car night',
    kicker: 'Cancel the noise',
    line: '641 horsepower, and a simulated eight-speed shift you do not need.',
    body: 'Hyundai gave an electric crossover a gearbox that is not there, a rev limiter '
        + 'for a redline that does not exist, and a track mode that manages battery heat lap after lap.',
    specs: [
      { k: 'Power',     v: '641', u: 'hp (N Grin Boost)' },
      { k: 'Torque',    v: '568', u: 'lb-ft' },
      { k: '0–60 mph',  v: '3.25', u: 'sec' },
      { k: 'Battery',   v: '84.0', u: 'kWh' },
      { k: 'Range',     v: '221',  u: 'mi EPA' },
      { k: 'DC charge', v: '350',  u: 'kW peak' },
    ],
  },
  {
    id: '04', slug: 'honda-civic-type-r', layout: 'terrain',
    brand: 'honda', model: 'Civic Type R', trim: 'FL5', year: '2025',
    profile: 'hatch', accent: '#CC0000', photoQuery: 'honda civic type r mountain road',
    kicker: 'Experience',
    line: 'The front-wheel-drive benchmark, sharpened again.',
    body: 'A limited-slip differential, a rev-match you can switch off, and suspension '
        + 'tuned at the Nürburgring. Still three pedals. Still no substitute.',
    specs: [
      { k: 'Power',       v: '315', u: 'hp @ 6500 rpm' },
      { k: 'Torque',      v: '310', u: 'lb-ft' },
      { k: 'Engine',      v: '2.0', u: 'L VTEC turbo' },
      { k: '0–60 mph',    v: '5.0', u: 'sec' },
      { k: 'Top speed',   v: '169', u: 'mph' },
      { k: 'Drivetrain',  v: 'FWD', u: '6-spd manual' },
    ],
  },
  {
    id: '05', slug: 'porsche-911-gt3-rs', layout: 'blueprint',
    brand: 'porsche', model: '911 GT3 RS', trim: '992', year: '2024',
    profile: 'coupe', accent: '#7FD4FF', photoQuery: 'porsche 911 gt3 rs race track',
    kicker: 'Aerodynamics, first',
    line: 'A road car with a drag reduction system.',
    body: 'The rear wing sits above the roofline for a reason: at 177 mph this car '
        + 'generates 1,895 pounds of downforce. Everything else was arranged around that.',
    specs: [
      { k: 'Power',      v: '518',   u: 'hp @ 8500 rpm' },
      { k: 'Torque',     v: '342',   u: 'lb-ft' },
      { k: 'Engine',     v: '4.0',   u: 'L flat-six' },
      { k: 'Redline',    v: '9000',  u: 'rpm' },
      { k: '0–60 mph',   v: '2.9',   u: 'sec' },
      { k: 'Downforce',  v: '1895',  u: 'lb @ 177 mph' },
    ],
  },
  {
    id: '06', slug: 'bmw-m5', layout: 'specslab',
    brand: 'bmw', model: 'M5', trim: 'G90', year: '2025',
    profile: 'sedan', accent: '#0066B1', photoQuery: 'bmw m5 sedan studio',
    kicker: 'The numbers',
    line: 'Seven hundred and seventeen horsepower, in a saloon with a boot.',
    body: 'A twin-turbo V8 married to an electric motor inside the gearbox. It will '
        + 'also do twenty-five miles on battery alone, silently, past your neighbours.',
    specs: [
      { k: 'Power',        v: '717', u: 'hp combined' },
      { k: 'Torque',       v: '738', u: 'lb-ft' },
      { k: '0–60 mph',     v: '3.4', u: 'sec' },
      { k: 'Top speed',    v: '190', u: "mph, M Driver's" },
      { k: 'Electric',     v: '25',  u: 'mi range' },
      { k: 'Drivetrain',   v: 'AWD', u: 'M xDrive' },
    ],
  },
  {
    id: '07', slug: 'mercedes-amg-gt-63', layout: 'duotone',
    brand: 'mercedes', model: 'AMG GT 63', trim: '4MATIC+', year: '2025',
    profile: 'coupe', accent: '#B8925A', photoQuery: 'mercedes amg gt coupe',
    kicker: 'Two natures',
    line: 'A grand tourer that forgot to be comfortable about it.',
    body: 'Hand-assembled 4.0-litre biturbo V8, rear-axle steering, active roll '
        + 'stabilisation — and, now, two seats in the back that nobody expected.',
    specs: [
      { k: 'Power',      v: '577', u: 'hp' },
      { k: 'Torque',     v: '590', u: 'lb-ft' },
      { k: 'Engine',     v: '4.0', u: 'L biturbo V8' },
      { k: '0–60 mph',   v: '3.1', u: 'sec' },
      { k: 'Top speed',  v: '196', u: 'mph' },
      { k: 'Drivetrain', v: 'AWD', u: '4MATIC+' },
    ],
  },
  {
    id: '08', slug: 'ford-mustang-dark-horse', layout: 'streak',
    brand: 'ford', model: 'Mustang', trim: 'Dark Horse', year: '2025',
    profile: 'coupe', accent: '#E8552D', photoQuery: 'ford mustang night city lights',
    kicker: 'Still naturally aspirated',
    line: 'Five litres, eight cylinders, no turbochargers, no apology.',
    body: 'The most powerful naturally aspirated Mustang Ford has put on sale, with a '
        + 'Tremec six-speed and forged connecting rods borrowed from the GT500.',
    specs: [
      { k: 'Power',      v: '500', u: 'hp @ 7250 rpm' },
      { k: 'Torque',     v: '418', u: 'lb-ft' },
      { k: 'Engine',     v: '5.0', u: 'L Coyote V8' },
      { k: '0–60 mph',   v: '4.1', u: 'sec' },
      { k: 'Top speed',  v: '166', u: 'mph' },
      { k: 'Gearbox',    v: '6', u: 'spd Tremec' },
    ],
  },
  {
    id: '09', slug: 'land-rover-defender-110-v8', layout: 'halftone',
    brand: 'landrover', model: 'Defender 110', trim: 'V8', year: '2024',
    profile: 'offroad', accent: '#005A2B', photoQuery: 'land rover defender mud terrain',
    kicker: 'Wade, then arrive',
    line: 'Thirty-five inches of water is a road surface.',
    body: 'Supercharged V8, air suspension that lifts to 11.5 inches, and a wading depth '
        + 'that treats a flooded lane as a routing suggestion rather than an obstacle.',
    specs: [
      { k: 'Power',      v: '518',  u: 'hp' },
      { k: 'Torque',     v: '461',  u: 'lb-ft' },
      { k: 'Engine',     v: '5.0',  u: 'L supercharged V8' },
      { k: '0–60 mph',   v: '4.9',  u: 'sec' },
      { k: 'Wading',     v: '35.4', u: 'in' },
      { k: 'Clearance',  v: '11.5', u: 'in' },
    ],
  },
  {
    id: '10', slug: 'tesla-model-s-plaid', layout: 'ticket',
    brand: 'tesla', model: 'Model S', trim: 'Plaid', year: '2025',
    profile: 'sedan', accent: '#CC0000', photoQuery: 'tesla model s white studio',
    kicker: 'Delivery ticket',
    line: 'Under two seconds to sixty, with the roof rack still fitted.',
    body: 'Three motors, carbon-sleeved rotors, and a quarter mile in the nines — '
        + 'from something that will also take four adults and their luggage to another state.',
    specs: [
      { k: 'Power',       v: '1020', u: 'hp, tri-motor' },
      { k: '0–60 mph',    v: '1.99', u: 'sec*' },
      { k: 'Top speed',   v: '200',  u: 'mph' },
      { k: 'Range',       v: '359',  u: 'mi EPA' },
      { k: '1/4 mile',    v: '9.23', u: 'sec' },
      { k: 'Drivetrain',  v: 'AWD', u: 'tri-motor' },
    ],
    footnote: '*with rollout subtracted',
  },
];

export const byId = (id) => CARS.find((c) => c.id === id);
