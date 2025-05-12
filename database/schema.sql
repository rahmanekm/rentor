-- Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, -- Hashed password
    PhoneNumber VARCHAR(20),
    UserType ENUM('Landlord', 'Tenant') NOT NULL,
    ProfilePictureURL VARCHAR(255),
    Bio TEXT, -- For tenants
    PropertyName VARCHAR(255), -- For landlords
    PropertyAddress TEXT, -- For landlords
    EmailVerified BOOLEAN DEFAULT FALSE,
    -- Flatmate specific fields (can be NULL if user is not looking or not a tenant type that uses this)
    LookingForDescription TEXT NULL,
    BudgetMin INT NULL,
    BudgetMax INT NULL,
    PreferredLocations TEXT NULL, -- e.g., comma-separated, or JSON string
    FlatmateMoveInDate DATE NULL,
    IsActivelyLooking BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- RoomListings Table
CREATE TABLE RoomListings (
    ListingID INT PRIMARY KEY AUTO_INCREMENT,
    LandlordID INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Address VARCHAR(255) NOT NULL,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    ZipCode VARCHAR(20) NOT NULL,
    RoomType ENUM('Single', 'Double', 'Studio', 'Shared') NOT NULL,
    Rent DECIMAL(10, 2) NOT NULL,
    Deposit DECIMAL(10, 2),
    AvailableDate DATE NOT NULL,
    LeaseTerms TEXT,
    PetPolicy ENUM('Allowed', 'Not Allowed', 'Case-by-Case') DEFAULT 'Not Allowed',
    SmokingPolicy ENUM('Allowed', 'Not Allowed', 'Outside Only') DEFAULT 'Not Allowed',
    Status ENUM('Available', 'Unavailable', 'Pending') DEFAULT 'Available',
    ImageUrl VARCHAR(255) NULL DEFAULT NULL, -- Added for listing images
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (LandlordID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Amenities Table
CREATE TABLE Amenities (
    AmenityID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT
);

-- RoomAmenities Junction Table (Many-to-Many relationship between RoomListings and Amenities)
CREATE TABLE RoomAmenities (
    ListingID INT NOT NULL,
    AmenityID INT NOT NULL,
    PRIMARY KEY (ListingID, AmenityID),
    FOREIGN KEY (ListingID) REFERENCES RoomListings(ListingID) ON DELETE CASCADE,
    FOREIGN KEY (AmenityID) REFERENCES Amenities(AmenityID) ON DELETE CASCADE
);

-- Applications Table
CREATE TABLE Applications (
    ApplicationID INT PRIMARY KEY AUTO_INCREMENT,
    ListingID INT NOT NULL,
    TenantID INT NOT NULL,
    Message TEXT,
    Status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    ApplicationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ListingID) REFERENCES RoomListings(ListingID) ON DELETE CASCADE,
    FOREIGN KEY (TenantID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Messages Table
CREATE TABLE Messages (
    MessageID INT PRIMARY KEY AUTO_INCREMENT,
    SenderID INT NOT NULL,
    ReceiverID INT NOT NULL,
    ApplicationID INT, -- Optional: Link message to a specific application
    MessageContent TEXT NOT NULL,
    SentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ReadStatus BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (SenderID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ApplicationID) REFERENCES Applications(ApplicationID) ON DELETE SET NULL -- If application is deleted, message remains but link is null
);

-- Favorites Table (Tenant's saved rooms)
CREATE TABLE Favorites (
    FavoriteID INT PRIMARY KEY AUTO_INCREMENT,
    TenantID INT NOT NULL,
    ListingID INT NOT NULL,
    SavedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (TenantID, ListingID), -- Ensure a tenant can only favorite a listing once
    FOREIGN KEY (TenantID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ListingID) REFERENCES RoomListings(ListingID) ON DELETE CASCADE
);
