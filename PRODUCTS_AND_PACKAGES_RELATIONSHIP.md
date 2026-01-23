# Products and Packages: Relationship Reference

**Purpose:** Clarify what the individual products are, how they relate to the four packages, and which are "general" vs package-specific.

---

## Summary

| | Count |
|--|--|
| **Packages** | 4 (Web Apps, Social Media, Agency, Freelancing) |
| **Individual products** | 12 |
| **Products linked to a package** | **All 12** (each product is included in exactly one package) |
| **Products not in any package** | **None** |

**Bottom line:** Every individual product on the products page is also included in exactly one package. There are no standalone-only products.

---

## How They Relate

- **Packages** = Bundles of training (levels 1–3), implementation plans, platform guides, frameworks, templates, **plus** 3 “included” individual products each.
- **Individual products** = Sellable items (tools, templates, strategies) that can be:
  - **Purchased alone** on `/products`, and/or
  - **Included in a package** when you buy that package (via `package_products`).

When you buy a **package**, you get:
1. All package content (levels, plans, guides, etc.)
2. Access to that package’s **3 included products** (same products as on `/products`).

When you buy an **individual product** only, you get just that product—no package levels/guides.

---

## Package → Products Mapping

### 1. Web Apps Package (`web-apps`)
| Product | Slug | Category | Sold individually? |
|--------|------|----------|--------------------|
| AI-Powered E-Commerce Builder | `ai-ecommerce-builder` | web-apps | ✅ Yes |
| SaaS Dashboard Template | `saas-dashboard-template` | web-apps | ✅ Yes |
| API Integration Platform | `api-integration-platform` | web-apps | ✅ Yes |

### 2. Social Media Package (`social-media`)
| Product | Slug | Category | Sold individually? |
|--------|------|----------|--------------------|
| Social Media Content Generator | `social-content-generator` | social-media | ✅ Yes |
| Instagram Growth Automation | `instagram-automation` | social-media | ✅ Yes |
| TikTok Content Strategy | `tiktok-strategy` | social-media | ✅ Yes |

### 3. Agency Package (`agency`)
| Product | Slug | Category | Sold individually? |
|--------|------|----------|--------------------|
| Client Management System | `client-management-system` | agency | ✅ Yes |
| Agency Proposal Generator | `agency-proposal-generator` | agency | ✅ Yes |
| Team Collaboration Tool | `team-collaboration-tool` | agency | ✅ Yes |

### 4. Freelancing Package (`freelancing`)
| Product | Slug | Category | Sold individually? |
|--------|------|----------|--------------------|
| Freelancer Portfolio Platform | `freelancer-portfolio` | freelancing | ✅ Yes |
| Freelance Invoice System | `freelance-invoice-system` | freelancing | ✅ Yes |
| Client Communication System | `client-communication-system` | freelancing | ✅ Yes |

---

## “General” vs “Not General”

In this codebase:

- **“General”** = Products that are **standalone sellable items** (they appear on `/products` and can be bought individually). They are the “general” product catalog, as opposed to the packages.
- **“Package-specific”** = Each of those products is tied to **exactly one package** via `package_products` / `included_products`.

So:

- **All 12 products are “general”** in the sense that they’re regular, individually purchasable products (tools, templates, strategies).
- **All 12 are “package-specific”** in the sense that each belongs to one package only (same category as the package: web-apps, social-media, agency, freelancing).

There are **no** products that:
- Exist only inside a package (hidden from `/products`), or  
- Are “general” across multiple packages (each product is in exactly one package).

---

## Quick Reference: Product → Package

| Product | Package |
|--------|---------|
| AI-Powered E-Commerce Builder | Web Apps |
| SaaS Dashboard Template | Web Apps |
| API Integration Platform | Web Apps |
| Social Media Content Generator | Social Media |
| Instagram Growth Automation | Social Media |
| TikTok Content Strategy | Social Media |
| Client Management System | Agency |
| Agency Proposal Generator | Agency |
| Team Collaboration Tool | Agency |
| Freelancer Portfolio Platform | Freelancing |
| Freelance Invoice System | Freelancing |
| Client Communication System | Freelancing |

---

## Where This Lives in Code / DB

- **`package_products`** table: `(package_id, product_id, package_value, display_order)` — links each product to its package.
- **`products.included_products`** (JSONB): Package rows store an array of included product slugs, e.g.  
  `["ai-ecommerce-builder", "saas-dashboard-template", "api-integration-platform"]` for Web Apps.
- **`getPackageProducts`** / **`getProductPackage`** (`lib/db/package-products.ts`): Used to resolve package ↔ product relationships.

---

## If You Want “General” vs “Not General” to Mean Something Else

Possible definitions you could adopt later:

1. **General = not in any package**  
   Right now, **no** products qualify; all 12 are in a package.

2. **General = used in multiple packages**  
   Right now, **no** products qualify; each is in exactly one package.

3. **General = category-agnostic / cross-category**  
   You’d need new products or new rules to define this.

If you want to change how products relate to packages (e.g. add standalone-only or multi-package products), that would mean updates to migrations, `package_products`, and possibly `included_products`.
