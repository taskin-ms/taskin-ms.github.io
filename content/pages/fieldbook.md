---
layout: layouts/fieldbook.njk
permalink: /hct/index.html
page_title: Hypersonic Compressible Turbulence | Taskin Mehereen
description: A concise field guide to compressibility, turbulent-flow physics, modeling, data, and emerging data-driven methods.
headline: Hypersonic Compressible Turbulence
intro: A concise field guide to compressibility, turbulent-flow physics, modeling, data, and emerging data-driven methods.
section_labels: [Flow physics, Closure, Canonical flows, Data and AI, Datasets]
---

## 01 — What is compressible flow?

In compressible flow, density evolves with the motion and is coupled to pressure and temperature through thermodynamics. Momentum and energy therefore evolve together with the thermodynamic state, rather than with a prescribed constant density ([Gatski & Bonnet, 2013, Chapters 1–2][gb]).

The variables are density $\rho$, velocity $\mathbf{u}$, pressure $p$, temperature $T$, and specific total energy $E=e+\tfrac12 u_i u_i$, where $e$ is specific internal energy. For a single-fluid continuum without body forces or volumetric energy sources, conservation of mass, momentum, and total energy gives

```math
\begin{aligned}
\partial_t\rho+\partial_j(\rho u_j)&=0,\\
\partial_t(\rho u_i)+\partial_j(\rho u_i u_j)&=-\partial_i p+\partial_j\tau_{ij},\\
\partial_t(\rho E)+\partial_j[(\rho E+p)u_j]&=\partial_j(u_i\tau_{ij}-q_j).
\end{aligned}
```

Here $\partial_j=\partial/\partial x_j$, repeated indices are summed, $\tau_{ij}$ is viscous stress, and $q_j$ is conductive heat flux. An equation of state and constitutive relations complete this system ([Gatski & Bonnet, 2013, Chapter 2][gb]).

### Density and thermodynamic fluctuations

```math
\frac{D\rho}{Dt}=-\rho\,\nabla\!\cdot\mathbf{u},
\qquad \nabla\!\cdot\mathbf{u}\ne0\quad\text{in general}.
```

Local expansion or compression changes a fluid element's density. Fluctuating density, pressure, temperature, and internal energy interact with velocity through mass conservation, pressure forces, and energy transport. Density variation can also arise from thermal or compositional variation; high Mach number is not its sole origin ([Gatski & Bonnet, 2013, Chapters 1–3][gb]; [Lele, 1994][lele]).

### Pressure

Pressure specifies thermodynamic state and supplies the mechanical force $-\nabla p$. Its fluctuations include acoustic contributions; pressure–strain correlations enter component-stress budgets, while pressure–dilatation couples kinetic and internal energy ([Lele, 1994][lele]). The local exchange term is

```math
p\,\nabla\!\cdot\mathbf{u}=p\theta.
```

It enters the kinetic-energy balance as $+p\theta$ and the internal-energy balance as $-p\theta$. Compression therefore transfers energy toward internal energy through this term ([Mittal & Girimaji, 2019][mg]).

### Dilatation

```math
\theta=\nabla\!\cdot\mathbf{u},\qquad
\mathbf{u}=\mathbf{u}^{s}+\mathbf{u}^{d},\qquad
\nabla\!\cdot\mathbf{u}^{s}=0,\quad
\nabla\!\times\mathbf{u}^{d}=0.
```

The Helmholtz decomposition separates solenoidal (vortical) and dilatational (irrotational) motions, with boundary conditions fixing the decomposition. Their relative amplitudes and scales distinguish compressible turbulent states that a single velocity scale does not capture ([Donzis & John, 2020][dj]).

### Vorticity

```math
\begin{aligned}
\boldsymbol{\omega}&=\nabla\!\times\mathbf{u},\\
\frac{D\boldsymbol{\omega}}{Dt}
&=(\boldsymbol{\omega}\!\cdot\nabla)\mathbf{u}-\theta\boldsymbol{\omega}
+\frac{\nabla\rho\times\nabla p}{\rho^2}\\
&\quad+\nabla\!\times\left(\frac{\nabla\!\cdot\boldsymbol{\tau}}{\rho}\right).
\end{aligned}
```

The terms describe vortex stretching, compression or expansion, baroclinic torque, and viscous effects. Non-aligned density and pressure gradients generate vorticity through the baroclinic term; density also enters the viscous contribution ([Gatski & Bonnet, 2013, Chapters 1–2][gb]).

### Mach numbers relevant to turbulence

Mean-flow Mach number compares a mean velocity with a reference sound speed $a$. A turbulent Mach-number convention based on Reynolds fluctuations is

```math
M_t=\frac{\sqrt{\overline{u_i'u_i'}}}{\overline a}.
```

This uses the three-component fluctuation magnitude; Favre-based conventions also occur. For a two-stream shear layer, convective Mach numbers use velocities relative to the convection speed of the structures; the common matched-convective-speed form is $M_c=|U_1-U_2|/(a_1+a_2)$ ([Papamoschou & Roshko, 1988][pr]). Mach numbers characterize different motions, but do not by themselves specify density variation, thermal conditions, or dilatational content ([Lele, 1994][lele]; [Donzis & John, 2020][dj]).

## 02 — Effects of compressibility in turbulence and the turbulence closure problem

Turbulence already introduces nonlinear correlations between fluctuating quantities; compressibility additionally introduces density and thermodynamic fluctuations and their coupling with velocity ([Gatski & Bonnet, 2013, Chapter 3][gb]).

Reynolds decomposition separates a mean and a zero-mean fluctuation:

```math
u_i=\overline{u}_i+u_i',\qquad
\overline{\rho u_i}=\overline\rho\,\overline u_i+\overline{\rho'u_i'}.
```

With fluctuating density, even the mean mass flux contains an additional correlation. Density weighting absorbs this contribution into the mean velocity ([Gatski & Bonnet, 2013, Chapter 3][gb]).

### Favre averaging

```math
\widetilde\phi=\frac{\overline{\rho\phi}}{\overline\rho},\qquad
\phi=\widetilde\phi+\phi'',\qquad
\overline{\rho\phi''}=0.
```

Favre averaging eliminates several explicit density–velocity correlations from mean convective fluxes. It simplifies the averaged conservation laws without eliminating turbulent stresses or thermodynamic correlations ([Gatski & Bonnet, 2013, Chapter 3][gb]). Assuming averaging commutes with differentiation, continuity becomes

```math
\frac{\partial\overline\rho}{\partial t}
+\frac{\partial(\overline\rho\,\widetilde u_j)}{\partial x_j}=0.
```

The mean momentum balance exposes the stress requiring closure:

```math
\begin{aligned}
\partial_t(\overline\rho\,\widetilde u_i)
+\partial_j(\overline\rho\,\widetilde u_i\widetilde u_j)
&=-\partial_i\overline p+\partial_j\overline{\tau}_{ij}\\
&\quad-\partial_j\!\left(\overline\rho\,\widetilde{u_i''u_j''}\right),\\
R_{ij}&=\overline\rho\,\widetilde{u_i''u_j''}.
\end{aligned}
```

Here $R_{ij}$ denotes the positive Favre covariance stress; the momentum equation contains its negative divergence ([Gatski & Bonnet, 2013, Chapter 3][gb]).

### Where the closure problem appears

Representative unknowns in averaged momentum, stress, and energy equations include:

- **Favre Reynolds stress:** $R_{ij}=\overline\rho\,\widetilde{u_i''u_j''}$.
- **Turbulent heat transport:** for example, the enthalpy flux $\overline\rho\,\widetilde{u_j''h''}$, where $h$ is specific enthalpy.
- **Pressure correlations:** pressure–strain $\overline{p'(\partial_j u_i'+\partial_i u_j')}$ and pressure–dilatation $\overline{p'\theta'}$.
- **Fluctuating viscous terms:** correlations between fluctuating stresses and velocity gradients.
- **Higher-order moments:** triple velocity correlations and other terms in second-moment transport.

Transport equations for second moments introduce third and higher moments, forming a closure hierarchy. Stress transport and pressure redistribution already arise in incompressible turbulence; density coupling, thermodynamic transport, dilatational dissipation, and kinetic–internal-energy exchange extend or modify these balances ([Gatski & Bonnet, 2013, Chapter 3][gb]; [Garnier, Adams & Sagaut, 2009][gas]).

### Compressible turbulent energy pathways

Kinetic and internal energy have separate balances. Pressure work includes spatial transport and pressure–dilatation exchange; viscous action converts kinetic into internal energy, while heat conduction transports internal energy. Mean-flow and fluctuating contributions must also be distinguished. Pressure–dilatation exchanges energy between these reservoirs; it is not simply transfer within a kinetic-energy cascade ([Mittal & Girimaji, 2019][mg]).

A pressure-fluctuation spectrum is not automatically an internal-energy spectrum. For a calorically perfect ideal gas, Mittal & Girimaji formulate internal-energy dynamics using $\varphi=\sqrt{\rho e}=\sqrt{p/(\gamma-1)}$, where $\gamma=c_p/c_v$, and derive mean and fluctuating balances for this variable. Its fluctuation correlations support an internal-energy spectral analysis, distinct from directly Fourier-transforming pressure ([Mittal & Girimaji, 2019][mg]).

### RANS, LES and DNS

- **RANS** averages the turbulent field and requires Reynolds-stress, thermal-transport, and related closures.
- **LES** filters the field, resolves larger motions, and requires subgrid-scale closure, including compressible energy-flux terms.
- **DNS** resolves all dynamically relevant scales of the specified governing model and avoids turbulence closure, at high computational cost.

These approaches differ in the correlations left unresolved ([Garnier, Adams & Sagaut, 2009][gas]; [Gatski & Bonnet, 2013, Chapter 5][gb]).

## 03 — Canonical cases of compressible turbulence

### Homogeneous turbulence

Homogeneous isotropic turbulence (HIT) removes mean shear and walls, isolating interactions among vortical motion, dilatation, and thermodynamic fluctuations. Forced HIT sustains turbulent motion; decaying HIT follows its unforced evolution. Diagnostics include turbulent Mach number, solenoidal and dilatational kinetic-energy contributions, pressure–dilatation, spectra, and inter-scale transfer. Local shocklets can occur under sufficiently strong compressibility ([Lele, 1994][lele]; [Garnier, Adams & Sagaut, 2009][gas]).

Donzis & John combine homogeneous-flow DNS and literature data to examine scaling with parameters that include internally generated dilatational scales. Their results concern homogeneous turbulence and specified statistical regimes, rather than a universal law for wall flows or wakes ([Donzis & John, 2020][dj]). Internal-energy spectra and kinetic–internal exchange require their own energetic formulation ([Mittal & Girimaji, 2019][mg]).

### Free shear flows

Mixing layers, jets, and wakes introduce mean shear, entrainment, and coherent structures. Compressibility affects instability characteristics, pressure fluctuations, and turbulent transport. Experiments on two-stream mixing layers find reduced spreading as convective Mach number increases; that relation is not a general scaling law for every jet or wake ([Papamoschou & Roshko, 1988][pr]; [Lele, 1994][lele]).

Jets and wakes have different mean-flow geometries and structure evolution. Wakes connect the subject to bluff bodies and high-speed separated flows; density ratio and the local shear-layer conditions remain distinct from freestream Mach number ([Gatski & Bonnet, 2013, Chapter 6][gb]).

### Wall-bounded and shock-containing flows

Supersonic and hypersonic turbulent boundary layers combine wall constraints with mean density, temperature, and viscosity variation. Thermal boundary conditions determine wall heat transfer and modify mean-property profiles ([Spina, Smits & Robinson, 1994][ssr]; [Gatski & Bonnet, 2013, Chapter 6][gb]).

Compressible wall turbulence does not require a shock. In **shock–turbulence interaction**, incoming turbulence passes through a shock and its statistics change. Turbulence evolving near a shock may additionally experience shear and separation. In **shock-wave/boundary-layer interaction**, the shock couples to a wall boundary layer; sufficiently strong interactions can produce separation and unsteady shock motion ([Gatski & Bonnet, 2013, Chapter 7][gb]; [Dussauge & Piponniau, 2008][dp]).

## 04 — Current directions in the age of data and AI

DNS, experiments, and larger numerical datasets support data-assisted turbulence modeling and flow prediction. The literature studies model inference and uncertainty reduction alongside the governing equations ([Duraisamy, Iaccarino & Xiao, 2019][dix]).

### Data-assisted turbulence closure

Work includes RANS-model corrections, Reynolds-stress prediction, discrepancy inference, and learned subgrid constitutive relations. These models supply or correct unresolved terms within conservation equations; learned closures do not have established general validity across flow regimes ([Duraisamy et al., 2019][dix]; [Brunton, Noack & Koumoutsakos, 2020][bnk]).

### Physics-constrained learning

Invariance, conservation, realizability, dimensional consistency, and known asymptotic or scaling behavior restrict admissible model forms. For example, Ling and collaborators embed tensor invariance in a Reynolds-stress anisotropy model. Such constraints specify physical structure without establishing universal predictive superiority ([Ling, Kurzawski & Templeton, 2016][lkt]; [Duraisamy et al., 2019][dix]).

### Reduced-order and operator-based modeling

Reduced-order models and learned time advancement approximate flow evolution in a smaller state representation. Neural operators learn mappings between functions, including input-to-solution or field-to-field mappings for PDEs. These tasks differ from closing a stress balance ([Brunton et al., 2020][bnk]; [Kovachki et al., 2023][kov]).

### Generalization and physical consistency

Training-domain coverage, geometric transfer, conservation, interpretability, and stability after coupling a model to a solver remain evaluation issues. For compressible applications, extrapolation in Reynolds and Mach numbers adds changes in both turbulent and thermodynamic regimes. An a-priori fit to stored data does not establish a-posteriori stability or accuracy ([Duraisamy et al., 2019][dix]; [Brunton et al., 2020][bnk]).

The energy balances of [Mittal & Girimaji (2019)][mg] and homogeneous-flow scaling of [Donzis & John (2020)][dj] define physical quantities and regimes relevant to compressible modeling. These are physics studies, not machine-learning papers.

## 05 — Publicly available datasets

### Johns Hopkins Turbulence Database — JHTDB

[JHTDB](https://turbulence.idies.jhu.edu/) is an open numerical turbulence laboratory with large simulation datasets and query tools. Its portal includes homogeneous isotropic turbulence, channel flow, boundary-layer flows, and other configurations ([JHTDB documentation][jhtdb]).

**Many canonical JHTDB datasets are incompressible.** Its isotropic and channel-flow DNS are incompressible baselines, not a compressible-turbulence database. They support statistics, spectra, velocity-gradient analysis, and tests of data-driven methods ([dataset documentation][jhtdb-old]).

[Datasets](https://turbulence.idies.jhu.edu/datasets) · [Database access and query tools](https://turbulence.idies.jhu.edu/database)

### BLASTNet

[BLASTNet](https://blastnet.github.io/) standardizes large-scale reacting and compressible-flow simulation data for machine-learning research, with dataset-specific descriptions and metadata ([project documentation][blast]).

The public [compressible inert CH₄–O₂ HIT DNS][blast-hit] is distributed as [`waitongchung/inert-ch4o2-hit-dns`][kaggle-hit]. Its official metadata lists three-dimensional velocity components, pressure, temperature, density, and O₂/CH₄ mass fractions. The case is non-reacting and uses periodic boundaries; it is not a hypersonic boundary-layer dataset ([official metadata][blast-meta]).

[Dataset collection](https://blastnet.github.io/datasets.html) · [HIT metadata][blast-meta]

### Additional datasets

- [Turbulence Modeling Resource: supersonic/hypersonic flat-plate DNS][tmr] — boundary-layer statistics and turbulent kinetic-energy budgets; no high-enthalpy effects are included.
- [Computational Turbulence Laboratory][ctl] — downloadable averaged profiles for compressible boundary layers and canonical shock–turbulence interactions, rather than complete instantaneous volume fields.

## References

- Gatski, T. B. & Bonnet, J.-P. (2013). *Compressibility, Turbulence and High Speed Flow*. 2nd ed. Academic Press. [Publisher][gb].
- Lele, S. K. (1994). “Compressibility Effects on Turbulence.” *Annual Review of Fluid Mechanics* **26**, 211–254. [DOI: 10.1146/annurev.fl.26.010194.001235][lele].
- Garnier, E., Adams, N. & Sagaut, P. (2009). *Large Eddy Simulation for Compressible Flows*. Springer. [DOI: 10.1007/978-90-481-2819-8][gas].
- Mittal, A. & Girimaji, S. S. (2019). “Mathematical framework for analysis of internal energy dynamics and spectral distribution in compressible turbulent flows.” *Physical Review Fluids* **4**, 042601(R). [DOI: 10.1103/PhysRevFluids.4.042601][mg].
- Donzis, D. A. & John, J. P. (2020). “Universality and scaling in homogeneous compressible turbulence.” *Physical Review Fluids* **5**, 084609. [DOI: 10.1103/PhysRevFluids.5.084609][dj].
- Duraisamy, K., Iaccarino, G. & Xiao, H. (2019). “Turbulence Modeling in the Age of Data.” *Annual Review of Fluid Mechanics* **51**, 357–377. [DOI: 10.1146/annurev-fluid-010518-040547][dix].
- Papamoschou, D. & Roshko, A. (1988). “The compressible turbulent shear layer: an experimental study.” *Journal of Fluid Mechanics* **197**, 453–477. [DOI: 10.1017/S0022112088003325][pr].
- Spina, E. F., Smits, A. J. & Robinson, S. K. (1994). “The Physics of Supersonic Turbulent Boundary Layers.” *Annual Review of Fluid Mechanics* **26**, 287–319. [DOI: 10.1146/annurev.fl.26.010194.001443][ssr].
- Dussauge, J.-P. & Piponniau, S. (2008). “Shock/boundary-layer interactions: Possible sources of unsteadiness.” *Journal of Fluids and Structures* **24**, 1166–1175. [DOI: 10.1016/j.jfluidstructs.2008.06.003][dp].
- Ling, J., Kurzawski, A. & Templeton, J. (2016). “Reynolds averaged turbulence modelling using deep neural networks with embedded invariance.” *Journal of Fluid Mechanics* **807**, 155–166. [DOI: 10.1017/jfm.2016.615][lkt].
- Brunton, S. L., Noack, B. R. & Koumoutsakos, P. (2020). “Machine Learning for Fluid Mechanics.” *Annual Review of Fluid Mechanics* **52**, 477–508. [DOI: 10.1146/annurev-fluid-010719-060214][bnk].
- Kovachki, N., Li, Z., Liu, B., Azizzadenesheli, K., Bhattacharya, K., Stuart, A. & Anandkumar, A. (2023). “Neural Operator: Learning Maps Between Function Spaces With Applications to PDEs.” *Journal of Machine Learning Research* **24**(89), 1–97. [Publisher][kov].
- Johns Hopkins Turbulence Database. [Official documentation][jhtdb], [dataset descriptions][jhtdb-old], and [database access](https://turbulence.idies.jhu.edu/database).
- BLASTNet. [Official project documentation][blast], [compressible inert CH₄–O₂ HIT DNS][blast-hit], and [dataset metadata][blast-meta].
- Turbulence Modeling Resource. [Supersonic/hypersonic zero-pressure-gradient plate DNS][tmr].
- Computational Turbulence Laboratory, University of Maryland. [Public DNS data][ctl].

[gb]: https://shop.elsevier.com/books/compressibility-turbulence-and-high-speed-flow/gatski/978-0-12-397027-5
[lele]: https://doi.org/10.1146/annurev.fl.26.010194.001235
[gas]: https://doi.org/10.1007/978-90-481-2819-8
[mg]: https://doi.org/10.1103/PhysRevFluids.4.042601
[dj]: https://doi.org/10.1103/PhysRevFluids.5.084609
[dix]: https://doi.org/10.1146/annurev-fluid-010518-040547
[pr]: https://doi.org/10.1017/S0022112088003325
[ssr]: https://doi.org/10.1146/annurev.fl.26.010194.001443
[dp]: https://doi.org/10.1016/j.jfluidstructs.2008.06.003
[lkt]: https://doi.org/10.1017/jfm.2016.615
[bnk]: https://doi.org/10.1146/annurev-fluid-010719-060214
[kov]: https://www.jmlr.org/papers/v24/21-1524.html
[jhtdb]: https://turbulence.idies.jhu.edu/home
[jhtdb-old]: https://turbulence.pha.jhu.edu/datasets.aspx
[blast]: https://blastnet.github.io/
[blast-hit]: https://blastnet.github.io/compressible_inert_ch4o2_hit
[blast-meta]: https://blastnet.github.io/assets/json/chung2022_info.json
[kaggle-hit]: https://www.kaggle.com/datasets/waitongchung/inert-ch4o2-hit-dns
[tmr]: https://tmbwg.github.io/turbmodels/Other_DNS_Data/supersonic_hypersonic_flatplate.html
[ctl]: https://larsson.umd.edu/data/
