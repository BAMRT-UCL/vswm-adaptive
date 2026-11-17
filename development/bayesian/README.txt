VSWM v0.8.4 — Independent 16-trial conditions

INSTALL
Replace development/bayesian/index.html with this index.html.

LAUNCH OPTIONS
- Simultaneous only: 16 simultaneous trials, then results.
- Sequential only: 16 sequential trials, then results.
- Full assessment: 16 simultaneous trials followed by 16 sequential trials.

Each run creates its own session ID and uploads results. runMode and
sessionTrialLimit are included in the JSON POST payload and downloadable backup,
so single-condition sessions can be distinguished from full assessments.

BAYESIAN MODEL
Retains the v0.8.3 Bayesian shadow estimator and provisional adult-reference
anchors/interpolation. Simultaneous and sequential posteriors remain separate.
The Bayesian model does not control trial selection. Difficulty/discrimination
parameters are not empirically calibrated.

This version is an exploratory development prototype, not a validated measure.
