import { PhysicsZone } from '../types';

export const SURFACE_WATER_ZONES: PhysicsZone[] = [
  {
    id: 'friction-sliding',
    name: 'Friction & Sliding',
    shortName: 'Friction',
    subtitle: 'Slippery Ice vs. Fuzzy Carpet!',
    emoji: '⛸️',
    color: '#06b6d4',
    softBg: '#ecfeff',
    x: 2030,
    y: 330,
    zoom: 1.35,
    intro:
      'Whenever two things rub together, a sneaky helper called friction grabs on! Rough carpet has lots of friction to slow you down, while shiny ice has almost none.',
    wonders: [
      {
        id: 'slippery-ice-slide',
        name: 'Slippery Ice Rink',
        emoji: '⛸️',
        wikiTitle: 'Ice_skating',
        wikiFallbacks: ['Ice_rink', 'Hockey_puck'],
        forcePower: 'Slippery Glide',
        tagline: 'Smooth ice lets you glide forever!',
        causeEffect:
          'Ice is super smooth with a whisper-thin slippery layer of water on top, so there is almost no rubbing friction to stop skates or pucks from gliding!',
        animalPro: {
          animal: 'Emperor Penguin',
          emoji: '🐧',
          badge: 'Belly-Sled Champion',
          story:
            'Penguins flop onto their smooth, sleek tummies and push with their feet to zip across icy snow way faster than waddling!',
        },
        tryAtHome:
          'Push an ice cube gently across a smooth plate and compare it with pushing a rubber eraser — watch the ice zoom!',
        accentColor: '#06b6d4',
        offsetX: -245,
        offsetY: -135,
        facts: [
          'A hockey puck glides all the way across an ice rink from just one flick of a stick!',
          'When ice melts just a tiny bit under your shoe, it acts like tiny water rollers that make you slip.',
          'In snowy winters, people sprinkle gritty sand on icy sidewalks to add bumpy friction so boots can grip!',
        ],
      },
      {
        id: 'carpet-vs-wood',
        name: 'Fuzzy Carpet vs. Smooth Wood',
        emoji: '🧦',
        wikiTitle: 'Carpet',
        wikiFallbacks: ['Wood_flooring', 'Hardwood'],
        forcePower: 'Sticky Grip',
        tagline: 'Fuzzy loops grab onto moving toys!',
        causeEffect:
          'Smooth wood lets sock feet and toy cars glide easily, while fuzzy carpet has millions of tiny soft loops that grab on and make toys stop fast!',
        animalPro: {
          animal: 'Tokay Gecko',
          emoji: '🦎',
          badge: 'Wall-Clinging Grip Pro',
          story:
            'Geckos have millions of tiny microscopic fuzzy hairs on their toes that grip walls and ceilings so tightly they can walk upside down!',
        },
        tryAtHome:
          'In your socks, try a tiny safe slide on a smooth kitchen floor and then on a fuzzy rug to feel the carpet grab your feet!',
        accentColor: '#0891b2',
        offsetX: 0,
        offsetY: -165,
        facts: [
          'Even surfaces that look smooth have tiny invisible bumps when you zoom in with a microscope!',
          'Rolling a ball on carpet slows it down quickly because the fuzzy threads rub all around the ball.',
          'Without friction, your socks would slide everywhere and you could not even walk across the room!',
        ],
      },
      {
        id: 'grass-and-sand',
        name: 'Bumpy Grass & Soft Sand',
        emoji: '🏖️',
        wikiTitle: 'Sand_dune',
        wikiFallbacks: ['Beach', 'Lawn'],
        forcePower: 'Sticky Grip',
        tagline: 'Soft bumpy ground slows wheels down!',
        causeEffect:
          'Tall grass blades poke against rolling balls and loose beach sand shifts under wheels, creating lots of drag that stops toys quickly.',
        animalPro: {
          animal: 'Camel',
          emoji: '🐪',
          badge: 'Sand-Walking Pro',
          story:
            'Camels have huge, wide, squishy feet that spread out like snowshoes so they walk smoothly over soft desert sand without sinking in!',
        },
        tryAtHome:
          'Roll a toy car on a smooth sidewalk and then try pushing it through backyard grass or a sandbox to feel how much harder you push!',
        accentColor: '#0d9488',
        offsetX: 245,
        offsetY: -135,
        facts: [
          'Soccer players kick harder on tall wet grass because the blades grab the ball and slow it down.',
          'Dry beach sand moves away from narrow bike tires, which is why beach bikes use super-fat tires!',
          'Sidewinder snakes wiggle sideways across slippery desert sand so they get a super firm grip!',
        ],
      },
      {
        id: 'bike-brakes-stop',
        name: 'Squeaky Bike Brakes',
        emoji: '🛑',
        wikiTitle: 'Bicycle_brake',
        wikiFallbacks: ['Bicycle', 'Disc_brake'],
        forcePower: 'Sticky Grip',
        tagline: 'Squeeze rubber pads to stop the spin!',
        causeEffect:
          'When you squeeze the brake handle, rubber pads hug tightly against the spinning wheel rim — friction grabs the wheel and brings your bike to a safe stop!',
        animalPro: {
          animal: 'Cheetah Claws',
          emoji: '🐾',
          badge: 'Built-In Brake Cleats',
          story:
            'Unlike house cats, cheetahs keep their tough claws sticking out like soccer cleats so they can dig into dirt and brake super fast!',
        },
        tryAtHome:
          'Spin a toy car wheel with your finger, then gently touch a soft pencil eraser to the spinning wheel to feel friction act like a brake!',
        accentColor: '#0284c7',
        offsetX: -275,
        offsetY: 40,
        facts: [
          'Without friction, bike brakes would not work at all and we would keep rolling forever!',
          'Car brakes get really warm after stopping a heavy car because rubbing friction turns movement into heat.',
          'Train tracks sometimes sprinkle sand right in front of train wheels so brakes can grab tightly in the rain!',
        ],
      },
      {
        id: 'snowy-sled-hill',
        name: 'Snowy Sledding Hill',
        emoji: '🛷',
        wikiTitle: 'Sled',
        wikiFallbacks: ['Sledding', 'Toboggan'],
        forcePower: 'Slippery Glide',
        tagline: 'Smooth plastic runners glide over snow!',
        causeEffect:
          'A sled has a shiny, super-smooth bottom that slides effortlessly over packed snow while gravity pulls you zooming down the hill!',
        animalPro: {
          animal: 'North American River Otter',
          emoji: '🦦',
          badge: 'Mud & Snow Slider',
          story:
            'River otters love sliding down slippery snowy hills and wet muddy riverbanks on their sleek fur just for fun and fast travel!',
        },
        tryAtHome:
          'Slide a smooth plastic lid and a rough dish towel down a tilted cookie sheet to see which one acts like a fast sled!',
        accentColor: '#0ea5e9',
        offsetX: 275,
        offsetY: 40,
        facts: [
          'Fresh fluffy snow has more friction than packed icy snow, so packed sled tracks are much faster!',
          'Skiers rub smooth wax on the bottom of their skis to make them even more slippery on snow.',
          'Sleds curve up at the front tip so they glide right over little snow bumps instead of digging in!',
        ],
      },
      {
        id: 'rubbing-hands-warm',
        name: 'Rubbing Hands Makes Warmth',
        emoji: '🔥',
        wikiTitle: 'Campfire',
        wikiFallbacks: ['Fire_making', 'Friction'],
        forcePower: 'Sticky Grip',
        tagline: 'Fast rubbing turns movement into cozy heat!',
        causeEffect:
          'When you rub your hands together super fast, friction makes all the tiny bumps on your skin tug and wiggle, creating instant cozy warmth!',
        animalPro: {
          animal: 'Honeybee',
          emoji: '🐝',
          badge: 'Cozy Warm-Up Pro',
          story:
            'In chilly weather, honeybees huddle together and vibrate their flight muscles super fast to create cozy warmth inside the hive!',
        },
        tryAtHome:
          'Press your palms together and rub them super fast for ten seconds, then touch your cheeks to feel the instant friction heat!',
        accentColor: '#f97316',
        offsetX: -150,
        offsetY: 165,
        facts: [
          'Long ago, people rubbed two dry sticks together fast enough to make friction sparks for a campfire!',
          'Shooting stars glow brightly in the night sky because space rocks rub super fast against Earth’s air!',
          'If you slide down a playground slide in shorts on a hot day, friction can make the slide feel extra warm.',
        ],
      },
      {
        id: 'slippery-soap-water',
        name: 'Soapy Slippery Slides',
        emoji: '🫧',
        wikiTitle: 'Water_slide',
        wikiFallbacks: ['Soap_bubble', 'Water_park'],
        forcePower: 'Slippery Glide',
        tagline: 'Water and soap make bumpy spots super slick!',
        causeEffect:
          'Water and bubbly soap fill in tiny bumps between surfaces like invisible roller skates, cutting down friction so you zip down a water slide!',
        animalPro: {
          animal: 'Bottlenose Dolphin',
          emoji: '🐬',
          badge: 'Silky Water Zoomer',
          story:
            'Dolphins have ultra-smooth, silky rubbery skin that slips through ocean water with almost no drag so they can leap high into the air!',
        },
        tryAtHome:
          'Rub two dry fingers together, then add a tiny drop of soapy water at the sink and feel how slippery friction becomes!',
        accentColor: '#38bdf8',
        offsetX: 150,
        offsetY: 165,
        facts: [
          'Bike chains use slippery oil drops so the metal links glide quietly without squeaking!',
          'A dry plastic water slide stops you fast, but turn on the rushing water and WHOOSH — away you go!',
          'Snails make their own slippery slime trail so their soft bellies glide safely over rough rocks!',
        ],
      },
    ],
  },
  {
    id: 'sink-float',
    name: 'Sink or Float — Buoyancy',
    shortName: 'Sink or Float',
    subtitle: 'Splish, Splash & Water Lift!',
    emoji: '⛵',
    color: '#2563eb',
    softBg: '#eff6ff',
    x: 430,
    y: 930,
    zoom: 1.35,
    intro:
      'Splash into the Water Bay! Water pushes upward on everything you drop in — that upward lift is called buoyancy, and it decides what floats and what sinks!',
    wonders: [
      {
        id: 'heavy-ship-floats',
        name: 'Giant Heavy Ships That Float',
        emoji: '🚢',
        wikiTitle: 'Container_ship',
        wikiFallbacks: ['Cruise_ship', 'Ship'],
        forcePower: 'Water Lift',
        tagline: 'Big hollow boat shapes hold lots of air!',
        causeEffect:
          'Even though a huge steel ship is super heavy, its wide hollow bowl shape is filled with light air and pushes away tons of water, so the water lifts it right up!',
        animalPro: {
          animal: 'Mallard Duck',
          emoji: '🦆',
          badge: 'Unsinkable Feather Boat',
          story:
            'Ducks coat their fluffy feathers with waterproof oil that traps cozy air pockets underneath, turning them into feathery floating boats!',
        },
        tryAtHome:
          'Drop a crumpled ball of aluminum foil in a bowl of water (it sinks!), then shape a second foil piece into a wide little boat to watch it float!',
        accentColor: '#2563eb',
        offsetX: -245,
        offsetY: -135,
        facts: [
          'A giant cargo ship can weigh as much as ten thousand elephants and still float on top of the ocean!',
          'Shape matters! A solid chunk of steel sinks instantly, but a wide hollow steel bowl floats easily.',
          'If too much water fills up inside a boat, it pushes the air out and makes the boat sink.',
        ],
      },
      {
        id: 'tiny-pebble-sinks',
        name: 'Tiny Pebbles That Sink',
        emoji: '🪨',
        wikiTitle: 'Pebble',
        wikiFallbacks: ['River_pebble', 'Rock_(geology)'],
        forcePower: 'Pull Down',
        tagline: 'Heavy packed stuff drops right through water!',
        causeEffect:
          'A tiny pebble is packed tightly with heavy rock and has no air pockets inside, so gravity pulls it straight down past the water’s upward push.',
        animalPro: {
          animal: 'Hippopotamus',
          emoji: '🦛',
          badge: 'Underwater River Walker',
          story:
            'Hippos have super dense, heavy bones that let them sink right to the bottom of rivers and trot along the riverbed like underwater tanks!',
        },
        tryAtHome:
          'Drop a tiny coin and a big wooden spoon into a sink full of water to see why size alone does not decide what sinks!',
        accentColor: '#1d4ed8',
        offsetX: 0,
        offsetY: -165,
        facts: [
          'Something small like a marble sinks, while a giant tree log floats — it is about how tightly packed the stuff is!',
          'Wood has millions of tiny invisible air tubes inside from when it was a growing tree, helping logs float.',
          'Crocodiles sometimes swallow smooth river stones to help them stay steady underwater!',
        ],
      },
      {
        id: 'diving-submarine',
        name: 'Diving Submarines',
        emoji: '🤿',
        wikiTitle: 'Submarine',
        wikiFallbacks: ['Submersible'],
        forcePower: 'Water Lift',
        tagline: 'Fill tanks with water to dive, air to rise!',
        causeEffect:
          'Submarines have secret tanks inside: letting heavy ocean water in makes the submarine sink down to explore, and blowing air back in lifts it up to the surface!',
        animalPro: {
          animal: 'Chambered Nautilus',
          emoji: '🐚',
          badge: 'Original Living Submarine',
          story:
            'The nautilus has spiral shell rooms that it fills with water to sink deep or fills with gas to float up — just like a real submarine!',
        },
        tryAtHome:
          'Fill an empty plastic water bottle with air and push it underwater (it pops up!), then fill it with water and watch it sink like a diving sub!',
        accentColor: '#0369a1',
        offsetX: 245,
        offsetY: -135,
        facts: [
          'Submarines can stay hidden deep under the waves where big ocean storms cannot rock them.',
          'Most fish have a little air balloon inside their tummy called a swim bladder that works like a mini submarine!',
          'Divers wear special inflatable vests to float smoothly right in the middle of the water without sinking or popping up.',
        ],
      },
      {
        id: 'rising-air-bubbles',
        name: 'Rising Air Bubbles',
        emoji: '🫧',
        wikiTitle: 'Bubble_(physics)',
        wikiFallbacks: ['Soap_bubble', 'Scuba_diving'],
        forcePower: 'Water Lift',
        tagline: 'Air is super light so water pushes it UP!',
        causeEffect:
          'Air is much lighter than water, so whenever air gets trapped underwater, the heavier water squeezes underneath and pushes the wiggly bubbles racing to the top!',
        animalPro: {
          animal: 'Sea Otter',
          emoji: '🦦',
          badge: 'Air-Blanket Floater',
          story:
            'Sea otters have the thickest fur on Earth and blow tiny air bubbles into it so they stay warm and float lazily on their backs!',
        },
        tryAtHome:
          'Use a straw to gently blow bubbles into a cup of water and watch every single bubble race straight up to pop at the top!',
        accentColor: '#0284c7',
        offsetX: -275,
        offsetY: 40,
        facts: [
          'Underwater air bubbles always race upward — they are nature’s arrow pointing toward the sky!',
          'Tiny fizzy soda bubbles can even cling to a raisin and give it an elevator ride to the top of a glass!',
          'Humpback whales blow giant rings of rising bubbles called bubble nets to corral tasty little fish!',
        ],
      },
      {
        id: 'pool-floaties-vest',
        name: 'Pool Floaties & Life Vests',
        emoji: '🛟',
        wikiTitle: 'Life_jacket',
        wikiFallbacks: ['Lifebuoy', 'Inflatable'],
        forcePower: 'Water Lift',
        tagline: 'Strap on trapped air to stay bobbing high!',
        causeEffect:
          'Life vests and beach balls are stuffed with airy foam or puffed-up air, giving water lots of light stuff to lift so you bob happily at the surface!',
        animalPro: {
          animal: 'Goldfish',
          emoji: '🐠',
          badge: 'Built-In Floaty Balloon',
          story:
            'Goldfish have a tiny stretchy air balloon inside their belly called a swim bladder that keeps them floating effortlessly without sinking!',
        },
        tryAtHome:
          'Try pushing a capped empty plastic bottle all the way to the bottom of the bathtub and feel how hard the water pushes it back up!',
        accentColor: '#3b82f6',
        offsetX: 275,
        offsetY: 40,
        facts: [
          'Sharks do not have an air balloon inside, so they use giant oily livers and keep swimming to stay up!',
          'Pool noodles are made of foam packed with millions of microscopic sealed air bubbles.',
          'Even big oranges float with their puffy peel on — because the orange peel is full of tiny air pockets like a built-in life jacket!',
        ],
      },
      {
        id: 'salty-ocean-float',
        name: 'Extra-Floaty Salty Sea',
        emoji: '🌊',
        wikiTitle: 'Dead_Sea',
        wikiFallbacks: ['Sea_salt', 'Ocean'],
        forcePower: 'Water Lift',
        tagline: 'Salty water gives an even bigger lift!',
        causeEffect:
          'Mixing lots of salt into water makes the water heavier and thicker, so salty ocean water pushes upward even harder than fresh bathtub water!',
        animalPro: {
          animal: 'Green Sea Turtle',
          emoji: '🐢',
          badge: 'Ocean Rest Floater',
          story:
            'Sea turtles glide easily through salty ocean water and can bob calmly near the sunny surface to take a big breath of air!',
        },
        tryAtHome:
          'Place an uncooked egg in fresh water (it sinks!), then let a grown-up stir in five big spoonfuls of salt to watch the egg magically float!',
        accentColor: '#06b6d4',
        offsetX: -150,
        offsetY: 165,
        facts: [
          'The Dead Sea is so super salty that people can lie back and read a book floating on top like a cork!',
          'Cargo ships actually float slightly higher in the salty ocean than they do in fresh rivers.',
          'Adding salt packs invisible extra bits into the water, giving the water stronger lifting muscles!',
        ],
      },
      {
        id: 'iceberg-floating',
        name: 'Giant Floating Icebergs',
        emoji: '🧊',
        wikiTitle: 'Iceberg',
        wikiFallbacks: ['Sea_ice', 'Polar_bear'],
        forcePower: 'Water Lift',
        tagline: 'Frozen ice puffs up slightly so it floats!',
        causeEffect:
          'When liquid water freezes into solid ice, its tiny water pieces spread out with tiny spaces between them — making ice slightly lighter than water so it floats!',
        animalPro: {
          animal: 'Polar Bear',
          emoji: '🐻‍❄️',
          badge: 'Ice-Island Swimmer',
          story:
            'Polar bears swim between floating icebergs using huge paddle paws and hollow air-filled fur hairs that help keep them buoyant and warm!',
        },
        tryAtHome:
          'Drop three ice cubes into a clear glass of water and peek from the side to see how most of the ice hides underwater like a real iceberg!',
        accentColor: '#38bdf8',
        offsetX: 150,
        offsetY: 165,
        facts: [
          'Only the tippy-top of an iceberg pokes out of the ocean — the biggest part hides right underneath!',
          'Because ice floats on top of ponds in winter, fish and frogs stay cozy and safe in the liquid water below!',
          'Some giant ocean icebergs are taller than a skyscraper and wider than a whole town!',
        ],
      },
    ],
  },
];
