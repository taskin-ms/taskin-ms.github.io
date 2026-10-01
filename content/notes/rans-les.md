---
title: "RANS averaging\nand LES filtering."
page_title: "RANS vs. LES: averaging and filtering | HCT fieldbook"
description: "A worked study note on Reynolds averaging, LES filtering, Favre variables, and the origin of the unclosed momentum stress in compressible flow."
eyebrow: "Compressible-flow equations"
intro: "Derive the density-weighted continuity and momentum equations, and identify the unclosed stress."
meta: ["Ensemble averaging", "Spatial filtering", "Favre variables"]
draft: false
---

## 01. Two different operations

For this note, RANS uses an ensemble expectation. A time average can stand in for it under appropriate stationarity and ergodicity assumptions. LES instead uses a spatial filter with a specified kernel and width. Neither operation is a turbulence model by itself.

```math
\overline f = \mathbb E[f]
```

```math
\overline f(\mathbf x)=\int G_\Delta(\mathbf x-\mathbf r)f(\mathbf r)\,\mathrm d\mathbf r
```

The bar is deliberately reused. Its operator must be specified. The filter is normalized: ∫GΔ d𝐫 = 1.

For ensemble averaging, a mean quantity is deterministic: averaging it again does not change it, and the average of the fluctuation is zero. A general spatial LES filter is not a projection. Applying it twice can change the result, and filtering a residual need not give zero.

| Question | RANS | LES |
|---|---|---|
| What remains? | The statistical mean. | The resolved, filtered field. |
| What is unclosed? | Correlations of turbulent fluctuations. | Stress and flux contributions not determined by the resolved field. |
| Apply twice? | The ensemble mean is unchanged. | A general spatial filter is not idempotent. |

> **The assumption behind the next steps** We assume a linear operator that commutes with space and time derivatives. For LES, a translation-invariant, constant-width filter on an unbounded or compatible periodic domain provides this setting. Variable filter widths and physical boundaries can introduce commutation terms. Those terms are not included in the derivation below.

## 02. Density weighting

In a compressible flow, mass flux involves the product of density and velocity. Define a density-weighted variable using the same underlying average or filter:

```math
\widetilde u_i = \frac{\overline{\rho u_i}}{\overline\rho}
```

Favre averaging for RANS; Favre filtering for LES. The definition has the same form, but its operator is different.

This is a definition, not the assumption that density fluctuations disappear. It makes the retained mass flux exactly equal to the retained density times the Favre velocity, wherever the retained density is nonzero.

## 03. Apply the operator to conservation

Use Cartesian index notation and sum over repeated indices. Let σ(ij) be the viscous stress. For simplicity, omit body forces. The instantaneous equations are:

```math
\partial_t\rho+\partial_j(\rho u_j)=0
```

```math
\partial_t(\rho u_i)+\partial_j(\rho u_i u_j)=-\partial_i p+\partial_j\sigma_{ij}
```

Linearity and commutation let us move the operator through the derivatives. Substitute the Favre definition into continuity:

```math
\partial_t\overline\rho+\partial_j(\overline\rho\widetilde u_j)=0
```

Momentum still contains the retained product ρu(i)u(j). Define its departure from the product of retained quantities:

```math
\tau_{ij}\equiv\overline{\rho u_i u_j}-\overline\rho\widetilde u_i\widetilde u_j
```

Separate that product into the resolved or mean contribution plus τ(ij), then move the stress divergence to the right-hand side:

```math
\partial_t(\overline\rho\widetilde u_i)+\partial_j(\overline\rho\widetilde u_i\widetilde u_j)
```

```math
{}=-\partial_i\overline p+\partial_j\overline{\sigma_{ij}}-\partial_j\tau_{ij}
```

The sign follows the positive-covariance definition of τ above. Some references define a negative Reynolds stress; check conventions before comparing equations.

## 04. Closure

For RANS, the mean velocity is deterministic under the ensemble expectation. With the Favre fluctuation u″(i) = u(i) − ũ(i), the stress is the density-weighted covariance of those fluctuations. For LES, retain the exact product-difference definition: a general filter does not obey all Reynolds averaging rules.

In RANS, the stress represents turbulent fluctuations relative to the mean. In LES, it represents contributions not determined by the retained field, which still contains resolved turbulence. Choosing how to approximate that stress is the modeling step.

> **Momentum is only part of the compressible closure problem.** We have left the retained viscous stress intact. With temperature-dependent properties, replacing it by a stress evaluated from retained fields is another approximation. The energy equation brings additional unresolved heat and energy fluxes. This note does not close those terms.

## 05. Work it through

1. Starting from instantaneous continuity, apply an operator without density weighting. Identify the density–velocity correlation that remains.
1. Introduce Favre velocity and show why that mass-flux correlation is absorbed into its definition.
1. Expand momentum and verify the sign of the τ(ij) divergence using the product-difference definition.
1. Apply a Gaussian spatial filter twice to a Fourier mode. Compare its gain with a single application; explain why the filtered residual need not vanish.
1. Write down what changes when the filter width varies in space. Locate the commutation assumption that fails.

> A useful next experiment: reproduce one filtered stress from a documented dataset and record the kernel, width, boundary treatment, units, and normalization. Mean profiles alone cannot reconstruct the full instantaneous LES stress.

## Reading alongside the derivation

References for the equations, averaging rules, and energy closures:

1. [Gatski & Bonnet, Compressibility, Turbulence and High Speed Flow](https://shop.elsevier.com/books/compressibility-turbulence-and-high-speed-flow/gatski/978-0-12-397027-5), especially Chapters 2, 3, and 5.
1. [Garnier, Adams & Sagaut, Large Eddy Simulation for Compressible Flows](https://link.springer.com/book/10.1007/978-90-481-2819-8), especially the LES governing equations and SGS modeling discussion.
1. [Pope, Turbulent Flows](https://doi.org/10.1017/CBO9780511840531), for statistical averaging and the RANS framework.
