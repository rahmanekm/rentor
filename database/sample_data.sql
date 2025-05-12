-- Sample Users
-- Passwords should be hashed in a real application. For simplicity, using plain text here.
-- Consider 'password123' as a placeholder for a securely hashed password.

-- Landlords
INSERT INTO Users (Name, Email, Password, PhoneNumber, UserType, ProfilePictureURL, PropertyName, PropertyAddress, EmailVerified) VALUES
('Alice Wonderland', 'alice.landlord@example.com', 'hashed_password_alice', '123-456-7890', 'Landlord', 'http://example.com/alice.jpg', 'Wonderland Estates', '123 Fantasy Lane, Dream City', TRUE),
('Bob The Builder', 'bob.landlord@example.com', 'hashed_password_bob', '987-654-3210', 'Landlord', 'http://example.com/bob.jpg', 'Builders Properties', '456 Construction Ave, Buildsville', TRUE);

-- Tenants
INSERT INTO Users (Name, Email, Password, PhoneNumber, UserType, ProfilePictureURL, Bio, EmailVerified, LookingForDescription, BudgetMin, BudgetMax, PreferredLocations, FlatmateMoveInDate, IsActivelyLooking) VALUES
('Charlie Brown', 'charlie.tenant@example.com', '$2a$10$gLJs2G72A.CEz1j5aZtcauGsTqWfR0x1jA.LzR0m9sXhJ0kQZ0n9S', '555-123-4567', 'Tenant', 'http://example.com/charlie.jpg', 'Quiet and respectful student looking for a room. I enjoy reading and chess.', TRUE, 'A clean, quiet flatmate who is also a student or young professional. Non-smoker preferred.', 500, 700, 'Near City University, Angel', '2025-09-01', TRUE), -- Password: password_charlie
('Diana Prince', 'diana.tenant@example.com', '$2a$10$gLJs2G72A.CEz1j5aZtcauGsTqWfR0x1jA.LzR0m9sXhJ0kQZ0n9S', '555-987-6543', 'Tenant', 'http://example.com/diana.jpg', 'Young professional working in finance. I like to keep things tidy and enjoy a calm home environment after work.', TRUE, 'A mature, respectful flatmate. Preferably someone who also works full-time. Good transport links are important.', 700, 950, 'Canary Wharf, Docklands', '2025-08-15', TRUE), -- Password: password_diana
('Eve Adams', 'eve.tenant@example.com', '$2a$10$gLJs2G72A.CEz1j5aZtcauGsTqWfR0x1jA.LzR0m9sXhJ0kQZ0n9S', '555-555-5555', 'Tenant', 'http://example.com/eve.jpg', 'Artist and part-time barista. Love plants, cooking, and exploring the city. Looking for a friendly, creative household.', TRUE, 'Sociable and artsy flatmates. A place with good natural light would be amazing. Open to pets.', 450, 650, 'Hackney, Shoreditch, Dalston', '2025-07-01', TRUE); -- Password: password_eve

-- Sample Room Listings
-- Assuming Alice Wonderland is UserID 1 and Bob The Builder is UserID 2
INSERT INTO RoomListings (LandlordID, Title, Description, Address, City, State, ZipCode, RoomType, Rent, Deposit, AvailableDate, LeaseTerms, PetPolicy, SmokingPolicy, Status) VALUES
(1, 'Cozy Room in Dream City', 'A beautiful and cozy room with all modern amenities. Perfect for students or young professionals.', '123 Fantasy Lane', 'Dream City', 'CA', '90210', 'Single', 600.00, 300.00, '2025-06-01', '12 months lease, 1 month notice', 'Not Allowed', 'Not Allowed', 'Available'),
(1, 'Spacious Studio near Downtown', 'Large studio apartment with a separate kitchen and balcony. Close to public transport.', '789 Imagination Rd', 'Dream City', 'CA', '90211', 'Studio', 900.00, 450.00, '2025-07-15', '6 months minimum lease', 'Case-by-Case', 'Outside Only', 'Available'),
(2, 'Modern Room in Buildsville', 'Newly renovated room in a quiet neighborhood. Includes high-speed internet.', '456 Construction Ave', 'Buildsville', 'NY', '10001', 'Single', 750.00, 375.00, '2025-05-20', 'Flexible lease terms', 'Allowed', 'Not Allowed', 'Pending'),
(2, 'Shared Apartment with Great Views', 'One room available in a 2-bedroom shared apartment. Stunning city views.', '101 Skyscraper Heights', 'Buildsville', 'NY', '10002', 'Shared', 550.00, 275.00, '2025-08-01', 'Minimum 3 months stay', 'Not Allowed', 'Not Allowed', 'Available');

-- Sample Amenities
INSERT INTO Amenities (Name, Description) VALUES
('WiFi', 'High-speed wireless internet'),
('Parking', 'Dedicated or street parking available'),
('Laundry', 'In-unit or on-site laundry facilities'),
('Air Conditioning', 'Central or window unit AC'),
('Heating', 'Central heating or space heaters'),
('Kitchen Access', 'Access to a shared or private kitchen'),
('Private Bathroom', 'Ensuite or dedicated bathroom'),
('Furnished', 'Room comes with basic furniture');

-- Sample RoomAmenities (Linking Listings to Amenities)
-- Assuming ListingIDs 1-4 and AmenityIDs 1-8
-- Cozy Room in Dream City (ListingID 1)
INSERT INTO RoomAmenities (ListingID, AmenityID) VALUES
(1, 1), -- WiFi
(1, 3), -- Laundry
(1, 5), -- Heating
(1, 8); -- Furnished

-- Spacious Studio near Downtown (ListingID 2)
INSERT INTO RoomAmenities (ListingID, AmenityID) VALUES
(2, 1), -- WiFi
(2, 4), -- Air Conditioning
(2, 6), -- Kitchen Access
(2, 7); -- Private Bathroom

-- Modern Room in Buildsville (ListingID 3)
INSERT INTO RoomAmenities (ListingID, AmenityID) VALUES
(3, 1), -- WiFi
(3, 2), -- Parking
(3, 5), -- Heating
(3, 8); -- Furnished

-- Shared Apartment with Great Views (ListingID 4)
INSERT INTO RoomAmenities (ListingID, AmenityID) VALUES
(4, 1), -- WiFi
(4, 3), -- Laundry
(4, 6); -- Kitchen Access

-- Sample Applications
-- Assuming Charlie Brown is UserID 3 and Diana Prince is UserID 4
-- Assuming Cozy Room is ListingID 1 and Modern Room is ListingID 3
INSERT INTO Applications (ListingID, TenantID, Message, Status) VALUES
(1, 3, 'I am very interested in this room. It looks perfect for my needs as a student. When can I schedule a viewing?', 'Pending'),
(3, 4, 'Hello, I would like to apply for the modern room. I am a young professional and can provide references. Please let me know the next steps.', 'Pending'),
(1, 4, 'Also interested in this cozy room as a backup. Looks great!', 'Pending');

-- Sample Messages
-- UserIDs: Alice=1, Bob=2, Charlie=3, Diana=4
-- ApplicationIDs: App1 (Listing1, Tenant3), App2 (Listing3, Tenant4)
INSERT INTO Messages (SenderID, ReceiverID, ApplicationID, MessageContent) VALUES
(3, 1, 1, 'Hi Alice, I submitted an application for the Cozy Room. Could we arrange a viewing sometime next week?'),
(1, 3, 1, 'Hello Charlie, thanks for your interest! Yes, we can arrange a viewing. How about Tuesday at 3 PM?'),
(4, 2, 2, 'Hi Bob, I applied for your Modern Room. I am available for a quick chat or viewing at your earliest convenience.');

-- Sample Favorites
-- TenantID 3 (Charlie), TenantID 4 (Diana)
-- ListingID 1 (Cozy Room), ListingID 2 (Spacious Studio), ListingID 4 (Shared Apartment)
INSERT INTO Favorites (TenantID, ListingID) VALUES
(3, 2), -- Charlie favorites Spacious Studio
(4, 1), -- Diana favorites Cozy Room
(4, 4); -- Diana favorites Shared Apartment
