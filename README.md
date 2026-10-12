# Ventilation and air-side calculation sheets

© 2026 Dennis Luk. All rights reserved.

A static site of fifteen calculation sheets. Open `index.html` in a browser, or publish the folder as a website. There is no build step and no server.

| Sheet | Page | Method |
|---|---|---|
| Home | `index.html` | List of sheets |
| I | `natural-ventilation-eink.html` | One opening, stack flow (BS 5925:1991) |
| II | `natural-ventilation-two-wall.html` | Two openings in one wall (BS 5925:1991), with a window factor F for each opening: J(φ) from BS 5925 or the maker’s tested figure |
| III | `natural-ventilation-cross.html` | High and low openings on opposite walls (BS 5925:1991), with a window factor F for each opening |
| IV | `natural-ventilation-psych.html` | Psychrometric chart (ASHRAE Fundamentals, Ch. 1) |
| V | `natural-ventilation-hvac.html` | Air-side equipment sizing (ASHRAE Fundamentals, Ch. 1) |
| VI | `hydrofort-tank.html` | Pneumatic tank |
| VII | `window-solar.html` | Window radiation gain (ASHRAE Fundamentals, Ch. 14–15) |
| VIII | `intake-separation.html` | Intake and exhaust separation, Figure C.1 (BS EN 16798-3:2025), with a drawing of what h and L are |
| IX | `dilution-distance.html` | Dilution distance, Table C.3 (BS EN 16798-3:2025) |
| X | `ahu-separation.html` | Roof-unit intake and exhaust, Table E.3, then heat-recovery classification (BS EN 16798-3:2025) |
| XI | `louvre.html` | Louvre face velocity analysis: face area and pressure drop, with editable bird, vermin and insect mesh presets |
| XII | `refrigerant.html` | Refrigerant discharge design: machinery-room ventilation, BS EN 378 and ASHRAE 15 |
| XIII | `jet-fan.html` | Jet fans estimation: throw and coverage method compared with the pressure-loss (obstruction) method; preliminary design, verify with CFD; editable entrainment constant C and a tab on the accuracy of K, Kv, η and C |
| XIV | `envelope.html` | Building envelope U- and R-value requirements by climate zone: city search, then Section 5 tables (ASHRAE/IES 90.1-2025 SI, ASHRAE 169-2025) |
| XV | `cooling-tower-chiller.html` | Cooling tower performance and water use: a quick heat-rejection and flow-change check; linked water in/out, range, approach, wet-bulb, flow and heat rejected; Merkel method (PDH M374) for an existing tower when the flow, wet-bulb, fan speed or load changes; four ways to find the tower characteristic C and m (maker’s constants, the maker’s selection points, test data, or one design point with an assumed slope) with the air flow and L/G worked out from the fan air flow, fan size and velocity, or fan power; tower water use (evaporation, bleed-off, drift, make-up); recorded Table 6.8.1-7 |
| XVI | `chiller-efficiency.html` | Chiller efficiency: minimum COP and IPLV.SI from ASHRAE/IES 90.1-2025 (SI) Tables 6.8.1-3 and 6.8.1-16 with the Kadj adjustment of §6.4.1.2.1, a manufacturer’s selection (COP, IPLV.SI) adjusted to new evaporator and condenser water temperatures, the rating conditions of the 90.1 and AHRI 551/591 tables, and the recorded Tables 6.8.1-3 and 6.8.1-16. Takes the condenser water temperatures from sheet XV through a link |

`psychro.js` must stay beside sheets IV, V and XV. `formula.css` and `formula.js` must stay beside sheets I, II, III, IX, XV and XVI: they typeset the formulae and the step-by-step working shown in the “Notes and formulae” panel. The sheet IX drawings are built into its page. `solar-irradiance.html` only redirects to sheet VII.

## Browsers and devices

The sheets are plain HTML, CSS and JavaScript and need no plug-ins. They are built for current versions of Chrome, Edge, Safari (macOS, iPhone and iPad), Firefox and Samsung Internet, on Windows, macOS, Linux, Android and iOS.

- Every page has a mobile layout below about 720 px wide, with no sideways scrolling down to a 320 px phone.
- Text boxes use 16 px type on touch screens, so iPhone and iPad do not zoom in when you tap one. Number boxes that cannot go negative open the decimal keypad.
- Drop-down lists, text boxes and buttons are styled the same way on every system, and touch targets are enlarged on phones and tablets.
- The type face is Palatino where the system has it (Windows: Palatino Linotype or Book Antiqua; macOS and iOS: Palatino). Linux falls back to its Palatino clones (URW Palladio L, P052, TeX Gyre Pagella) and Android to Noto Serif.
- Pages always show in the light paper style, even when the device is in dark mode, and phone numbers are not auto-linked on iPhone.

## Sources

The sheets apply published methods; the standards themselves are not reproduced, except that sheets XV and XVI record the efficiency values of ASHRAE/IES 90.1-2025 (SI) Tables 6.8.1-7 (XV) and 6.8.1-3 and 6.8.1-16 (XVI) for reference (© ASHRAE; see the note below). All drawings are original schematics made for this site, and formulas are written out as text. The J(φ) curves on sheet I are plotted from the values the sheet calculates with, read from BS 5925:1991 at six angles. Check results against a licensed copy of each standard.

Sheets IV, V and VII look up city elevations from Open-Meteo. Nothing else leaves the browser. Sheet VII links to ashrae-meteo.info, where the user reads the clear-sky optical depths τb and τd for the nearest station; the sheet does not fetch from that site.

## Copyright

© 2026 Dennis Luk. All rights reserved. No part of this site may be copied, reproduced or redistributed without written permission. Standards and handbooks cited remain the copyright of their publishers. The 90.1 table values on sheet XV are transcribed from the standard, which is the copyright of ASHRAE and IES: get permission or remove those tables before publishing the site publicly. City search uses the Open-Meteo Geocoding API; place data © GeoNames, licensed CC BY 4.0.

Because the site is all rights reserved, do not add an open-source licence file to the repository.

## Put it on GitHub

1. Create an empty repository on GitHub. Do not add a README there.
2. On the repository page, choose **Add file → Upload files**.
3. Upload every file in this folder, including `index.html`, `psychro.js` and `.nojekyll`. Do not upload this folder as a zip, and do not upload any standards PDFs.
4. Commit to the `main` branch.

## Publish it (GitHub Pages)

1. Repository **Settings → Pages**.
2. Source: **Deploy from a branch**.
3. Branch: `main`, folder: **/ (root)**.
4. Save. The site appears at `https://<user>.github.io/<repository>/`.

`.nojekyll` is required so GitHub serves the HTML as it is.
