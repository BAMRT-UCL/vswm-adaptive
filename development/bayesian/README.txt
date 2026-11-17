VSWM v0.9.2 — Adult-reference response-probability schedule

INSTALL
Replace development/bayesian/index.html with this index.html.

MODEL
- theta=0 is the provisional average-adult reference.
- 2PL logistic response model, a=1.
- Prior N(0, 1.5^2), separate simultaneous and sequential posteriors.
- Fixed lapse=5% and guess/lower response floor=2%.
- Simultaneous target exact-success probabilities at theta=0:
  3x3: load 2=99%, 3=98%, 4=95%, 5=85%.
  4x4: load 4=95%, 5=80%, 6=60%.
  5x5: load 6=65%, 7=50%.
- Unspecified loads are linearly interpolated/extrapolated on the logit scale
  within their grid. This gives a smooth monotonic difficulty schedule.
- Difficulty b is solved so the model's actual probability, including lapse
  and guess floors, equals the target probability at theta=0.
- Sequential difficulty remains a provisional heuristic.

ADAPTIVE CONTROLLER
Retains v0.9 threshold staircase: two consecutive exact responses advance one
load; any non-exact response steps down one load; grid progression is one-way.

LIMITATIONS
All adult-reference probabilities and extrapolation assumptions are hypotheses,
not empirically established population norms. Exact/non-exact likelihood remains
binary. This is an exploratory development prototype, not a validated measure.
