VSWM v0.9.0 — Adaptive threshold + Bayesian posterior

INSTALL
Replace development/bayesian/index.html with this index.html.

ADAPTIVE CONTROLLER
- Two consecutive exact trials advance one memory-load step.
- Any non-exact trial decreases the next load by one step.
- Grid size progression remains one-way: 3x3 -> 4x4 -> 5x5.
- Grid transitions use the existing overlapping bridge loads.
- Participants can recover upwards after an error.
- Highest successful grid/load is recorded separately from current adaptive level.
- Threshold history and each adaptive decision are recorded in trial JSON.

BAYESIAN ESTIMATOR
- Separate posterior distributions for simultaneous and sequential tasks.
- Prior N(0, 1.5^2), theta grid -4 to +4.
- 2PL logistic response curve with a=1.
- Provisional lapse floor 5% and lower response/guess floor 2%, so unexpected
  responses are possible and do not force posterior probability to zero.
- Exact/non-exact scoring remains the Bayesian outcome; partial-credit fields
  are retained but are not yet used in the likelihood.
- Live graph overlays prior (dashed grey) and posterior (blue).
- Posterior mean and SD remain displayed.

IMPORTANT LIMITATIONS
- Item difficulties and discrimination are provisional, not empirically calibrated.
- Lapse/guess rates are fixed development assumptions, not estimated.
- This is not a validated measure. The posterior should not be interpreted as
  norm-referenced ability until calibration and validation work is completed.
- Receiver spreadsheet schema has not been extended for all new fields; JSON
  backup and POST payload carry the detailed data.
