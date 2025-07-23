CREATE DATABASE apollo;
GO

USE apollo;
GO

-- Bảng quản trị viên
CREATE TABLE Admins (
    AdminId INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) DEFAULT 'editor', -- 'admin', 'editor'
    Email NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_Admin_Email UNIQUE (Email)
);

-- Bảng vé vào cổng
CREATE TABLE Tickets (
    TicketId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    LanguageCode NVARCHAR(10) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    ActivatedAt DATETIME NULL
);

-- Bảng hiện vật
CREATE TABLE Artifacts (
    ArtifactId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ImageUrl NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Bảng bản dịch hiện vật
CREATE TABLE ArtifactTranslations (
    Id INT PRIMARY KEY IDENTITY,
    ArtifactId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Artifacts(ArtifactId),
    LanguageCode NVARCHAR(10),
    Name NVARCHAR(255),
    Description NVARCHAR(MAX),
    AudioUrl NVARCHAR(255),
    VideoUrl NVARCHAR(255),
    CONSTRAINT UQ_Artifact_Lang UNIQUE (ArtifactId, LanguageCode)
);

-- Bảng câu chuyện
CREATE TABLE Stories (
    StoryId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    IsGlobal BIT DEFAULT 0,
    ArtifactId UNIQUEIDENTIFIER NULL REFERENCES Artifacts(ArtifactId),
    ImageUrl NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Bản dịch câu chuyện
CREATE TABLE StoryTranslations (
    Id INT PRIMARY KEY IDENTITY,
    StoryId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Stories(StoryId),
    LanguageCode NVARCHAR(10),
    Title NVARCHAR(255),
    Content NVARCHAR(MAX),
    AudioUrl NVARCHAR(255),
    CONSTRAINT UQ_Story_Lang UNIQUE (StoryId, LanguageCode)
);

-- Khu trưng bày
CREATE TABLE MapZones (
    ZoneId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255),
    Floor INT,
    MapImageUrl NVARCHAR(255)
);

-- Vị trí hiện vật trên bản đồ
CREATE TABLE ArtifactLocations (
    ArtifactId UNIQUEIDENTIFIER PRIMARY KEY REFERENCES Artifacts(ArtifactId),
    ZoneId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES MapZones(ZoneId),
    PosX FLOAT,
    PosY FLOAT
);

-- Lượt quét QR
CREATE TABLE ScanLogs (
    Id INT PRIMARY KEY IDENTITY,
    ArtifactId UNIQUEIDENTIFIER REFERENCES Artifacts(ArtifactId),
    TicketId UNIQUEIDENTIFIER REFERENCES Tickets(TicketId),
    LanguageCode NVARCHAR(10),
    ScannedAt DATETIME DEFAULT GETDATE()
);

-- Token reset mật khẩu
CREATE TABLE PasswordResetTokens (
    Token NVARCHAR(255) PRIMARY KEY,
    AdminId INT FOREIGN KEY REFERENCES Admins(AdminId),
    ExpiresAt DATETIME
);

--Dữ liệu mẫu
USE apollo;
GO

-- Tạo biến cần dùng trước
DECLARE @ZoneId UNIQUEIDENTIFIER = NEWID();
DECLARE @ArtifactId UNIQUEIDENTIFIER = NEWID();
DECLARE @StoryId UNIQUEIDENTIFIER = NEWID();

-- 1. Admin mẫu
INSERT INTO Admins (Username, PasswordHash, Role, Email)
VALUES ('admin', 'hashed_password_here', 'admin', 'truongchinh31001@gmail.com');
