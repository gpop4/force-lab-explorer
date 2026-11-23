import { PhysicsZone } from '../types';

export const MOTION_ZONES: PhysicsZone[] = [
  {
    id: 'gravity-falling',
    name: 'Gravity & Falling',
    shortName: 'Gravity',
    subtitle: 'Drop, Bounce & Zoom Down!',
    emoji: '🍎',
    color: '#ef4444',
    softBg: '#fef2f2',
    x: 430,
    y: 330,
    zoom: 1.35,
    intro:
      'Earth gives everything a giant invisible hug called gravity! It pulls apples off trees, makes balls bounce back down, and keeps our feet right on the ground.',
    wonders: [
      {
        id: 'earth-hug-gravity',
        name: 'Why We Stick to Earth',
        emoji: '🌍',
        wikiTitle: 'Apple_tree',
        wikiFallbacks: ['Apple', 'Earth'],
        forcePower: 'Pull Down',
        tagline: 'Earth’s gentle invisible hug!',
        causeEffect:
          'When you jump straight up, Earth’s invisible pull gently tugs you right back down so you never float away into space.',
        animalPro: {
          animal: 'Tree Kangaroo',
          emoji: '🦘',
          badge: 'Safe Landing Pro',
          story:
            'Tree kangaroos can leap down from high rainforest branches because their strong, cushioned legs catch gravity’s pull safely!',
        },
        tryAtHome:
          'Jump as high as you can three times and feel Earth pull your feet gently back to the floor every single time!',
        accentColor: '#ef4444',
        offsetX: -245,
        offsetY: -135,
        facts: [
          'Gravity pulls everything toward the middle of Earth — even people standing on the other side of the world!',
          'That is why rain falls down from clouds and spilled milk drops straight to the floor.',
          'On the Moon, gravity is much gentler, so astronauts can hop way higher than on Earth!',
        ],
      },
      {
        id: 'feather-vs-bowling-ball',
        name: 'Feather vs. Bowling Ball',
        emoji: '🪶',
        wikiTitle: 'Feather',
        wikiFallbacks: ['Bird_feather', 'Peacock_feather'],
        forcePower: 'Pull Down',
        tagline: 'Air pushes back on light fluffy things!',
        causeEffect:
          'Gravity pulls both a feather and a ball down, but invisible air catches under the wide fluffy feather like a tiny parachute so it floats down slowly.',
        animalPro: {
          animal: 'Golden Eagle',
          emoji: '🦅',
          badge: 'Air-Riding Glider',
          story:
            'Eagles spread their huge feathered wings wide to catch pushing air underneath, letting them soar in the sky without flapping!',
        },
        tryAtHome:
          'Drop a flat piece of paper and a crumpled paper ball at the exact same time to watch the air slow the flat sheet down!',
        accentColor: '#f97316',
        offsetX: 0,
        offsetY: -165,
        facts: [
          'Air looks invisible, but it is full of tiny bouncy bits that push up against wide, flat things.',
          'A heavy bowling ball slices straight through the air without slowing down.',
          'Astronauts dropped a hammer and a feather on the Moon where there is no air — and they hit the ground at the exact same moment!',
        ],
      },
      {
        id: 'bouncy-rubber-ball',
        name: 'Bouncy Balls & Springs',
        emoji: '🏀',
        wikiTitle: 'Basketball',
        wikiFallbacks: ['Bouncy_ball', 'Rubber_ball'],
        forcePower: 'Spring Bounce',
        tagline: 'Squish flat, then pop right back up!',
        causeEffect:
          'When a bouncy ball hits the floor, it squishes flat like a pancake for a blink of an eye, then snaps back round and pushes off the ground!',
        animalPro: {
          animal: 'Red Kangaroo',
          emoji: '🦘',
          badge: 'Built-In Springs',
          story:
            'Kangaroos have stretchy rubber-band tendons in their back legs that squish when they land and spring them forward on the next hop!',
        },
        tryAtHome:
          'Drop a rubber ball and a soft sock from the same height to see which one squishes and pops back up!',
        accentColor: '#ea580c',
        offsetX: 245,
        offsetY: -135,
        facts: [
          'A bouncy basketball is full of tightly squeezed air that acts like a springy cushion.',
          'If you drop a ball from higher up, it hits the floor harder and bounces higher too!',
          'Each bounce gets a little smaller until gravity settles the ball to a stop.',
        ],
      },
      {
        id: 'roller-coaster-drop',
        name: 'Roller Coaster Hills',
        emoji: '🎢',
        wikiTitle: 'Roller_coaster',
        wikiFallbacks: ['Steel_roller_coaster'],
        forcePower: 'Pull Down',
        tagline: 'Climb high, then let gravity zoom you!',
        causeEffect:
          'A chain pulls the coaster to the tippy-top of the tall hill, and then gravity takes over to zoom the cars super fast down the track and up the next bump!',
        animalPro: {
          animal: 'Peregrine Falcon',
          emoji: '🦅',
          badge: 'Fastest Gravity Diver',
          story:
            'Peregrine falcons fold their wings into a pointy teardrop and let gravity pull them into the fastest dive of any animal on Earth!',
        },
        tryAtHome:
          'Tape a cardboard paper-towel tube at a slant and roll a marble down to see how going higher makes it zoom faster!',
        accentColor: '#dc2626',
        offsetX: -275,
        offsetY: 40,
        facts: [
          'Most roller coasters do not have an engine after the first hill — gravity gives them all their zooming power!',
          'The tallest hill is always first so the coaster gets enough speed to climb all the smaller hills.',
          'That tickly tummy feeling at the top of a drop happens right as gravity starts pulling you fast!',
        ],
      },
      {
        id: 'parachute-float',
        name: 'Big Parachutes Catch Air',
        emoji: '🪂',
        wikiTitle: 'Parachute',
        wikiFallbacks: ['Parachuting'],
        forcePower: 'Pull Down',
        tagline: 'Scoop up air for a soft landing!',
        causeEffect:
          'A wide parachute scoops up a giant pocket of air underneath it, which pushes upward against gravity and turns a fast fall into a gentle float.',
        animalPro: {
          animal: 'Flying Squirrel',
          emoji: '🐿️',
          badge: 'Furry Parachute Pro',
          story:
            'Flying squirrels stretch out soft furry flaps between their arms and legs to catch the air and glide softly from tree to tree!',
        },
        tryAtHome:
          'Tie four short pieces of string from a coffee filter or tissue to a tiny plastic toy, toss it up, and watch it float gently down!',
        accentColor: '#fb7185',
        offsetX: 275,
        offsetY: 40,
        facts: [
          'Dandelion seeds use fluffy little umbrellas that work just like tiny nature parachutes!',
          'The wider the parachute is, the more air it traps and the slower it drifts down.',
          'Space capsules returning from outer space open giant colorful parachutes to splash softly into the ocean.',
        ],
      },
      {
        id: 'swing-set-pendulum',
        name: 'Playground Swing Set',
        emoji: '⛓️',
        wikiTitle: 'Swing_(seat)',
        wikiFallbacks: ['Playground'],
        forcePower: 'Spring Bounce',
        tagline: 'Back and forth with a rhythm!',
        causeEffect:
          'When you kick your legs up high, gravity pulls you swinging down through the bottom and swooshes you right up to the other side!',
        animalPro: {
          animal: 'Gibbon',
          emoji: '🐒',
          badge: 'Jungle Swing Master',
          story:
            'Gibbons have extra-long arms and use gravity’s swing rhythm to swoop gracefully from branch to branch high in the trees!',
        },
        tryAtHome:
          'Tie a spoon or toy car to a piece of string, pull it to the side, and let go to watch gravity swing it back and forth!',
        accentColor: '#e11d48',
        offsetX: -150,
        offsetY: 165,
        facts: [
          'A swinging toy on a string is called a pendulum — grandfather clocks use one to tick-tock on time!',
          'A longer rope makes a slow, swoopy swing, while a short string swings back and forth super quick.',
          'Pumping your legs adds a tiny extra push each time so you climb higher toward the clouds!',
        ],
      },
      {
        id: 'trampoline-jump',
        name: 'Bouncy Trampoline',
        emoji: '🤸',
        wikiTitle: 'Trampoline',
        wikiFallbacks: ['Trampolining'],
        forcePower: 'Spring Bounce',
        tagline: 'Stretch the springs, blast to the sky!',
        causeEffect:
          'When you land on a trampoline, your weight stretches all the metal springs tight; then the springs snap back and launch you way up in the air!',
        animalPro: {
          animal: 'Red-Eyed Tree Frog',
          emoji: '🐸',
          badge: 'Super-Spring Jumper',
          story:
            'Tiny tree frogs fold their super-long back legs tight like coiled springs and can leap twenty times their own body length!',
        },
        tryAtHome:
          'Carefully stretch a rubber band just a tiny bit with a grown-up to feel how it wants to snap right back to its cozy shape!',
        accentColor: '#f43f5e',
        offsetX: 150,
        offsetY: 165,
        facts: [
          'Every time you jump down harder, the trampoline springs stretch more and bounce you even higher!',
          'Springs are hiding inside clicky pens, couch cushions, and pogo sticks too.',
          'Astronauts sometimes bounce on trampolines to practice twisting and flipping safely in mid-air!',
        ],
      },
    ],
  },
  {
    id: 'speed-momentum',
    name: 'Speed, Momentum & Traction',
    shortName: 'Speed & Grip',
    subtitle: 'Zoom Fast, Grip Tight & Keep Rolling!',
    emoji: '🏎️',
    color: '#f59e0b',
    softBg: '#fffbeb',
    x: 1230,
    y: 330,
    zoom: 1.35,
    intro:
      'Ready, set, ZOOM! Discover why some racers zip super fast, why heavy trucks are hard to stop, and how grippy tires grab the road.',
    wonders: [
      {
        id: 'fast-vs-slow-race',
        name: 'Fast vs. Slow Zoom',
        emoji: '⚡',
        wikiTitle: 'Cheetah',
        wikiFallbacks: ['Formula_One_car', 'Race_car'],
        forcePower: 'Fast Zoom',
        tagline: 'Big push makes a super fast zoom!',
        causeEffect:
          'A gentle nudge makes a toy roll slowly, while a big strong push sends it zooming across the whole room in a flash!',
        animalPro: {
          animal: 'Cheetah',
          emoji: '🐆',
          badge: 'Fastest Land Sprinter',
          story:
            'Cheetahs can zoom faster than a car on the highway, and they swing their long tail like a boat rudder to turn sharply without tipping over!',
        },
        tryAtHome:
          'Give a toy car a tiny finger tap, then a big push on the floor, and mark with a sock how far each push went!',
        accentColor: '#f59e0b',
        offsetX: -245,
        offsetY: -135,
        facts: [
          'A cheetah goes from standing still to super fast in just three big heartbeats!',
          'Garden snails move so slowly it would take them a whole afternoon to cross a living room.',
          'Pointy shapes like race cars and jets slice through the air easier so they can zoom even faster!',
        ],
      },
      {
        id: 'heavy-train-momentum',
        name: 'Heavy Things Are Hard to Stop',
        emoji: '🚂',
        wikiTitle: 'Freight_train',
        wikiFallbacks: ['Locomotive', 'Train'],
        forcePower: 'Heavy Push',
        tagline: 'Once heavy things roll, they want to keep going!',
        causeEffect:
          'A giant heavy train carries a huge rolling push called momentum, so it takes a very long distance for its brakes to bring it to a full stop.',
        animalPro: {
          animal: 'White Rhinoceros',
          emoji: '🦏',
          badge: 'Unstoppable Heavy Runner',
          story:
            'A heavy rhinoceros weighs as much as two cars, so once it starts trotting fast, it needs extra room to slow down and turn!',
        },
        tryAtHome:
          'Roll a light ping-pong ball and a heavier orange gently across a table, then stop each one with your hand to feel the difference!',
        accentColor: '#d97706',
        offsetX: 0,
        offsetY: -165,
        facts: [
          'Heavy things are hard to get started moving — and just as hard to stop once they get rolling!',
          'A big freight train can take ten whole football fields of track to slow all the way down.',
          'Seatbelts in cars keep our bodies safely snug when a car stops suddenly!',
        ],
      },
      {
        id: 'grippy-tires-traction',
        name: 'Grippy Tires & Cleats',
        emoji: '🛞',
        wikiTitle: 'Tire',
        wikiFallbacks: ['Off-road_tire', 'Monster_truck'],
        forcePower: 'Sticky Grip',
        tagline: 'Bumpy treads hug the road!',
        causeEffect:
          'Chunky rubber grooves on tires and sneakers bite into the ground and push water out of the way so you zoom forward instead of spinning in place.',
        animalPro: {
          animal: 'Mountain Goat',
          emoji: '🐐',
          badge: 'Cliff-Grip Champion',
          story:
            'Mountain goats have split hooves with soft rubbery pads underneath that grip steep rocky cliffs like built-in climbing shoes!',
        },
        tryAtHome:
          'Look at the bottom of your sneakers and trace the bumpy patterns that help you run and stop without slipping!',
        accentColor: '#b45309',
        offsetX: 245,
        offsetY: -135,
        facts: [
          'Monster trucks have gigantic bumpy rubber tires so they can grip slippery mud and dirt!',
          'Rain tires have little channels that squish puddle water away so the rubber touches the road.',
          'Even cats and dogs have soft bumpy paw pads to give them extra grip when they dash around corners!',
        ],
      },
      {
        id: 'bowling-pin-crash',
        name: 'Bowling Ball & Pins',
        emoji: '🎳',
        wikiTitle: 'Ten-pin_bowling',
        wikiFallbacks: ['Bowling_ball', 'Bowling'],
        forcePower: 'Heavy Push',
        tagline: 'Pass the push from ball to pins!',
        causeEffect:
          'When a heavy rolling bowling ball bumps into the pins, it passes its rolling push right into them and sends pins flying everywhere!',
        animalPro: {
          animal: 'Bighorn Sheep',
          emoji: '🐏',
          badge: 'Crash-Bump Pro',
          story:
            'Bighorn sheep have thick curly horns and extra-strong bony heads made to handle big bumps when they butt heads on mountains!',
        },
        tryAtHome:
          'Line up five empty plastic cups and roll a soft ball into them to watch the ball pass its push to the cups!',
        accentColor: '#ea580c',
        offsetX: -275,
        offsetY: 40,
        facts: [
          'A heavy bowling ball knocks down way more pins than a light beach ball rolling at the same speed.',
          'One pin bumping into the next pin passes the push along like a chain of dominoes!',
          'Smooth polished bowling lanes let the ball keep almost all its speed until it reaches the pins.',
        ],
      },
      {
        id: 'shock-absorber-bump',
        name: 'Squishy Bump Cushions',
        emoji: '🚲',
        wikiTitle: 'Mountain_bike',
        wikiFallbacks: ['Bicycle_suspension', 'Shock_absorber'],
        forcePower: 'Spring Bounce',
        tagline: 'Soft cushions soak up bumpy jolts!',
        causeEffect:
          'Springs and soft pads squish gently when you hit a bump, soaking up the hard shake so the ride stays smooth and safe.',
        animalPro: {
          animal: 'Woodpecker',
          emoji: '🐦',
          badge: 'Shock-Absorber Head',
          story:
            'Woodpeckers tap trees twenty times a second without getting a headache because spongy bone cushions wrap around their brain like a helmet!',
        },
        tryAtHome:
          'Drop a wooden block onto a hard floor, then drop it onto a fluffy pillow, and listen how the pillow soaks up the thump!',
        accentColor: '#ca8a04',
        offsetX: 275,
        offsetY: 40,
        facts: [
          'Bike helmets have special foam inside that squishes to protect your head if you tumble.',
          'Cars have bouncy shock-absorber springs above every wheel so bumpy roads feel cozy inside.',
          'Running shoes have squishy foam soles to cushion your feet every single time you jump!',
        ],
      },
      {
        id: 'spinning-top-balance',
        name: 'Spinning Tops & Bikes',
        emoji: '🪀',
        wikiTitle: 'Top',
        wikiFallbacks: ['Spinning_top', 'Gyroscope'],
        forcePower: 'Fast Zoom',
        tagline: 'Spinning fast helps things stay upright!',
        causeEffect:
          'A toy top falls right over when it sits still, but give it a fast twirl and its spinning motion holds it standing tall on its tiny pointy tip!',
        animalPro: {
          animal: 'Hummingbird',
          emoji: '🐦',
          badge: 'Mid-Air Balance Pro',
          story:
            'Hummingbirds whir their tiny wings in fast figure-eights to stay perfectly balanced and still in mid-air while sipping flower nectar!',
        },
        tryAtHome:
          'Spin a coin on a smooth table and watch it stand tall while spinning fast, then wobble and flop flat as it slows down!',
        accentColor: '#f59e0b',
        offsetX: -150,
        offsetY: 165,
        facts: [
          'Bicycle wheels are much easier to balance when you pedal forward fast than when you stand still!',
          'Space stations use giant spinning wheels inside called gyroscopes to stay steady in outer space.',
          'Spinning figure skaters pull their arms in snug to twirl even faster like a tornado!',
        ],
      },
      {
        id: 'rocket-push-back',
        name: 'Balloon Zoom Push-Back',
        emoji: '🎈',
        wikiTitle: 'Toy_balloon',
        wikiFallbacks: ['Balloon', 'Model_rocket'],
        forcePower: 'Fast Zoom',
        tagline: 'Air blasts one way, balloon zooms the other!',
        causeEffect:
          'When you let go of a puffed-up balloon, whooshing air shoots out the back and pushes the balloon zooming forward in the opposite direction!',
        animalPro: {
          animal: 'Jet-Propelled Squid',
          emoji: '🦑',
          badge: 'Underwater Jet Zoomer',
          story:
            'Squids suck water into their body and squirt it out a tiny nozzle backward to rocket away through the ocean like a water balloon!',
        },
        tryAtHome:
          'Blow up a balloon without tying it, pinch the end, count 3-2-1, and let go to watch it zoom around the room!',
        accentColor: '#fb923c',
        offsetX: 150,
        offsetY: 165,
        facts: [
          'Real space rockets blast fiery gas downward so the rocket shoots upward into the sky!',
          'Octopuses and jellyfish also push water behind them to glide forward through the sea.',
          'Every big push in one direction gives an equal push right back the opposite way!',
        ],
      },
    ],
  },
];
