# Learning Unsteady Compressible Flows on Unstructured Meshes

*Scientific Machine Learning · Computational Fluid Dynamics · Graph Neural Networks*

**Authors:** Taskin Mehereen, Donnell Fulwiler, Gauri Agrawal, Sriram Iyer, Narendra Singh, Shuiwang Ji

**Status:** Ongoing Research

## Overview

High-fidelity computational fluid dynamics (CFD) simulations play a central role in aerospace design, optimization, and uncertainty quantification. However, their computational cost makes repeated evaluations expensive, particularly for unsteady, high-speed flows involving shock waves, flow separation, and complex wake dynamics.

Graph neural networks (GNNs) offer a promising alternative by learning flow evolution directly on unstructured computational meshes. Nevertheless, long-horizon prediction stability, small-scale flow reconstruction, and satisfaction of the governing conservation laws remain important challenges.

This project investigates **scalable graph-based surrogate modeling for unsteady compressible flows around blunt-body capsules**, combining distributed neural network training, autoregressive stabilization, and test-time physical refinement. Beyond flow-field reconstruction, the broader objective is to evaluate the reliability of learned surrogates for aerodynamic analysis.

## 1. Physical Problem and Motivation

Supersonic flow around blunt bodies is characterized by a detached bow shock upstream of the body. The curved shock produces a nonuniform downstream flow containing both subsonic and supersonic regions. Variations in shock strength generate entropy gradients and vorticity, as described by Crocco's theorem:

$$
T\nabla s
=
\nabla h_0
-
\mathbf{u}\times\boldsymbol{\omega},
\qquad
\boldsymbol{\omega}=\nabla\times\mathbf{u}.
$$

These rotational flow characteristics make simplified potential-flow formulations inadequate. The flow must instead be modeled through the governing conservation equations, expressed for compressible viscous flow as

$$
\frac{\partial\mathbf{U}}{\partial t}
+
\nabla\cdot(\mathbf{F}_c-\mathbf{F}_v)
=0,
$$

where $\mathbf{U}=[\rho,\rho\mathbf{u},\rho E]^T$ contains the conserved variables, and $\mathbf{F}_c$ and $\mathbf{F}_v$ denote convective and viscous fluxes.

For unsteady capsule flows, additional complexity arises from separated shear layers and evolving downstream wakes. Accurately resolving these phenomena requires numerical discretizations capable of representing sharp flow gradients alongside smaller-scale fluctuations.

Our objective is to investigate whether neural surrogates can reproduce these dynamics with sufficient temporal stability and physical consistency to support aerodynamic analysis.

## 2. Computational Methodology

### 2.1 Graph-Based Flow Prediction

We employ a MeshGraphNet-based architecture to learn the temporal evolution of compressible flow fields on unstructured computational meshes.

The computational domain is represented as a graph $\mathcal{G}=(\mathcal{V},\mathcal{E})$, where nodes correspond to mesh locations and edges encode geometric connectivity. Node features contain the local flow state and relevant geometric and boundary information, while edge features describe relative spatial relationships.

The model follows an **encode–process–decode architecture**. Separate multilayer perceptrons map node and edge features into latent representations. Successive message-passing layers aggregate information across neighboring mesh locations, and a decoder maps the updated latent features into predicted flow variables.

The learned evolution operator is written as

$$
\hat{\mathbf{q}}_{t+\Delta t}
=
\mathcal{G}_{\theta}(\mathbf{q}_t,\mathcal{M}),
$$

where $\mathbf{q}=[\rho,u,v,p]^T$ represents the primitive flow variables and $\mathcal{M}$ contains the computational mesh information.

### 2.2 Distributed Training with X-MeshGraphNet

High-resolution unstructured meshes generate computationally expensive graphs. In our initial experiments, full-graph training exceeded available GPU memory.

To address this limitation, we adapted **X-MeshGraphNet's distributed training infrastructure** to our CFD dataset.

The computational graph is partitioned into subdomains distributed across multiple GPUs. Each partition retains the necessary local connectivity and halo information to support message passing across partition boundaries.

Unlike conventional data parallelism, which replicates the entire graph across devices, this approach distributes the computational graph itself.

Integrating X-MeshGraphNet enabled multi-GPU training on graph representations that were impractical under our initial single-device setup, while retaining the existing distributed implementation.

### 2.3 Autoregressive Prediction and Pushforward Training

A fundamental challenge in learned temporal evolution is the accumulation of prediction errors during autoregressive inference.

Conventional one-step training minimizes the discrepancy between predicted and reference flow states:

$$
\mathcal{L}_{1}
=
\frac{1}{N}
\sum_{i=1}^{N}
\left\|
\hat{\mathbf{q}}_{i,t+\Delta t}
-
\mathbf{q}_{i,t+\Delta t}
\right\|_2^2.
$$

However, during inference, the model repeatedly receives its own predictions rather than ground-truth states. This mismatch can amplify small errors and eventually destabilize long rollouts.

We investigate **pushforward training**, which exposes the network to states generated through preceding autoregressive predictions. A representative objective is

$$
\mathcal{L}_{PF}
=
\frac{1}{N}
\sum_{i=1}^{N}
\left\|
\mathcal{G}_{\theta}
(\tilde{\mathbf{q}}_{t+K\Delta t},\mathcal{M})_i
-
\mathbf{q}_{i,t+(K+1)\Delta t}
\right\|_2^2,
$$

where $\tilde{\mathbf{q}}$ denotes a state obtained from preceding model predictions.

This training strategy aims to improve robustness to the distribution shift encountered during closed-loop inference.

### 2.4 Test-Time Physical Refinement

Although graph-based surrogates can approximate complex flow structures, their predictions do not inherently satisfy the governing conservation equations or boundary conditions.

We therefore investigate a **Gauss–Newton-based test-time projection** to improve physical consistency without retraining the underlying neural network.

Starting from a surrogate prediction $\hat{\mathbf{q}}$, the correction procedure locally linearizes the physical constraint residuals and computes bounded iterative updates.

The refinement objective can be represented as

$$
\mathbf{q}^{*}
=
\underset{\mathbf{q}}{\operatorname{argmin}}
\left[
\lambda_{NS}\|\mathcal{R}_{NS}(\mathbf{q})\|_2^2
+
\lambda_{BC}\|\mathcal{R}_{BC}(\mathbf{q})\|_2^2
+
\lambda_{\mathrm{reg}}
\|\mathbf{q}-\hat{\mathbf{q}}\|_2^2
\right].
$$

Here, $\mathcal{R}_{NS}$ measures discrete conservation-law violations, $\mathcal{R}_{BC}$ represents boundary-condition residuals, and the regularization term limits deviations from the original prediction.

The refinement additionally accounts for physical admissibility, including positive density and pressure.

Separately, we investigate ground-truth-free corrections aimed at recovering flow statistics and attenuated small-scale fluctuations. These statistical corrections and the Gauss–Newton projection address complementary objectives: **statistical fidelity and physical constraint satisfaction**, respectively.

## 3. Results and Discussion

### 3.1 Flow-Field Reconstruction

MeshGraphNet captures the dominant features of the compressible flow, including the detached bow shock, post-shock gradients, and large-scale distributions of velocity, pressure, and density. Qualitative agreement with high-fidelity CFD reference solutions indicates that the learned graph operator can approximate the principal flow structures on unstructured computational meshes.

However, localized discrepancies remain near the curved shock front, steep thermodynamic gradients, and separated downstream wake. The predicted fields exhibit attenuation of small-scale spatial fluctuations, indicating reduced fidelity at higher spatial frequencies.

These observations motivate a more detailed investigation of spectral energy distributions, higher-order flow statistics, and conservation-law residuals.

### 3.2 Long-Horizon Stability

Pushforward training substantially improves autoregressive prediction stability compared with conventional one-step training.

Over a **746-step closed-loop rollout**, the conventionally trained model exhibits increasing prediction errors, reaching a normalized whole-domain mean-squared error of approximately $53$.

In contrast, the pushforward-trained model maintains comparatively low errors throughout the rollout, ending near $0.008$.

Although intermittent error peaks remain, the pushforward-trained model avoids the sustained error growth observed in conventional training.

These results demonstrate the importance of accounting for the autoregressive input distribution when learning long-horizon flow evolution. However, stable pointwise predictions do not necessarily guarantee accurate small-scale dynamics or satisfaction of the governing conservation equations.

### 3.3 Conservation-Law Satisfaction

Gauss–Newton projection is applied at test time to reduce violations of the compressible Navier–Stokes equations and boundary conditions.

The projection substantially improves physical constraint satisfaction throughout the autoregressive rollout, achieving a median reduction factor of $4.60\times10^6$ in the total constraint residual.

Individual reductions reach $3.08\times10^6$ for mass conservation, $9.25\times10^5$ for x-momentum, $3.22\times10^7$ for y-momentum, and $4.59\times10^6$ for energy conservation. Wall no-slip violations decrease by approximately $4.52\times10^{10}$.

These results demonstrate that iterative test-time projection can significantly reduce discrete physical inconsistencies without modifying the pretrained neural network.

### 3.4 Statistical Fidelity and Small-Scale Reconstruction

We further investigate whether ground-truth-free test-time refinement can improve the statistical properties of predicted flow fields.

Relative to the baseline surrogate, the corrected fields exhibit substantial improvements in spectral fidelity. Kinetic energy and enstrophy spectral errors decrease by approximately **66% and 53%**, respectively, while Wasserstein-1 distances for velocity and vorticity distributions are also reduced.

| Metric ↓ | Baseline | GT-free TTS |
|---|---:|---:|
| NRMSE (u) | **0.274 ± 0.065** | 0.348 ± 0.062 |
| NRMSE (v) | **0.192 ± 0.046** | 0.226 ± 0.044 |
| E(k) Error | 0.266 ± 0.068 | **0.090 ± 0.042** |
| Z(k) Error | 0.287 ± 0.067 | **0.136 ± 0.057** |
| W₁(u) | 2.00 ± 0.92 | **1.56 ± 0.73** |
| W₁(v) | 3.32 ± 1.43 | **2.25 ± 1.60** |
| W₁(ω) | 0.115 ± 0.017 | **0.045 ± 0.017** |

*Table 1. Comparison of pointwise prediction errors, spectral fidelity, and Wasserstein-1 distances between the baseline surrogate and ground-truth-free test-time refinement. Values are reported as mean ± uncertainty; the lower mean is highlighted in bold.*

Improvements are also observed in structure-function errors across orders $p=2$ through $9$, although the relative differences become smaller at higher orders.

Notably, the improved statistical agreement is accompanied by an increase in pointwise normalized prediction error. This highlights an important distinction between **instantaneous flow-field accuracy and statistical fidelity**: improving the distribution of turbulent fluctuations does not necessarily improve correspondence with a particular CFD realization.

## 4. Aerodynamic Load Prediction

The ultimate engineering motivation is to evaluate whether learned flow fields can reliably predict aerodynamic forces and moments acting on the capsule.

These quantities are obtained by integrating pressure and viscous stresses along the body boundary. For the two-dimensional configuration, the aerodynamic force per unit span is

$$
\mathbf{F}'_{\mathrm{aero}}(t)
=
\oint_{\partial B}
\left[
-p\mathbf{n}
+
\boldsymbol{\tau}\cdot\mathbf{n}
\right] \,ds.
$$

This provides an engineering-oriented measure of surrogate accuracy beyond pointwise flow-field prediction.

Future evaluations will compare aerodynamic load histories and their statistical properties against high-fidelity CFD reference solutions, investigating whether improvements in predictive stability, physical consistency, and flow-field statistics translate into improved force estimation.

## 5. Conclusion and Future Directions

This project investigates the use of graph neural networks as scalable surrogates for unsteady compressible flow prediction on unstructured meshes.

Our results demonstrate that pushforward training can substantially improve long-horizon rollout stability, while Gauss–Newton-based test-time projection significantly reduces discrete conservation-law violations. Complementary ground-truth-free refinement improves the statistical agreement of predicted flow structures, despite a trade-off with pointwise accuracy.

Together, these findings emphasize that **temporal stability, physical consistency, and statistical fidelity are distinct but complementary requirements** for reliable neural CFD surrogates.

The next stage of this work will focus on aerodynamic load prediction, the relationship between wake reconstruction and force accuracy, and the computational trade-offs associated with test-time refinement.

Ultimately, the objective is to assess the suitability of learned flow surrogates for repeated aerodynamic evaluations and uncertainty quantification in aerospace engineering.

*Research ongoing. Additional aerodynamic-load and computational-performance evaluations will be incorporated as they become available.*

## References

1. Pfaff et al., *Learning Mesh-Based Simulation with Graph Networks*, ICLR, 2021.
2. Brandstetter et al., *Message Passing Neural PDE Solvers*, ICLR, 2022.
3. Nabian et al., *X-MeshGraphNet: Scalable Multi-Scale Graph Neural Networks for Mesh-Based Physics Simulations*, 2024.
4. Anderson and Cadou, *Fundamentals of Aerodynamics*, 7th ed., Sections 9.5 and 13.5.
