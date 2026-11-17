VSWM v0.9.1 — Full 16-trial independent conditions

INSTALL
Replace development/bayesian/index.html with this index.html.

LAUNCH OPTIONS
- Simultaneous only: 16 simultaneous trials, then results.
- Sequential only: 16 sequential trials, then results.
- Full assessment: 16 simultaneous trials followed by 16 sequential trials (32 total).

The independent condition options no longer stop after four trials. Each run has
a new session ID and records runMode and sessionTrialLimit in the JSON payload.

The threshold controller and Bayesian shadow estimator are retained from v0.9.0.
This remains an exploratory, uncalibrated development prototype.
