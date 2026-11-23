import { PhysicsZone } from '../types';

export const MAGNET_MACHINE_ZONES: PhysicsZone[] = [
  {
    id: 'magnetism-pulls',
    name: 'Magnetism & Invisible Pulls',
    shortName: 'Magnets',
    subtitle: 'Snap Together & Push Away!',
    emoji: '🧲',
    color: '#8b5cf6',
    softBg: '#f5f3ff',
    x: 1230,
    y: 930,
    zoom: 1.35,
    intro:
      'Magnets have a super-cool invisible superpower! Without even touching, they can pull metal things snapping straight to them — or push another magnet away!',
    wonders: [
      {
        id: 'attract-and-repel',
        name: 'Pull Together & Push Away',
        emoji: '🧲',
        wikiTitle: 'Magnet',
        wikiFallbacks: ['Horseshoe_magnet', 'Neodymium_magnet'],
        forcePower: 'Invisible Pull',
        tagline: 'Opposites snap — twins push away!',
        causeEffect:
          'Every magnet has a North end and a South end: North and South love to snap together, while two Norths or two Souths push each other apart like invisible springs!',
        animalPro: {
          animal: 'Loggerhead Sea Turtle',
          emoji: '🐢',
          badge: 'Magnetic Ocean Navigator',
          story:
            'Baby sea turtles can feel Earth’s invisible magnetic pull right from the moment they hatch, guiding them across whole oceans!',
        },
        tryAtHome:
          'Hold two magnets close together, then flip one magnet around backwards to feel the invisible force switch from pull to push!',
        accentColor: '#8b5cf6',
        offsetX: -245,
        offsetY: -135,
        facts: [
          'Magnet power works right through paper, cardboard, water, and even the air!',
          'If you break a bar magnet in half, you do not lose a pole — you magically get two smaller magnets with both North and South ends!',
          'You cannot see a magnetic field, but iron dust sprinkled on paper draws its curvy invisible lines!',
        ],
      },
      {
        id: 'magic-compass',
        name: 'North-Pointing Compass',
        emoji: '🧭',
        wikiTitle: 'Compass',
        wikiFallbacks: ['Magnetic_compass'],
        forcePower: 'Invisible Pull',
        tagline: 'A tiny floating magnet points North!',
        causeEffect:
          'A compass holds a lightweight spinning magnet needle that feels Earth’s giant magnetic field and always swings to point toward the North Pole!',
        animalPro: {
          animal: 'European Robin',
          emoji: '🐦',
          badge: 'Magnetic-Map Flyer',
          story:
            'Migrating robins have a special natural compass built right into their eyes so they always know which way is North and South!',
        },
        tryAtHome:
          'Turn around in a circle while holding a toy compass (or phone compass app) and watch the magic red arrow keep pointing the same way!',
        accentColor: '#7c3aed',
        offsetX: 0,
        offsetY: -165,
        facts: [
          'Sailors used magnetic compasses for hundreds of years to steer ships across foggy oceans!',
          'If you hold another magnet next to a compass, the needle gets tricked and spins toward your magnet!',
          'Even in pitch-black darkness or thick clouds, a compass still knows which way is North.',
        ],
      },
      {
        id: 'maglev-floating-train',
        name: 'Floating Maglev Trains',
        emoji: '🚄',
        wikiTitle: 'Maglev',
        wikiFallbacks: ['Shanghai_maglev_train', 'Shinkansen'],
        forcePower: 'Invisible Pull',
        tagline: 'Super magnets float a whole train in mid-air!',
        causeEffect:
          'Powerful magnets on the track and under the train push against each other to lift the whole train off the rails — with zero wheel friction, it glides super fast and quiet!',
        animalPro: {
          animal: 'Pacific Salmon',
          emoji: '🐟',
          badge: 'Magnetic Stream Finder',
          story:
            'Salmon swim thousands of miles in the ocean and use Earth’s invisible magnetic clues to glide right back to the exact river where they were born!',
        },
        tryAtHome:
          'Stack two donut-shaped ring magnets on a pencil so their matching poles face each other — watch the top magnet float in mid-air like a mini maglev!',
        accentColor: '#6d28d9',
        offsetX: 245,
        offsetY: -135,
        facts: [
          'Maglev is short for Magnetic Levitation — which means floating with magnets!',
          'Because maglev trains do not even touch the track, they can zoom faster than three hundred miles an hour!',
          'Alternating pulls and pushes along the track smoothly glide the train forward like surfing on an invisible wave!',
        ],
      },
      {
        id: 'fridge-magnet-stick',
        name: 'Fridge Magnets & Iron',
        emoji: '📎',
        wikiTitle: 'Refrigerator_magnet',
        wikiFallbacks: ['Paper_clip', 'Ferromagnetism'],
        forcePower: 'Invisible Pull',
        tagline: 'Magnets love iron and steel, not wood or plastic!',
        causeEffect:
          'Magnets only stick to special metals like iron and steel (such as paperclips and fridge doors) — they completely ignore wood, plastic, rubber, and apples!',
        animalPro: {
          animal: 'Honeybee',
          emoji: '🐝',
          badge: 'Tiny Iron-Grain Finder',
          story:
            'Honeybees actually have tiny microscopic grains of magnetic iron inside their tummies that help them find their way back to the hive!',
        },
        tryAtHome:
          'Go on a Fridge Magnet Hunt around your house with a grown-up to discover three things a magnet sticks to and three things it ignores!',
        accentColor: '#9333ea',
        offsetX: -275,
        offsetY: 40,
        facts: [
          'Not even all shiny metals stick to magnets — aluminum soda cans and copper pennies do not stick!',
          'You can hang a chain of three or four paperclips from one strong magnet because the paperclips borrow magnetic power!',
          'Magnetic cabinet latches and purse clasps use tiny hidden magnets to click shut neatly.',
        ],
      },
      {
        id: 'giant-junkyard-magnet',
        name: 'Switch-On Crane Magnets',
        emoji: '🏗️',
        wikiTitle: 'Electromagnet',
        wikiFallbacks: ['Scrap', 'Crane_(machine)'],
        forcePower: 'Invisible Pull',
        tagline: 'Electricity makes a magnet you can turn ON and OFF!',
        causeEffect:
          'Giant recycling cranes run electricity through a coil of wire to make a super-strong electromagnet that lifts heavy scrap cars, then switches OFF to drop them cleanly!',
        animalPro: {
          animal: 'Electric Eel',
          emoji: '⚡',
          badge: 'Living Electricity Pro',
          story:
            'Electric eels have special battery-like cells in their long body that send out tiny electric pulses to sense where things are in muddy rivers!',
        },
        tryAtHome:
          'Listen closely next time a doorbell rings or a speaker plays music — tiny switch-on electromagnets inside are tapping and wiggling to make the sound!',
        accentColor: '#a855f7',
        offsetX: 275,
        offsetY: 40,
        facts: [
          'Regular fridge magnets stay magnetic all day, but electromagnets can switch ON and OFF with one button!',
          'Your headphones and speakers use tiny electromagnets vibrating super fast to play your favorite songs.',
          'Recycling centers use giant hanging electromagnets to scoop steel cans right out of mixed trash!',
        ],
      },
      {
        id: 'earth-giant-magnet',
        name: 'Earth Is a Giant Magnet',
        emoji: '🌌',
        wikiTitle: 'Aurora',
        wikiFallbacks: ['Earth%27s_magnetic_field', 'Aurora_borealis'],
        forcePower: 'Invisible Pull',
        tagline: 'A shimmering magnetic shield around our planet!',
        causeEffect:
          'Deep inside Earth, swirling hot liquid iron turns our whole planet into a giant magnet with an invisible shield that even paints glowing Northern Lights in the sky!',
        animalPro: {
          animal: 'Humpback Whale',
          emoji: '🐋',
          badge: 'Globe-Trekking Whale',
          story:
            'Humpback whales travel thousands of miles in nearly straight lines across the open ocean by following Earth’s giant magnetic map!',
        },
        tryAtHome:
          'Draw Earth on a piece of paper with a big N at the top and S at the bottom, then trace big rainbow shield loops curving from North to South!',
        accentColor: '#6366f1',
        offsetX: -150,
        offsetY: 165,
        facts: [
          'Earth’s invisible magnetic bubble protects our air and animals from wild sunny space wind!',
          'When sun sparkles bounce off Earth’s magnetic shield near the poles, they paint dancing green and purple ribbons called auroras!',
          'Hundreds of animals — from whales to butterflies — use Earth’s giant magnet to find their way home.',
        ],
      },
      {
        id: 'magnetic-train-toys',
        name: 'Snap-Together Train Toys',
        emoji: '🚂',
        wikiTitle: 'Wooden_railway',
        wikiFallbacks: ['Toy_train', 'Magnetic_building_tiles'],
        forcePower: 'Invisible Pull',
        tagline: 'Little magnets link train cars with a click!',
        causeEffect:
          'Wooden toy trains have little round magnets on their noses and tails — turn them the right way and CLICK, they snap together; turn one backward and the cars chase each other away!',
        animalPro: {
          animal: 'Monarch Butterfly',
          emoji: '🦋',
          badge: 'Tiny Winged Compass',
          story:
            'Even delicate monarch butterflies have a tiny magnetic sensor in their antennae helping them fly thousands of miles south for winter!',
        },
        tryAtHome:
          'Line up two magnetic toy trains or magnetic tiles on a flat table and see if you can push the front one forward without even touching it!',
        accentColor: '#c084fc',
        offsetX: 150,
        offsetY: 165,
        facts: [
          'Magnetic building tiles snap together from any angle because little magnets spin freely inside the plastic edges!',
          'If you turn a magnetic train car backwards, its matching pole pushes the next train car across the floor like magic!',
          'Toy designers love magnets because little hands can snap and unsnap them easily without screws or glue.',
        ],
      },
    ],
  },
  {
    id: 'simple-machines',
    name: 'Simple Machines',
    shortName: 'Machines',
    subtitle: 'Ramps, Levers, Pulleys & Gears!',
    emoji: '⚙️',
    color: '#16a34a',
    softBg: '#f0fdf4',
    x: 2030,
    y: 930,
    zoom: 1.35,
    intro:
      'Welcome to the Clever Workshop! Simple machines are everyday super-helpers — ramps, seesaws, pulleys, wheels, and gears — that make lifting and moving heavy stuff super easy!',
    wonders: [
      {
        id: 'playground-ramp-slide',
        name: 'Ramps & Slides',
        emoji: '🛝',
        wikiTitle: 'Playground_slide',
        wikiFallbacks: ['Inclined_plane', 'Wheelchair_ramp'],
        forcePower: 'Helper Machine',
        tagline: 'Gentle slopes make climbing way easier!',
        causeEffect:
          'Lifting a heavy box straight up is hard, so a slanted ramp spreads the climb out smoothly — letting you roll heavy things up with a much easier push!',
        animalPro: {
          animal: 'Leafcutter Ant',
          emoji: '🐜',
          badge: 'Trail-Building Lifter',
          story:
            'Tiny leafcutter ants clear smooth sloping highway paths over sticks and leaves so they can carry giant leaf pieces up hills back to their nest!',
        },
        tryAtHome:
          'Prop a sturdy book or piece of cardboard against a couch cushion to build a ramp and race toy cars up and down!',
        accentColor: '#16a34a',
        offsetX: -245,
        offsetY: -135,
        facts: [
          'A playground slide, a wheelchair ramp, and a winding mountain road are all clever ramp machines!',
          'A longer, gentler ramp takes a little extra walking, but it feels way easier to push up than a steep hill.',
          'Long ago, builders used giant earthen ramps to drag huge stone blocks to the tops of pyramids!',
        ],
      },
      {
        id: 'seesaw-lever',
        name: 'Seesaws & Levers',
        emoji: '⚖️',
        wikiTitle: 'Seesaw',
        wikiFallbacks: ['Lever', 'Crowbar_(tool)'],
        forcePower: 'Helper Machine',
        tagline: 'Push one end down to lift the other up!',
        causeEffect:
          'A seesaw is a stiff bar balancing on a middle bump — pushing down on your end lifts your friend high into the sky, even if they are heavier than you!',
        animalPro: {
          animal: 'Sea Otter',
          emoji: '🦦',
          badge: 'Clever Tool-Using Pro',
          story:
            'Sea otters use clever rocks and shells as prying tools and hammers on their tummies to pop open tough clamshells!',
        },
        tryAtHome:
          'Balance a wooden ruler across a thick marker on the table, put a toy on one end, and tap the other end to launch a mini seesaw!',
        accentColor: '#15803d',
        offsetX: 0,
        offsetY: -165,
        facts: [
          'A kid sitting way out at the far end of a seesaw can actually lift a grown-up sitting closer to the middle!',
          'Scissors, bottle openers, light switches, and spoon catapults are all sneaky levers!',
          'Your very own elbows and arms act like built-in levers every time you pick up a teddy bear!',
        ],
      },
      {
        id: 'treehouse-pulley',
        name: 'Rope & Pulley Lifts',
        emoji: '🪢',
        wikiTitle: 'Pulley',
        wikiFallbacks: ['Block_and_tackle', 'Crane_(machine)'],
        forcePower: 'Helper Machine',
        tagline: 'Pull DOWN on a rope to lift UP!',
        causeEffect:
          'A pulley is a grooved wheel with a rope looped over it — pulling downward with your own body weight smoothly hoists a bucket or flag straight up high!',
        animalPro: {
          animal: 'Orb-Weaver Spider',
          emoji: '🕷️',
          badge: 'Silk-Line Hoist Master',
          story:
            'Spiders spin super-strong silk lines and smoothly haul themselves up and down or lift tiny prey bundles just like a living pulley!',
        },
        tryAtHome:
          'Loop a jump rope over a smooth doorknob or broomstick resting between two chairs and pull down to hoist a small toy basket up!',
        accentColor: '#059669',
        offsetX: 245,
        offsetY: -135,
        facts: [
          'Flagpoles use a pulley at the very top so you can raise a flag high in the sky while standing on the ground!',
          'Elevators in tall buildings use giant super-strong pulleys and cables to lift people smoothly to the top floor.',
          'Adding extra pulley wheels shares the heavy work so lifting a giant load feels light as a feather!',
        ],
      },
      {
        id: 'wheels-and-axles',
        name: 'Rolling Wheels & Axles',
        emoji: '🎡',
        wikiTitle: 'Ferris_wheel',
        wikiFallbacks: ['Wheel_and_axle', 'Wagon'],
        forcePower: 'Helper Machine',
        tagline: 'Round wheels beat dragging every time!',
        causeEffect:
          'Dragging a heavy toy box rubs hard against the floor, but putting round wheels on a spinning rod (an axle) lets it roll effortlessly with tiny friction!',
        animalPro: {
          animal: 'Dung Beetle',
          emoji: '🪲',
          badge: 'Nature’s Wheel Roller',
          story:
            'Dung beetles pat food into a super-round ball and roll it smoothly across the savanna — way faster than dragging a heavy lump!',
        },
        tryAtHome:
          'Try pushing a heavy book flat across the table, then lay three round markers underneath it like rollers and feel how easily it glides!',
        accentColor: '#10b981',
        offsetX: -275,
        offsetY: 40,
        facts: [
          'Doorknobs, steering wheels, Ferris wheels, and skateboards are all wheel-and-axle machines!',
          'Turning a big steering wheel makes it super easy to twist the heavy car tires down below.',
          'Rolling a wheel creates way less rubbing friction than sliding a flat box!',
        ],
      },
      {
        id: 'spinning-gears',
        name: 'Spinning Clicking Gears',
        emoji: '⚙️',
        wikiTitle: 'Gear',
        wikiFallbacks: ['Clockwork', 'Bicycle_drivetrain'],
        forcePower: 'Helper Machine',
        tagline: 'Teeth lock together to pass the spin!',
        causeEffect:
          'Gears are wheels with bumpy teeth around the edge — when one gear spins, its teeth push the neighbor gear to spin in the opposite direction!',
        animalPro: {
          animal: 'Planthopper Bug',
          emoji: '🦗',
          badge: 'Real Living Leg Gears!',
          story:
            'Baby planthopper bugs actually grow real tiny interlocking gears on their hind legs so both legs snap straight at the exact same instant when they jump!',
        },
        tryAtHome:
          'Peek at the gears on a bicycle or an old hand-crank eggbeater with a grown-up and watch how spinning one wheel turns the other!',
        accentColor: '#22c55e',
        offsetX: 275,
        offsetY: 40,
        facts: [
          'When two gears touch, one spins clockwise while its partner spins the opposite way!',
          'Bicycles use gears and a chain so pedaling uphill feels light and pedaling on flat roads goes super fast.',
          'Inside wind-up toys and old ticking clocks, dozens of tiny gears work together like a dancing team!',
        ],
      },
      {
        id: 'twisty-screw-lid',
        name: 'Twisty Jar Lids & Screws',
        emoji: '🔩',
        wikiTitle: 'Screw',
        wikiFallbacks: ['Spiral_staircase', 'Mason_jar'],
        forcePower: 'Helper Machine',
        tagline: 'A ramp wrapped around in a curly spiral!',
        causeEffect:
          'A screw or twisty jar lid is really a tiny ramp wrapped round and round — twisting gently pulls the lid down super tight so nothing spills!',
        animalPro: {
          animal: 'Spiral Narwhal Tusk',
          emoji: '🐳',
          badge: 'Ocean Spiral Wonder',
          story:
            'Narwhals grow an amazing long twisty spiral tusk that slices cleanly through icy Arctic ocean water!',
        },
        tryAtHome:
          'Twist the lid on and off a plastic peanut butter jar and trace the spiral ramp grooves with your finger!',
        accentColor: '#16a34a',
        offsetX: -150,
        offsetY: 165,
        facts: [
          'A spiral staircase is like a giant walk-up screw that saves space while climbing high!',
          'Twisty water-bottle caps hold water tightly sealed even if you bounce your backpack upside down.',
          'Giant Archimedes screws lift water up hills just by spinning around inside a tube!',
        ],
      },
      {
        id: 'splitting-wedge',
        name: 'Sharp Wedges & Snowplows',
        emoji: '🪓',
        wikiTitle: 'Snowplow',
        wikiFallbacks: ['Wedge', 'Axe'],
        forcePower: 'Helper Machine',
        tagline: 'Pointy V-shapes push things apart!',
        causeEffect:
          'A wedge is shaped like a pointy slice of pizza — push the narrow edge forward and its slanted sides smoothly split snow, wood, or apples apart!',
        animalPro: {
          animal: 'North American Beaver',
          emoji: '🦫',
          badge: 'Chisel-Tooth Builder',
          story:
            'Beavers have super-strong, orange wedge-shaped front teeth that slice right through whole tree trunks to build cozy river dams!',
        },
        tryAtHome:
          'Look at a doorstop wedge holding a door open — its slanted triangle shape squeezes snugly under the door to keep it from swinging shut!',
        accentColor: '#4ade80',
        offsetX: 150,
        offsetY: 165,
        facts: [
          'The pointy front nose of a ship is a giant wedge that slices smoothly through ocean waves!',
          'Your very own front teeth are built-in wedges made for biting cleanly into crunchy apples!',
          'Snowplows have big angled wedge blades that push heavy snow neatly off to the sides of the road.',
        ],
      },
    ],
  },
];
