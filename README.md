# Ventilation and air-side calculation sheets

© 2026 Dennis Luk. All rights reserved.

A static site of twenty-eight calculation sheets. Open `index.html` in a browser, or publish the folder as a website. There is no build step and no server.

| Sheet | Page | Method |
|---|---|---|
| Home | `index.html` | List of sheets |
| I | `hydrofort-tank.html` | Pneumatic tank |
| II | `cooling-tower-chiller.html` | Cooling tower heat rejection and water use: linked water in/out, range, approach, wet-bulb, flow and heat rejected; the new range and water temperatures when the flow or load changes (heat balance only, no tower characteristic); evaporation, bleed-off, drift and make-up water; recorded Table 6.8.1-7 |
| III | `chiller-efficiency.html` | Chiller efficiency: minimum COP and IPLV.SI from ASHRAE/IES 90.1-2025 (SI) Tables 6.8.1-3 and 6.8.1-16 with the Kadj adjustment of §6.4.1.2.1, a manufacturer’s selection (COP, IPLV.SI) adjusted to new evaporator and condenser water temperatures, the rating conditions of the 90.1 and AHRI 551/591 tables, and the recorded Tables 6.8.1-3 and 6.8.1-16. Takes the condenser water temperatures from sheet II through a link |
| IV | `buffer-thermal-store.html` | Thermal storage and buffer vessel sizing: buffer vessel from the smallest compressor step, circuit ΔT and starts per hour (with a control-band cross-check), thermal store from an energy balance, and tank diameter and height; the guide’s worked examples checked; Excel export |
| V | `feed-expansion-tank.html` | Feed and expansion tank: open tank with an air-water interface, total system water volume with a safety factor, water expansion between two temperatures (specific volume calculated or entered) less the pipe growth, tank at twice the expansion and the next standard size |
| VI | `pipe-friction.html` | Pipe friction loss: Darcy–Weisbach with the Altshul–Tsal friction factor. Flow entered or worked out from load, ΔT and specific heat with an optional safety factor; pipe chosen from BS EN 1057 / AS 1432 copper, BS EN 10255 / AS 1074 steel, larger steel with a wall of your choice, or typed; ASME-size steel pipe (Sch 40, Sch 80, standard weight), polyethylene pressure pipe to BS EN 12201, HDPE drainage pipe to BS EN 1519 and UPVC pressure pipe to BS EN 1452 for reference, water properties at any temperature 0 to 200 °C, a choice of roughness, and the project pipework specification tables (heating and cooling services, condensate and drainage) by service: choose a service and the tube switches with the size (the maker can still change it), with a check of the chosen pipe against it and a table of the specified tubes at each size; your own pressure limit; all steps in the side bar. |
| VII | `system-pressure-loss.html` | Pipework system pressure loss: sections along the index run, each a pipe (BS, AS, ASME, PE, HDPE and UPVC tables of sheet VI, optionally following the project specification by service) with fittings counted from a K table or the Darby 3-K method (with a side-by-side check of the two), a typed or tabulated diameter, or equipment entered in kPa; running total, design margin, a check at a higher flow, return counted twice if wanted; saved in the browser, saved or opened as a .json file, printed, or downloaded as an .xlsx workbook with live formulas. |
| VIII | `surge-tank-sizing.html` | Surge tank sizing by the maker’s method: water hammer protection (start-up) and cavitation protection (shut-down); US or SI units; example checked; Excel export with formulas. |
| IX | `natural-ventilation-eink.html` | One opening, stack flow (BS 5925:1991) |
| X | `natural-ventilation-two-wall.html` | Two openings in one wall (BS 5925:1991), with a window factor F for each opening: J(φ) from BS 5925 or the maker’s tested figure |
| XI | `natural-ventilation-cross.html` | High and low openings on opposite walls (BS 5925:1991), with a window factor F for each opening |
| XII | `natural-ventilation-psych.html` | Psychrometric chart (ASHRAE Fundamentals, Ch. 1) |
| XIII | `natural-ventilation-hvac.html` | Air-side equipment sizing (ASHRAE Fundamentals, Ch. 1) |
| XIV | `air-change-rate.html` | Air change rate: room width, depth and height (or volume) and room type to air flow in m³/h, L/s and m³/s, with the 104-row Axair / DIN 1946 table in the side bar, a fresh-air-per-person check, and air changes from a known flow. |
| XV | `duct-pressure-drop.html` | Duct pressure drop and sizing: rectangular duct (section 1, any three of flow, velocity, width and depth give the fourth) and circular duct (section 2, any two of flow, velocity and diameter); Darcy–Weisbach with Altshul–Tsal; list of sizes meeting velocity and friction limits. |
| XVI | `duct-system-pressure-loss.html` | Duct system pressure loss: straight duct, elbow, transition, tap and equipment sections along the index run; friction as sheet XV; fitting coefficients from the duct-fitting tables (or typed); running total, design margin, Excel export with formulas, print. |
| XVII | `intake-separation.html` | Intake and exhaust separation, Figure C.1 (BS EN 16798-3:2025), with a drawing of what h and L are |
| XVIII | `dilution-distance.html` | Dilution distance, Table C.3 (BS EN 16798-3:2025) |
| XIX | `ahu-separation.html` | Roof-unit intake and exhaust, Table E.3, then heat-recovery classification (BS EN 16798-3:2025) |
| XX | `louvre.html` | Louvre face velocity analysis: size a louvre from airflow and face velocity, or check one of known size (airflow or face velocity, free area, pressure drop), with editable bird, vermin and insect mesh presets |
| XXI | `refrigerant.html` | Refrigerant discharge design: machinery-room ventilation, BS EN 378 and ASHRAE 15 |
| XXII | `jet-fan.html` | Jet fans estimation: throw and coverage method compared with the pressure-loss (obstruction) method; preliminary design, verify with CFD; editable entrainment constant C and a tab on the accuracy of K, Kv, η and C |
| XXIII | `smoke-extraction.html` | Smoke extraction sizing to BS 9991:2015 clause 14 and Annex A: rules summary, natural vent, smoke shaft and basement outlet checks, basement powered extract, lobby or corridor MSVS with a stepwise extract-rate method (SCA design fire, natural-system benchmark, small-stair minimum) plus replacement-air pressure, shaft and door-force checks, one calculator per tab with two-way velocity/area inputs, and four installation drawings with the points to watch. |
| XXIV | `window-solar.html` | Window radiation gain (ASHRAE Fundamentals, Ch. 14–15) |
| XXV | `envelope.html` | Building envelope U- and R-value requirements by climate zone: city search, then Section 5 tables (ASHRAE/IES 90.1-2025 SI, ASHRAE 169-2025) |
| XXVI | `layer-stack-u-factor.html` | Assembly U-factor by layers: roof (insulation entirely above deck), mass wall or mass floor from a stack of layers with the A9.4.1 air films and Table A9.4.4-1 material R-values, checked against the Tables 5.5-0 to 5.5-8 maximum U-factor and minimum continuous-insulation R by climate zone and space category |
| XXVII | `generator-sizing.html` | Standby generator sizing: load schedule with starting methods, peak motor load, transient load, minimum genset kVA and next standard size (method of the reference genset workbooks); Excel export |
| XXVIII | `light-sizing.html` | Lighting sizing: zonal cavity method (cavity ratios, effective cavity reflectances, coefficient of utilisation from the maker’s table, light loss factor, number and layout of luminaires, installed W/m²) and point-by-point method (inverse square and cosine law, plan of illuminance and uniformity); Excel export |

## Grouping and numbering

The navigation and the contents page group the sheets by trade, and the roman numerals run in that order.

- Mechanical, water systems: I to VIII
- Mechanical, air and ventilation: IX to XXIII
- Mechanical, heat gain and envelope: XXIV to XXVI
- Electrical, power supply: XXVII
- Electrical, lighting: XXVIII

To add a sheet, add it to the group list in the navigation of every page and to a group on `index.html`, and renumber the sheets after it.


`psychro.js` must stay beside sheets XII and XIII. `formula.css` and `formula.js` must stay beside sheets II, III, V, VI, VII, VIII, IX, X, XI, XIV, XV, XVI, XVIII, XXIII and XXVI: they typeset the formulae and the step-by-step working shown in the “Notes and formulae” panel. The sheet XVIII drawings are built into its page. `solar-irradiance.html` only redirects to sheet XXIV.

## Browsers and devices

The sheets are plain HTML, CSS and JavaScript and need no plug-ins. They are built for current versions of Chrome, Edge, Safari (macOS, iPhone and iPad), Firefox and Samsung Internet, on Windows, macOS, Linux, Android and iOS.

- Every page has a mobile layout below about 720 px wide, with no sideways scrolling down to a 320 px phone.
- Text boxes use 16 px type on touch screens, so iPhone and iPad do not zoom in when you tap one. Number boxes that cannot go negative open the decimal keypad.
- Drop-down lists, text boxes and buttons are styled the same way on every system, and touch targets are enlarged on phones and tablets.
- The type face is Palatino where the system has it (Windows: Palatino Linotype or Book Antiqua; macOS and iOS: Palatino). Linux falls back to its Palatino clones (URW Palladio L, P052, TeX Gyre Pagella) and Android to Noto Serif.
- Pages always show in the light paper style, even when the device is in dark mode, and phone numbers are not auto-linked on iPhone.

## Sources

The sheets apply published methods; the standards themselves are not reproduced, except that sheets II and III record the efficiency values of ASHRAE/IES 90.1-2025 (SI) Tables 6.8.1-7 (XV) and 6.8.1-3 and 6.8.1-16 (XVI) for reference (© ASHRAE; see the note below). All drawings are original schematics made for this site, and formulas are written out as text. The J(φ) curves on sheet IX are plotted from the values the sheet calculates with, read from BS 5925:1991 at six angles. Check results against a licensed copy of each standard.

Sheets XII, XIII and XXIV look up city elevations from Open-Meteo. Nothing else leaves the browser. Sheet XXIV links to ashrae-meteo.info, where the user reads the clear-sky optical depths τb and τd for the nearest station; the sheet does not fetch from that site.

## Copyright

© 2026 Dennis Luk. All rights reserved. No part of this site may be copied, reproduced or redistributed without written permission. Standards and handbooks cited remain the copyright of their publishers. The 90.1 table values on sheet II are transcribed from the standard, which is the copyright of ASHRAE and IES: get permission or remove those tables before publishing the site publicly. City search uses the Open-Meteo Geocoding API; place data © GeoNames, licensed CC BY 4.0.

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
