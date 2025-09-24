Product Requirements Document: Cargo Bidding Platform  
Version:  1.2 
# 1. Introduction & Vision  
This document outlines the requirements for a real -time, online platform that facilitates the shipping 
of cargo by connecting two primary user types: Cargo Owners  and Truck Owners (Logistics 
Companies) . The system's core mechanism is a time -bound, lowest -bid auction model, designed to 
provide a competitive and efficient marketplace for shipping services. The vision is to digitize a 
fragmented industry, ensuring transparency, speed, and fairness in the procurement of logistics 
services.  
The platform will serve as a central hub where Cargo Owners can list their shipping requirements and 
Truck Owners can compete for jobs through a dynamic, real -time bidding process. The system will 
handle the auction flow automatically, from start to finish, and facilitate communication between the 
winning parties.  
# 2. User Personas  
## 2.1. Cargo Owner  
A company or individual who needs to ship goods and is looking for a logistics provider.  
- Goals:  
o To list their cargo requirements quickly and easily.  
o To find the most cost -effective and reliable shipping option through a transparent 
bidding process.  
o To monitor the bids in real -time without active participation in the auction.  
o To establish direct communication with the winning Truck Owner.  
- Frustrations:  
o Manual, time -consuming process of contacting multiple logistics companies for 
quotes.  
o Lack of transparency in pricing.  
o Uncertainty about the status of their shipping requests.  
## 2.2. Truck Owner (Logistics Company)  
A company or independent professional with a fleet of trucks, seeking new business opportunities.  
- Goals:  
o To have a constant stream of new, available shipping jobs.  
o To compete effectively in a competitive bidding environment.  
o To get real -time notifications about new auctions and bid statuses.  
o To communicate directly with the Cargo Owner for coordination.  

- Frustrations:  
o Finding consistent cargo to transport.  
o Relying on traditional, slow methods of finding business.  
o Lack of a centralized platform to view all available jobs.  
# 3. Features & Functionality  
The platform will consist of two distinct, user -specific portals.  
## 3.1. Cargo Owner Portal  
- Cargo Listing Form:  A simple, multi -step form to create a new cargo request. Fields will 
include:  
o Cargo Description ( e.g., "50 boxes of books", "1 ton of steel parts")  
o Number of Items / Weight  
o Pickup Location (City)  
o Destination (City)  
o Desired Pickup Date  
- Active Auction Dashboard:  A live view of the cargo owner's listing when it is in the active 
auction phase. This dashboard will display:  
o A live, auto -updating timer (5 minutes).  
o The current lowest bid amount.  
o The ID of the Truck Owner with the current lowest bid.  
- Job Management:  A table or list view of all past and pending cargo listings.  
o Shows the status of each job ( e.g., "Pending Auction", "Active", "Awarded", 
"Completed").  
o After an auction concludes, it displays the winning bid amount and the details of the 
winning Truck Owner.  
- Chat System:  Once an auction is won, a chat interface will become available for direct, one -
on-one communication with the winning Truck Owner.  
## 3.2. Truck Owner Portal  
- Live Auction Dashboard:  The primary view for Truck Owners. This will display a list of all live, 
ongoing auctions. The list will update automatically as new auctions begin and old ones end.  
o Each auction card will show the cargo details and the remaining time on the clock.  
o A prominent button or form field to "Place a Bid".  
- Bidding Functionality:  

o Upon entering a bid, the system will validate it against the current lowest bid. Only a 
new, lower bid will be accepted.  
o The system provides real -time feedback ( e.g., "Your bid is currently the lowest!")  
o The truck owner can see their own bids and the lowest bid on a particular item.  
- Job Management:  A dashboard to track the status of bids they have placed, jobs they have 
won, and jobs they have completed.  
- Chat System:  A chat interface for communication with the Cargo Owner once a bid is won.  
# 4. Technical Stack & Architecture  
This section details the core technologies and architecture for the Cargo Bidding Platform.  
- Frontend:  We will use the Next.js & React 18  framework for the frontend. Next.js provides 
powerful features like Server -Side Rendering (SSR) and API Routes, which will simplify the 
development of a two -sided marketplace. We will also use:  
o State Management:  Zustand  will be used for a simple and fast state management 
solution. It will manage shared global state like user authentication status or the 
current active auction, ensuring state is consistent across the application.  
o Data Fetching:  SWR  (Stale -While -Revalidate) will be used for client -side data 
fetching. This library will handle caching, revalidation, and error handling for all API 
calls, ensuring the UI is always up -to-date with minimal development effort.  
o UI Components:  Shadcn/UI  will provide a set of pre -built, accessible, and 
customizable components built with Tailwind CSS. This will speed up development 
and ensure a consistent, professional design.  
- Backend:  The backend will be a RESTful API built on Node.js  and Express.js . 
o Real -time Communication:  Socket.IO  will be the core technology for real -time 
updates. It will handle bid submissions, auction timer synchronization, and live chat 
messages.  
o Document Generation:  If required for future features, Puppeteer  will be used to 
generate high -fidelity PDFs from HTML templates for documents like contracts or 
bills of lading. pdf-lib will be used for any in -app PDF manipulation. Both are free, 
open -source libraries.  
- Database:  MongoDB  with Mongoose  will be used as the primary database. Its flexible, 
document -based structure is well -suited for the varied data related to users, cargos, bids, 
and chat messages.  
- Deployment & Storage:  The entire application will be deployed on AWS (Amazon Web 
Services) . 
o Compute:  AWS EC2  will host the Node.js/Express.js backend and the Next.js 
frontend.  
o Document Storage:  AWS S3  will be used for secure, scalable object storage. Any 
documents generated by the platform (e.g., invoices, contracts) will be stored here.  

o Database:  We can use MongoDB Atlas  as a managed cloud database service, which 
is built on AWS, simplifying database management and scaling.  
o Real -time Scaling:  The real -time nature of the app will be handled by Socket.IO , 
which can be configured to scale across multiple EC2 instances to handle a large 
number of concurrent connections.  
# 5. UI/UX Principles  
- Clarity and Simplicity:  The user interface will be clean and intuitive, with a minimal learning 
curve for both user types. Forms will be straightforward, and dashboards will be uncluttered.  
- Real -time Feedback:  All changes will be reflected in the UI instantly, providing a seamless 
and engaging experience. This includes bid updates, timer countdowns, and chat messages.  
- Mobile -First Design:  The application will be fully responsive and optimized for mobile 
devices, as many Truck Owners will likely be on the go.  
- Security:  User authentication with JWT will be implemented. All sensitive data will be 
encrypted at rest and in transit. We will use libraries like bcrypt  to securely hash passwords 
and apply security best practices such as input validation on all API endpoints.  
- Notification System:  We can use browser notifications or a simple in -app notification system 
to alert users about key events ( e.g., "Your auction is about to start!", "You have a new bid!").  
 

