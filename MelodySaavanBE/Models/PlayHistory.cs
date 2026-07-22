namespace JioSaavanTrial.Models
{
    public class PlayHistory
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        // JioSaavn Song Id
        public string SongId { get; set; } = string.Empty;

        // When the song started playing
        public DateTime PlayedAt { get; set; }

        // Seconds listened
        public int PlayedDuration { get; set; }

        // Total song duration in seconds
        public int SongDuration { get; set; }

        // True if user listened to a significant portion
        public bool Completed { get; set; }

        // Search, Album, Playlist, Artist, Recommendation, Radio, etc.
        public string Source { get; set; } = string.Empty;

        // Number of times this song has been played
        public int PlayCount { get; set; } = 1;

        // Last time this song was played
        public DateTime LastPlayedAt { get; set; }
    }
}
