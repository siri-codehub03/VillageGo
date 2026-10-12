# VillageGo — Local shop delivery & earning app

VillageGo is a beginner-friendly front-end prototype for village communities. It connects customers with local vegetable, fruit, juice and grocery sellers, and lets local delivery partners manage demo delivery jobs.

## Features in this prototype

- Browse and search products across vegetables, fruits, juice stalls and groceries.
- Add items to a shopping cart, change quantities and create a demo order.
- Seller view: accept new orders and mark them ready for pickup.
- Delivery partner view: accept eligible jobs, mark pickup and complete delivery.
- Admin view: inspect order status and export order records to CSV.
- Browser `localStorage` saves demo changes on the same browser/device.
- Responsive layout for phones and desktop screens.

## Run it locally

1. Download and unzip the project.
2. Open the `VillageGo` folder.
3. Double-click `index.html` to open it in a modern browser.

No installation or build step is required. An internet connection may be used by the browser to load the optional Google Fonts; the app itself does not require a server or external API.

## Try the complete demo flow

1. In **Customer**, add items to the cart and click **Place demo order**.
2. Open **Seller** and click **Accept & prepare** on the new order.
3. Click **Mark ready** when the order is prepared.
4. Open **Delivery** and accept the delivery, mark it picked up, then complete delivery.
5. Open **Admin** to view the updated status and export the CSV.

The app includes two sample orders to make the seller and delivery screens useful immediately.

## Important limitations

This is a learning/demo prototype, not a live delivery service. It has no real accounts, identity verification, server database, live GPS, messaging, payment processing, refunds, or notifications. Demo data is stored only in the current browser and does not sync across devices. Never enter real private or payment information.

Before a real launch, build a secure backend and authentication, implement seller and delivery-partner verification, protect customer addresses, add consent-based location sharing, support order cancellations and disputes, establish food-safety and local legal processes, and integrate a trusted payment provider. Delivery roles and hours must be appropriate for the person's age and local law.

## Suggested stack for a future version

- Front end: HTML, CSS, JavaScript (this prototype)
- Backend: Node.js + Express or another maintained server framework
- Database: PostgreSQL / MySQL
- Authentication: secure managed authentication or carefully implemented server-side sessions
- Maps: a mapping provider with explicit location permission
- Payments: a trusted payment gateway; do not store raw card details

## Project structure

```text
VillageGo/
├── index.html
├── styles.css
├── app.js
├── README.md
└── .gitignore
```

## GitHub upload

Create a repository named `villagego-local-delivery`, then upload these files or use Git:

```bash
git init
git add .
git commit -m "Build VillageGo local delivery prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/villagego-local-delivery.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your own GitHub username.
