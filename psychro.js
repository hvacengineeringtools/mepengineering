/* psychro.js - shared psychrometric core for the NV website.
   Pure functions, SI only (degC, kg/kg, Pa, kJ/kg). No DOM access.
   Saturation: Hyland-Wexler (ASHRAE Fundamentals), ice below 0 C.
   Wet-bulb: ASHRAE Eq. 33 above 0 C, ice-bulb Eq. 35 below 0 C.
   Valid -20 to 80 C dry-bulb. Density is kg of DRY air per m3 of mixture (= 1/v). */
(function (root) {
  "use strict";
  var T_LO = -20, T_HI = 80, TDP_LO = -60;
  var CPA = 1.006, CPV = 1.86, H0 = 2501;

  function pws(t) {
    var T = t + 273.15;
    if (t < 0) return Math.exp(-5.6745359e3 / T + 6.3925247 - 9.677843e-3 * T + 6.2215701e-7 * T * T + 2.0747825e-9 * T * T * T - 9.484024e-13 * T * T * T * T + 4.1635019 * Math.log(T));
    return Math.exp(-5.8002206e3 / T + 1.3914993 - 4.8640239e-2 * T + 4.1764768e-5 * T * T - 1.4452093e-8 * T * T * T + 6.5459673 * Math.log(T));
  }
  function invPws(pv, lo, hi) {
    if (!(pv > 0) || pv < pws(lo) || pv > pws(hi)) return null;
    for (var i = 0; i < 70; i++) { var m = (lo + hi) / 2; if (pws(m) < pv) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  function WfromPv(pv, P) { if (!(pv > 0) || pv >= P * 0.99) return null; return 0.621945 * pv / (P - pv); }
  function pvFromW(W, P) { return W * P / (0.621945 + W); }
  function tdpFromPv(pv) { return invPws(pv, -80, 100); }
  function Wsat(T, P) { return WfromPv(pws(T), P); }
  function enthalpy(T, W) { return CPA * T + W * (H0 + CPV * T); }
  function TfromHW(h, W) { return (h - H0 * W) / (CPA + CPV * W); }
  function density(T, W, P) { return 1 / (0.287042 * (T + 273.15) * (1 + 1.607858 * W) / (P / 1000)); }
  function pressurePa(z) { z = Math.max(-500, Math.min(9000, z)); return 101325 * Math.pow(1 - 2.25577e-5 * z, 5.2559); }

  function WfromTdbTwb(Tdb, Twb, P) {
    var Ws = Wsat(Twb, P); if (Ws == null) return null;
    return Twb >= 0 ? ((2501 - 2.326 * Twb) * Ws - 1.006 * (Tdb - Twb)) / (2501 + 1.86 * Tdb - 4.186 * Twb)
                    : ((2830 - 0.24 * Twb) * Ws - 1.006 * (Tdb - Twb)) / (2830 + 1.86 * Tdb - 2.1 * Twb);
  }
  function twbFromTdbW(Tdb, W, P) {
    function bis(lo, hi) { for (var i = 0; i < 70; i++) { var m = (lo + hi) / 2, Wm = WfromTdbTwb(Tdb, m, P); if (Wm == null || Wm > W) hi = m; else lo = m; } return (lo + hi) / 2; }
    if (Tdb < 0) return bis(Tdb - 60, Tdb);
    return W <= WfromTdbTwb(Tdb, -1e-9, P) ? bis(-60, 0) : bis(0, Tdb);
  }
  function tdbFromRhPv(rh, pv) { return invPws(pv / rh, T_LO, T_HI); }
  function tAtRh(W, rh, P) { return invPws(pvFromW(W, P) / rh, T_LO, T_HI); }

  function stateFromTW(T, W, P) {
    if (!(W >= 0) || !Number.isFinite(T)) return null;
    var pv = pvFromW(W, P);
    return { Tdb: T, Twb: twbFromTdbW(T, W, P), RH: pv / pws(T), Tdp: tdpFromPv(pv), W: W, h: enthalpy(T, W), rho: density(T, W, P) };
  }
  function stateFromTdbRH(T, RH, P) { return stateFromTW(T, WfromPv(RH * pws(T), P), P); }
  function stateFromHW(h, W, P) { return stateFromTW(TfromHW(h, W), W, P); }

  /* Recompute every entered property from the answer; reject on any disagreement */
  function verify(r, k, P) {
    var pv = pvFromW(r.W, P), back = { tdb: r.Tdb, rh: pv / pws(r.Tdb), tdp: tdpFromPv(pv) };
    return Object.keys(k).every(function (key) {
      if (key === "twb") return Math.abs(WfromTdbTwb(r.Tdb, k.twb, P) - r.W) < 2e-6;
      return back[key] != null && Math.abs(back[key] - k[key]) < (key === "rh" ? 0.002 : 0.05);
    });
  }
  /* k = two of {tdb, twb, rh (0-1), tdp}, all in degC / fraction. Returns state or {err} */
  function solve(k, P) {
    var keys = Object.keys(k);
    if (keys.length !== 2) return { err: "Pick two different properties." };
    var Tdb = k.tdb, Twb = k.twb, RH = k.rh, Tdp = k.tdp, W = null, pv = null;
    var bad = { err: "No physical state for that pair between " + T_LO + " and " + T_HI + " \u00b0C." };
    if (Tdb != null && RH != null) { pv = RH * pws(Tdb); W = WfromPv(pv, P); if (W == null) return bad; Tdp = tdpFromPv(pv); Twb = twbFromTdbW(Tdb, W, P); }
    else if (Tdb != null && Tdp != null) { if (Tdp > Tdb + 0.05) return { err: "Dew point cannot exceed dry-bulb." }; pv = pws(Tdp); W = WfromPv(pv, P); if (W == null) return bad; RH = pv / pws(Tdb); Twb = twbFromTdbW(Tdb, W, P); }
    else if (Tdb != null && Twb != null) { if (Twb > Tdb + 0.05) return { err: "Wet-bulb cannot exceed dry-bulb." }; W = WfromTdbTwb(Tdb, Twb, P); if (W == null || W < 0) return bad; pv = pvFromW(W, P); RH = pv / pws(Tdb); Tdp = tdpFromPv(pv); }
    else if (Tdp != null && RH != null) { pv = pws(Tdp); Tdb = tdbFromRhPv(RH, pv); if (Tdb == null) return bad; W = WfromPv(pv, P); if (W == null) return bad; Twb = twbFromTdbW(Tdb, W, P); }
    else if (Twb != null && RH != null) {
      var lo = Twb, hi = T_HI, Tb = null;
      for (var i = 0; i < 80; i++) { var mid = (lo + hi) / 2, Wm = WfromTdbTwb(mid, Twb, P); if (Wm == null || Wm < 0) { hi = mid; continue; } if (pvFromW(Wm, P) / pws(mid) > RH) lo = mid; else hi = mid; Tb = mid; }
      if (Tb == null) return bad; Tdb = Tb; W = WfromTdbTwb(Tdb, Twb, P); if (W == null || W < 0) return bad; pv = pvFromW(W, P); Tdp = tdpFromPv(pv);
    }
    else if (Twb != null && Tdp != null) {
      if (Tdp > Twb + 0.05) return { err: "Dew point cannot exceed wet-bulb." };
      pv = pws(Tdp); W = WfromPv(pv, P); if (W == null) return bad;
      var l2 = Twb, h2 = T_HI;
      for (var j = 0; j < 80; j++) { var m2 = (l2 + h2) / 2, W2 = WfromTdbTwb(m2, Twb, P); if (W2 == null || W2 < W) h2 = m2; else l2 = m2; }
      Tdb = (l2 + h2) / 2; RH = pv / pws(Tdb);
    }
    else return { err: "Choose two different properties." };
    if ([Tdb, Twb, RH, Tdp, W].some(function (x) { return x == null || !Number.isFinite(x); }) || W < 0 || RH < 0) return bad;
    var out = { Tdb: Tdb, Twb: Twb, RH: Math.min(1, RH), Tdp: Tdp, W: W, h: enthalpy(Tdb, W), rho: density(Tdb, W, P) };
    return verify(out, k, P) ? out : bad;
  }

  /* Mass-weighted adiabatic mixing of two streams (kg dry air/s). T is solved from h and W. */
  function mixMass(s1, m1, s2, m2, P) {
    var m = m1 + m2; if (!(m > 0)) return null;
    var W = (m1 * s1.W + m2 * s2.W) / m, h = (m1 * s1.h + m2 * s2.h) / m;
    return stateFromHW(h, W, P);
  }

  /* Sensible / latent split of the change from s1 (warm, wet side) to s2 (cooled side), m in kg dry air/s.
     mode "exact": Qs + Ql = m (h1 - h2) with no residual.   mode "thumb": cp 1.006, hfg 2450 (rule of thumb). */
  function splitLoads(m, s1, s2, mode) {
    var dT = s1.Tdb - s2.Tdb, dW = s1.W - s2.W, Qt = m * (s1.h - s2.h);
    if (mode === "thumb") return { Qt: Qt, Qs: m * 1.006 * dT, Ql: m * 2450 * dW };
    return { Qt: Qt, Qs: m * (CPA + CPV * s2.W) * dT, Ql: m * dW * (H0 + CPV * s1.Tdb) };
  }
  /* Room state + loads + mass flow -> required supply state */
  function supplyFromLoads(room, m, Qs, Ql, mode, P) {
    var Ws, Ts;
    if (mode === "thumb") { Ws = room.W - Ql / (m * 2450); Ts = room.Tdb - Qs / (m * 1.006); }
    else { Ws = room.W - Ql / (m * (H0 + CPV * room.Tdb)); Ts = room.Tdb - Qs / (m * (CPA + CPV * Ws)); }
    return { Ts: Ts, Ws: Ws, state: Ws >= 0 ? stateFromTW(Ts, Ws, P) : null };
  }
  /* Off-coil humidity ratio on the room-load line for a chosen off-coil dry-bulb */
  function woffOnLoadLine(room, a, T, mode) {
    var dT = room.Tdb - T;
    if (mode === "thumb") return room.W - a * 1.006 * dT / 2450;
    var hg = H0 + CPV * room.Tdb;
    return (room.W * hg - CPA * a * dT) / (hg + CPV * a * dT);
  }

  /* Line MA -> OFF (straight in T-W) extended to the saturation curve: apparatus dew point and contact factor */
  function coilLine(ma, off, P) {
    var dT = ma.Tdb - off.Tdb;
    if (!(dT > 1e-6)) return { adp: null, cf: null, reason: "Coil-off is not colder than mixed air." };
    if (off.W > ma.W + 1e-9) return { adp: null, cf: null, reason: "Coil would add moisture." };
    var slope = (ma.W - off.W) / dT;
    function g(t) { return off.W + slope * (t - off.Tdb) - Wsat(t, P); }
    if (g(off.Tdb) >= 0) return { adp: { Tdb: off.Tdb, W: off.W }, cf: 1, reason: "" };
    var t = off.Tdb, step = 0.05;
    while (t > T_LO) {
      var t2 = t - step; if (g(t2) >= 0) {
        var lo = t2, hi = t; for (var i = 0; i < 50; i++) { var m = (lo + hi) / 2; if (g(m) >= 0) lo = m; else hi = m; }
        var Ta = (lo + hi) / 2, Wa = off.W + slope * (Ta - off.Tdb);
        return { adp: { Tdb: Ta, W: Wa }, cf: (ma.Tdb - off.Tdb) / (ma.Tdb - Ta), reason: "" };
      }
      t = t2;
    }
    return { adp: null, cf: null, reason: "The coil line never reaches saturation: it removes too much moisture for the cooling it gives." };
  }

  /* Decide coil-only versus coil + reheat for a required supply state S.
     rules: {minOff (C), rhMax (0-1), cfMax, adpMin (C or null)} */
  function coilPlan(ma, S, m, P, rules, mode) {
    var flags = [], direct = coilLine(ma, S, P);
    var dry = S.W >= ma.W - 1e-6;                      /* no dehumidification asked for */
    var okDirect;
    if (dry) {
      okDirect = S.W <= ma.W + 1e-6 && S.RH <= 1 && S.Tdb < ma.Tdb;
      direct = { adp: null, cf: null, reason: "" };
    } else {
      okDirect = !!direct.adp && direct.cf <= rules.cfMax && S.RH <= rules.rhMax + 1e-3 && S.Tdb >= rules.minOff &&
                 (rules.adpMin == null || direct.adp.Tdb >= rules.adpMin);
    }
    var plan = { direct: direct, dry: dry, flags: flags, ma: ma, S: S };
    if (dry) {
      /* No dehumidification is asked for: a dry coil cools at constant W = Wma. */
      if (!(S.Tdb < ma.Tdb)) {
        plan.kind = "heating"; plan.coil = ma; plan.supply = S; plan.reheatKW = 0;
        plan.heatKW = m * (CPA + CPV * ma.W) * (S.Tdb - ma.Tdb);
        flags.push("Required supply is not colder than mixed air: no cooling is needed, and heating of " + plan.heatKW.toFixed(2) + " kW brings the mixed air to the supply dry-bulb.");
        return plan;
      }
      var dryOut = stateFromTW(S.Tdb, ma.W, P);
      plan.kind = "sensible"; plan.coil = dryOut; plan.supply = dryOut; plan.reheatKW = 0; plan.line = null;
      if (S.W > ma.W + 1e-5) flags.push("The mixed air is already drier than the supply needs (Wma = " + (ma.W * 1000).toFixed(2) + " g/kg against Ws = " + (S.W * 1000).toFixed(2) + " g/kg). A dry coil supplies it at Wma, so the room settles drier than its design condition; humidification is needed only if indoor humidity must be held.");
      return plan;
    }
    if (okDirect) { plan.kind = "coil"; plan.coil = S; plan.supply = S; plan.reheatKW = 0; plan.line = direct; return plan; }
    if (!dry) {
      if (direct.reason) flags.push("Coil only: " + direct.reason);
      else {
        if (direct.cf > rules.cfMax) flags.push("Coil only: contact factor " + direct.cf.toFixed(2) + " is above " + rules.cfMax.toFixed(2) + ".");
        if (S.RH > rules.rhMax + 1e-3) flags.push("Coil only: supply RH " + (S.RH * 100).toFixed(0) + " % is above the " + (rules.rhMax * 100).toFixed(0) + " % a coil can deliver.");
        if (S.Tdb < rules.minOff) flags.push("Coil only: supply dry-bulb is below the " + rules.minOff + " \u00b0C coil limit.");
        if (rules.adpMin != null && direct.adp && direct.adp.Tdb < rules.adpMin) flags.push("Coil only: apparatus dew point " + direct.adp.Tdb.toFixed(1) + " \u00b0C is below the " + rules.adpMin + " \u00b0C chilled-water limit.");
      }
    }
    /* reheat path: coil leaves at (Tco, Ws) near saturation, then reheat to Ts */
    var Tco = tAtRh(S.W, rules.rhMax, P), limited = false, coil;
    if (Tco == null || Tco < rules.minOff) { limited = true; coil = stateFromTdbRH(rules.minOff, rules.rhMax, P); }
    else coil = stateFromTW(Tco, S.W, P);
    if (coil.Tdb > S.Tdb) {                             /* needed supply is colder and wetter than the coil limit allows */
      flags.push("Required supply RH is above the coil limit and no reheat can fix it. Raise supply temperature or cut the latent load.");
      plan.kind = "infeasible"; plan.coil = S; plan.supply = S; plan.reheatKW = 0; plan.line = direct; return plan;
    }
    var cpm = CPA + CPV * coil.W;
    plan.kind = limited ? "limited" : "reheat"; plan.coil = coil; plan.reheatKW = m * cpm * (S.Tdb - coil.Tdb);
    plan.supply = limited ? stateFromTW(S.Tdb, coil.W, P) : S;
    plan.line = coilLine(ma, coil, P);
    if (plan.line.reason) flags.push("Coil + reheat: " + plan.line.reason);
    else if (plan.line.cf > rules.cfMax) flags.push("Coil + reheat: contact factor " + plan.line.cf.toFixed(2) + " is above " + rules.cfMax.toFixed(2) + ".");
    if (limited) flags.push("Coil limited to " + rules.minOff + " \u00b0C at " + (rules.rhMax * 100).toFixed(0) + " % RH. Required Ws = " + (S.W * 1000).toFixed(2) + " g/kg cannot be reached; delivered Ws = " + (coil.W * 1000).toFixed(2) + " g/kg, so room humidity will rise.");
    return plan;
  }

  var PSY = { T_LO: T_LO, T_HI: T_HI, TDP_LO: TDP_LO, CPA: CPA, CPV: CPV, H0: H0,
    pws: pws, invPws: invPws, WfromPv: WfromPv, pvFromW: pvFromW, tdpFromPv: tdpFromPv, Wsat: Wsat, enthalpy: enthalpy, TfromHW: TfromHW,
    density: density, pressurePa: pressurePa, WfromTdbTwb: WfromTdbTwb, twbFromTdbW: twbFromTdbW, tdbFromRhPv: tdbFromRhPv, tAtRh: tAtRh,
    stateFromTW: stateFromTW, stateFromTdbRH: stateFromTdbRH, stateFromHW: stateFromHW, verify: verify, solve: solve,
    mixMass: mixMass, splitLoads: splitLoads, supplyFromLoads: supplyFromLoads, woffOnLoadLine: woffOnLoadLine, coilLine: coilLine, coilPlan: coilPlan };
  if (typeof module !== "undefined" && module.exports) module.exports = PSY; else root.PSY = PSY;
})(typeof window !== "undefined" ? window : globalThis);
