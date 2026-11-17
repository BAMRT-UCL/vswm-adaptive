VSWM v0.8.3 — Independent task demonstrations and Bayesian development

INSTALL
Replace development/bayesian/index.html with this index.html.

LAUNCH OPTIONS
1. Demonstrate simultaneous: 4 simultaneous trials only.
2. Demonstrate sequential: 4 sequential trials only.
3. Full assessment: 16 simultaneous trials followed by 16 sequential trials.

Each run creates a new session ID and records runMode and sessionTrialLimit in
the POST payload and JSON backup. Demo runs contain only the selected condition.
They are distinguishable from full assessments for later filtering.

BAYESIAN MODEL
- Separate simultaneous and sequential posterior distributions.
- Simultaneous provisional anchors:
  3x3 / 2 locations: b=-1
  4x4 / 4 locations: b=0
  5x5 / 7 locations: b=+1
- Intermediate simultaneous loads use linear interpolation within each grid.
- Sequential difficulty remains provisional.
- a=1; prior N(0,1.5^2); binary exact/non-exact likelihood.
- Adds item information at prior mean to the researcher display.
- Shadow mode only; does not control trial selection.

IMPORTANT
The anchors and interpolation slopes are hypotheses, not calibrated item parameters
or population norms. A posterior shift following easy successful trials can still
occur because the responses are evidence under the assumed model. Review the item
parameters and likelihood against pilot data before interpreting theta normatively.
The existing receiver schema may ignore the new runMode fields in sheet columns;
the full JSON payload is still included in the request and downloadable backup.
