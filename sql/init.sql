
-- Tạo lại database
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


select * from Admins
select * from Tickets
select * from Artifacts
select * from ArtifactTranslations
select * from Stories
select * from StoryTranslations
select * from MapZones
select * from ArtifactLocations
select * from ScanLogs
select * from PasswordResetTokens
SELECT TOP 1 * FROM Artifacts
SELECT * FROM ArtifactTranslations WHERE LanguageCode = 'en'

DELETE FROM Admins
DELETE FROM Tickets
DELETE FROM Artifacts
DELETE FROM MapZones

--Dữ liệu mẫu
USE apollo;
GO

-- Tạo biến cần dùng trước
DECLARE @ZoneId UNIQUEIDENTIFIER = NEWID();
DECLARE @ArtifactId UNIQUEIDENTIFIER = NEWID();
DECLARE @StoryId UNIQUEIDENTIFIER = NEWID();

-- 1. Admin mẫu
INSERT INTO Admins (Username, PasswordHash, Role, Email)
VALUES ('admin', 'hashed_password_here', 'admin', 'admin@gmail.com');

-- 2. Vé vào cổng
INSERT INTO Tickets (TicketId, LanguageCode) VALUES (NEWID(), 'vi');
INSERT INTO Tickets (TicketId, LanguageCode) VALUES (NEWID(), 'en');

-- 3. Khu trưng bày
INSERT INTO MapZones (ZoneId, Name, Floor, MapImageUrl)
VALUES (@ZoneId, N'Khu A', 1, 'https://example.com/maps/floor1.jpg');

-- 4. Hiện vật
INSERT INTO Artifacts (ArtifactId, ImageUrl)
VALUES (@ArtifactId, 'https://example.com/images/drum.jpg');

-- 5. Bản dịch hiện vật (đa ngôn ngữ)
INSERT INTO ArtifactTranslations (ArtifactId, LanguageCode, Name, Description, AudioUrl, VideoUrl)
VALUES 
(@ArtifactId, 'vi', N'Trống đồng Đông Sơn', N'Một biểu tượng của văn hóa Đông Sơn', 'https://example.com/audio/drum_vi.mp3', 'https://example.com/videos/drum_vi.mp4'),
(@ArtifactId, 'en', N'Dong Son Bronze Drum', N'A symbol of Dong Son culture', 'https://example.com/audio/drum_en.mp3', 'https://example.com/videos/drum_en.mp4');

-- 6. Gắn hiện vật vào vị trí bản đồ
INSERT INTO ArtifactLocations (ArtifactId, ZoneId, PosX, PosY)
VALUES (@ArtifactId, @ZoneId, 120.5, 200.3);

-- 7. Câu chuyện về hiện vật
INSERT INTO Stories (StoryId, IsGlobal, ArtifactId, ImageUrl)
VALUES (@StoryId, 0, @ArtifactId, 'https://example.com/story/drum.jpg');

-- 8. Bản dịch câu chuyện
INSERT INTO StoryTranslations (StoryId, LanguageCode, Title, Content, AudioUrl)
VALUES 
(@StoryId, 'vi', N'Nguồn gốc trống đồng', N'Trống đồng có từ thời Hùng Vương...', 'https://example.com/story/audio_vi.mp3'),
(@StoryId, 'en', N'Origin of bronze drums', N'Bronze drums date back to the Hung Kings...', 'https://example.com/story/audio_en.mp3');