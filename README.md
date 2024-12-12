# Grocery Store PWA

## Overview

A Progressive Web App (PWA) for an online grocery store, built with Next.js and Contentful.

## Prerequisites

- Node.js (v20+)
- npm or yarn
- Contentful Account

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in Contentful credentials:
   - `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
   - `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test Contentful connection
npm run test:contentful
```

## Features

- Responsive design
- Product listing from Contentful CMS
- Progressive Web App capabilities

## Tech Stack

- Next.js
- React
- Contentful
- TypeScript
