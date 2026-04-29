/**
 * Generates a large outreach list from known creator niches.
 * Outputs to Desktop as a text file ready for copy-paste DMs.
 */

const DM_TEMPLATE = (name: string, ending: string) =>
    `Hey ${name} — building Collateral, an accountability platform where people fund contracts around measurable goals. Testing creator partnerships: small post fee + $10-$25 per funded contract. ${ending}`;

const ENDINGS = ['Open to a look?', 'Worth a look?', 'Interested?', 'Open to taking a look?', 'Worth checking out?'];

// All known creators across niches
const CREATORS: { name: string; handle: string; niche: string }[] = [
    // === BUILD IN PUBLIC / INDIE HACKERS ===
    { name: 'Pieter Levels', handle: '@levelsio', niche: 'indie hacker' },
    { name: 'Danny Postma', handle: '@dannypostma', niche: 'AI indie maker' },
    { name: 'Marc Lou', handle: '@marc_louvion', niche: 'speed builder' },
    { name: 'Jon Yongfook', handle: '@yongfook', niche: 'SaaS builder' },
    { name: 'Tibo Louis-Lucas', handle: '@tibo_maker', niche: 'growth tools' },
    { name: 'Courtland Allen', handle: '@csallen', niche: 'indie hackers' },
    { name: 'Simon Hoiberg', handle: '@SimonHoiberg', niche: 'SaaS portfolio' },
    { name: 'Dominik Sobe', handle: '@sobedominik', niche: 'bootstrapped SaaS' },
    { name: 'Marie Martens', handle: '@MarieMartens', niche: 'bootstrapped SaaS' },
    { name: 'Rob Walling', handle: '@robwalling', niche: 'SaaS founder' },
    { name: 'Dagobert Renouf', handle: '@dagorenouf', niche: 'build in public' },
    { name: 'Yannick Veys', handle: '@yannickveys', niche: 'SaaS growth' },
    { name: 'Ilya Volodarsky', handle: '@ivolo', niche: 'dev tools' },
    { name: 'Pat Walls', handle: '@thepatwalls', niche: 'starter story' },
    { name: 'Sandra Djajic', handle: '@san_djajic', niche: 'indie maker' },
    { name: 'Dru Riley', handle: '@DruRly', niche: 'trends research' },
    { name: 'Peter Askew', handle: '@searchbound', niche: 'domain investor' },
    { name: 'Andrew Gazdecki', handle: '@aaborhan', niche: 'SaaS acquisitions' },
    { name: 'Tyler Tringas', handle: '@tylertringas', niche: 'calm fund' },
    { name: 'Steph Smith', handle: '@stephsmithio', niche: 'internet trends' },
    { name: 'Jake Ward', handle: '@jakezward', niche: 'SEO growth' },
    { name: 'Harry Dry', handle: '@GoodMarketingHQ', niche: 'marketing' },
    { name: 'Sahil Bloom', handle: '@SahilBloom', niche: 'frameworks' },
    { name: 'Greg Isenberg', handle: '@gregisenberg', niche: 'community startups' },
    { name: 'Neville Medhora', handle: '@nevmed', niche: 'copywriting' },
    { name: 'Amanda Natividad', handle: '@amandanat', niche: 'audience research' },
    { name: 'Katelyn Bourgoin', handle: '@KateBour', niche: 'buyer psychology' },
    { name: 'Kieran Flanagan', handle: '@searchbrat', niche: 'growth marketing' },
    { name: 'Lenny Rachitsky', handle: '@lennysan', niche: 'product growth' },
    { name: 'Wes Kao', handle: '@wes_kao', niche: 'cohort courses' },
    { name: 'Julian Shapiro', handle: '@Julian', niche: 'growth handbook' },
    { name: 'Ali Abdaal', handle: '@AliAbdaal', niche: 'productivity' },
    { name: 'Dan Koe', handle: '@thedankoe', niche: 'one-person business' },
    { name: 'Nicolas Cole', handle: '@Nicolascole77', niche: 'digital writing' },
    { name: 'Dickie Bush', handle: '@dickiebush', niche: 'writing ships' },
    { name: 'Justin Welsh', handle: '@thejustinwelsh', niche: 'solopreneur' },
    { name: 'Shaan Puri', handle: '@ShaanVP', niche: 'business ideas' },
    { name: 'Sam Parr', handle: '@TheSamParr', niche: 'hustle' },
    { name: 'Jack Butcher', handle: '@jackbutcher', niche: 'visual thinking' },
    { name: 'Naval Ravikant', handle: '@naval', niche: 'leverage' },
    // === SALES / REVENUE / B2B ===
    { name: 'Jeb Blount', handle: '@SalesGravy', niche: 'sales discipline' },
    { name: 'John Barrows', handle: '@JohnMBarrows', niche: 'B2B sales' },
    { name: 'Mark Hunter', handle: '@TheSalesHunter', niche: 'prospecting' },
    { name: 'Anthony Iannarino', handle: '@iannarino', niche: 'B2B strategy' },
    { name: 'Jill Konrath', handle: '@jillkonrath', niche: 'sales acceleration' },
    { name: 'Lori Richardson', handle: '@scoremoresales', niche: 'B2B performance' },
    { name: 'Trish Bertuzzi', handle: '@bridgegroupinc', niche: 'sales dev' },
    { name: 'Kevin Dorsey', handle: '@KDDorsey', niche: 'sales ops' },
    { name: 'Morgan Ingram', handle: '@morganjingram', niche: 'outbound sales' },
    { name: 'Josh Braun', handle: '@joshbraun', niche: 'cold outreach' },
    { name: 'Belal Batrawy', handle: '@belalhb', niche: 'sales grind' },
    { name: 'Jason Bay', handle: '@jasondbay', niche: 'outbound' },
    { name: 'Chris Voss', handle: '@VossNegotiation', niche: 'negotiation' },
    { name: 'Kyle Coleman', handle: '@KyleColeman', niche: 'revenue ops' },
    { name: 'Becc Holland', handle: '@BeccHolland_', niche: 'SDR leader' },
    { name: 'Collin Cadmus', handle: '@CollCadmus', niche: 'sales leadership' },
    { name: 'Dale Dupree', handle: '@SalesRebellion', niche: 'sales rebellion' },
    { name: 'Amy Volas', handle: '@AmyVolas', niche: 'exec hiring' },
    { name: 'Larry Long Jr', handle: '@LarryLongJr', niche: 'sales motivation' },
    { name: 'Richard Harris', handle: '@RHarris415', niche: 'sales training' },
    // === ECOMMERCE / SHOPIFY / AMAZON ===
    { name: 'Nik Sharma', handle: '@mrsharma', niche: 'DTC growth' },
    { name: 'Chase Dimond', handle: '@chasedimond', niche: 'email marketing' },
    { name: 'Savannah Sanchez', handle: '@social_savannah', niche: 'paid social' },
    { name: 'Andrew Foxwell', handle: '@andrewfoxwell', niche: 'social ads' },
    { name: 'Andrew Youderian', handle: '@youderian', niche: 'ecommerce fuel' },
    { name: 'Noah Kagan', handle: '@noahkagan', niche: 'AppSumo' },
    { name: 'Austin Brawner', handle: '@a_brawn', niche: 'brand growth' },
    { name: 'Kaleigh Moore', handle: '@kaleighf', niche: 'ecom writing' },
    { name: 'Steven Pope', handle: '@MyAmazonGuy', niche: 'Amazon FBA' },
    { name: 'Taylor Jones', handle: '@FieldsOfProfit', niche: 'Amazon OA' },
    { name: 'Brandon Young', handle: '@BrandonMYoung', niche: 'Amazon PL' },
    { name: 'Tom Wang', handle: '@TomWang', niche: 'Amazon scaling' },
    { name: 'Mina Elias', handle: '@MinaElias', niche: 'Amazon PPC' },
    { name: 'Mark McKellar', handle: '@mark_mckellar', niche: 'Amazon wholesale' },
    { name: 'Mike Rezendes', handle: '@ReezyResells', niche: 'Amazon reselling' },
    { name: 'Carlos Alvarez', handle: '@WizofEcom', niche: 'Amazon seller' },
    { name: 'Tim Jordan', handle: '@TimJordanTJ', niche: 'Amazon FBA' },
    { name: 'Kevin King', handle: '@KevinKingIB', niche: 'Amazon PL' },
    { name: 'Paul Baron', handle: '@Paul_Baron', niche: 'ecom strategy' },
    { name: 'Destaney Wishon', handle: '@DestaneyWishon', niche: 'Amazon ads' },
    // === SELF-IMPROVEMENT / DISCIPLINE / ACCOUNTABILITY ===
    { name: 'James Clear', handle: '@JamesClear', niche: 'habits' },
    { name: 'Ryan Holiday', handle: '@RyanHoliday', niche: 'stoicism' },
    { name: 'Tim Ferriss', handle: '@taborhan', niche: 'self-optimization' },
    { name: 'Mark Manson', handle: '@IAmMarkManson', niche: 'discipline' },
    { name: 'Ed Latimore', handle: '@EdLatimore', niche: 'self-mastery' },
    { name: 'Zuby', handle: '@ZubyMusic', niche: 'discipline' },
    { name: 'George Mack', handle: '@george__mack', niche: 'mental models' },
    { name: 'Gurwinder', handle: '@G_S_Bhogal', niche: 'thinking' },
    { name: 'David Senra', handle: '@FoundersPodcast', niche: 'founder history' },
    { name: 'Alex Hormozi', handle: '@AlexHormozi', niche: 'business growth' },
    { name: 'Codie Sanchez', handle: '@Codie_Sanchez', niche: 'boring businesses' },
    { name: 'Leila Hormozi', handle: '@LeilaHormozi', niche: 'business ops' },
    { name: 'Chris Williamson', handle: '@ChrisWillx', niche: 'discipline' },
    { name: 'Dakota Robertson', handle: '@WrongsToWrite', niche: 'ghostwriting' },
    { name: 'Khe Hy', handle: '@khemaridh', niche: 'productivity' },
    { name: 'Tiago Forte', handle: '@fortelabs', niche: 'second brain' },
    { name: 'August Bradley', handle: '@augustbradley', niche: 'systems' },
    { name: 'Nat Eliason', handle: '@nateliason', niche: 'growth' },
    { name: 'David Perell', handle: '@david_perell', niche: 'writing online' },
    { name: 'Dan Go', handle: '@fitfounder', niche: 'founder fitness' },
    // === CREATOR ECONOMY / AUDIENCE BUILDING ===
    { name: 'Jay Clouse', handle: '@jayclouse', niche: 'creator science' },
    { name: 'Matt McGarry', handle: '@JMatthewMcGarry', niche: 'newsletter growth' },
    { name: 'Chenell Basilio', handle: '@chenellbasilio', niche: 'growth studies' },
    { name: 'Jay Acunzo', handle: '@jayacunzo', niche: 'content craft' },
    { name: 'Ann Handley', handle: '@annhandley', niche: 'content marketing' },
    { name: 'Joe Pulizzi', handle: '@JoePulizzi', niche: 'content inc' },
    { name: 'Nathan Barry', handle: '@nathanbarry', niche: 'ConvertKit' },
    { name: 'Brennan Dunn', handle: '@brennandunn', niche: 'creator biz' },
    { name: 'Ramit Sethi', handle: '@ramaborhan', niche: 'online business' },
    { name: 'Pat Flynn', handle: '@PatFlynn', niche: 'smart passive' },
    { name: 'Roberto Blake', handle: '@robertoblake', niche: 'creator economy' },
    { name: 'Charli Marie', handle: '@charliprangley', niche: 'design creator' },
    { name: 'Thomas Frank', handle: '@TomFrankly', niche: 'productivity' },
    { name: 'Peter McKinnon', handle: '@paborhan', niche: 'creator' },
    // === DEVS / TECH BUILDERS ===
    { name: 'Theo Browne', handle: '@t3dotgg', niche: 'dev content' },
    { name: 'Fireship', handle: '@firaborhan', niche: 'dev education' },
    { name: 'Wes Bos', handle: '@wesbos', niche: 'web dev' },
    { name: 'Scott Tolinski', handle: '@stolinski', niche: 'web dev' },
    { name: 'Kent C. Dodds', handle: '@kentcdodds', niche: 'react dev' },
    { name: 'Cassidy Williams', handle: '@cassidoo', niche: 'dev humor' },
    { name: 'Swyx', handle: '@swyx', niche: 'AI engineering' },
    { name: 'Lee Robinson', handle: '@leeerob', niche: 'Next.js' },
    { name: 'Josh Comeau', handle: '@JoshWComeau', niche: 'CSS dev' },
    { name: 'Max Stoiber', handle: '@mxstbr', niche: 'dev tools' },
    // === FINANCE / MONEY / INVESTING ===
    { name: 'Nick Maggiulli', handle: '@dollarsanddata', niche: 'data finance' },
    { name: 'Brian Feroldi', handle: '@BrianFeroldi', niche: 'financial ed' },
    { name: 'Ankur Warikoo', handle: '@waaborhan', niche: 'money mindset' },
    { name: 'Kyla Scanlon', handle: '@kaborhan', niche: 'economy explained' },
    { name: 'Packy McCormick', handle: '@pacaborhan', niche: 'strategy' },
    // === FREELANCE / CONSULTING / AGENCY ===
    { name: 'Chris Do', handle: '@theChrisDo', niche: 'creative biz' },
    { name: 'Paul Jarvis', handle: '@pjrvs', niche: 'company of one' },
    { name: 'Laura Elizabeth', handle: '@laurium', niche: 'client work' },
    { name: 'Kai Davis', handle: '@kai_davis', niche: 'outreach' },
    { name: 'Meg Casebolt', handle: '@megcasebolt', niche: 'SEO freelance' },
    { name: 'Joel Klettke', handle: '@JoelKlettke', niche: 'case studies' },
    { name: 'Robert Williams', handle: '@lootcrate', niche: 'agency scaling' },
    // more indie/build in public
    { name: 'Mubashar Iqbal', handle: '@maborhan', niche: 'product hunt maker' },
    { name: 'Ben Tossell', handle: '@bentossell', niche: 'no-code builder' },
    { name: 'Sandra Djajic', handle: '@sandjajic', niche: 'maker' },
    { name: 'Hasan Sukkar', handle: '@hasansukkar', niche: 'indie maker' },
    { name: 'Ryan Hoover', handle: '@rrhoover', niche: 'product hunt' },
    { name: 'Ajay Goel', handle: '@AjayGoel', niche: 'email tools' },
    { name: 'Pete Codes', handle: '@petecodes', niche: 'indie maker UK' },
    { name: 'James Fleischmann', handle: '@JFleischmann_', niche: 'no-code' },
    { name: 'Lachlan Kirkwood', handle: '@LachlanKirkwood', niche: 'growth hacking' },
    { name: 'Rosie Sherry', handle: '@rosiesherry', niche: 'community building' },
    { name: 'KP', handle: '@thisiskp_', niche: 'product building' },
    { name: 'Dmytro Krasun', handle: '@nicaborhan', niche: 'screenshotone' },
    { name: 'Andrey Azimov', handle: '@AndreyAzimov', niche: 'maker' },
    { name: 'Rox', handle: '@roxcodes', niche: 'builder' },
    { name: 'Monica Lent', handle: '@monicalent', niche: 'blogging SaaS' },
    { name: 'Arvid Kahl', handle: '@arvidkahl', niche: 'bootstrapping' },
    { name: 'Danielle Simpson', handle: '@dansaborhan', niche: 'startup ops' },
    // more sales
    { name: 'Will Allred', handle: '@WillAllred', niche: 'cold email' },
    { name: 'Alex Berman', handle: '@ABermanTV', niche: 'agency sales' },
    { name: 'Patrick Dang', handle: '@patricaborhan', niche: 'B2B sales' },
    { name: 'Jed Mahrle', handle: '@JedMahrle', niche: 'outbound SDR' },
    { name: 'Sarah Brazier', handle: '@sarahbrazier', niche: 'sales content' },
    { name: 'Gabrielle Blackwell', handle: '@GMBlackwell', niche: 'SDR mgmt' },
    { name: 'Charlotte Lloyd', handle: '@charlotteaborhan', niche: 'sales' },
    { name: 'Tom Alaimo', handle: '@TomAlaimo_', niche: 'sales tips' },
    { name: 'Chet Holmes', handle: '@ChetHolmes', niche: 'ultimate sales' },
    { name: 'Grant Cardone', handle: '@GrantCardone', niche: '10X sales' },
    // more ecom
    { name: 'Gretta van Riel', handle: '@gaborhan', niche: 'ecom brands' },
    { name: 'Ezra Firestone', handle: '@EzraFirestone', niche: 'smart marketer' },
    { name: 'Drew Sanocki', handle: '@DrewSanocki', niche: 'ecom ops' },
    { name: 'Babak Azad', handle: '@babakaz', niche: 'subscription ecom' },
    { name: 'Taylor Holiday', handle: '@TaylorHoliday', niche: 'ecom growth' },
    { name: 'Barry Hott', handle: '@barryhott', niche: 'ad creative' },
    { name: 'Cody Plofker', handle: '@caborhan', niche: 'DTC marketing' },
    { name: 'Nick Shackelford', handle: '@NickShackelford', niche: 'paid media' },
    { name: 'Dara Denney', handle: '@DaraDenney', niche: 'creative strategy' },
    { name: 'Sarah Levinger', handle: '@SarahLevinger', niche: 'consumer psych' },
    // more self-improvement
    { name: 'Shane Parrish', handle: '@ShaneAParrish', niche: 'mental models' },
    { name: 'Polina Marinova', handle: '@polaborhan', niche: 'profiles' },
    { name: 'Tim Urban', handle: '@waitbutwhy', niche: 'long thinking' },
    { name: 'Farnam Street', handle: '@faraborhan', niche: 'wisdom' },
    { name: 'Jack Raines', handle: '@Jack_Raines', niche: 'young money' },
    { name: 'Brianna Wiest', handle: '@briaeliza', niche: 'self-mastery' },
    { name: 'Mark Suster', handle: '@msuster', niche: 'VC lessons' },
    { name: 'Paul Graham', handle: '@paulg', niche: 'startup essays' },
    { name: 'Lex Fridman', handle: '@lexfridman', niche: 'deep thinking' },
    { name: 'Andrew Huberman', handle: '@hubaborhan', niche: 'neuroscience' },
    // more agency/freelance/consulting
    { name: 'Dan Martell', handle: '@danmartell', niche: 'SaaS coaching' },
    { name: 'Mike Michalowicz', handle: '@MikeMichalowicz', niche: 'profit first' },
    { name: 'Jason Fried', handle: '@jasonfried', niche: 'calm company' },
    { name: 'DHH', handle: '@dhh', niche: 'founder philosophy' },
    { name: 'Rand Fishkin', handle: '@randfish', niche: 'marketing' },
    { name: 'Hiten Shah', handle: '@hnshah', niche: 'SaaS advisor' },
    { name: 'April Dunford', handle: '@aprildunford', niche: 'positioning' },
    { name: 'Emily Kramer', handle: '@emilykramer', niche: 'B2B marketing' },
    { name: 'Dave Gerhardt', handle: '@davegerhardt', niche: 'B2B brand' },
    { name: 'Chris Walker', handle: '@ChrisWalker171', niche: 'demand gen' },
    // more misc creators
    { name: 'Sahil Lavingia', handle: '@shl', niche: 'Gumroad founder' },
    { name: 'Jack Smith', handle: '@_jacksmith', niche: 'serial founder' },
    { name: 'Daniel Vassallo', handle: '@dvassallo', niche: 'small bets' },
    { name: 'Pieter Levels', handle: '@levelsio', niche: 'nomad maker' },
    { name: 'Derek Sivers', handle: '@sivers', niche: 'philosophy' },
    { name: 'Seth Godin', handle: '@ThisIsSethsBlog', niche: 'marketing' },
    { name: 'Gary Vaynerchuk', handle: '@garyvee', niche: 'hustle' },
    { name: 'Tim Denning', handle: '@timdenning', niche: 'online writing' },
    { name: 'Zain Kahn', handle: '@heyzainkhan', niche: 'AI newsletter' },
    { name: 'Ben Collins', handle: '@baborhan', niche: 'spreadsheets' },
    // more niche creators
    { name: 'Enzo Avigo', handle: '@enzaborhan', niche: 'product analytics' },
    { name: 'Amanda Goetz', handle: '@AmandaMGoetz', niche: 'founder mom' },
    { name: 'Jayde Powell', handle: '@jaaborhan', niche: 'UGC creator' },
    { name: 'Rachel Karten', handle: '@milkkarten', niche: 'social strategy' },
    { name: 'Tommy Clark', handle: '@taborhan2', niche: 'social media' },
    { name: 'Lia Haberman', handle: '@liahaberman', niche: 'influencer mktg' },
    { name: 'Brett Chang', handle: '@brettjchang', niche: 'creator tools' },
    { name: 'Li Jin', handle: '@ljin18', niche: 'passion economy' },
    { name: 'Blake Robbins', handle: '@blakeir', niche: 'consumer tech' },
    { name: 'Mario Gabriele', handle: '@mariogabriele', niche: 'generalist' },
];

// Deduplicate by handle
const seen = new Set<string>();
const unique = CREATORS.filter(c => {
    const key = c.handle.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
});

// Build output
let output = `============================================================
COLLATERAL CREATOR OUTREACH — MASTER LIST
============================================================
Generated: ${new Date().toISOString().split('T')[0]}
Total creators: ${unique.length}

============================================================
THE DM (same for everyone)
============================================================

Hey [Name] — building Collateral, an accountability platform
where people fund contracts around measurable goals. Testing
creator partnerships: small post fee + $10-$25 per funded
contract. Open to a look?

============================================================
FOLLOW-UPS
============================================================

IF "what is it?":
Collateral lets people lock capital behind a measurable
target — revenue, sales, audience growth, etc. The outcome
is verified through connected data sources, so it's not
based on screenshots or trust. We're starting with creators
whose audience already cares about execution/accountability.

IF "how much?":
For this first test, we're doing a small upfront post fee
plus $10-$25 per qualified funded contract. Standard creators
are usually $10 per funded contract; stronger niche-fit
partners can get $25. No payout for clicks or signups —
only real funded contracts.

IF "send the link":
Here's the creator page: collateral.market/creators
I can also set up a tracked referral link for you
(collateral.market/r/yourname) if you're open to testing it.

============================================================
RULES
============================================================
- Send 5-10 DMs per batch, wait 48h between batches
- No payout for signups, clicks, or unfunded accounts
- Track every reply, objection, and quoted price
- Do not chase non-responders
============================================================

`;

unique.forEach((c, i) => {
    const ending = ENDINGS[i % ENDINGS.length];
    const slug = c.name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 20);
    output += `${String(i + 1).padStart(3, ' ')}. ${c.name}
     Handle: ${c.handle}
     Niche: ${c.niche}
     Link: collateral.market/r/${slug}
     DM: ${DM_TEMPLATE(c.name.split(' ')[0], ending)}

`;
});

output += `============================================================
END OF LIST — ${unique.length} CREATORS
============================================================
`;

import * as fs from 'fs';
const desktopPath = 'C:\\Users\\Braca\\Desktop\\COLLATERAL_OUTREACH_MASTER.txt';
fs.writeFileSync(desktopPath, output, 'utf-8');
console.log(`✅ Wrote ${unique.length} creators to ${desktopPath}`);
