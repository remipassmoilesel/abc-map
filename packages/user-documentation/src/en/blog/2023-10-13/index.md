---
title: Use Stadia Maps layers
layout: main-layout.njk
---

## Introduction

[Stadia Maps](https://stadiamaps.com/) offers beautiful base maps available at attractive prices. There is also a free third party that allows
great experiments without spending anything.

Since October 2023, Stadia Maps is the new provider of [Stamen](https://maps.stamen.com/stadia-partnership/) tiles.

This post describes how to use Stadia Maps basemaps with Abc-Map as XYZ layers.

## How to use Stadia Maps layers ?

### Step 1: Sign up for Stadia Maps

Register here: [https://stadiamaps.com/stamen/onboarding/create-account/](https://stadiamaps.com/stamen/onboarding/create-account/)

You don't need to fill in any payment information to get started.

### Step 2: Create an API key

<div class="alert alert-info my-3 w-75">
    <div class="fw-bold">What is an API key?</div>
    <div>An API key is a code that authenticates you to a service. API keys must be kept secret.</div>
</div>

<div class="alert alert-warning mb-5 w-75">
    If you use an API key in a <i>public project</i>, this may result in <b>excessive billing</b>.
</div>

Create a "property".

<figure class="figure">
    <img src="./screenshot-1.png" alt="Property creation form">
    <figcaption>Property creation form</figcaption>
</figure>

In the 'Authentication Configuration' section create an API key:

<figure class="figure">
    <img src="./screenshot-2.png" alt="Button to create an API key">
    <figcaption>Button for creating an API key</figcaption>
</figure>

Keep the tab open, you will need your key in the next step.

<figure class="figure">
    <img src="./screenshot-3.png" alt="Example API key">
    <figcaption>API key example</figcaption>
</figure>

### Step 3: choose and add a basemap

The easiest is to use the data store. Open the data store and select a layer:

<figure class="figure">
    <img src="./screenshot-4.png" alt="Selecting a layer in the data store">
    <figcaption>Selecting a layer from the data store</figcaption>
</figure>

Then enter your API key:

<figure class="figure">
    <img src="./screenshot-5.png" alt="Entering the API key">
    <figcaption>Entering the API key</figcaption>
</figure>

_Et voilà !_
