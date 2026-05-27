const fs = require('fs');
const path = require('path');

const overviewContent = fs.readFileSync('FRONTEND/src/views/Overview.js', 'utf8');
const activeContent = fs.readFileSync('FRONTEND/src/views/ActiveContracts.js', 'utf8');

const cssStart = overviewContent.indexOf('/* --- TWO PATHS (Solo vs Rivalry) --- */');
const cssEnd = overviewContent.indexOf('/* --- HOW IT WORKS (Shared) --- */', cssStart);
let cssBlock = overviewContent.substring(cssStart, cssEnd || overviewContent.indexOf('/* ---', cssStart + 10));

const htmlStart = overviewContent.indexOf('<section class="eq-paths"');
const htmlEnd = overviewContent.indexOf('</section>', htmlStart) + 10;
let htmlBlock = overviewContent.substring(htmlStart, htmlEnd);

const chunks = [
    {
        AllowMultiple: false,
        StartLine: 693,
        EndLine: 694,
        TargetContent: "            @media (max-width: 560px) { .ctp-grid { grid-template-columns: 1fr; } }\n        </style>",
        ReplacementContent: "            @media (max-width: 560px) { .ctp-grid { grid-template-columns: 1fr; } }\n\n" + cssBlock + "\n        </style>"
    },
    {
        AllowMultiple: false,
        StartLine: 768,
        EndLine: 773,
        TargetContent: "                    </div>\n                </div>\n            </div>\n        </div>\n\n        <!-- Contract Type Picker Modal -->",
        ReplacementContent: "                    </div>\n                </div>\n            </div>\n\n            <!-- Integrated Solo Contracts -->\n            " + htmlBlock + "\n\n        </div>\n\n        <!-- Contract Type Picker Modal -->"
    }
];

fs.writeFileSync('patch.json', JSON.stringify(chunks, null, 2), 'utf8');
console.log("Created patch.json");
