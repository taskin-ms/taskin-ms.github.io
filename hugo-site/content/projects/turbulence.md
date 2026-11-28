---
title: "Developing a High-Fidelity Compressible Turbulence Database with PyFR"
draft: false
weight: 2
category: "Scientific Computing · Turbulence"
summary: "High-order numerical simulation of compressible homogeneous isotropic turbulence."
status: "Ongoing Research"
art: "turbulence"
artLabel: "TURBULENCE DNS"
image: "/images/projects/turbulence-dns.webp"
imageAlt: "Scientific visualization of three-dimensional homogeneous isotropic turbulence"
ShowToc: true
TocOpen: false
math: true
---

*Computational Fluid Dynamics · GPU Scientific Computing · Turbulence · Scientific Machine Learning*

**Status:** Ongoing Research

## Overview

High-fidelity turbulence databases have become important resources for fluid mechanics and scientific machine learning. In particular, the [Johns Hopkins Turbulence Database (JHTDB)](https://turbulence.idies.jhu.edu/datasets/homogeneousTurbulence/isotropic) provides publicly accessible simulations of incompressible turbulence for studying multiscale dynamics, validating physical models, and developing data-driven methods. Comparable, systematically curated resources for **compressible turbulence** remain less widely accessible to the machine-learning community.

Compressibility introduces additional physical mechanisms—including density fluctuations, dilatational motion, acoustic interactions, and exchanges between kinetic and internal energy—that complicate both direct numerical simulation (DNS) and statistical modeling. Understanding these effects requires simulations that are not only well resolved but also carefully controlled and validated.

This project aims to establish a **high-fidelity database of homogeneous isotropic compressible turbulence (HIT)** across different Reynolds numbers, turbulent Mach numbers, and compressibility regimes. The work has two complementary contributions:

1. **Scientific computing:** Extending the high-order, GPU-accelerated CFD solver **PyFR** with Ornstein–Uhlenbeck stochastic forcing, solenoidal–dilatational forcing control, and thermodynamic energy regulation to generate sustained compressible turbulence.
2. **Scientific data infrastructure:** Developing reproducible initialization, numerical verification, stationarity assessment, and statistical validation procedures that can support a trustworthy, publicly accessible turbulence database.

The solver extensions and initial verification studies are implemented. Expansion to a broader parameter space, convergence of sensitive dilatational statistics, and public dataset release remain ongoing objectives.

## 1. Physical Problem and Motivation

Homogeneous isotropic turbulence provides a controlled setting for investigating fundamental turbulent processes without complications introduced by walls, body geometry, or mean spatial inhomogeneity. Its statistical symmetries make it especially useful for identifying scaling relationships and evaluating the generality of turbulence models.

In incompressible flow, the velocity field satisfies $\nabla\cdot\mathbf{u}=0$. In compressible flow, velocity fluctuations can contain both rotational and compressive components:

$$
\mathbf{u}=\mathbf{u}^{s}+\mathbf{u}^{d}, \qquad \nabla\cdot\mathbf{u}^{s}=0, \qquad \nabla\times\mathbf{u}^{d}=0.
$$

These modes interact with fluctuations in density, pressure, and temperature. Their relative amplitudes influence compressibility-dependent energy transfer and higher-order turbulence statistics. One useful diagnostic is the dilatational-to-solenoidal velocity ratio,

$$
\delta=\frac{u_{d,\mathrm{rms}}}{u_{s,\mathrm{rms}}}.
$$

The simulations solve the three-dimensional compressible Navier–Stokes equations with a stochastic momentum source and an energy sink:

$$
\frac{\partial\mathbf{U}}{\partial t} +\nabla\cdot\left(\mathbf{F}_{c}-\mathbf{F}_{v}\right) =\mathbf{S}, \qquad \mathbf{U}= \begin{bmatrix} \rho\\ \rho\mathbf{u}\\ \rho E \end{bmatrix},
$$

$$
\mathbf{S}= \begin{bmatrix} 0\\ \rho\mathbf{f}\\ \rho\mathbf{u}\cdot\mathbf{f}-\Lambda(t) \end{bmatrix}.
$$

Here, $\mathbf{f}$ is a time-correlated stochastic acceleration field and $\Lambda(t)$ regulates the energy added by forcing. Periodic boundary conditions are imposed on all faces of the cubic domain.

The principal challenge is to generate physically meaningful turbulence over long time intervals while ensuring that numerical errors do not contaminate the comparatively small compressible fluctuations of interest.

## 2. Numerical Framework and Solver Development

### 2.1 High-Order Flux Reconstruction on GPUs

We use [PyFR](https://www.pyfr.org/), an open-source CFD solver based on the **flux reconstruction (FR)** framework. FR represents the solution using high-order polynomials within mesh elements and couples neighboring elements through numerical fluxes. Its element-local operations are well suited to parallel execution on modern GPU hardware.

Our simulations use a triply periodic domain $[0,2\pi]^3$ discretized with hexahedral elements. A representative forced-HIT configuration employs $32^3$ elements and polynomial degree $p=3$, corresponding to 128 solution points along each coordinate direction. The working nondimensionalization uses $\rho_0=1$, $c_0=1$, $\gamma=1.4$, and $\mathrm{Pr}=0.72$.

Rather than replacing PyFR's underlying FR discretization or GPU backends, the project adds the physical mechanisms and diagnostics needed for controlled compressible turbulence simulations. The extensions are implemented within the existing solver infrastructure.

### 2.2 Spectral Initialization and Pressure Consistency

The initial velocity field is synthesized in Fourier space, projected onto the solenoidal subspace, and scaled to a prescribed energy spectrum:

$$
E(k)=A k^4\exp\!\left[-2\left(\frac{k}{k_0}\right)^2\right].
$$

The construction preserves the reality condition of the velocity field and produces a divergence-free field to numerical precision in its original spectral representation. Interpolation onto the FR solution points introduces the expected discretization error.

A uniform initial pressure can generate an artificial acoustic transient even when the initial velocity is solenoidal. To reduce this effect, pressure fluctuations are initialized using the pressure Poisson relation

$$
\nabla^2p'=-\rho_0 \frac{\partial u_i}{\partial x_j} \frac{\partial u_j}{\partial x_i}.
$$

In a controlled comparison using identical initial velocity fields, pressure-consistent initialization reduced the peak dilatational velocity by approximately **6.9 times** relative to uniform-pressure initialization. This helps distinguish physically generated compressible motion from acoustic adjustment introduced by inconsistent initial conditions.

### 2.3 Ornstein–Uhlenbeck Stochastic Forcing

To sustain turbulent motion, we developed a custom **Ornstein–Uhlenbeck (OU) forcing plugin** that injects time-correlated momentum at low wavenumbers. The forcing coefficients are advanced using the exact finite-time OU transition,

$$
\mathbf{a}_{\mathbf{k}}^{n+1} =e^{-\Delta t/T_f}\mathbf{a}_{\mathbf{k}}^n +\sigma_f\sqrt{1-e^{-2\Delta t/T_f}}\, \boldsymbol{\xi}_{\mathbf{k}}^n,
$$

where $T_f$ is the forcing correlation time, $\sigma_f$ controls amplitude, and $\boldsymbol{\xi}_{\mathbf{k}}^n$ denotes appropriately normalized Gaussian noise.

The field is restricted to a selected low-wavenumber band and decomposed using the Helmholtz projectors

$$
\mathbf{P}^{s}(\mathbf{k}) =\mathbf{I}-\frac{\mathbf{k}\mathbf{k}^{T}}{|\mathbf{k}|^2}, \qquad \mathbf{P}^{d}(\mathbf{k}) =\frac{\mathbf{k}\mathbf{k}^{T}}{|\mathbf{k}|^2}.
$$

A configurable mixing parameter controls the solenoidal and dilatational components of the injected forcing, while power normalization provides additional control over energy input. This allows different forcing conditions to be investigated without changing the underlying numerical solver.

The OU state is updated **once per accepted time step**, rather than independently at each Runge–Kutta stage. Its random-number-generator state and Fourier coefficients are serialized in solution checkpoints, enabling trajectory-continuous restarts instead of starting a different random realization after each restart.

### 2.4 Thermodynamic Energy Regulation

In continuously forced compressible turbulence, viscous dissipation converts kinetic energy to internal energy. Without additional control, this can cause the mean temperature and sound speed to drift, making it difficult to compare statistics at fixed thermodynamic conditions.

We therefore implement an energy sink that compensates for the measured mean forcing work:

$$
\Lambda(t)=\left\langle\rho\mathbf{u}\cdot\mathbf{f}\right\rangle,
$$

where $\langle\cdot\rangle$ denotes a volume average. For a periodic domain, the corresponding volume-averaged total-energy balance is

$$
\frac{d}{dt}\langle\rho E\rangle =\left\langle\rho\mathbf{u}\cdot\mathbf{f}\right\rangle-\Lambda(t).
$$

The implementation measures forcing power during the simulation and updates the sink once per accepted step. Verification runs show that the sink compensates for nearly all injected energy and prevents sustained drift in the mean thermodynamic state.

These solver modifications form the **scientific-computing contribution** of the project: a working, GPU-capable framework for controlled, continuously forced compressible HIT.

## 3. Numerical Verification and Validation

The second contribution is a **numerical and statistical quality-assurance framework** for evaluating whether generated flow fields are suitable for scientific analysis and future database release. Validation separates three questions: Does the solver implement the intended equations correctly? Are the resolved physical quantities insensitive to discretization? Has the forced flow reached a statistically stationary regime?

### 3.1 Implementation Verification

The solver extensions, initial-condition generator, forcing update, restart behavior, and post-processing diagnostics have been checked with **120 passing automated tests** in the documented development study.

The tests include OU update statistics, forcing consistency, energy-source bookkeeping, analytic-gradient checks, and continuity across restarted simulations. These checks establish confidence in the implementation but do not, by themselves, establish convergence of every compressible turbulence statistic.

### 3.2 Compressible Kinetic-Energy Budget

For unforced, decaying compressible turbulence in a periodic domain, the volume-averaged kinetic-energy budget is

$$
\frac{dK}{dt} =\left\langle p\,\theta\right\rangle -\left\langle\varepsilon\right\rangle, \qquad K=\frac{1}{2}\left\langle\rho|\mathbf{u}|^2\right\rangle, \qquad \theta=\nabla\cdot\mathbf{u}.
$$

Here, $\varepsilon$ is the viscous dissipation rate per unit volume. We evaluate the time derivative, pressure–dilatation contribution, and viscous dissipation independently rather than inferring budget closure from total-energy conservation alone.

A central numerical detail is the use of **PyFR's interface-corrected gradients**, including the local discontinuous Galerkin (LDG) contribution. These gradients are necessary for a discrete evaluation consistent with the solver's interelement coupling. In a periodic-domain diagnostic, including the interface correction reduced the normalized mean-divergence error by approximately **2,800 times** compared with element-local differentiation alone.

### 3.3 Mesh and Polynomial-Order Convergence

We conduct controlled $h/p$-refinement experiments using the same initial flow and physical parameters. The following results are from **unforced, decaying** turbulence runs; they should not be interpreted as convergence of long-time stationary forcing statistics.

| Discretization | Solution points per direction | Normalized RMS kinetic-energy budget residual |
|---|---:|---:|
| $16^3$ elements, $p=3$ | 64 | $1.358\times10^{-3}$ |
| $16^3$ elements, $p=4$ | 80 | $1.240\times10^{-4}$ |
| $32^3$ elements, $p=3$ | 128 | $1.103\times10^{-4}$ |
| $32^3$ elements, $p=4$ | 160 | $1.758\times10^{-5}$ |

*Table 1. Numerical kinetic-energy budget closure under mesh and polynomial-order refinement. Residuals are normalized by mean viscous dissipation and evaluated using interface-corrected gradients; smaller values indicate better closure.*

Across the refinement matrix, the budget residual decreases by approximately **77 times**, with an observed rate of $O(h^{3.6})$ for fixed polynomial degree $p=3$. Kinetic-energy decay, total viscous dissipation, solenoidal dissipation, and energy-containing spectra also exhibit close agreement between the finer configurations.

However, convergence of the dominant energy-containing quantities does not imply convergence of all compressibility-sensitive diagnostics. In particular, **dilatational dissipation remains resolution-sensitive**, changing by approximately **31% between the two finest configurations**. Higher-resolution calculations are therefore required before using this quantity as a validated database statistic.

### 3.4 Calibration of Statistically Stationary Turbulence

We calibrate the stochastic forcing against a published compressible HIT reference by monitoring turbulent Mach number $M_t$, Taylor-scale Reynolds number $Re_\lambda$, and the dilatational-to-solenoidal velocity ratio $\delta$. Stationarity is assessed from statistics over trailing windows expressed in large-eddy turnover times, rather than from transient crossings of target values.

| Forcing amplitude $\sigma_f$ | Stationarity assessment | $M_t$ | $Re_\lambda$ | $\delta$ |
|---|---|---:|---:|---:|
| 0.0045 | Stationary window identified | 0.09210 | 60.62 | $5.582\times10^{-3}$ |
| **0.0047** | **Stationary window identified** | **0.09365** | **61.65** | **$5.672\times10^{-3}$** |
| 0.0049 | Not yet stationary | 0.09599 | 61.74 | $5.883\times10^{-3}$ |
| Reference target | — | 0.09300 | 58.00 | $3.000\times10^{-3}$ |

*Table 2. Preliminary forcing-amplitude calibration. Statistics are reported from the corresponding evaluation windows; the $\sigma_f=0.0049$ case is not classified as stationary and is not treated as a reproduced reference state.*

At $\sigma_f=0.0047$, a stationary candidate was obtained over approximately **8.7 large-eddy turnover times**. Its turbulent Mach number differs from the target by approximately **0.7%**, and its Taylor-scale Reynolds number by approximately **6.3%**.

The dilatational velocity ratio remains a significant open discrepancy: $\delta\approx5.7\times10^{-3}$, compared with a target of $3.0\times10^{-3}$. Additional sensitivity studies indicate that the forcing correlation time strongly influences this quantity. Increasing the correlation time from $T_f=1$ to $T_f=5$ reduced the measured $\delta$ by approximately **3.1 times** in a controlled comparison, motivating further calibration.

These findings demonstrate progress toward reproducing the reference turbulent state while making clear that **full agreement in compressibility-sensitive statistics has not yet been established**.

## 4. Toward a Public Compressible Turbulence Database

The longer-term goal is not simply to produce isolated DNS trajectories. It is to build a **reproducible scientific dataset** in which each flow realization is accompanied by sufficient numerical and statistical information to evaluate its reliability.

The intended database will organize three-dimensional velocity, pressure, density, and thermodynamic fields across controlled combinations of $Re_\lambda$, $M_t$, and solenoidal–dilatational forcing characteristics. Consistent simulation metadata—including numerical resolution, polynomial order, fluid properties, forcing parameters, sampling intervals, and stationarity diagnostics—will be essential for meaningful comparisons across cases.

The present work establishes several components of that foundation: verified stochastic forcing, reproducible initialization and restarts, independent energy-budget diagnostics, and systematic convergence tests. These methods can be used as **quality-control criteria** when deciding which simulations are sufficiently validated for inclusion in the future dataset.

The next development stages include higher-resolution verification of dilatational statistics, broader forcing and parameter studies, longer statistically stationary sampling, and preparation of a public data-access and documentation workflow. A publicly released database is **a planned outcome, not a completed deliverable**.

## 5. Conclusion and Future Directions

This project combines two closely connected research directions: **developing a high-order GPU-accelerated CFD capability for sustained compressible turbulence**, and **establishing the numerical verification and statistical validation framework needed for a reliable research database**.

The PyFR extension implements temporally correlated OU forcing, control over solenoidal and dilatational forcing components, thermodynamic energy regulation, and restart-continuous stochastic trajectories. Initial studies demonstrate a stationary forced-HIT candidate, substantial improvements in kinetic-energy budget closure under refinement, and convergence of several energy-containing statistics.

At the same time, the remaining discrepancy in dilatational velocity and the unresolved convergence of dilatational dissipation show why database development requires more than generating visually plausible turbulent fields. These quantities will guide the next phase of forcing calibration and resolution studies.

The ultimate objective is a publicly accessible, high-fidelity compressible turbulence resource that supports investigations of compressible scaling laws, statistical turbulence modeling, and scientific machine-learning methods—including generative models trained on physically validated flow data.

*Research ongoing. Larger-resolution studies, additional compressibility regimes, and public dataset release remain future milestones.*

## References

1. Witherden, F. D., Farrington, A. M., and Vincent, P. E. (2014). [PyFR: An open source framework for solving advection–diffusion type problems on streaming architectures using the flux reconstruction approach](https://doi.org/10.1016/j.cpc.2014.07.011). *Computer Physics Communications*, 185, 3028–3040.
2. Donzis, D. A., and Panickacheril John, J. (2020). [Universality and scaling in homogeneous compressible turbulence](https://doi.org/10.1103/PhysRevFluids.5.084609). *Physical Review Fluids*, 5, 084609.
3. Panickacheril John, J., and Donzis, D. A. (2024). [Strong evidence for universality in homogeneous compressible turbulence](https://doi.org/10.1063/5.0218585). *Physics of Fluids*, 36, 106121.
4. Li, Y., et al. (2008). [A public turbulence database cluster and applications to study Lagrangian evolution of velocity increments in turbulence](https://doi.org/10.1080/14685240802376389). *Journal of Turbulence*, 9, N31.
5. Vinuesa, R., and Brunton, S. L. (2022). [Enhancing computational fluid dynamics with machine learning](https://doi.org/10.1038/s43588-022-00264-7). *Nature Computational Science*, 2, 358–366.
