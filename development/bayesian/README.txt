VSWM v0.9.3 — Threshold-start Bayesian development

INSTALL
Replace development/bayesian/index.html with this index.html.

TRIAL LENGTH
- Simultaneous-only session: 16 trials.
- Sequential-only session: 16 trials.
- Full assessment: 16 simultaneous + 16 sequential trials.

BAYESIAN STARTING DISTRIBUTION
- Both condition-specific posterior distributions initialise from Normal(-2, 1.5^2).
- This is a provisional threshold-search starting prior, not a claim that the
  population mean is theta=-2.
- Exact responses increase the posterior mean under the monotonic response model.
- Non-exact responses decrease it.
- Prior/posterior distribution, mean and SD remain visible.

ITEM MODEL
- Simultaneous adult-reference success schedule retained:
  3x3: load 2=99%, 3=98%, 4=95%, 5=85%.
  4x4: load 4=95%, 5=80%, 6=60%.
  5x5: load 6=65%, 7=50%.
- Unspecified simultaneous loads interpolated/extrapolated on logit scale.
- Sequential difficulty remains provisional.
- a=1, lapse=5%, lower response floor=2%.
- Exact/non-exact binary likelihood remains in use.

ADAPTIVE CONTROLLER
- Two consecutive exact responses advance one load.
- Any non-exact response steps down one load.
- Grid size progression remains one-way with existing bridge loads.

IMPORTANT
Theta=-2 is the starting prior centre for threshold-search development. It is
not the average-adult reference: theta=0 remains the provisional average-adult
reference in the item success schedule. All item probabilities are hypotheses,
not calibrated norms. This is an exploratory prototype.
