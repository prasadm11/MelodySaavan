namespace JioSaavanTrial.Models
{
    public class LikedSong
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string SongId { get; set; } = string.Empty;

        public DateTime LikedAt { get; set; }
    }
}
