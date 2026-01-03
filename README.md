# Thien An Furniture Monorepo

Replacement repository for [thienanfurniture.com](https://thienanfurniture.com/). This project uses a modern monorepo structure to manage the customer-facing website and the administrative dashboard.

## Architecture

### 1. Database Diagram (ERD)
Modeling the core entities for product management and customer inquiries.

```mermaid
erDiagram
    CATEGORY ||--o{ PRODUCT : contains
    CATEGORY ||--o{ CATEGORY : "sub-category"
    PRODUCT ||--o{ PRODUCT_IMAGE : has
    PRODUCT ||--o{ SEO_METADATA : has
    PROJECT ||--o{ SEO_METADATA : has
    NEWS_POST ||--o{ NEWS_CATEGORY : belongs_to
    NEWS_POST ||--o{ SEO_METADATA : has
    SERVICE ||--o{ SEO_METADATA : has
    INQUIRY }o--|| PRODUCT : "inquires about"
    SETTING ||--o{ BRANCH_ADDRESS : contains

    PRODUCT {
        string title_vi
        string title_en
        string slug
        text short_desc_vi
        text short_desc_en
        text content_vi
        text content_en
        string status "VISIBLE | FEATURED"
        uuid category1_id FK
        uuid category2_id FK
    }

    CATEGORY {
        string title_vi
        string title_en
        string slug
        uuid parent_id FK
    }

    PROJECT {
        string title_vi
        string title_en
        text content_vi
        text content_en
    }

    NEWS_POST {
        string title_vi
        string title_en
        uuid category_id FK
    }

    INQUIRY {
        string full_name
        string email
        string phone
        string address
        string subject
        text content
        datetime created_at
    }

    SEO_METADATA {
        string title
        string keywords
        text description
    }
```

### 2. User Story Diagram
Visualizing the primary actors and their interactions with the system.

```mermaid
graph TD
    subgraph "Customer Journey (Web App)"
        C[Customer/Visitor] --> |"Browses"| PC[Product Catalog]
        C --> |"Filters by"| CAT[Categories]
        C --> |"Views"| PD[Product Details]
        C --> |"Sends"| IQ[Inquiry/Contact]
        C --> |"Reads"| NP[News/Projects/Services]
        C --> |"Subscribes"| NS[Newsletter]
    end

    subgraph "Admin Management (Admin App)"
        A[Admin] --> |"Manages"| MP[Products & Categories]
        A --> |"Publishes"| MN[News/Projects/Services]
        A --> |"Reviews"| MO[Inquiries & Contacts]
        A --> |"Updates"| MG[Gallery/Sliders]
        A --> |"Configures"| MS[Site & SEO Settings]
    end

    IQ --> |"Notifies"| MO
    MN --> |"Updates"| NP
```

### 3. OOP Diagram
High-level class structure for the core business logic.

```mermaid
classDiagram
    class BasePost {
        <<abstract>>
        +String title_vi
        +String title_en
        +String slug
        +String image_url
        +Boolean status
        +SEOMetadata seo
    }

    class Product {
        +Category level1
        +Category level2
        +String short_desc_vi
        +String short_desc_en
        +String content_vi
        +String content_en
    }

    class Category {
        +String title_vi
        +String title_en
        +Category parent
    }

    class Inquiry {
        +String fullName
        +String email
        +String phone
        +String content
        +DateTime createdAt
    }

    class SEOMetadata {
        +String title
        +String keywords
        +String description
    }

    BasePost <|-- Product
    BasePost <|-- NewsPost
    BasePost <|-- Project
    BasePost <|-- Service
    Product "*" --o "1" Category
    NewsPost "*" --o "1" NewsCategory
```

## User Stories: Who Does What?

### Customer / Visitor (Web App)
- **Browse Furniture**: Browse high-quality furniture collections categorized by room and style.
- **Project Inspiration**: View completed interior design projects to see work quality.
- **Service Details**: Learn about design, manufacturing, and installation services.
- **Direct Inquiry**: Contact the team about specific products or general design needs.
- **Stay Updated**: Read news and subscribe to the newsletter for latest designs.

### Administrator (Admin App)
- **Content Engine**: Manage Products, News, Projects, Services, and Home Introduction.
- **Bilingual Control**: Manage all content in both Vietnamese and English.
- **Inquiry Management**: Monitor and respond to customer contacts and newsletter signups.
- **Visual Assets**: Control home sliders, partner logos, and gallery banners.
- **SEO & Settings**: Fine-tune SEO metadata for every post and configure site-wide contact info.

---

## Tech Stack

This Turborepo includes the following:

- `apps/web`: [Next.js](https://nextjs.org/) app for customers.
- `apps/admin`: [Next.js](https://nextjs.org/) app for administration.
- `packages/ui`: Shared React components.
- `packages/database`: Database schema and client.
- `packages/tailwind-config`: Shared Tailwind configurations.

## Development

1. Install dependencies: `pnpm install`
2. Run development servers: `pnpm dev`
3. Build all apps: `pnpm build`
